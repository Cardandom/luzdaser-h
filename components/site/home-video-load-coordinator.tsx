"use client"

import { useEffect, useRef, useState } from "react"

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
  const [isDesktopExperience, setIsDesktopExperience] = useState(false)

  useEffect(() => {
    const desktopMediaQuery = window.matchMedia("(min-width: 768px)")
    const syncDesktopExperience = () => {
      setIsDesktopExperience(desktopMediaQuery.matches)
    }

    syncDesktopExperience()
    desktopMediaQuery.addEventListener("change", syncDesktopExperience)

    return () => {
      desktopMediaQuery.removeEventListener("change", syncDesktopExperience)
    }
  }, [])

  useEffect(() => {
    let hasScheduledFirstProject = false
    let heroVisibilityObserver: IntersectionObserver | null = null
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

    const prepareNextProject = (event: Event) => {
      const projectEvent = event as CustomEvent<ScrollVideoRevealEventDetail>
      const projectIndex = projectIds.indexOf(projectEvent.detail?.id ?? "")

      if (projectIndex === -1) {
        return
      }

      prepareProject(projectIds[projectIndex + 1])
    }

    if (isDesktopExperience) {
      window.addEventListener(
        scrollVideoRevealActiveEvent,
        prepareNextProject,
      )
    }

    const heroVideo = document.querySelector<HTMLVideoElement>(
      "video[data-home-hero-video]",
    )

    if (heroVideo) {
      heroVisibilityObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          if (heroVideo.paused) {
            void heroVideo.play().catch(() => {})
          }
        } else {
          heroVideo.pause()
        }
      })
      heroVisibilityObserver.observe(heroVideo)

      if (isDesktopExperience) {
        if (heroVideo.readyState >= 2) {
          prepareFirstProject()
        } else {
          heroVideo.addEventListener("loadeddata", prepareFirstProject, {
            once: true,
          })
        }
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

      heroVisibilityObserver?.disconnect()
      window.removeEventListener(
        scrollVideoRevealActiveEvent,
        prepareNextProject,
      )
      heroVideo?.removeEventListener("loadeddata", prepareFirstProject)
    }
  }, [isDesktopExperience, projectIds])

  return null
}
