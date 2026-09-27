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
  homeModelNavigationEvent,
  type HomeModelNavigationDetail,
} from "@/lib/home-model-navigation"
import {
  scrollVideoRevealActiveEvent,
  scrollVideoRevealPrepareEvent,
} from "@/components/site/home-video-load-coordinator"

// Keep the previous desktop reveal cadence while removing most of its idle tail.
const desktopVideoScrollDistance = 4550
const desktopCardRevealScrollDistance = 975
const desktopTrailingMargin = 225
const desktopScrollDistance =
  desktopVideoScrollDistance +
  desktopCardRevealScrollDistance +
  desktopTrailingMargin
const videoPhaseEnd = desktopVideoScrollDistance / desktopScrollDistance
const cardRevealStart = videoPhaseEnd
const cardRevealEnd =
  (desktopVideoScrollDistance + desktopCardRevealScrollDistance) /
  desktopScrollDistance
const navigationRevealProgress = 0.9
const navigationFallbackDelayMs = 4000
const videoCatchup = 0.12
// The desktop sources are 24 FPS, so half a frame avoids redundant seeks.
const seekThreshold = 1 / 48
const seekFallbackDelayMs = 100

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
let navigationFallbackTimeoutId: number | null = null

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

function clearNavigationFallback() {
  if (navigationFallbackTimeoutId === null) {
    return
  }

  window.clearTimeout(navigationFallbackTimeoutId)
  navigationFallbackTimeoutId = null
}

function startNavigationFallback(navigation: PendingNavigation) {
  clearNavigationFallback()
  navigationFallbackTimeoutId = window.setTimeout(() => {
    if (pendingNavigation?.token !== navigation.token) {
      return
    }

    navigationFallbackTimeoutId = null
    pendingNavigation = null

    if (window.location.hash !== `#${navigation.id}`) {
      return
    }

    const section = document.getElementById(navigation.id)

    if (!section) {
      return
    }

    const restoreScrollBehavior = temporarilyDisableNativeSmoothScroll()

    section.scrollIntoView({
      behavior: "auto",
      block: "start",
    })
    restoreScrollBehavior()
  }, navigationFallbackDelayMs)
}

function advancePendingNavigation() {
  const navigation = pendingNavigation

  if (!navigation) {
    return
  }

  if (window.location.hash !== `#${navigation.id}`) {
    navigationToken += 1
    pendingNavigation = null
    clearNavigationFallback()
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
  clearNavigationFallback()
  const restoreScrollBehavior = temporarilyDisableNativeSmoothScroll()

  window.scrollTo({
    top: destination,
    behavior: "auto",
  })
  restoreScrollBehavior()
}

function requestRevealNavigation(id: HomeModelId) {
  if (pendingNavigation?.id === id) {
    advancePendingNavigation()
    return
  }

  navigationToken += 1
  const navigation = { id, token: navigationToken }

  pendingNavigation = navigation
  startNavigationFallback(navigation)
  advancePendingNavigation()
}

function cancelRevealNavigation(id: HomeModelId) {
  if (pendingNavigation?.id !== id) {
    return
  }

  navigationToken += 1
  pendingNavigation = null
  clearNavigationFallback()
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
    clearNavigationFallback()
  }
}

type MobileModelShowcaseProps = {
  primaryImageAlt: string
  primaryImageSrc: string
  projectHref: string
  secondaryImageAlt: string
  secondaryImageSrc: string
  title: string
}

function MobileModelShowcase({
  primaryImageAlt,
  primaryImageSrc,
  projectHref,
  secondaryImageAlt,
  secondaryImageSrc,
  title,
}: MobileModelShowcaseProps) {
  return (
    <div className="relative isolate flex min-h-svh overflow-hidden border-t border-stone-200 bg-black px-5 py-10 md:hidden">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-48 bg-linear-to-b from-luxury-gold/15 to-transparent"
      />

      <div className="relative mx-auto flex w-full max-w-lg flex-1 flex-col justify-center">
        <div className="relative z-10 aspect-4/3 w-11/12 self-start overflow-hidden border border-white/80 bg-stone-200 shadow-2xl">
          <Image
            src={primaryImageSrc}
            alt={primaryImageAlt}
            fill
            sizes="(max-width: 767px) 84vw, 1px"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-b from-black/5 via-transparent to-black/20"
          />
        </div>

        <div className="relative z-30 -my-8 flex w-5/6 flex-col items-center gap-5 self-center border border-luxury-border bg-white/95 px-5 py-6 text-center shadow-2xl backdrop-blur-sm">
          <h2 className="font-heading text-4xl leading-tight text-foreground">
            {title}
          </h2>

          <Link
            href={projectHref}
            aria-label={`Open ${title} project board`}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-linear-to-b from-luxury-gold-soft to-luxury-gold px-6 py-2 text-sm font-semibold text-stone-950 shadow-lg transition-transform hover:-translate-y-0.5"
          >
            Open Project Board
          </Link>
        </div>

        <div className="relative z-20 aspect-4/3 w-11/12 self-end overflow-hidden border border-white/80 bg-stone-200 shadow-2xl">
          <Image
            src={secondaryImageSrc}
            alt={secondaryImageAlt}
            fill
            sizes="(max-width: 767px) 84vw, 1px"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-b from-black/5 via-transparent to-black/20"
          />
        </div>
      </div>
    </div>
  )
}

