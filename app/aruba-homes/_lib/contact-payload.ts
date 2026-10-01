export type ResidenceName = "Oliver" | "Luca" | "Audrey"

export function createFunnelContactPayload(
  fields: FormData,
  residence: ResidenceName | null,
  formId: string,
) {
  return {
    name: String(fields.get("name") ?? "").trim(),
    phone: String(fields.get("phone") ?? "").trim(),
    email: String(fields.get("email") ?? "").trim(),
    city: "",
    comments: [
      "Please send current pricing and availability for Reina Sophia Residences.",
      `Interested in: ${residence ?? "All residence models"}.`,
      `Source: /aruba-homes (${formId}).`,
    ].join("\n"),
    // An enquiry is not an opt-in to promotional communications.
    marketingConsent: false,
    website: String(fields.get("website") ?? ""),
  }
}
