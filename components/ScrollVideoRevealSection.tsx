"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

import {
  getHomeModelBySlug,
  homeModels,
  type HomeModelId,
  type HomeModelProjectSlug,
} from "@/lib/home-models"
import {
  scrollVideoRevealActiveEvent,
  scrollVideoRevealPrepareEvent,
  scrollVideoRevealReadyEvent,
} from "@/components/site/home-video-load-coordinator"

const videoPhaseEnd = 0.7
const cardRevealStart = 0.7
const cardRevealEnd = 0.85
const navigationRevealProgress = 0.9
const desktopScrollDistance = 6500
const mobileScrollDistanceViewportRatio = 3.8
const desktopVideoCatchup = 0.12
const mobileVideoCatchup = 0.3
// The sources are 24 FPS: use half a frame on desktop and a wider mobile tolerance.
const desktopSeekThreshold = 1 / 48
const mobileSeekThreshold = 1 / 30
const seekFallbackDelayMs = 100
const videoFullyBufferedToleranceSeconds = 0.25
const videoReadyEvents = [
  "progress",
  "loadedmetadata",
  "durationchange",
  "loadeddata",
  "canplay",
  "suspend",
] as const

type RegisteredScrollTrigger = {
  end: number
  start: number
}

type NavigationRuntime = {
  sortAndRefresh: () => void
}

type PendingNavigation = {
  id: HomeModelId
  token: number
}

const homeModelIds = homeModels.map((model) => model.id)
const registeredScrollTriggers = new Map<
  HomeModelId,
  RegisteredScrollTrigger
>()

let navigationRuntime: NavigationRuntime | null = null
let navigationToken = 0
let pendingNavigation: PendingNavigation | null = null

function getHomeModelIndex(id: HomeModelId) {
  return homeModelIds.indexOf(id)
}

function temporarilyDisableNativeSmoothScroll() {
  const scrollingElement = document.scrollingElement
  const scrollElement =
    scrollingElement instanceof HTMLElement
      ? scrollingElement
      : document.documentElement
  const style = scrollElement.style
  const previousScrollBehavior = style.getPropertyValue("scroll-behavior")
  const previousScrollBehaviorPriority =
    style.getPropertyPriority("scroll-behavior")

  style.setProperty("scroll-behavior", "auto", "important")

  return () => {
    if (previousScrollBehavior) {
      style.setProperty(
        "scroll-behavior",
        previousScrollBehavior,
        previousScrollBehaviorPriority,
      )
    } else {
      style.removeProperty("scroll-behavior")
    }
  }
}

function advancePendingNavigation() {
  const navigation = pendingNavigation

  if (!navigation) {
    return
  }

  const destinationIndex = getHomeModelIndex(navigation.id)
  const missingRequiredId = homeModelIds
    .slice(0, destinationIndex + 1)
    .find((requiredId) => !registeredScrollTriggers.has(requiredId))

  if (missingRequiredId) {
    window.dispatchEvent(
      new CustomEvent(scrollVideoRevealPrepareEvent, {
        detail: { id: missingRequiredId },
      }),
    )
    return
  }

  const runtime = navigationRuntime

  if (!runtime) {
    return
  }

  runtime.sortAndRefresh()

  if (pendingNavigation?.token !== navigation.token) {
    return
  }

  const trigger = registeredScrollTriggers.get(navigation.id)

  if (!trigger) {
    return
  }

  const destination =
    trigger.start +
    (trigger.end - trigger.start) * navigationRevealProgress

  pendingNavigation = null
  const restoreScrollBehavior = temporarilyDisableNativeSmoothScroll()

  window.scrollTo({
    top: destination,
    behavior: "auto",
  })
  restoreScrollBehavior()
}

function requestRevealNavigation(id: HomeModelId) {
  navigationToken += 1
  pendingNavigation = { id, token: navigationToken }
  advancePendingNavigation()
}

function cancelRevealNavigation(id: HomeModelId) {
  if (pendingNavigation?.id !== id) {
    return
  }

  navigationToken += 1
  pendingNavigation = null
}

