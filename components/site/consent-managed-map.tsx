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
    <div className="flex w-full min-w-0 items-center justify-center bg-linear-to-br from-stone-50 via-white to-luxury-gold/10 px-4 py-10 text-center sm:aspect-video sm:min-h-80 sm:p-10">
      <div className="w-full min-w-0 max-w-lg">
        <span className="mx-auto inline-flex size-12 items-center justify-center rounded-full border border-luxury-border bg-white text-luxury-gold-ink shadow-sm">
          <MapPin className="size-5" aria-hidden="true" />
        </span>
        <h3 className="mt-5 break-words font-heading text-2xl leading-tight text-foreground sm:text-3xl">
          Interactive map
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-foreground/70 sm:text-base sm:leading-7">
          Google Maps is provided by a third party and may process information
          about your device when loaded.
        </p>
        <div className="mt-6 flex w-full flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white transition hover:bg-foreground/90 focus-visible:ring-4 focus-visible:ring-luxury-gold/40 focus-visible:outline-none sm:w-auto sm:px-6"
            onClick={() => {
              const consent = grantExternalMediaConsent()
              setExternalMediaAllowed(consent.externalMedia)
            }}
          >
            Load Google Maps
          </button>
          <button
            type="button"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-foreground bg-white px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-stone-100 focus-visible:ring-4 focus-visible:ring-luxury-gold/40 focus-visible:outline-none sm:w-auto sm:px-6"
            onClick={openPrivacySettings}
          >
            Manage privacy settings
          </button>
        </div>
      </div>
    </div>
  )
}
