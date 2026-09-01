"use client"

import { useEffect, useState } from "react"
import { ExternalLink, MapPin } from "lucide-react"

import {
  PRIVACY_CONSENT_CHANGED_EVENT,
  grantExternalMediaConsent,
  openPrivacySettings,
  readPrivacyConsent,
  type PrivacyConsent,
} from "@/lib/privacy-consent"

type ConsentManagedMapProps = {
  googleMapsEmbedUrl: string
  googleMapsUrl: string
  locationAddress: string
}

export function ConsentManagedMap({
  googleMapsEmbedUrl,
  googleMapsUrl,
  locationAddress,
}: ConsentManagedMapProps) {
  const [externalMediaAllowed, setExternalMediaAllowed] = useState(false)

  useEffect(() => {
    const initializeMapConsent = window.setTimeout(() => {
      setExternalMediaAllowed(readPrivacyConsent()?.externalMedia ?? false)
    }, 0)

    const handleConsentChanged = (event: Event) => {
      const consent = (event as CustomEvent<PrivacyConsent>).detail

      setExternalMediaAllowed(consent.externalMedia)
    }

    window.addEventListener(
      PRIVACY_CONSENT_CHANGED_EVENT,
      handleConsentChanged,
    )

    return () => {
      window.clearTimeout(initializeMapConsent)
      window.removeEventListener(
        PRIVACY_CONSENT_CHANGED_EVENT,
        handleConsentChanged,
      )
    }
  }, [])

  if (externalMediaAllowed) {
    return (
      <div className="relative aspect-video min-h-80">
        <iframe
          src={googleMapsEmbedUrl}
          title={`Google Maps location for ${locationAddress}`}
          className="absolute inset-0 size-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full border border-luxury-border bg-white/95 px-4 py-2 text-xs font-medium text-foreground shadow-lg backdrop-blur transition hover:border-luxury-gold focus-visible:ring-4 focus-visible:ring-luxury-gold/40 focus-visible:outline-none"
        >
          Open in Google Maps
          <ExternalLink className="size-3.5" aria-hidden="true" />
        </a>
      </div>
    )
  }

  return (
    <div className="flex aspect-video min-h-80 items-center justify-center bg-linear-to-br from-stone-50 via-white to-luxury-gold/10 p-6 text-center sm:p-10">
      <div className="max-w-lg">
        <span className="mx-auto inline-flex size-12 items-center justify-center rounded-full border border-luxury-border bg-white text-luxury-gold-ink shadow-sm">
          <MapPin className="size-5" aria-hidden="true" />
        </span>
        <h3 className="mt-5 font-heading text-3xl text-foreground">
          Interactive map
        </h3>
        <p className="mt-3 text-sm leading-7 text-foreground/70 sm:text-base">
          Google Maps is provided by a third party and may process information
          about your device when loaded.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-white transition hover:bg-foreground/90 focus-visible:ring-4 focus-visible:ring-luxury-gold/40 focus-visible:outline-none"
            onClick={() => {
              const consent = grantExternalMediaConsent()
              setExternalMediaAllowed(consent.externalMedia)
            }}
          >
            Load Google Maps
          </button>
          <button
            type="button"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-foreground bg-white px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-stone-100 focus-visible:ring-4 focus-visible:ring-luxury-gold/40 focus-visible:outline-none"
            onClick={openPrivacySettings}
          >
            Manage privacy settings
          </button>
        </div>
      </div>
    </div>
  )
}
