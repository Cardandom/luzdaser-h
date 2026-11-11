import { formatAwg, type Configuration } from "@/lib/commercial-pricing"

export type ResidenceName = "Oliver" | "Luca" | "Audrey"
export type FunnelRequestType = "buyer-pack" | "video-consultation"

export function createFunnelContactPayload(
  fields: FormData,
  residence: ResidenceName | null,
  formId: string,
  requestType: FunnelRequestType = "buyer-pack",
  configuration: Configuration | null = null,
) {
  return {
    name: String(fields.get("name") ?? "").trim(),
    phone: String(fields.get("phone") ?? "").trim(),
    email: String(fields.get("email") ?? "").trim(),
    city: "",
    comments: configuration && requestType === "buyer-pack" ? [
      "Personalized Offer requested.",
      `Residence: ${configuration.residence}`,
      `Starting package: ${formatAwg(configuration.startingPackage)}`,
      "Selected upgrades:",
      ...(configuration.upgrades.length ? configuration.upgrades.map((upgrade) => `- ${upgrade.label}: ${formatAwg(upgrade.price)}`) : ["- Base configuration"]),
      "",
      `Estimated starting configuration: ${formatAwg(configuration.total)}`,
      "Source: /aruba-homes configurator",
    ].join("\n") : [
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
