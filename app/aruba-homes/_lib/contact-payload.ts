export type ResidenceName = "Oliver" | "Luca" | "Audrey"
export type FunnelRequestType = "buyer-pack" | "video-consultation"

export function createFunnelContactPayload(
  fields: FormData,
  residence: ResidenceName | null,
  formId: string,
  requestType: FunnelRequestType = "buyer-pack",
) {
  return {
    name: String(fields.get("name") ?? "").trim(),
    phone: String(fields.get("phone") ?? "").trim(),
    email: String(fields.get("email") ?? "").trim(),
    city: "",
    comments: [
      requestType === "video-consultation"
        ? "Private video consultation requested."
        : "Buyer Pack requested for Reina Sophia Residences.",
      `Interested in: ${residence ?? "All residence models"}.`,
      `Source: /aruba-homes (${requestType === "video-consultation" ? "video-consultation" : formId}).`,
    ].join("\n"),
    // An enquiry is not an opt-in to promotional communications.
    marketingConsent: false,
    website: String(fields.get("website") ?? ""),
  }
}
