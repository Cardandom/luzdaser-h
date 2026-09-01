"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

import { CookieConsent } from "@/components/site/cookie-consent"
import { GoogleConsentMode } from "@/components/site/google-consent-mode"
import { SiteHeader } from "@/components/site/site-header"
import { WhatsAppButton } from "@/components/site/whatsapp-button"
import { restoreQueuedClientLoginScroll } from "@/lib/client-login-return"

const HIDDEN_CHROME_PATHS = [
  "/client-login",
  "/admin-login",
  "/client",
  "/admin",
] as const

function shouldHideChrome(pathname: string) {
  return HIDDEN_CHROME_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  )
}

export function AppChrome() {
  const pathname = usePathname()

  useEffect(() => {
    restoreQueuedClientLoginScroll()
  }, [pathname])

  if (!pathname) {
    return null
  }

  const chromeIsHidden = shouldHideChrome(pathname)

  return (
    <>
      <GoogleConsentMode enabled={!chromeIsHidden} />
      {chromeIsHidden ? null : (
        <>
          <SiteHeader />
          <WhatsAppButton />
          <CookieConsent />
        </>
      )}
    </>
  )
}