function registerRevealTrigger(
  id: HomeModelId,
  trigger: RegisteredScrollTrigger,
  runtime: NavigationRuntime,
) {
  registeredScrollTriggers.set(id, trigger)
  navigationRuntime = runtime

  if (pendingNavigation) {
    advancePendingNavigation()
  } else {
    runtime.sortAndRefresh()
  }
}

function unregisterRevealTrigger(
  id: HomeModelId,
  trigger: RegisteredScrollTrigger,
) {
  if (registeredScrollTriggers.get(id) !== trigger) {
    return
  }

  registeredScrollTriggers.delete(id)

  const currentTargetId = pendingNavigation?.id

  if (
    currentTargetId &&
    getHomeModelIndex(id) <= getHomeModelIndex(currentTargetId)
  ) {
    navigationToken += 1
    pendingNavigation = null
  }
}

function isVideoAlmostFullyBuffered(video: HTMLVideoElement) {
  const { buffered, duration } = video

  if (!Number.isFinite(duration) || duration <= 0 || buffered.length === 0) {
    return false
  }

  let coveredUntil = 0

  for (let index = 0; index < buffered.length; index += 1) {
    const bufferedStart = buffered.start(index)
    const bufferedEnd = buffered.end(index)

    if (bufferedStart > coveredUntil + videoFullyBufferedToleranceSeconds) {
      return false
    }

    coveredUntil = Math.max(coveredUntil, bufferedEnd)

    if (coveredUntil >= duration - videoFullyBufferedToleranceSeconds) {
      return true
    }
  }

  return false
}

type ScrollVideoRevealSectionProps = {
  id?: HomeModelId
  projectSlug?: HomeModelProjectSlug
  posterSrc?: string
  videoSrc?: string
  mobileVideoSrc?: string
  revealOnHashNavigation?: boolean
}

