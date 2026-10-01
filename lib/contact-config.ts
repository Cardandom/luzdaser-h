// Official contact already used by the website's floating WhatsApp button.
export const contactPhone = "+2976992222"
export const contactPhoneDisplay = "+297 699 2222"

const defaultWhatsAppMessage =
  "Hello, I'm interested in Reina Sophia Residences. I'd like more information."

export function getWhatsAppUrl(message = defaultWhatsAppMessage) {
  const url = new URL(`https://wa.me/${contactPhone.replace(/\D/g, "")}`)
  url.searchParams.set("text", message)
  return url.toString()
}
