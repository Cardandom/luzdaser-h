"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Dialog } from "@base-ui/react/dialog"
import { X } from "lucide-react"

import {
  DEFAULT_PRIVACY_CONSENT_PREFERENCES,
  PRIVACY_CONSENT_CHANGED_EVENT,
  PRIVACY_SETTINGS_OPEN_EVENT,
  acceptAllPrivacyConsent,
  readPrivacyConsent,
  rejectAllPrivacyConsent,
  savePrivacyConsent,
  type PrivacyConsent,
  type PrivacyConsentPreferences,
} from "@/lib/privacy-consent"

type ConsentView = "overview" | "preferences"

const preferenceOptions: Array<{
  key: keyof PrivacyConsentPreferences
  title: string
  description: string
}> = [
  {
    key: "analytics",
    title: "Analytics",
    description:
      "Helps us understand website performance when analytics is enabled.",
  },
  {
    key: "advertising",
    title: "Advertising",
    description:
      "Allows campaign measurement technologies when advertising is enabled.",
  },
  {
    key: "externalMedia",
    title: "External Media",
    description:
      "Allows third-party content such as Google Maps to load on this website.",
  },
]

function preferencesFromConsent(
  consent: PrivacyConsent | null,
): PrivacyConsentPreferences {
  if (!consent) {
    return { ...DEFAULT_PRIVACY_CONSENT_PREFERENCES }
  }

  return {
    analytics: consent.analytics,
    advertising: consent.advertising,
    externalMedia: consent.externalMedia,
  }
}

