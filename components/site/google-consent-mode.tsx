"use client"

import Script from "next/script"
import { useEffect, useState } from "react"

import {
  PRIVACY_CONSENT_CHANGED_EVENT,
  readPrivacyConsent,
  type PrivacyConsent,
} from "@/lib/privacy-consent"

type GoogleConsentValue = "denied" | "granted"

type GoogleConsentState = {
  analytics_storage: GoogleConsentValue
  ad_storage: GoogleConsentValue
  ad_user_data: GoogleConsentValue
  ad_personalization: GoogleConsentValue
}

type GoogleConsentModeProps = {
  enabled?: boolean
}

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    reinaSophiaGoogleConsentInitialized?: boolean
    reinaSophiaGtmStarted?: boolean
  }
}

const configuredGtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim() ?? ""
const validGtmId = /^GTM-[A-Z0-9]+$/.test(configuredGtmId)
  ? configuredGtmId
  : null

function mapGoogleConsent(consent: PrivacyConsent | null): GoogleConsentState {
  const analyticsStorage = consent?.analytics ? "granted" : "denied"
  const advertisingStorage = consent?.advertising ? "granted" : "denied"

  return {
    analytics_storage: analyticsStorage,
    ad_storage: advertisingStorage,
    ad_user_data: advertisingStorage,
    ad_personalization: advertisingStorage,
  }
}

function ensureGoogleCommandQueue() {
  window.dataLayer = window.dataLayer ?? []
  window.gtag =
    window.gtag ??
    ((...args: unknown[]) => {
      window.dataLayer?.push(args)
    })
}

function applyGoogleConsent(consent: PrivacyConsent | null) {
  ensureGoogleCommandQueue()

  if (window.reinaSophiaGoogleConsentInitialized) {
    window.gtag?.("consent", "update", mapGoogleConsent(consent))
    return
  }

  window.gtag?.("consent", "default", mapGoogleConsent(consent))
  window.reinaSophiaGoogleConsentInitialized = true
}

function updateGoogleConsent(consent: PrivacyConsent) {
  ensureGoogleCommandQueue()
  window.gtag?.("consent", "update", mapGoogleConsent(consent))
}

function consentAllowsGoogleTags(consent: PrivacyConsent | null) {
  return Boolean(consent?.analytics || consent?.advertising)
}

function queueGoogleTagManagerStart() {
  if (window.reinaSophiaGtmStarted) {
    return
  }

  ensureGoogleCommandQueue()
  window.dataLayer?.push({
    "gtm.start": Date.now(),
    event: "gtm.js",
  })
  window.reinaSophiaGtmStarted = true
}

export function GoogleConsentMode({ enabled = true }: GoogleConsentModeProps) {
  const [shouldLoadGtm, setShouldLoadGtm] = useState(false)

  useEffect(() => {
    if (!enabled) {
      if (
        window.reinaSophiaGoogleConsentInitialized &&
        typeof window.gtag === "function"
      ) {
        window.gtag("consent", "update", mapGoogleConsent(null))
      }

      return
    }

    if (!validGtmId) {
      return
    }

    const currentConsent = readPrivacyConsent()
    let initializeGtm: number | undefined

    applyGoogleConsent(currentConsent)

    if (consentAllowsGoogleTags(currentConsent)) {
      queueGoogleTagManagerStart()
      initializeGtm = window.setTimeout(() => {
        setShouldLoadGtm(true)
      }, 0)
    }

    const handleConsentChanged = (event: Event) => {
      const consent = (event as CustomEvent<PrivacyConsent>).detail

      updateGoogleConsent(consent)

      if (consentAllowsGoogleTags(consent)) {
        queueGoogleTagManagerStart()
        setShouldLoadGtm(true)
      }
    }

    window.addEventListener(
      PRIVACY_CONSENT_CHANGED_EVENT,
      handleConsentChanged,
    )

    return () => {
      if (initializeGtm !== undefined) {
        window.clearTimeout(initializeGtm)
      }

      window.removeEventListener(
        PRIVACY_CONSENT_CHANGED_EVENT,
        handleConsentChanged,
      )
    }
  }, [enabled])

  if (!enabled || !validGtmId || !shouldLoadGtm) {
    return null
  }

  return (
    <Script
      id="reina-sophia-google-tag-manager"
      src={`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(
        validGtmId,
      )}`}
      strategy="afterInteractive"
    />
  )
}
