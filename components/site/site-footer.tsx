import Link from "next/link"

import { CookieSettingsButton } from "@/components/site/cookie-settings-button"

export function SiteFooter() {
  return (
    <footer className="luxury-shell mt-6 pb-8 sm:mt-8 sm:pb-10">
      <div className="luxury-panel rounded-3xl px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-4 text-sm text-foreground/70 md:flex-row md:items-center md:justify-between">
          <p className="text-foreground/75">
            2026 Reina Sophia Residences. All rights reserved.
          </p>
          <nav
            aria-label="Legal and privacy"
            className="flex flex-wrap items-center gap-x-5 gap-y-2 pr-20 sm:pr-40"
          >
            <Link className="transition-colors hover:text-foreground" href="/privacy-policy">
              Privacy Policy
            </Link>
            <Link className="transition-colors hover:text-foreground" href="/cookie-policy">
              Cookie Policy
            </Link>
            <Link className="transition-colors hover:text-foreground" href="/terms-of-use">
              Terms of Use
            </Link>
            <CookieSettingsButton className="transition-colors hover:text-foreground" />
          </nav>
        </div>
      </div>
    </footer>
  )
}
