"use client"

import { sendGTMEvent } from "@next/third-parties/google"
import { MessageCircleMore } from "lucide-react"
import { getWhatsAppUrl } from "@/lib/contact-config"

const WHATSAPP_URL = getWhatsAppUrl()

export function WhatsAppButton() {
  const handleWhatsAppClick = () => {
    try {
      sendGTMEvent({
        event: "whatsapp_click",
        cta_location: "floating_whatsapp",
      })
    } catch {
      // Tracking must never prevent the visitor from opening WhatsApp.
    }
  }

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open WhatsApp chat"
      onClick={handleWhatsAppClick}
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-3 rounded-full border border-white/10 bg-green-700 px-4 py-3 text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:shadow-xl sm:bottom-7 sm:right-7"
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
