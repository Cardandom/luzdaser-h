import { MessageCircleMore } from "lucide-react"

const WHATSAPP_URL =
  "https://wa.me/2971234567?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20los%20proyectos."

export function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Open WhatsApp chat"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-3 rounded-full border border-white/10 bg-green-500 px-4 py-3 text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:shadow-xl sm:bottom-7 sm:right-7"
    >
      <span className="inline-flex size-10 items-center justify-center rounded-full bg-white/15">
        <MessageCircleMore className="size-5" aria-hidden="true" />
      </span>
      <span className="hidden text-sm font-semibold tracking-wide sm:inline">
        WhatsApp
      </span>
    </a>
  )
}
