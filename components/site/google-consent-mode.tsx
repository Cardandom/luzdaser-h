"use client"

import { GoogleTagManager } from "@next/third-parties/google"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

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

function updateGoogleConsent(consent: PrivacyConsent) {
  window.gtag?.("consent", "update", mapGoogleConsent(consent))
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

  useEffect(() => {
    if (isExcludedRoute) return

    const handleConsentChanged = () => {
      const consent = readPrivacyConsent()
      if (consent) updateGoogleConsent(consent)
    }

    window.addEventListener(
      PRIVACY_CONSENT_CHANGED_EVENT,
      handleConsentChanged,
    )

    return () => {
      window.removeEventListener(
        PRIVACY_CONSENT_CHANGED_EVENT,
        handleConsentChanged,
      )
    }
  }, [isExcludedRoute])

  if (isExcludedRoute) {
    return null
  }

  return <GoogleTagManager gtmId="GTM-KCXR38RF" />
}
