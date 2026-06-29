"use client"

import { usePathname } from "next/navigation"

import { SiteHeader } from "@/components/site/site-header"
import { WhatsAppButton } from "@/components/site/whatsapp-button"

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

  if (!pathname || shouldHideChrome(pathname)) {
    return null
  }

  return (
    <>
      <SiteHeader />
      <WhatsAppButton />
    </>
  )
}
