import type { MouseEvent } from "react"

import { homeModels, type HomeModelId } from "@/lib/home-models"

export const homeModelNavigationEvent = "scroll-video-reveal:navigate"

export type HomeModelNavigationDetail = {
  id: HomeModelId
}

const homeModelIds = new Set<HomeModelId>(
  homeModels.map((model) => model.id),
)

function shouldUseNativeNavigation(event: MouseEvent<HTMLAnchorElement>) {
  const target = event.currentTarget.getAttribute("target")

  return (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey ||
    event.altKey ||
    (target !== null && target !== "_self") ||
    event.currentTarget.hasAttribute("download")
  )
}

export function navigateToHomeModel(
  event: MouseEvent<HTMLAnchorElement>,
  id: HomeModelId,
) {
  if (shouldUseNativeNavigation(event) || !homeModelIds.has(id)) {
    return
  }

  const section = document.getElementById(id)
  const href = `#${id}`

  if (!section) {
    return
  }

  event.preventDefault()

  if (window.location.hash !== href) {
    window.history.pushState(null, "", href)
  }

  const navigationWasHandled = !window.dispatchEvent(
    new CustomEvent<HomeModelNavigationDetail>(homeModelNavigationEvent, {
      cancelable: true,
      detail: { id },
    }),
  )

  if (!navigationWasHandled) {
    section.scrollIntoView()
  }
}
