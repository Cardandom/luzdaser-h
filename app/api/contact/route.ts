import { Resend } from "resend"

export const runtime = "nodejs"

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type ContactPayload = {
  name: string
  phone: string
  email: string
  city: string
  comments: string
  marketingConsent: boolean
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function readRequiredString(payload: Record<string, unknown>, key: string) {
  const value = payload[key]
  return typeof value === "string" ? value.trim() : null
}

function readOptionalString(payload: Record<string, unknown>, key: string) {
  const value = payload[key]

  if (value === undefined || value === null) {
    return ""
  }

  return typeof value === "string" ? value.trim() : null
}

function readBoolean(payload: Record<string, unknown>, key: string) {
  const value = payload[key]
  return typeof value === "boolean" ? value : null
}

function isValidContact(payload: ContactPayload) {
  return (
    payload.name.length >= 2 &&
    payload.name.length <= 100 &&
    payload.email.length <= 254 &&
    emailPattern.test(payload.email) &&
    payload.phone.length <= 40 &&
    payload.city.length <= 100 &&
    payload.comments.length >= 10 &&
    payload.comments.length <= 2000
  )
}

function escapeHtml(value: string) {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }

  return value.replace(/[&<>"']/g, (character) => entities[character])
}

function renderHtmlEmail(payload: ContactPayload, submissionTimestamp: string) {
  const phone = payload.phone || "Not provided"
  const city = payload.city || "Not provided"
  const marketingConsent = payload.marketingConsent ? "Yes" : "No"

  return `
    <!doctype html>
    <html lang="en">
      <body style="margin:0;background:#f5f5f4;color:#1c1917;font-family:Arial,sans-serif;">
        <div style="max-width:640px;margin:0 auto;padding:32px 20px;">
          <div style="background:#ffffff;border:1px solid #e7e5e4;border-radius:16px;padding:28px;">
            <p style="margin:0 0 8px;color:#8a6a2f;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">Reina Sophia Residences</p>
            <h1 style="margin:0 0 24px;font-size:28px;line-height:1.2;">New website inquiry</h1>
            <table role="presentation" style="width:100%;border-collapse:collapse;font-size:15px;line-height:1.6;">
              <tr><th scope="row" style="width:110px;padding:8px 12px 8px 0;text-align:left;vertical-align:top;">Name</th><td style="padding:8px 0;">${escapeHtml(payload.name)}</td></tr>
              <tr><th scope="row" style="width:110px;padding:8px 12px 8px 0;text-align:left;vertical-align:top;">Email</th><td style="padding:8px 0;">${escapeHtml(payload.email)}</td></tr>
              <tr><th scope="row" style="width:110px;padding:8px 12px 8px 0;text-align:left;vertical-align:top;">Phone</th><td style="padding:8px 0;">${escapeHtml(phone)}</td></tr>
              <tr><th scope="row" style="width:110px;padding:8px 12px 8px 0;text-align:left;vertical-align:top;">City</th><td style="padding:8px 0;">${escapeHtml(city)}</td></tr>
              <tr><th scope="row" style="width:110px;padding:8px 12px 8px 0;text-align:left;vertical-align:top;">Comments</th><td style="padding:8px 0;white-space:pre-wrap;">${escapeHtml(payload.comments)}</td></tr>
              <tr><th scope="row" style="width:110px;padding:8px 12px 8px 0;text-align:left;vertical-align:top;">Marketing consent</th><td style="padding:8px 0;">${marketingConsent}</td></tr>
              <tr><th scope="row" style="width:110px;padding:8px 12px 8px 0;text-align:left;vertical-align:top;">Submission timestamp</th><td style="padding:8px 0;">${submissionTimestamp}</td></tr>
            </table>
            <p style="margin:24px 0 0;padding-top:20px;border-top:1px solid #e7e5e4;color:#78716c;font-size:13px;">Source: Website contact form</p>
          </div>
        </div>
      </body>
    </html>
  `.trim()
}

function renderTextEmail(payload: ContactPayload, submissionTimestamp: string) {
  return [
    "New Reina Sophia inquiry",
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone || "Not provided"}`,
    `City: ${payload.city || "Not provided"}`,
    "Comments:",
    payload.comments,
    `Marketing consent: ${payload.marketingConsent ? "Yes" : "No"}`,
    `Submission timestamp: ${submissionTimestamp}`,
    "",
    "Source: Website contact form",
  ].join("\n")
}

function invalidResponse() {
  return Response.json({ error: "Invalid contact request." }, { status: 400 })
}

function genericSuccessResponse() {
  return Response.json({ success: true })
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type")?.toLowerCase()

  if (!contentType?.includes("application/json")) {
    return Response.json({ error: "JSON content type required." }, { status: 415 })
  }

  let body: unknown

  try {
    body = await request.json()
  } catch {
    return invalidResponse()
  }

  if (!isRecord(body)) {
    return invalidResponse()
  }

  const website = readOptionalString(body, "website")

  if (website === null) {
    return invalidResponse()
  }

  if (website) {
    return genericSuccessResponse()
  }

  const name = readRequiredString(body, "name")
  const phone = readOptionalString(body, "phone")
  const email = readRequiredString(body, "email")
  const city = readOptionalString(body, "city")
  const comments = readRequiredString(body, "comments")
  const marketingConsent = readBoolean(body, "marketingConsent")

  if (
    name === null ||
    phone === null ||
    email === null ||
    city === null ||
    comments === null ||
    marketingConsent === null
  ) {
    return invalidResponse()
  }

  const payload = { name, phone, email, city, comments, marketingConsent }

  if (!isValidContact(payload)) {
    return invalidResponse()
  }

  const apiKey = process.env.RESEND_API_KEY?.trim()

  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not configured.")
    return Response.json({ error: "Unable to send the request." }, { status: 500 })
  }

  const resend = new Resend(apiKey)
  const to = process.env.CONTACT_TO_EMAIL?.trim() || "info@jbsseco.com"
  const from =
    process.env.CONTACT_FROM_EMAIL?.trim() ||
    "Reina Sophia Website <website@jbsseco.com>"
  const submissionTimestamp = new Date().toISOString()

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: payload.email,
      subject: `New Reina Sophia inquiry — ${payload.name.replace(/[\r\n]+/g, " ")}`,
      html: renderHtmlEmail(payload, submissionTimestamp),
      text: renderTextEmail(payload, submissionTimestamp),
    })

    if (error) {
      console.error("[contact] Resend rejected the email:", error.name)
      return Response.json({ error: "Unable to send the request." }, { status: 502 })
    }

    return genericSuccessResponse()
  } catch (error) {
    const errorName = error instanceof Error ? error.name : "UnknownError"
    console.error("[contact] Resend request failed:", errorName)
    return Response.json({ error: "Unable to send the request." }, { status: 502 })
  }
}
