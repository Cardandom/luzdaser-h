"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"

import { featuredProjects, type ProjectSlug } from "@/lib/projects"

const videoPhaseEnd = 0.7
const cardRevealStart = 0.7
const cardRevealEnd = 0.85

type ScrollVideoRevealSectionProps = {
  id?: string
  projectSlug?: ProjectSlug
  videoSrc?: string
}

export function ScrollVideoRevealSection({
  id = "scroll-video-reveal",
  projectSlug = "oliver-boutique",
  videoSrc = "/videos/video_recortado_oliver.mp4",
}: ScrollVideoRevealSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)
  const revealProject = featuredProjects.find(
    (project) => project.slug === projectSlug,
  )
  const revealTitle =
    projectSlug === "oliver-boutique"
      ? "Oliver House Boutique"
      : "Lucas House Boutique"

  useEffect(() => {
    let context: { revert: () => void } | null = null
    let removeVideoTicker: (() => void) | null = null
    let scrollTriggerInstance: { kill: () => void } | null = null
    let isMounted = true
    let hasInitialized = false

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
      const scrollDistance = isDesktop ? "+=6500" : "+=5200"
      const cardEase = gsap.parseEase("power3.out")
      let targetTime = 0
      let currentTime = 0

      const setVideoTargetTime = (nextTargetTime: number, shouldSnap = false) => {
        const duration = video.duration

        if (!Number.isFinite(duration) || duration <= 0) {
          return
        }

        targetTime = gsap.utils.clamp(0, duration, nextTargetTime)

        if (shouldSnap) {
          currentTime = targetTime
          video.currentTime = targetTime
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

        currentTime += (targetTime - currentTime) * 0.12
        video.currentTime = gsap.utils.clamp(0, duration, currentTime)
      }

      gsap.ticker.add(updateVideoTime)
      removeVideoTicker = () => {
        gsap.ticker.remove(updateVideoTime)
      }

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

      ScrollTrigger.refresh()
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
      video?.removeEventListener("loadedmetadata", handleLoadedMetadata)
      removeVideoTicker?.()
      scrollTriggerInstance?.kill()
      context?.revert()
    }
  }, [])

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/35"
      />

      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-5 py-10 sm:px-8">
        <div
          ref={cardRef}
          className="pointer-events-auto flex w-full max-w-xl flex-col items-center gap-5 text-center"
        >
          {revealProject && (
            <>
              <h2 className="font-heading text-4xl leading-tight text-white drop-shadow-lg sm:text-6xl">
                {revealTitle}
              </h2>

              <Link
                href={`/projects/${revealProject.slug}`}
                aria-label={`Open ${revealTitle} project board`}
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
