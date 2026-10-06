import assert from "node:assert/strict"
import fs from "node:fs"
import vm from "node:vm"
import ts from "typescript"

// Run the actual adapter and endpoint with an isolated, fake email transport.
// This check cannot read .env.local, send email or access a database.
const deliveries = []
let transportError = false
function loadTypeScript(file, dependencies = {}, globals = {}) {
  const source = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    fileName: file,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText
  const context = {
    exports: {},
    Request,
    Response,
    URL,
    process: { env: { RESEND_API_KEY: "test-only" } },
    console: { error() {} },
    require(name) {
      if (!(name in dependencies)) throw new Error(`Unexpected dependency: ${name}`)
      return dependencies[name]
    },
    ...globals,
  }
  vm.runInNewContext(source, context, { filename: file })
  return context.exports
}

const { createFunnelContactPayload } = loadTypeScript("app/aruba-homes/_lib/contact-payload.ts")
const { getWhatsAppUrl } = loadTypeScript("lib/contact-config.ts")
const { POST } = loadTypeScript("app/api/contact/route.ts", {
  resend: {
    Resend: class {
      emails = {
        async send(message) {
          deliveries.push(message)
          return { error: transportError ? { name: "TestError" } : null }
        },
      }
    },
  },
})

const fields = new FormData()
fields.set("name", " Test Visitor ")
fields.set("email", " visitor@example.com ")
fields.set("phone", " +297 000 0000 ")
const request = (payload) => new Request("http://localhost/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
})

for (const residence of [null, "Oliver", "Luca", "Audrey"]) {
  const payload = createFunnelContactPayload(fields, residence, "request-prices")
  const response = await POST(request(payload))
  assert.equal(response.status, 200)
  assert.equal((await response.json()).success, true)
  const message = deliveries.at(-1)
  assert.equal(message.replyTo, "visitor@example.com")
  assert.ok(message.text.includes("Buyer Pack requested for Reina Sophia Residences."))
  assert.ok(message.text.includes(`Interested in: ${residence ?? "All residence models"}.`))
  assert.ok(message.text.includes("Marketing consent: No"))
  assert.ok(message.text.includes("Source: /aruba-homes (request-prices)."))
}

const selectedPayload = createFunnelContactPayload(fields, "Audrey", "request-prices")

const consultationPayload = createFunnelContactPayload(fields, "Oliver", "consultation-form", "video-consultation")
assert.equal(consultationPayload.marketingConsent, false)
assert.equal(consultationPayload.website, "")
assert.equal(consultationPayload.comments, [
  "Private video consultation requested.",
  "Interested in: Oliver.",
  "Source: /aruba-homes (video-consultation).",
].join("\n"))
assert.equal((await POST(request(consultationPayload))).status, 200)
assert.ok(deliveries.at(-1).text.includes(consultationPayload.comments))
assert.ok(deliveries.at(-1).text.includes("Marketing consent: No"))

const sentBeforeInvalid = deliveries.length
assert.equal((await POST(request({ ...selectedPayload, email: "invalid" }))).status, 400)
assert.equal((await POST(request({ ...selectedPayload, name: " " }))).status, 400)
assert.equal(deliveries.length, sentBeforeInvalid)
assert.equal((await POST(request({ ...selectedPayload, website: "spam.example" }))).status, 200)
assert.equal(deliveries.length, sentBeforeInvalid, "Honeypot must not send email")
assert.equal((await POST(request({ ...consultationPayload, website: "spam.example" }))).status, 200)
assert.equal(deliveries.length, sentBeforeInvalid, "Consultation honeypot must not send email")

transportError = true
assert.equal((await POST(request(selectedPayload))).status, 502)
transportError = false

// Existing long-form submissions keep the same contract.
assert.equal((await POST(request({
  name: "Existing Visitor", email: "existing@example.com", phone: "",
  city: "Paradera", comments: "Please send information about the residences.",
  marketingConsent: true, website: "",
}))).status, 200)
assert.ok(deliveries.at(-1).text.includes("Marketing consent: Yes"))

