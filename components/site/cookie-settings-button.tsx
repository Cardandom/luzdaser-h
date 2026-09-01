"use client"

import type { ComponentPropsWithoutRef } from "react"

import { openPrivacySettings } from "@/lib/privacy-consent"

type CookieSettingsButtonProps = ComponentPropsWithoutRef<"button">

export function CookieSettingsButton({
  children = "Cookie Settings",
  onClick,
  type = "button",
  ...props
}: CookieSettingsButtonProps) {
  return (
    <button
      {...props}
      type={type}
      onClick={(event) => {
        onClick?.(event)

        if (!event.defaultPrevented) {
          openPrivacySettings()
        }
      }}
    >
      {children}
    </button>
  )
}

