export const PRIVACY_CONSENT_COOKIE_NAME = "rs_consent_v1"
export const PRIVACY_CONSENT_VERSION = 1
export const PRIVACY_CONSENT_CHANGED_EVENT =
  "reina-sophia:privacy-consent-changed"
export const PRIVACY_SETTINGS_OPEN_EVENT =
  "reina-sophia:privacy-settings-open"

const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 180

export type PrivacyConsentPreferences = {
  analytics: boolean
  advertising: boolean
  externalMedia: boolean
}

export type PrivacyConsent = PrivacyConsentPreferences & {
  version: typeof PRIVACY_CONSENT_VERSION
  timestamp: string
}

export const DEFAULT_PRIVACY_CONSENT_PREFERENCES: PrivacyConsentPreferences = {
  analytics: false,
  advertising: false,
  externalMedia: false,
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean"
}

function isPrivacyConsent(value: unknown): value is PrivacyConsent {
  if (!value || typeof value !== "object") {
    return false
  }

  const consent = value as Partial<PrivacyConsent>

  return (
    consent.version === PRIVACY_CONSENT_VERSION &&
    isBoolean(consent.analytics) &&
    isBoolean(consent.advertising) &&
    isBoolean(consent.externalMedia) &&
    typeof consent.timestamp === "string" &&
    Number.isFinite(Date.parse(consent.timestamp))
  )
}

export function readPrivacyConsent(): PrivacyConsent | null {
  if (typeof document === "undefined") {
    return null
  }

  const cookiePrefix = `${PRIVACY_CONSENT_COOKIE_NAME}=`
  const serializedConsent = document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(cookiePrefix))
    ?.slice(cookiePrefix.length)

  if (!serializedConsent) {
    return null
  }

  try {
    const parsedConsent: unknown = JSON.parse(
      decodeURIComponent(serializedConsent),
    )

    return isPrivacyConsent(parsedConsent) ? parsedConsent : null
  } catch {
    return null
  }
}

export function savePrivacyConsent(
  preferences: PrivacyConsentPreferences,
): PrivacyConsent {
  const consent: PrivacyConsent = {
    version: PRIVACY_CONSENT_VERSION,
    analytics: preferences.analytics,
    advertising: preferences.advertising,
    externalMedia: preferences.externalMedia,
    timestamp: new Date().toISOString(),
  }

  if (typeof document === "undefined") {
    return consent
  }

  const secureAttribute =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : ""

  document.cookie = `${PRIVACY_CONSENT_COOKIE_NAME}=${encodeURIComponent(
    JSON.stringify(consent),
  )}; Max-Age=${CONSENT_MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secureAttribute}`

  window.dispatchEvent(
    new CustomEvent<PrivacyConsent>(PRIVACY_CONSENT_CHANGED_EVENT, {
      detail: consent,
    }),
  )

  return consent
}

export function acceptAllPrivacyConsent(): PrivacyConsent {
  return savePrivacyConsent({
    analytics: true,
    advertising: true,
    externalMedia: true,
  })
}

export function rejectAllPrivacyConsent(): PrivacyConsent {
  return savePrivacyConsent(DEFAULT_PRIVACY_CONSENT_PREFERENCES)
}

export function grantExternalMediaConsent(): PrivacyConsent {
  const currentConsent = readPrivacyConsent()

  return savePrivacyConsent({
    analytics: currentConsent?.analytics ?? false,
    advertising: currentConsent?.advertising ?? false,
    externalMedia: true,
  })
}

export function openPrivacySettings(): void {
  if (typeof window === "undefined") {
    return
  }

  window.dispatchEvent(new Event(PRIVACY_SETTINGS_OPEN_EVENT))
}

