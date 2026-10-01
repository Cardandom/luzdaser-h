"use client"

import { ArrowUp, MessageCircleMore } from "lucide-react"
import { useEffect, useState } from "react"

import styles from "../funnel.module.css"

export function MobileFunnelActions({ whatsappHref }: { whatsappHref: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hero = document.getElementById("funnel-hero")
    const form = document.getElementById("request-prices")
    const closing = document.getElementById("funnel-closing")
    const footer = document.getElementById("funnel-footer")
    if (!hero || !form || !closing || !footer) return
    const targets = [hero, form, closing, footer]

    const mobile = window.matchMedia("(max-width: 767px)")
    let disconnect = () => {}

    function monitorViewport() {
      disconnect()
      setVisible(false)
      if (!mobile.matches || !("IntersectionObserver" in window)) return

      let heroPassed = false
      // Wait for each target's first observation before displaying anything.
      const obstructed = new Map<Element, boolean>(
        targets.slice(1).map((target) => [target, true]),
      )

      function updateVisibility() {
        const activeElement = document.activeElement
        const enteringDetails = activeElement instanceof HTMLElement &&
          activeElement.matches("input, textarea, select, [contenteditable='true']")
        setVisible(heroPassed && !enteringDetails && ![...obstructed.values()].some(Boolean))
      }

      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === hero) {
            heroPassed = !entry.isIntersecting && entry.boundingClientRect.bottom <= 0
          } else {
            obstructed.set(entry.target, entry.isIntersecting)
          }
        }
        updateVisibility()
      }, { threshold: 0 })

      for (const target of targets) observer.observe(target)
      document.addEventListener("focusin", updateVisibility)
      document.addEventListener("focusout", updateVisibility)
      disconnect = () => {
        observer.disconnect()
        document.removeEventListener("focusin", updateVisibility)
        document.removeEventListener("focusout", updateVisibility)
      }
    }

    monitorViewport()
    mobile.addEventListener("change", monitorViewport)
    return () => {
      disconnect()
      mobile.removeEventListener("change", monitorViewport)
    }
  }, [])

  return (
    <nav
      aria-label="Quick contact"
      hidden={!visible}
      data-funnel-mobile-actions
      className={`${styles.mobileActions} fixed inset-x-0 bottom-0 z-30 border-t border-luxury-border bg-white shadow-lg md:hidden`}
    >
      <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
        <a
          href="#request-prices"
          data-funnel-event="funnel_primary_cta"
          data-cta-location="mobile-sticky"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-linear-to-b from-luxury-gold-soft to-luxury-gold px-3 text-sm font-semibold text-stone-950"
        >
          Get Prices <ArrowUp className="size-4" aria-hidden="true" />
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          data-funnel-event="funnel_whatsapp_click"
          data-cta-location="mobile-sticky"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-luxury-border px-3 text-sm font-medium"
        >
          <MessageCircleMore className="size-4 text-[#25D366]" aria-hidden="true" /> WhatsApp
        </a>
      </div>
    </nav>
  )
}