const oldUrl = new URL("https://wa.me/2976992222")
oldUrl.searchParams.set("text", "Hello, I'm interested in Reina Sophia Residences. I'd like more information.")
assert.equal(getWhatsAppUrl(), oldUrl.toString(), "Existing floating WhatsApp URL must stay identical")
const funnelMessage = "Hi, I'm interested in Reina Sophia Residences. I'd like to receive current pricing and availability."
const funnelUrl = new URL(getWhatsAppUrl(funnelMessage))
assert.equal(funnelUrl.pathname, "/2976992222")
assert.equal(funnelUrl.searchParams.get("text"), funnelMessage)
console.log("PASS: short form contract, all models, validation, honeypot, delivery errors, existing form and WhatsApp compatibility. No email sent.")

// Run the actual client submit handler with controlled hooks and a fake fetch.
// This checks API-success/event ordering without a browser or network transport.
function createFormHarness({ requestType = "buyer-pack", response, trackingThrows = false } = {}) {
  const events = []
  const statuses = []
  const submissions = []
  const selections = []
  const fakeForm = { resetCount: 0, reset() { this.resetCount++ } }
  const jsx = (type, props) => ({ type, props })
  const { FunnelForm, RequestAvailabilityLink } = loadTypeScript("app/aruba-homes/_components/funnel-interactions.tsx", {
    react: {
      createContext() { return {} },
      useContext() { return { residence: "Audrey", selectResidence: value => selections.push(value) } },
      useState(initial) { return [initial, value => statuses.push(value)] },
      useRef(initial) { return { current: initial } },
    },
    "react/jsx-runtime": { jsx, jsxs: jsx },
    "lucide-react": { ArrowRight() {}, Check() {}, ChevronDown() {}, MessageCircleMore() {} },
    "@next/third-parties/google": {
      sendGTMEvent({ event }) {
        events.push(event)
        if (trackingThrows && event === "lead_form_success") throw new Error("Tracking unavailable")
      },
    },
    "../_lib/contact-payload": { createFunnelContactPayload },
  }, {
    AbortSignal: { timeout() { return undefined } },
    FormData: class {
      constructor(form) {
        assert.equal(form, fakeForm)
        return fields
      }
    },
    async fetch(url, options) {
      assert.equal(url, "/api/contact")
      assert.equal(options.method, "POST")
      submissions.push(JSON.parse(options.body))
      return typeof response === "function" ? response() : response
    },
  })
  const form = FunnelForm({ id: requestType === "buyer-pack" ? "request-prices" : "video-consultation", requestType, whatsappHref: funnelUrl.toString() })
  assert.equal(form.type, "form")
  const cardLink = RequestAvailabilityLink({ residence: "Luca" })
  assert.equal(cardLink.props.href, "#request-prices")
  cardLink.props.onClick()
  assert.deepEqual(selections, ["Luca"])
  return {
    events, statuses, submissions, fakeForm,
    submit: () => form.props.onSubmit({ preventDefault() {}, currentTarget: fakeForm }),
  }
}

const buyerSuccess = createFormHarness({ response: Response.json({ success: true }) })
await buyerSuccess.submit()
assert.deepEqual(buyerSuccess.events, ["lead_form_success"])
assert.deepEqual(buyerSuccess.statuses, ["submitting", "success"])
assert.equal(buyerSuccess.fakeForm.resetCount, 1)
assert.ok(buyerSuccess.submissions[0].comments.includes("Buyer Pack requested for Reina Sophia Residences."))
assert.ok(buyerSuccess.submissions[0].comments.includes("Interested in: Audrey."))
assert.equal(buyerSuccess.submissions[0].marketingConsent, false)

for (const response of [Response.json({ error: "Delivery failed" }, { status: 502 }), Response.json({ success: false })]) {
  const failure = createFormHarness({ response })
  await failure.submit()
  assert.deepEqual(failure.events, [], "Unconfirmed requests must not report conversion success")
  assert.deepEqual(failure.statuses, ["submitting", "error"])
  assert.equal(failure.fakeForm.resetCount, 0)
}

