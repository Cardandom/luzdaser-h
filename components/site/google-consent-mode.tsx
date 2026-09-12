"use client"

import { GoogleTagManager } from "@next/third-parties/google"
import { usePathname } from "next/navigation"
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

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    reinaSophiaGoogleConsentInitialized?: boolean
  }
}

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

function isGtmExcludedPath(pathname: string | null) {
  if (!pathname) return true

  return (
    pathname === "/client" ||
    pathname.startsWith("/client/") ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/client-login" ||
    pathname === "/admin-login"
  )
}

export function GoogleConsentMode() {
  const pathname = usePathname()
  const isExcludedRoute = isGtmExcludedPath(pathname)
  const [shouldLoadGtm, setShouldLoadGtm] = useState(false)

  useEffect(() => {
    if (isExcludedRoute) return

    const currentConsent = readPrivacyConsent()
    let initializeGtm: number | undefined

    applyGoogleConsent(currentConsent)

    if (consentAllowsGoogleTags(currentConsent)) {
      initializeGtm = window.setTimeout(() => {
        setShouldLoadGtm(true)
      }, 0)
    }

    const handleConsentChanged = (event: Event) => {
      const consent = (event as CustomEvent<PrivacyConsent>).detail

      updateGoogleConsent(consent)

      if (consentAllowsGoogleTags(consent)) {
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
  }, [isExcludedRoute])

  if (isExcludedRoute || !shouldLoadGtm) {
    return null
  }

  return <GoogleTagManager gtmId="GTM-KCXR38RF" />
}
