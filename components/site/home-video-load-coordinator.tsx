"use client"

import { useEffect, useRef } from "react"

export const scrollVideoRevealPrepareEvent = "scroll-video-reveal:prepare"
export const scrollVideoRevealActiveEvent = "scroll-video-reveal:active"

type ScrollVideoRevealEventDetail = {
  id?: string
}

type HomeVideoLoadCoordinatorProps = {
  projectIds: readonly string[]
}

export function HomeVideoLoadCoordinator({
  projectIds,
}: HomeVideoLoadCoordinatorProps) {
  const preparedProjectIdsRef = useRef(new Set<string>())

  useEffect(() => {
    let hasScheduledFirstProject = false
    let idleCallbackId: number | null = null
    let isMounted = true
    let timeoutId: number | null = null

    const prepareProject = (id: string | undefined) => {
      if (!id || preparedProjectIdsRef.current.has(id)) {
        return
      }

      preparedProjectIdsRef.current.add(id)
      window.dispatchEvent(
        new CustomEvent(scrollVideoRevealPrepareEvent, {
          detail: { id },
        }),
      )
    }

    const runFirstProjectPreparation = () => {
      idleCallbackId = null
      timeoutId = null

      if (isMounted) {
        prepareProject(projectIds[0])
      }
    }

    const prepareFirstProject = () => {
      if (hasScheduledFirstProject) {
        return
      }

      hasScheduledFirstProject = true

      if (typeof window.requestIdleCallback === "function") {
        idleCallbackId = window.requestIdleCallback(
          runFirstProjectPreparation,
          { timeout: 500 },
        )
      } else {
        timeoutId = window.setTimeout(runFirstProjectPreparation, 0)
      }
    }

    const handleActiveProject = (event: Event) => {
      const activeEvent = event as CustomEvent<ScrollVideoRevealEventDetail>
      const activeProjectIndex = projectIds.indexOf(activeEvent.detail?.id ?? "")

      if (activeProjectIndex === -1) {
        return
      }

      prepareProject(projectIds[activeProjectIndex + 1])
    }

    window.addEventListener(
      scrollVideoRevealActiveEvent,
      handleActiveProject,
    )

    const heroVideo = document.querySelector<HTMLVideoElement>(
      "video[data-home-hero-video]",
    )

    if (heroVideo) {
      if (heroVideo.readyState >= 2) {
        prepareFirstProject()
      } else {
        heroVideo.addEventListener("loadeddata", prepareFirstProject, {
          once: true,
        })
      }
    }

    return () => {
      isMounted = false

      if (idleCallbackId !== null) {
        window.cancelIdleCallback(idleCallbackId)
      }

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId)
      }

      window.removeEventListener(
        scrollVideoRevealActiveEvent,
        handleActiveProject,
      )
      heroVideo?.removeEventListener("loadeddata", prepareFirstProject)
    }
  }, [projectIds])

  return null
}