const consultationSuccess = createFormHarness({ requestType: "video-consultation", response: Response.json({ success: true }), trackingThrows: true })
await consultationSuccess.submit()
assert.deepEqual(consultationSuccess.events, ["lead_form_success", "video_consultation_request"])
assert.deepEqual(consultationSuccess.statuses, ["submitting", "success"], "Tracking failures must not change a successful delivery into an error")
assert.ok(consultationSuccess.submissions[0].comments.includes("Private video consultation requested."))
assert.ok(consultationSuccess.submissions[0].comments.includes("Source: /aruba-homes (video-consultation)."))

let resolveSubmission
const deferredResponse = new Promise(resolve => { resolveSubmission = resolve })
const lockedSubmission = createFormHarness({ response: () => deferredResponse })
const pendingSubmission = lockedSubmission.submit()
await lockedSubmission.submit()
assert.equal(lockedSubmission.submissions.length, 1, "A second click during a pending request must not send a duplicate")
resolveSubmission(Response.json({ success: true }))
await pendingSubmission
assert.deepEqual(lockedSubmission.events, ["lead_form_success"])
console.log("PASS: actual Buyer Pack/consultation submit handlers, selected model, backend-success gating, independent conversion events and duplicate-submission lock. No network requests.")

// Exercise the actual visibility effect with controlled observer entries.
// This validates logic and cleanup; it does not claim browser/layout coverage.
let mobileEffect
let mobileVisible = false
let breakpointChanged
const focusListeners = new Map()
const observers = []
const media = {
  matches: true,
  addEventListener(event, callback) {
    assert.equal(event, "change")
    breakpointChanged = callback
  },
  removeEventListener() { breakpointChanged = undefined },
}
class FakeElement {
  constructor(id, input = false) { this.id = id; this.input = input }
  matches() { return this.input }
}
const elements = Object.fromEntries(
  ["funnel-hero", "request-prices", "funnel-closing", "funnel-footer"].map(id => [id, new FakeElement(id)]),
)
const fakeDocument = {
  activeElement: null,
  getElementById(id) { return elements[id] },
  addEventListener(event, callback) { focusListeners.set(event, callback) },
  removeEventListener(event) { focusListeners.delete(event) },
}
class FakeObserver {
  targets = []
  disconnected = false
  constructor(callback) { this.callback = callback; observers.push(this) }
  observe(element) { this.targets.push(element) }
  disconnect() { this.disconnected = true }
  publish(id, isIntersecting, bottom = 0) {
    this.callback([{ target: elements[id], isIntersecting, boundingClientRect: { bottom } }])
  }
}
const { MobileFunnelActions } = loadTypeScript("app/aruba-homes/_components/mobile-funnel-actions.tsx", {
  react: {
    useState(initial) { return [initial, (value) => { mobileVisible = value }] },
    useEffect(effect) { mobileEffect = effect },
  },
  "react/jsx-runtime": { jsx() {}, jsxs() {} },
  "lucide-react": { ArrowUp() {}, MessageCircleMore() {} },
  "../funnel.module.css": { default: { mobileActions: "mobile-actions" } },
}, {
  document: fakeDocument,
  window: { matchMedia: () => media, IntersectionObserver: FakeObserver },
  IntersectionObserver: FakeObserver,
  HTMLElement: FakeElement,
})
MobileFunnelActions({ whatsappHref: funnelUrl.toString() })
const unmountMobileActions = mobileEffect()
const observer = observers.at(-1)
assert.equal(observer.targets.length, 4)
assert.equal(mobileVisible, false)
observer.publish("funnel-hero", true, 200)
observer.publish("request-prices", false, 800)
observer.publish("funnel-closing", false, 2000)
observer.publish("funnel-footer", false, 2200)
assert.equal(mobileVisible, false, "Hero visible: no sticky CTA")
observer.publish("funnel-hero", false, 2000)
assert.equal(mobileVisible, false, "Hero below viewport: do not mistake it for passed")
observer.publish("funnel-hero", false, -1)
assert.equal(mobileVisible, true, "Past hero: show quick actions")
observer.publish("request-prices", true, 150)
assert.equal(mobileVisible, false, "Never cover the form")
observer.publish("request-prices", false, -1)
assert.equal(mobileVisible, true)
fakeDocument.activeElement = new FakeElement("focused-input", true)
focusListeners.get("focusin")()
assert.equal(mobileVisible, false, "Hide while entering details")
fakeDocument.activeElement = null
focusListeners.get("focusout")()
assert.equal(mobileVisible, true)
observer.publish("funnel-closing", true, 600)
assert.equal(mobileVisible, false, "Do not duplicate the closing CTA")
observer.publish("funnel-closing", false, 1500)
observer.publish("funnel-footer", true, 600)
assert.equal(mobileVisible, false, "Never cover the footer")
observer.publish("funnel-footer", false, 1800)
assert.equal(mobileVisible, true)
media.matches = false
breakpointChanged()
assert.equal(mobileVisible, false, "No sticky CTA on desktop")
assert.equal(observer.disconnected, true)
assert.equal(focusListeners.size, 0)
media.matches = true
breakpointChanged()
assert.equal(observers.length, 2, "Resume observing when returning to mobile")
unmountMobileActions()
assert.equal(observers.at(-1).disconnected, true)
assert.equal(focusListeners.size, 0)
assert.equal(breakpointChanged, undefined)
console.log("PASS: mobile CTA visibility, hero direction, form/focus/closing/footer exclusions, responsive changes and cleanup (simulated observers).")