export function CookieConsent() {
  const firstActionRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<ConsentView>("overview")
  const [savedConsent, setSavedConsent] = useState<PrivacyConsent | null>(null)
  const [draftPreferences, setDraftPreferences] =
    useState<PrivacyConsentPreferences>({
      ...DEFAULT_PRIVACY_CONSENT_PREFERENCES,
    })

  useEffect(() => {
    const currentConsent = readPrivacyConsent()
    const initializeConsentDialog = window.setTimeout(() => {
      setSavedConsent(currentConsent)
      setDraftPreferences(preferencesFromConsent(currentConsent))
      setView(currentConsent ? "preferences" : "overview")
      setOpen(!currentConsent)
    }, 0)

    const handleConsentChanged = (event: Event) => {
      const consent = (event as CustomEvent<PrivacyConsent>).detail

      setSavedConsent(consent)
      setDraftPreferences(preferencesFromConsent(consent))
    }

    const handleOpenSettings = () => {
      const consent = readPrivacyConsent()

      setSavedConsent(consent)
      setDraftPreferences(preferencesFromConsent(consent))
      setView("preferences")
      setOpen(true)
    }

    window.addEventListener(
      PRIVACY_CONSENT_CHANGED_EVENT,
      handleConsentChanged,
    )
    window.addEventListener(PRIVACY_SETTINGS_OPEN_EVENT, handleOpenSettings)

    return () => {
      window.clearTimeout(initializeConsentDialog)
      window.removeEventListener(
        PRIVACY_CONSENT_CHANGED_EVENT,
        handleConsentChanged,
      )
      window.removeEventListener(PRIVACY_SETTINGS_OPEN_EVENT, handleOpenSettings)
    }
  }, [])

  useEffect(() => {
    if (!open) {
      return
    }

    const focusFirstAction = window.requestAnimationFrame(() => {
      firstActionRef.current?.focus()
    })

    return () => {
      window.cancelAnimationFrame(focusFirstAction)
    }
  }, [open, view])

  const persistConsent = (consent: PrivacyConsent) => {
    setSavedConsent(consent)
    setDraftPreferences(preferencesFromConsent(consent))
    setOpen(false)
  }

  const handleAcceptAll = () => {
    persistConsent(acceptAllPrivacyConsent())
  }

  const handleRejectAll = () => {
    persistConsent(rejectAllPrivacyConsent())
  }

  const handleSavePreferences = () => {
    persistConsent(savePrivacyConsent(draftPreferences))
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-80 bg-stone-950/50 backdrop-blur-sm transition-opacity duration-200 data-starting-style:opacity-0 data-ending-style:opacity-0" />
        <Dialog.Viewport className="fixed inset-0 z-90 flex items-end justify-center overflow-y-auto p-3 sm:items-center sm:p-6">
          <Dialog.Popup
            initialFocus={firstActionRef}
            className="relative max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl overflow-y-auto rounded-3xl border border-luxury-border bg-white p-5 text-foreground shadow-2xl outline-none transition duration-200 ease-out data-starting-style:translate-y-4 data-starting-style:opacity-0 data-ending-style:translate-y-4 data-ending-style:opacity-0 sm:max-h-[calc(100dvh-3rem)] sm:p-8"
          >
            <Dialog.Close
              className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full border border-luxury-border bg-white text-foreground/70 transition hover:border-luxury-gold hover:text-foreground focus-visible:ring-4 focus-visible:ring-luxury-gold/30 focus-visible:outline-none"
              aria-label="Close privacy choices"
            >
              <X className="size-4" aria-hidden="true" />
            </Dialog.Close>

            {view === "overview" ? (
              <>
                <Dialog.Title className="pr-12 font-heading text-3xl tracking-tight sm:text-4xl">
                  Your Privacy Choices
                </Dialog.Title>
                <Dialog.Description className="mt-4 text-sm leading-7 text-foreground/70 sm:text-base">
                  We use necessary technologies to operate this website and its
                  secure client features. With your permission, we may also use
                  analytics and advertising technologies to understand website
                  performance, measure our campaigns and improve your experience.
                  You can accept all optional technologies, reject them, or manage
                  your preferences.
                </Dialog.Description>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  <button
                    ref={firstActionRef}
                    type="button"
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white transition hover:bg-foreground/90 focus-visible:ring-4 focus-visible:ring-luxury-gold/40 focus-visible:outline-none"
                    onClick={handleAcceptAll}
                  >
                    Accept All
                  </button>
                  <button
                    type="button"
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-foreground bg-white px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-stone-100 focus-visible:ring-4 focus-visible:ring-luxury-gold/40 focus-visible:outline-none"
                    onClick={handleRejectAll}
                  >
                    Reject All
                  </button>
                  <button
                    type="button"
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-foreground bg-white px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-stone-100 focus-visible:ring-4 focus-visible:ring-luxury-gold/40 focus-visible:outline-none"
                    onClick={() => setView("preferences")}
                  >
                    Manage Preferences
                  </button>
                </div>
              </>
            ) : (
              <>
                <Dialog.Title className="pr-12 font-heading text-3xl tracking-tight sm:text-4xl">
                  Privacy Preferences
                </Dialog.Title>
                <Dialog.Description className="mt-4 text-sm leading-7 text-foreground/70 sm:text-base">
                  Choose which optional technologies may be used. Necessary
                  technologies remain enabled because the website and secure
                  client features depend on them.
                </Dialog.Description>

                <div className="mt-6 divide-y divide-luxury-border rounded-2xl border border-luxury-border">
                  <div className="flex items-start justify-between gap-5 p-4 sm:p-5">
                    <div>
                      <p className="font-semibold text-foreground">Necessary</p>
                      <p className="mt-1 text-sm leading-6 text-foreground/65">
                        Required for core website functions, security and your
                        privacy preferences.
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <input
                        type="checkbox"
                        checked
                        disabled
                        aria-label="Necessary technologies, always enabled"
                        className="size-5 accent-luxury-gold"
                      />
                      <p className="mt-1 text-xs text-foreground/55">
                        Always enabled
                      </p>
                    </div>
                  </div>

                  {preferenceOptions.map((option) => (
                    <label
                      key={option.key}
                      className="flex cursor-pointer items-start justify-between gap-5 p-4 sm:p-5"
                    >
                      <span>
                        <span className="font-semibold text-foreground">
                          {option.title}
                        </span>
                        <span className="mt-1 block text-sm leading-6 text-foreground/65">
                          {option.description}
                        </span>
                      </span>
                      <input
                        type="checkbox"
                        checked={draftPreferences[option.key]}
                        onChange={(event) => {
                          setDraftPreferences((currentPreferences) => ({
                            ...currentPreferences,
                            [option.key]: event.target.checked,
                          }))
                        }}
                        className="mt-1 size-5 shrink-0 accent-luxury-gold"
                      />
                    </label>
                  ))}
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  <button
                    ref={firstActionRef}
                    type="button"
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white transition hover:bg-foreground/90 focus-visible:ring-4 focus-visible:ring-luxury-gold/40 focus-visible:outline-none"
                    onClick={handleSavePreferences}
                  >
                    Save Preferences
                  </button>
                  <button
                    type="button"
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-foreground bg-white px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-stone-100 focus-visible:ring-4 focus-visible:ring-luxury-gold/40 focus-visible:outline-none"
                    onClick={handleRejectAll}
                  >
                    Reject All
                  </button>
                  <button
                    type="button"
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-foreground bg-white px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-stone-100 focus-visible:ring-4 focus-visible:ring-luxury-gold/40 focus-visible:outline-none"
                    onClick={handleAcceptAll}
                  >
                    Accept All
                  </button>
                </div>
              </>
            )}

            <p className="mt-6 text-xs leading-6 text-foreground/60">
              Learn more in our{" "}
              <Link
                href="/privacy-policy"
                className="font-medium text-foreground underline decoration-luxury-gold underline-offset-4"
              >
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link
                href="/cookie-policy"
                className="font-medium text-foreground underline decoration-luxury-gold underline-offset-4"
              >
                Cookie Policy
              </Link>
              .
            </p>

            <span className="sr-only" aria-live="polite">
              {savedConsent ? "Privacy choices are saved." : ""}
            </span>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
