"use client"

import { useEffect, useRef } from "react"

export const scrollVideoRevealPrepareEvent = "scroll-video-reveal:prepare"
export const scrollVideoRevealActiveEvent = "scroll-video-reveal:active"
export const scrollVideoRevealReadyEvent = "scroll-video-reveal:ready"

const MOBILE_HERO_BUFFER_SECONDS = 12
const HERO_FULLY_BUFFERED_TOLERANCE_SECONDS = 0.25
const mobileHeroBufferEvents = [
  "loadeddata",
  "loadedmetadata",
  "progress",
  "canplay",
  "timeupdate",
] as const

type ScrollVideoRevealEventDetail = {
  id?: string
}

type HomeVideoLoadCoordinatorProps = {
  projectIds: readonly string[]
}

function hasSufficientMobileHeroBuffer(video: HTMLVideoElement) {
  const { buffered, currentTime, duration } = video
  let lastBufferedEnd = 0

  for (let index = 0; index < buffered.length; index += 1) {
    const bufferedStart = buffered.start(index)
    const bufferedEnd = buffered.end(index)

    lastBufferedEnd = Math.max(lastBufferedEnd, bufferedEnd)

    if (
      bufferedStart <= currentTime &&
      currentTime <= bufferedEnd &&
      bufferedEnd - currentTime >= MOBILE_HERO_BUFFER_SECONDS
    ) {
      return true
    }
  }

  return (
    Number.isFinite(duration) &&
    duration > 0 &&
    lastBufferedEnd > 0 &&
    lastBufferedEnd >= duration - HERO_FULLY_BUFFERED_TOLERANCE_SECONDS
  )
}

export function HomeVideoLoadCoordinator({
  projectIds,
}: HomeVideoLoadCoordinatorProps) {
  const preparedProjectIdsRef = useRef(new Set<string>())

  useEffect(() => {
    let hasScheduledFirstProject = false
    let heroVisibilityObserver: IntersectionObserver | null = null
    let idleCallbackId: number | null = null
    let isMounted = true
    let removeMobileHeroBufferListeners: (() => void) | null = null
    let timeoutId: number | null = null
    const isMobile = window.matchMedia("(max-width: 767px)").matches

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

    const handleActiveProject = (event: Event) => {
      if (!isMobile) {
        prepareNextProject(event)
      }
    }

    const handleReadyProject = (event: Event) => {
      if (isMobile) {
        prepareNextProject(event)
      }
    }

    window.addEventListener(
      scrollVideoRevealActiveEvent,
      handleActiveProject,
    )
    window.addEventListener(scrollVideoRevealReadyEvent, handleReadyProject)

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

          if (isMobile) {
            removeMobileHeroBufferListeners?.()
            removeMobileHeroBufferListeners = null
            prepareFirstProject()
          }
        }
      })
      heroVisibilityObserver.observe(heroVideo)

      if (isMobile) {
        const maybePrepareFirstProject = () => {
          if (
            hasScheduledFirstProject ||
            !hasSufficientMobileHeroBuffer(heroVideo)
          ) {
            return
          }

          removeMobileHeroBufferListeners?.()
          removeMobileHeroBufferListeners = null
          prepareFirstProject()
        }

        for (const eventName of mobileHeroBufferEvents) {
          heroVideo.addEventListener(eventName, maybePrepareFirstProject)
        }

        removeMobileHeroBufferListeners = () => {
          for (const eventName of mobileHeroBufferEvents) {
            heroVideo.removeEventListener(eventName, maybePrepareFirstProject)
          }
        }

        maybePrepareFirstProject()
      } else if (heroVideo.readyState >= 2) {
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

      removeMobileHeroBufferListeners?.()
      heroVisibilityObserver?.disconnect()
      window.removeEventListener(
        scrollVideoRevealActiveEvent,
        handleActiveProject,
      )
      window.removeEventListener(scrollVideoRevealReadyEvent, handleReadyProject)
      heroVideo?.removeEventListener("loadeddata", prepareFirstProject)
    }
  }, [projectIds])

  return null
}
