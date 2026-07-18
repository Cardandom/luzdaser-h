type ClientLoginReturnLocation = {
  href: string
  scrollX: number
  scrollY: number
}

const CLIENT_LOGIN_RETURN_KEY = "reina-sophia-client-login-return"
const CLIENT_LOGIN_RESTORE_SCROLL_KEY = "reina-sophia-client-login-restore-scroll"

export function rememberClientLoginReturn() {
  if (typeof window === "undefined") {
    return
  }

  const returnLocation: ClientLoginReturnLocation = {
    href: `${window.location.pathname}${window.location.search}${window.location.hash}`,
    scrollX: window.scrollX,
    scrollY: window.scrollY,
  }

  try {
    window.sessionStorage.setItem(
      CLIENT_LOGIN_RETURN_KEY,
      JSON.stringify(returnLocation),
    )
  } catch {
    // Session storage can be unavailable in restricted browser modes.
  }
}

export function consumeClientLoginReturn() {
  if (typeof window === "undefined") {
    return null
  }

  try {
    const rawReturnLocation = window.sessionStorage.getItem(CLIENT_LOGIN_RETURN_KEY)
    window.sessionStorage.removeItem(CLIENT_LOGIN_RETURN_KEY)

    if (!rawReturnLocation) {
      return null
    }

    return JSON.parse(rawReturnLocation) as ClientLoginReturnLocation
  } catch {
    return null
  }
}

export function queueClientLoginScrollRestore({
  scrollX,
  scrollY,
}: Pick<ClientLoginReturnLocation, "scrollX" | "scrollY">) {
  if (typeof window === "undefined") {
    return
  }

  try {
    window.sessionStorage.setItem(
      CLIENT_LOGIN_RESTORE_SCROLL_KEY,
      JSON.stringify({ scrollX, scrollY }),
    )
  } catch {
    // Session storage can be unavailable in restricted browser modes.
  }
}

export function restoreQueuedClientLoginScroll() {
  if (typeof window === "undefined") {
    return
  }

  try {
    const rawScrollPosition = window.sessionStorage.getItem(
      CLIENT_LOGIN_RESTORE_SCROLL_KEY,
    )

    if (!rawScrollPosition) {
      return
    }

    window.sessionStorage.removeItem(CLIENT_LOGIN_RESTORE_SCROLL_KEY)

    const scrollPosition = JSON.parse(rawScrollPosition) as Pick<
      ClientLoginReturnLocation,
      "scrollX" | "scrollY"
    >

    window.requestAnimationFrame(() => {
      window.scrollTo({
        left: scrollPosition.scrollX,
        top: scrollPosition.scrollY,
        behavior: "auto",
      })
    })
  } catch {
    // If the stored value is malformed, ignore it and keep normal navigation.
  }
}