type ScrollVideoRevealSectionProps = {
  id?: HomeModelId
  mobilePrimaryImageAlt?: string
  mobileSecondaryImageAlt?: string
  mobileSecondaryImageSrc?: string
  projectSlug?: HomeModelProjectSlug
  posterSrc?: string
  videoSrc?: string
  revealOnHashNavigation?: boolean
}

export function ScrollVideoRevealSection({
  id = "oliver",
  mobilePrimaryImageAlt = "Front view of the Oliver residence",
  mobileSecondaryImageAlt = "Oliver residence patio and pool",
  mobileSecondaryImageSrc = "/Oliver.webp",
  projectSlug = "oliver",
  posterSrc = "/oliver-house-scroll-poster.jpg",
  videoSrc = "/videos/video_recortado_oliver.mp4",
  revealOnHashNavigation = false,
}: ScrollVideoRevealSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)
  const [isDesktopExperience, setIsDesktopExperience] = useState(false)
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false)
  const revealModel = getHomeModelBySlug(projectSlug)

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
    if (!isDesktopExperience) {
      return
    }

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
  }, [id, isDesktopExperience])

  useEffect(() => {
    const section = sectionRef.current

    if (!isDesktopExperience || !section || shouldLoadVideo) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadVideo(true)
          observer.disconnect()
        }
      },
      { rootMargin: "50% 0px" },
    )

    observer.observe(section)

    return () => {
      observer.disconnect()
    }
  }, [isDesktopExperience, shouldLoadVideo])

  useEffect(() => {
    if (!isDesktopExperience || !revealOnHashNavigation) {
      return
    }

    const handleRevealNavigation = (event: Event) => {
      const navigationEvent =
        event as CustomEvent<HomeModelNavigationDetail>

      if (navigationEvent.detail?.id === id) {
        navigationEvent.preventDefault()
        requestRevealNavigation(id)
      }
    }

    const handleHashChange = () => {
      cancelRevealNavigation(id)
    }

    window.addEventListener(
      homeModelNavigationEvent,
      handleRevealNavigation,
    )
    window.addEventListener("hashchange", handleHashChange)

    return () => {
      window.removeEventListener(
        homeModelNavigationEvent,
        handleRevealNavigation,
      )
      window.removeEventListener("hashchange", handleHashChange)
      cancelRevealNavigation(id)
    }
  }, [id, isDesktopExperience, revealOnHashNavigation])

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

    if (!isDesktopExperience || !shouldLoadVideo) {
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

        currentTime += (targetTime - currentTime) * videoCatchup

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
          end: `+=${desktopScrollDistance}`,
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
  }, [id, isDesktopExperience, shouldLoadVideo, videoSrc])

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative w-full bg-black md:h-screen md:overflow-hidden"
    >
      {revealModel ? (
        <MobileModelShowcase
          primaryImageAlt={mobilePrimaryImageAlt}
          primaryImageSrc={posterSrc}
          projectHref={revealModel.projectHref}
          secondaryImageAlt={mobileSecondaryImageAlt}
          secondaryImageSrc={mobileSecondaryImageSrc}
          title={revealModel.title}
        />
      ) : null}

      <div className="relative hidden h-full w-full overflow-hidden md:block">
        <Image
          src={posterSrc}
          alt=""
          fill
          sizes="(min-width: 768px) 100vw, 1px"
          className="object-cover"
          aria-hidden="true"
        />

        {isDesktopExperience ? (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
          >
            {shouldLoadVideo ? (
              <source src={videoSrc} type="video/mp4" />
            ) : null}
          </video>
        ) : null}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/35"
        />

        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-8 py-10">
          <div
            ref={cardRef}
            className="pointer-events-auto flex w-full max-w-xl flex-col items-center gap-5 text-center opacity-0"
          >
            {revealModel && (
              <>
                <h2 className="font-heading text-6xl leading-tight text-white drop-shadow-lg">
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
      </div>
    </section>
  )
}
