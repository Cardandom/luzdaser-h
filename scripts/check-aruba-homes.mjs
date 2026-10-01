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
  assert.ok(message.text.includes(`Interested in: ${residence ?? "All residence models"}.`))
  assert.ok(message.text.includes("Marketing consent: No"))
  assert.ok(message.text.includes("Source: /aruba-homes (request-prices)."))
}

const selectedPayload = createFunnelContactPayload(fields, "Audrey", "request-prices")

const sentBeforeInvalid = deliveries.length
assert.equal((await POST(request({ ...selectedPayload, email: "invalid" }))).status, 400)
assert.equal((await POST(request({ ...selectedPayload, name: " " }))).status, 400)
assert.equal(deliveries.length, sentBeforeInvalid)
assert.equal((await POST(request({ ...selectedPayload, website: "spam.example" }))).status, 200)
assert.equal(deliveries.length, sentBeforeInvalid, "Honeypot must not send email")

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
    if (route === "/aruba-homes") {
      assert.match(html, /name="robots" content="noindex, follow"/)
      assert.doesNotMatch(html, /<iframe\b/)
      const heroVideos = [...html.matchAll(/<video\b[^>]*>/g)]
      assert.equal(heroVideos.length, 1, "Only the hero may contain a video")
      assert.match(heroVideos[0][0], /poster="\/videos\/reina-sophia-funnel-hero-v3-poster.webp"/)
      assert.match(heroVideos[0][0], /preload="metadata"/)
      assert.doesNotMatch(heroVideos[0][0], /\ssrc=/, "Viewport selection must happen through source media")
      assert.match(html, /src="\/videos\/reina-sophia-funnel-hero-mobile.mp4"[^>]*media="\(prefers-reduced-motion: no-preference\) and \(max-width: 767px\)"/)
      assert.match(html, /src="\/videos\/reina-sophia-funnel-hero-desktop.mp4"[^>]*media="\(prefers-reduced-motion: no-preference\) and \(min-width: 768px\)"/)
      assert.doesNotMatch(html, /reina-sophia-funnel-hero(?:-poster)?\.(?:mp4|webp)/, "Removed v2-derived assets must not be referenced")
      assert.equal((html.match(/<form\b/g) ?? []).length, 1)
      assert.equal((html.match(/data-funnel-block="/g) ?? []).length, 5)
      assert.match(html, /id="request-prices"/)
      assert.doesNotMatch(html, /id="request-information"|href="#request-information"|href="\/projects\//)
      assert.doesNotMatch(html, /funnel_model_view/)
      assert.match(html, /New Homes for Sale in Aruba/)
      assert.match(html, /Send Me Prices &amp; Availability/)
      assert.match(html, /aria-label="Quick contact" hidden=""/)
      for (const event of ["funnel_primary_cta", "funnel_whatsapp_click", "funnel_form_start", "funnel_form_submit", "funnel_model_interest"]) {
        assert.ok(html.includes(`data-funnel-event="${event}"`), event)
      }
      for (const card of html.matchAll(/<article\b[\s\S]*?<\/article>/g)) {
        assert.equal((card[0].match(/<img\b/g) ?? []).length, 1)
        assert.equal((card[0].match(/<li\b/g) ?? []).length, 3)
        assert.equal((card[0].match(/href="#request-prices"/g) ?? []).length, 1)
      }
      assert.doesNotMatch(html, /name="city"|name="comments"|name="marketingConsent"/)
      assert.doesNotMatch(html, /Open WhatsApp chat/)
    } else {
      assert.match(html, /Open WhatsApp chat/, `Existing floating WhatsApp missing on ${route}`)
      assert.doesNotMatch(html, /name="robots" content="noindex, follow"/)
    }
    console.log(`PASS: ${route} HTTP 200`)
  }
}