// Optional HTTP smoke checks against a running local development/production server.
if (process.argv[2]) {
  const baseUrl = new URL(process.argv[2])
  assert.ok(["localhost", "127.0.0.1"].includes(baseUrl.hostname), "Only local servers are allowed")
  for (const route of ["/", "/aruba-homes", "/projects/oliver", "/projects/luca", "/projects/audrey"]) {
    const response = await fetch(new URL(route, baseUrl))
    assert.equal(response.status, 200, route)
    const html = await response.text()
    const visibleMarkup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    assert.doesNotMatch(visibleMarkup, /beachfront|oceanfront|living by the sea/i, `Misleading location copy on ${route}`)
    assert.doesNotMatch(html, /id="construction-progress"/, "Construction section must stay hidden without assigned photos")
    if (route === "/aruba-homes") {
      assert.match(html, /name="robots" content="noindex, follow"/)
      assert.doesNotMatch(html, /<iframe\b/)
      const heroVideos = [...html.matchAll(/<video\b[^>]*>/g)]
      assert.equal(heroVideos.length, 1, "Only the hero may contain a video")
      assert.match(heroVideos[0][0], /poster="\/videos\/reina-sophia-funnel-hero-v3-poster.webp"/)
      assert.match(heroVideos[0][0], /preload="metadata"/)
      assert.doesNotMatch(heroVideos[0][0], /\ssrc=/, "Viewport selection must happen through source media")
      assert.doesNotMatch(html, /src="\/videos\/reina-sophia-funnel-hero-mobile.mp4"/, "Mobile hero must not load interior video frames")
      assert.match(visibleMarkup, /alt="Exterior sunset render of the Oliver residence at Reina Sophia"/, "Mobile hero uses the existing exterior render")
      assert.match(html, /src="\/videos\/reina-sophia-funnel-hero-desktop.mp4"[^>]*media="\(prefers-reduced-motion: no-preference\) and \(min-width: 768px\)"/)
      assert.doesNotMatch(html, /reina-sophia-funnel-hero(?:-poster)?\.(?:mp4|webp)/, "Removed v2-derived assets must not be referenced")
      assert.equal((html.match(/<form\b/g) ?? []).length, 2, "Buyer Pack plus a collapsed consultation form")
      assert.deepEqual([...html.matchAll(/data-funnel-block="([^"]+)"/g)].map(match => match[1]), [
        "hero", "models", "ownership", "request", "purchase-process", "reasons", "lifestyle", "consultation", "conversion",
      ], "Pricing, freehold ownership and purchase process must precede the location/lifestyle content")
      assert.match(html, /id="request-prices"/)
      assert.match(html, /id="buying-in-aruba"/)
      assert.match(html, /href="#buying-in-aruba"/)
      assert.doesNotMatch(html, /id="request-information"|href="#request-information"/)
      assert.doesNotMatch(html, /funnel_model_view/)
      assert.match(html, /New Freehold Homes in Central Aruba/)
      assert.match(html, /Own the home\./)
      assert.match(html, /Own the land\./)
      assert.match(html, /Homes from AWG 1,140,545/)
      assert.match(html, /Get the Current Reina Sophia Buyer Pack/)
      assert.match(html, /Send Me the Buyer Pack/)
      for (const price of ["From AWG 1,140,545", "From AWG 1,804,539", "From AWG 2,189,211"]) {
        assert.ok(html.includes(price), `Missing approved price ${price}`)
      }
      for (const benefit of ["Current Price List", "Available Residences", "Floorplans", "Payment Structure", "What&#x27;s Included"]) {
        assert.ok(html.includes(benefit), `Missing Buyer Pack benefit ${benefit}`)
      }
      const consultationToggle = html.match(/<details class="group mt-5"[^>]*>/)
      assert.ok(consultationToggle, "One lightweight consultation expander")
      assert.doesNotMatch(consultationToggle[0], /\sopen(?:\s|=|>)/, "Consultation must initially be collapsed")
      assert.match(html, /id="video-consultation"/)
      assert.match(html, /data-form-location="video-consultation"/)
      assert.match(html, /aria-label="Quick contact" hidden=""/)
      for (const event of ["funnel_primary_cta", "funnel_whatsapp_click", "funnel_form_start", "funnel_form_submit", "funnel_model_interest"]) {
        assert.ok(html.includes(`data-funnel-event="${event}"`), event)
      }
      const cards = [...html.matchAll(/<article\b[\s\S]*?<\/article>/g)]
      assert.equal(cards.length, 3, "Exactly three comparison cards")
      for (const [index, card] of cards.entries()) {
        const slug = ["luca", "oliver", "audrey"][index]
        assert.equal((card[0].match(/<img\b/g) ?? []).length, 1)
        assert.equal((card[0].match(/<li\b/g) ?? []).length, 5)
        assert.equal((card[0].match(/href="#request-prices"/g) ?? []).length, 1)
        assert.ok(card[0].includes(`aria-label="View Floorplan for ${slug[0].toUpperCase()}${slug.slice(1)}"`), `${slug} floorplan dialog trigger`)
        assert.ok(card[0].includes('aria-haspopup="dialog"'), `${slug} accessible dialog trigger`)
        assert.doesNotMatch(card[0], /href="\/projects\//, `${slug} floorplan stays in the funnel`)
        assert.ok(card[0].includes(`data-residence="${slug[0].toUpperCase()}${slug.slice(1)}"`), `${slug} selected-residence tracking`)
        assert.ok(card[0].includes("Check Current Availability"))
      }
      assert.ok(cards[2][0].includes("160 m² Home"))
      assert.doesNotMatch(cards[2][0], /130\s*m/)
      assert.doesNotMatch(html, /name="city"|name="comments"|name="marketingConsent"/)
      assert.doesNotMatch(html, /Open WhatsApp chat/)
    } else {
      assert.match(html, /Open WhatsApp chat/, `Existing floating WhatsApp missing on ${route}`)
      assert.doesNotMatch(html, /name="robots" content="noindex, follow"/)
      if (route.startsWith("/projects/")) assert.match(html, /id="blueprint-sheets-heading"/, `Floorplan target missing on ${route}`)
      if (route === "/projects/audrey") assert.doesNotMatch(visibleMarkup, /130\s*m/)
      if (route === "/") {
        assert.match(html, /Your own home\./)
        assert.match(html, /Your own land\./)
        assert.match(html, /In the heart of Aruba\./)
        assert.match(html, /href="\/aruba-homes#request-prices"/)
      }
    }
    console.log(`PASS: ${route} HTTP 200`)
  }
}