export function ScrollVideoRevealSection({
  id = "oliver",
  projectSlug = "oliver-boutique",
  posterSrc = "/oliver-house-scroll-poster.jpg",
  videoSrc = "/videos/video_recortado_oliver.mp4",
  mobileVideoSrc,
  revealOnHashNavigation = false,
}: ScrollVideoRevealSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)
  const readyVideoSourceKeyRef = useRef<string | null>(null)
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false)
  const revealModel = getHomeModelBySlug(projectSlug)

  useEffect(() => {
    const handlePrepareVideo = (event: Event) => {
      const prepareEvent = event as CustomEvent<{ id?: string }>

      if (prepareEvent.detail?.id === id) {
        setShouldLoadVideo(true)
      }
    }

    window.addEventListener(
      scrollVideoRevealPrepareEvent,
      handlePrepareVideo,
    )

    return () => {
      window.removeEventListener(
        scrollVideoRevealPrepareEvent,
        handlePrepareVideo,
      )
    }
  }, [id])

  useEffect(() => {
    const section = sectionRef.current

    if (!section || shouldLoadVideo) {
      return
    }

    const rootMargin = window.matchMedia("(max-width: 767px)").matches
      ? "15% 0px"
      : "50% 0px"
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadVideo(true)
          observer.disconnect()
        }
      },
      { rootMargin },
    )

    observer.observe(section)

    return () => {
      observer.disconnect()
    }
  }, [shouldLoadVideo])

  useEffect(() => {
    const video = videoRef.current
    const isMobile = window.matchMedia("(max-width: 767px)").matches

    if (!isMobile || !shouldLoadVideo || !video) {
      return
    }

    const readyVideo = video
    const readyVideoSourceKey = `${id}:${mobileVideoSrc ?? videoSrc}`

    function removeReadyListeners() {
      for (const eventName of videoReadyEvents) {
        readyVideo.removeEventListener(eventName, maybeDispatchReady)
      }
    }

    function maybeDispatchReady() {
      if (readyVideoSourceKeyRef.current === readyVideoSourceKey) {
        removeReadyListeners()
        return
      }

      if (!isVideoAlmostFullyBuffered(readyVideo)) {
        return
      }

      readyVideoSourceKeyRef.current = readyVideoSourceKey
      removeReadyListeners()
      window.dispatchEvent(
        new CustomEvent(scrollVideoRevealReadyEvent, {
          detail: { id },
        }),
      )
    }

    for (const eventName of videoReadyEvents) {
      readyVideo.addEventListener(eventName, maybeDispatchReady)
    }

    maybeDispatchReady()

    return removeReadyListeners
  }, [id, mobileVideoSrc, shouldLoadVideo, videoSrc])

  useEffect(() => {
    if (!revealOnHashNavigation) {
      return
    }

    const handleRevealNavigation = (event: Event) => {
      const navigationEvent = event as CustomEvent<{ id?: string }>

      if (navigationEvent.detail?.id === id) {
        requestRevealNavigation(id)
      }
    }

    const handleHashChange = () => {
      if (window.location.hash === `#${id}`) {
        requestRevealNavigation(id)
      }
    }

    window.addEventListener(
      "scroll-video-reveal:navigate",
      handleRevealNavigation,
    )
    window.addEventListener("hashchange", handleHashChange)
    handleHashChange()

    return () => {
      window.removeEventListener(
        "scroll-video-reveal:navigate",
        handleRevealNavigation,
      )
      window.removeEventListener("hashchange", handleHashChange)
      cancelRevealNavigation(id)
    }
  }, [id, revealOnHashNavigation])

  useEffect(() => {
    let cancelBoundarySeekFallback: (() => void) | null = null
    let context: { revert: () => void } | null = null
    let removeVideoSeekListener: (() => void) | null = null
    let removeVideoTicker: (() => void) | null = null
    let scrollTriggerInstance: {
      end: number
      isActive: boolean
      kill: () => void
      start: number
    } | null = null
    let isMounted = true
    let hasInitialized = false

    if (!shouldLoadVideo) {
      return
    }

    const initScrollAnimation = async () => {
      if (hasInitialized) {
        return
      }

      const section = sectionRef.current
      const video = videoRef.current
      const card = cardRef.current

      if (
        !section ||
        !video ||
        !card ||
        !Number.isFinite(video.duration) ||
        video.duration <= 0
      ) {
        return
      }

      hasInitialized = true
      video.currentTime = 0
      video.pause()

      const [gsapModule, scrollTriggerModule] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ])

      if (!isMounted) {
        return
      }

      const gsap = gsapModule.gsap
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger

      gsap.registerPlugin(ScrollTrigger)

      const isDesktop = window.matchMedia("(min-width: 768px)").matches
      const scrollDistance = isDesktop
        ? `+=${desktopScrollDistance}`
        : () => `+=${Math.round(window.innerHeight * mobileScrollDistanceViewportRatio)}`
      const videoCatchup = isDesktop ? desktopVideoCatchup : mobileVideoCatchup
      const seekThreshold = isDesktop
        ? desktopSeekThreshold
        : mobileSeekThreshold
      const cardEase = gsap.parseEase("power3.out")
      const modelIndex = getHomeModelIndex(id)
      const refreshPriority = homeModelIds.length - modelIndex
      let targetTime = 0
      let currentTime = 0
      let boundarySeekFallbackId: number | null = null
      let isTickerActive = false
      let lastRequestedTime: number | null = null
      let pendingSeekIsBoundary = false
      let pendingSeekTime: number | null = null
      let seekInFlight = false
      let seekRequestedAt = 0

      const isWithinSeekThreshold = (firstTime: number, secondTime: number) =>
        Math.abs(firstTime - secondTime) <= seekThreshold

      const clearBoundarySeekFallback = () => {
        if (boundarySeekFallbackId === null) {
          return
        }

        window.clearTimeout(boundarySeekFallbackId)
        boundarySeekFallbackId = null
      }

      cancelBoundarySeekFallback = clearBoundarySeekFallback

      const reconcileSeekState = () => {
        if (
          seekInFlight &&
          !video.seeking &&
          performance.now() - seekRequestedAt >= seekFallbackDelayMs
        ) {
          seekInFlight = false
        }
      }

      const flushPendingSeek = () => {
        reconcileSeekState()

        if (
          (!isTickerActive && !pendingSeekIsBoundary) ||
          pendingSeekTime === null
        ) {
          return
        }

        if (seekInFlight || video.seeking) {
          return
        }

        const nextSeekTime = pendingSeekTime
        clearBoundarySeekFallback()
        pendingSeekIsBoundary = false
        pendingSeekTime = null

        if (
          (lastRequestedTime !== null &&
            isWithinSeekThreshold(lastRequestedTime, nextSeekTime)) ||
          isWithinSeekThreshold(video.currentTime, nextSeekTime)
        ) {
          return
        }

        lastRequestedTime = nextSeekTime
        seekInFlight = true
        seekRequestedAt = performance.now()

        try {
          video.currentTime = nextSeekTime
        } catch {
          seekInFlight = false
        }
      }

      const scheduleBoundarySeekFallback = () => {
        if (
          !isMounted ||
          isTickerActive ||
          !pendingSeekIsBoundary ||
          pendingSeekTime === null ||
          (!seekInFlight && !video.seeking) ||
          boundarySeekFallbackId !== null
        ) {
          return
        }

        boundarySeekFallbackId = window.setTimeout(() => {
          boundarySeekFallbackId = null
          flushPendingSeek()
          scheduleBoundarySeekFallback()
        }, seekFallbackDelayMs)
      }

      const queueLatestSeek = (
        nextSeekTime: number,
        allowBoundarySeek = false,
      ) => {
        if (!isTickerActive && !allowBoundarySeek) {
          return
        }

        const duration = video.duration

        if (!Number.isFinite(duration) || duration <= 0) {
          return
        }

        const clampedSeekTime = gsap.utils.clamp(0, duration, nextSeekTime)
        reconcileSeekState()

        const matchesLastRequest =
          lastRequestedTime !== null &&
          isWithinSeekThreshold(lastRequestedTime, clampedSeekTime)

        if (
          matchesLastRequest ||
          isWithinSeekThreshold(video.currentTime, clampedSeekTime)
        ) {
          clearBoundarySeekFallback()
          pendingSeekIsBoundary = false
          pendingSeekTime = null
          return
        }

        pendingSeekIsBoundary = allowBoundarySeek
        pendingSeekTime = clampedSeekTime
        flushPendingSeek()
        scheduleBoundarySeekFallback()
      }

      const handleSeeked = () => {
        if (video.seeking) {
          return
        }

        seekInFlight = false
        flushPendingSeek()
      }

      const setVideoTargetTime = (nextTargetTime: number, shouldSnap = false) => {
        const duration = video.duration

        if (!Number.isFinite(duration) || duration <= 0) {
          return
        }

        targetTime = gsap.utils.clamp(0, duration, nextTargetTime)

        if (shouldSnap) {
          currentTime = targetTime
          queueLatestSeek(targetTime, true)
        } else {
          clearBoundarySeekFallback()
          pendingSeekIsBoundary = false
          pendingSeekTime = null
        }
      }

      const setCardProgress = (nextProgress: number) => {
        const progress = gsap.utils.clamp(0, 1, nextProgress)
        const easedProgress = cardEase(progress)

        gsap.set(card, {
          autoAlpha: easedProgress,
          scale: gsap.utils.interpolate(0.92, 1, easedProgress),
          y: gsap.utils.interpolate(20, 0, easedProgress),
        })
      }

      const updateVideoTime = () => {
        const duration = video.duration

        if (!Number.isFinite(duration) || duration <= 0) {
          return
        }

        const frameRatio = isDesktop ? 1 : gsap.ticker.deltaRatio(60)
        const catchup = 1 - Math.pow(1 - videoCatchup, frameRatio)
        currentTime += (targetTime - currentTime) * catchup

        if (isWithinSeekThreshold(targetTime, currentTime)) {
          currentTime = targetTime
        }

        const nextCurrentTime = gsap.utils.clamp(0, duration, currentTime)
        queueLatestSeek(nextCurrentTime)
      }

      const startVideoTicker = () => {
        if (!isMounted || isTickerActive) {
          return
        }

        isTickerActive = true
        gsap.ticker.add(updateVideoTime)
      }

      const stopVideoTicker = () => {
        // Let only the latest final-frame handoff finish after crossing the boundary.
        if (!pendingSeekIsBoundary) {
          clearBoundarySeekFallback()
          pendingSeekTime = null
        }

        if (!isTickerActive) {
          return
        }

        gsap.ticker.remove(updateVideoTime)
        isTickerActive = false
        scheduleBoundarySeekFallback()
      }

      const syncVideoTicker = (isActive: boolean) => {
        if (isActive) {
          startVideoTicker()
        } else {
          stopVideoTicker()
        }
      }

      video.addEventListener("seeked", handleSeeked)
      removeVideoSeekListener = () => {
        video.removeEventListener("seeked", handleSeeked)
      }
      removeVideoTicker = stopVideoTicker

      context = gsap.context(() => {
        gsap.set(card, {
          autoAlpha: 0,
          scale: 0.92,
          y: 20,
          transformOrigin: "center center",
        })

        scrollTriggerInstance = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: scrollDistance,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority,
          onToggle: (self) => {
            syncVideoTicker(self.isActive)

            if (self.isActive) {
              window.dispatchEvent(
                new CustomEvent(scrollVideoRevealActiveEvent, {
                  detail: { id },
                }),
              )
            }
          },
          onRefresh: (self) => {
            syncVideoTicker(self.isActive)
          },
          onUpdate: (self) => {
            const duration = video.duration

            if (!Number.isFinite(duration) || duration <= 0) {
              return
            }

            const progress = self.progress
            const videoProgress = gsap.utils.clamp(0, 1, progress / videoPhaseEnd)

            setVideoTargetTime(videoProgress * duration, progress >= videoPhaseEnd)

            const cardProgress =
              (progress - cardRevealStart) / (cardRevealEnd - cardRevealStart)

            setCardProgress(cardProgress)
          },
        })
      }, section)

      if (!scrollTriggerInstance) {
        return
      }

      registerRevealTrigger(id, scrollTriggerInstance, {
        sortAndRefresh: () => {
          ScrollTrigger.sort()
          ScrollTrigger.refresh()
        },
      })

      syncVideoTicker(scrollTriggerInstance?.isActive ?? false)
    }

    const video = videoRef.current
    const handleLoadedMetadata = () => {
      void initScrollAnimation()
    }

    if (video) {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        void initScrollAnimation()
      } else {
        video.addEventListener("loadedmetadata", handleLoadedMetadata)
        video.load()
      }
    }

    return () => {
      isMounted = false
      cancelBoundarySeekFallback?.()
      video?.removeEventListener("loadedmetadata", handleLoadedMetadata)
      removeVideoTicker?.()
      removeVideoSeekListener?.()
      if (scrollTriggerInstance) {
        unregisterRevealTrigger(id, scrollTriggerInstance)
      }
      scrollTriggerInstance?.kill()
      context?.revert()
    }
  }, [id, shouldLoadVideo, videoSrc])

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative h-svh w-full overflow-hidden bg-black md:h-screen"
    >
      <Image
        src={posterSrc}
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        aria-hidden="true"
      />

      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        {shouldLoadVideo ? (
          mobileVideoSrc ? (
            <>
              <source
                src={mobileVideoSrc}
                type="video/mp4"
                media="(max-width: 767px)"
              />
              <source
                src={videoSrc}
                type="video/mp4"
                media="(min-width: 768px)"
              />
            </>
          ) : (
            <source src={videoSrc} type="video/mp4" />
          )
        ) : null}
      </video>

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/35"
      />

      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-5 py-10 sm:px-8">
        <div
          ref={cardRef}
          className="pointer-events-auto flex w-full max-w-xl flex-col items-center gap-5 text-center opacity-0"
        >
          {revealModel && (
            <>
              <h2 className="font-heading text-4xl leading-tight text-white drop-shadow-lg sm:text-6xl">
                {revealModel.title}
              </h2>

              <Link
                href={revealModel.projectHref}
                aria-label={`Open ${revealModel.title} project board`}
                className="inline-flex h-11 items-center justify-center rounded-full bg-linear-to-b from-luxury-gold-soft to-luxury-gold px-6 text-sm font-semibold text-stone-950 shadow-lg transition-transform hover:-translate-y-0.5"
              >
                Open Project Board
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
