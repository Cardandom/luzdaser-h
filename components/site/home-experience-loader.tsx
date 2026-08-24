"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

const homeLoaderSeenKey = "reina-sophia-home-loader-seen-v1"
const loaderGraceMs = 120
const loaderCompleteHoldMs = 125
const loaderExitMs = 200
const loaderSafetyTimeoutMs = 2500

function hasSeenHomeLoader() {
  try {
    return window.sessionStorage.getItem(homeLoaderSeenKey) === "true"
  } catch {
    return false
  }
}

function rememberHomeLoader() {
  try {
    window.sessionStorage.setItem(homeLoaderSeenKey, "true")
  } catch {
    // The loader remains non-blocking when session storage is unavailable.
  }
}

export function HomeExperienceLoader() {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const navigationEntry = window.performance.getEntriesByType(
      "navigation",
    )[0] as PerformanceNavigationTiming | undefined

    if (hasSeenHomeLoader() || navigationEntry?.type === "back_forward") {
      if (navigationEntry?.type === "back_forward") {
        rememberHomeLoader()
      }

      return
    }

    const heroVideo = document.querySelector<HTMLVideoElement>(
      "video[data-home-hero-video]",
    )
    let completeHoldTimerId: number | null = null
    let exitTimerId: number | null = null
    let frameCallbackId: number | null = null
    let graceTimerId: number | null = null
    let hasRequestedFirstFrame = false
    let hasSettled = false
    let hasShownLoader = false
    let hasStartedExit = false
    let isMounted = true
    let safetyTimerId: number | null = null

    const cancelFrameCallback = () => {
      if (
        frameCallbackId !== null &&
        heroVideo &&
        typeof heroVideo.cancelVideoFrameCallback === "function"
      ) {
        heroVideo.cancelVideoFrameCallback(frameCallbackId)
        frameCallbackId = null
      }
    }

    const hideImmediately = () => {
      if (!isMounted) {
        return
      }

      hasStartedExit = true

      if (completeHoldTimerId !== null) {
        window.clearTimeout(completeHoldTimerId)
        completeHoldTimerId = null
      }

      if (exitTimerId !== null) {
        window.clearTimeout(exitTimerId)
        exitTimerId = null
      }

      setIsVisible(false)
    }

    const beginExit = () => {
      if (!isMounted || hasStartedExit) {
        return
      }

      hasStartedExit = true
      setIsExiting(true)
      exitTimerId = window.setTimeout(() => {
        exitTimerId = null

        if (isMounted) {
          setIsVisible(false)

          if (safetyTimerId !== null) {
            window.clearTimeout(safetyTimerId)
            safetyTimerId = null
          }
        }
      }, loaderExitMs)
    }

    const settleLoader = (didComplete: boolean) => {
      if (!isMounted || hasSettled) {
        return
      }

      if (didComplete) {
        setProgress(100)
      }

      hasSettled = true
      rememberHomeLoader()
      cancelFrameCallback()

      if (graceTimerId !== null) {
        window.clearTimeout(graceTimerId)
        graceTimerId = null
      }

      if (!hasShownLoader) {
        if (safetyTimerId !== null) {
          window.clearTimeout(safetyTimerId)
          safetyTimerId = null
        }

        return
      }

      if (didComplete) {
        completeHoldTimerId = window.setTimeout(() => {
          completeHoldTimerId = null
          beginExit()
        }, loaderCompleteHoldMs)
      } else {
        if (safetyTimerId !== null) {
          window.clearTimeout(safetyTimerId)
          safetyTimerId = null
        }

        hideImmediately()
      }
    }

    const setMilestone = (value: number) => {
      if (!isMounted || hasSettled) {
        return
      }

      setProgress((currentProgress) => Math.max(currentProgress, value))
    }

    const handleFirstFrame = () => {
      frameCallbackId = null
      settleLoader(true)
    }

    const handleLoadedMetadata = () => {
      setMilestone(35)
    }

    const handleLoadedData = () => {
      setMilestone(80)

      if (hasRequestedFirstFrame || hasSettled || !heroVideo) {
        return
      }

      hasRequestedFirstFrame = true

      if (typeof heroVideo.requestVideoFrameCallback === "function") {
        frameCallbackId = heroVideo.requestVideoFrameCallback(handleFirstFrame)
      } else {
        settleLoader(true)
      }
    }

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        if (hasSettled) {
          hideImmediately()
        } else {
          settleLoader(false)
        }
      }
    }

    setMilestone(10)

    graceTimerId = window.setTimeout(() => {
      graceTimerId = null

      if (isMounted && !hasSettled) {
        hasShownLoader = true
        setIsVisible(true)
      }
    }, loaderGraceMs)

    safetyTimerId = window.setTimeout(() => {
      safetyTimerId = null

      if (hasSettled) {
        hideImmediately()
      } else {
        settleLoader(false)
      }
    }, loaderSafetyTimeoutMs)

    window.addEventListener("pageshow", handlePageShow)

    if (heroVideo) {
      heroVideo.addEventListener("loadedmetadata", handleLoadedMetadata, {
        once: true,
      })
      heroVideo.addEventListener("loadeddata", handleLoadedData, {
        once: true,
      })

      if (heroVideo.readyState >= 1) {
        handleLoadedMetadata()
      }

      if (heroVideo.readyState >= 2) {
        handleLoadedData()
      }
    }

    return () => {
      isMounted = false
      cancelFrameCallback()
      window.removeEventListener("pageshow", handlePageShow)
      heroVideo?.removeEventListener("loadedmetadata", handleLoadedMetadata)
      heroVideo?.removeEventListener("loadeddata", handleLoadedData)

      if (completeHoldTimerId !== null) {
        window.clearTimeout(completeHoldTimerId)
      }

      if (exitTimerId !== null) {
        window.clearTimeout(exitTimerId)
      }

      if (graceTimerId !== null) {
        window.clearTimeout(graceTimerId)
      }

      if (safetyTimerId !== null) {
        window.clearTimeout(safetyTimerId)
      }
    }
  }, [])

  if (!isVisible) {
    return null
  }

  return (
    <div
      className={`fixed inset-0 z-50 grid place-items-center bg-luxury-surface-strong transition-opacity duration-200 motion-reduce:transition-none ${
        isExiting ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div
        className={`flex w-full max-w-sm flex-col items-center px-8 text-center transition duration-200 motion-reduce:transform-none motion-reduce:transition-none ${
          isExiting ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <span className="inline-flex size-20 items-center justify-center overflow-hidden rounded-full border border-luxury-border bg-white shadow-lg">
          <Image
            src="/Logo_Icono_Dorado.png"
            alt=""
            width={80}
            height={80}
            className="size-full object-cover"
            aria-hidden="true"
          />
        </span>

        <div className="mt-7">
          <p className="font-heading text-3xl tracking-wide text-foreground sm:text-4xl">
            Reina Sophia Residences
          </p>
          <p className="mt-3 text-xs font-medium uppercase tracking-widest text-luxury-gold-ink">
            Aruba Investment
          </p>
        </div>

        <div
          className="mt-12 w-full"
          role="progressbar"
          aria-label="Preparing the Reina Sophia home experience"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div className="flex items-baseline justify-center gap-1 text-luxury-gold-ink">
            <span className="font-heading text-6xl tabular-nums">
              {progress}
            </span>
            <span className="text-sm font-medium">%</span>
          </div>

          <div className="mt-8 h-px w-full overflow-hidden bg-luxury-gold/25">
            <div
              className="h-full bg-luxury-gold transition-all duration-300 ease-out motion-reduce:transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-4 text-xs uppercase tracking-widest text-foreground/50">
            Preparing your experience
          </p>
        </div>
      </div>
    </div>
  )
}
