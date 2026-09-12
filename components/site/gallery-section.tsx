"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import Image from "next/image"

type GalleryItem = {
  id: string
  src: string
  title: string
  description: string
  alt: string
  objectPosition: string
}

const galleryItems: GalleryItem[] = [
  {
    id: "aerial-community-overview",
    src: "/gallery/001%20(1)%20(1).webp",
    title: "Aerial View of Reina Sophia Residences",
    description: "Reina Sophia Residences",
    alt: "Top-down aerial view of Reina Sophia Residences in Aruba",
    objectPosition: "center center",
  },
  {
    id: "community-playground",
    src: "/gallery/001%20(11).webp",
    title: "Community Playground",
    description: "Reina Sophia Residences",
    alt: "Elevated view of the community playground and surrounding homes",
    objectPosition: "center center",
  },
  {
    id: "landscaped-community-entrance",
    src: "/gallery/001%20(12).webp",
    title: "Landscaped Community Entrance",
    description: "Reina Sophia Residences",
    alt: "Landscaped entrance to Reina Sophia Residences in Aruba",
    objectPosition: "center center",
  },
  {
    id: "parkside-residential-streetscape",
    src: "/gallery/001%20(2).webp",
    title: "Parkside Residential Streetscape",
    description: "Reina Sophia Residences",
    alt: "Residential streetscape leading toward the community park",
    objectPosition: "center center",
  },
  {
    id: "gated-main-entrance",
    src: "/gallery/Entrada%20Principal.webp",
    title: "Gated Main Entrance",
    description: "Reina Sophia Residences",
    alt: "Gated main entrance to Reina Sophia Residences",
    objectPosition: "center center",
  },
  {
    id: "coastal-community-panorama",
    src: "/gallery/Panoramica%20Lateral%20Der%2C%20Proyecto.webp",
    title: "Coastal Community Panorama",
    description: "Reina Sophia Residences",
    alt: "Aerial panorama of Reina Sophia Residences near the Aruba coastline",
    objectPosition: "center center",
  },
  {
    id: "central-park-aerial-view",
    src: "/gallery/Panoramica%20Parque.webp",
    title: "Central Park Aerial View",
    description: "Reina Sophia Residences",
    alt: "Aerial view of the central park and surrounding residences",
    objectPosition: "center center",
  },
  {
    id: "community-master-plan",
    src: "/gallery/Planta%20General.webp",
    title: "Community Master Plan",
    description: "Reina Sophia Residences",
    alt: "Top-down master plan of Reina Sophia Residences",
    objectPosition: "center center",
  },
  {
    id: "central-park-layout",
    src: "/gallery/Planta%20Parque.webp",
    title: "Central Park Layout",
    description: "Reina Sophia Residences",
    alt: "Top-down view of the central park, pathways, and play areas",
    objectPosition: "center center",
  },
  {
    id: "parkside-corner-at-sunset",
    src: "/gallery/Vista%20Frontal%20Calle%2CEsqina%20Parque%20Izq%2COliver%20Der%2C.webp",
    title: "Parkside Corner at Sunset",
    description: "Reina Sophia Residences",
    alt: "Sunset view of a residential corner beside the community park",
    objectPosition: "center center",
  },
  {
    id: "residential-avenue-at-sunset",
    src: "/gallery/Vista%20frontal%20Calle%2CLuca%20Izq%2C%20Oliver%20Der%2C.webp",
    title: "Residential Avenue at Sunset",
    description: "Reina Sophia Residences",
    alt: "Sunset view along a tree-lined residential avenue",
    objectPosition: "center center",
  },
  {
    id: "landscaped-residential-green",
    src: "/gallery/Vista%20Frontal%20zona%20verde%20%23%203%2C%20Luca%20%23%2038%20%20%26%20Modelo%2019.webp",
    title: "Landscaped Residential Green",
    description: "Reina Sophia Residences",
    alt: "Landscaped residential green with palm trees and modern homes",
    objectPosition: "center center",
  },
  {
    id: "community-recreation-area",
    src: "/gallery/Vista%20lateral%20Parque.webp",
    title: "Community Recreation Area",
    description: "Reina Sophia Residences",
    alt: "Outdoor exercise and play equipment in the community park",
    objectPosition: "center center",
  },
  {
    id: "private-patio-plunge-pool",
    src: "/gallery/amenities.webp",
    title: "Private Patio with Plunge Pool",
    description: "Reina Sophia Residences",
    alt: "Private furnished patio with a compact plunge pool",
    objectPosition: "center center",
  },
  {
    id: "covered-outdoor-living-area",
    src: "/gallery/amenities2.webp",
    title: "Covered Outdoor Living Area",
    description: "Reina Sophia Residences",
    alt: "Covered outdoor living area with lounge and dining furniture",
    objectPosition: "center center",
  },
  {
    id: "contemporary-bathroom",
    src: "/gallery/amenities3.webp",
    title: "Contemporary Bathroom",
    description: "Reina Sophia Residences",
    alt: "Contemporary bathroom with a glass shower and warm wood finishes",
    objectPosition: "center center",
  },
]

const desktopVisibleGalleryCount = 5
const mobileVisibleGalleryCount = 3
const carouselTransitionDurationMs = 700

type CarouselDirection = "previous" | "next"

type RenderedGalleryCard = {
  key: string
  item: GalleryItem
  slot: number
}

type SlotMetrics = {
  left: number
  top: number
  width: number
  height: number
  zIndex: number
}

function getGalleryItem(index: number) {
  return galleryItems[(index + galleryItems.length) % galleryItems.length]
}

function getVisibleGalleryItems(startIndex: number, visibleGalleryCount: number) {
  return Array.from(
    { length: Math.min(visibleGalleryCount, galleryItems.length) },
    (_, offset) => getGalleryItem(startIndex + offset),
  )
}

function buildSteadyCards(
  startIndex: number,
  visibleGalleryCount: number,
): RenderedGalleryCard[] {
  return getVisibleGalleryItems(startIndex, visibleGalleryCount).map((item, slot) => ({
    key: item.id,
    item,
    slot,
  }))
}

function getSlotMetrics(activeVisibleIndex: number, visibleGalleryCount: number) {
  const inactiveWidthUnits = 1.1
  const activeWidthUnits = 2.25
  const gapUnits = 0.16
  const activeSlotIndex = Math.min(Math.max(activeVisibleIndex, 0), visibleGalleryCount - 1)
  const widths = Array.from({ length: visibleGalleryCount }, (_, index) =>
    index === activeSlotIndex ? activeWidthUnits : inactiveWidthUnits,
  )
  const totalUnits =
    widths.reduce((sum, width) => sum + width, 0) + gapUnits * (visibleGalleryCount - 1)
  const gapPercent = (gapUnits / totalUnits) * 100
  const visibleSlots: SlotMetrics[] = []
  let consumedUnits = 0

  widths.forEach((widthUnits, index) => {
    const width = (widthUnits / totalUnits) * 100
    const isActive = index === activeSlotIndex

    visibleSlots.push({
      left: (consumedUnits / totalUnits) * 100,
      top: isActive ? 0 : 7,
      width,
      height: isActive ? 100 : 86,
      zIndex: isActive ? 30 : 10 + index,
    })

    consumedUnits += widthUnits + gapUnits
  })

  const previousSlot = visibleSlots[0]
  const nextSlot = visibleSlots[visibleSlots.length - 1]
  const allSlots: Record<number, SlotMetrics> = {
    [-1]: {
      ...previousSlot,
      left: previousSlot.left - previousSlot.width - gapPercent,
      zIndex: 5,
    },
    [visibleGalleryCount]: {
      ...nextSlot,
      left: nextSlot.left + nextSlot.width + gapPercent,
      zIndex: 5,
    },
  }

  visibleSlots.forEach((slotMetrics, index) => {
    allSlots[index] = slotMetrics
  })

  return {
    visibleSlots,
    allSlots,
  }
}

export function GallerySection() {
  const [visibleGalleryCount, setVisibleGalleryCount] = useState(desktopVisibleGalleryCount)
  const [activeVisibleIndex, setActiveVisibleIndex] = useState(1)
  const [carouselStartIndex, setCarouselStartIndex] = useState(0)
  const [renderedCards, setRenderedCards] = useState<RenderedGalleryCard[]>(() =>
    buildSteadyCards(0, desktopVisibleGalleryCount),
  )
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const carouselStartIndexRef = useRef(carouselStartIndex)
  const transitionFrameRef = useRef<number | null>(null)
  const transitionTimeoutRef = useRef<number | null>(null)
  const { allSlots } = useMemo(
    () => getSlotMetrics(activeVisibleIndex, visibleGalleryCount),
    [activeVisibleIndex, visibleGalleryCount],
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)")
    const updateVisibleGalleryCount = () => {
      const nextVisibleGalleryCount = mediaQuery.matches
        ? mobileVisibleGalleryCount
        : desktopVisibleGalleryCount

      setVisibleGalleryCount(nextVisibleGalleryCount)
      setActiveVisibleIndex((currentIndex) =>
        Math.min(currentIndex, nextVisibleGalleryCount - 1),
      )
      setRenderedCards(
        buildSteadyCards(carouselStartIndexRef.current, nextVisibleGalleryCount),
      )
    }

    updateVisibleGalleryCount()
    mediaQuery.addEventListener("change", updateVisibleGalleryCount)

    return () => {
      mediaQuery.removeEventListener("change", updateVisibleGalleryCount)
    }
  }, [])

  useEffect(() => {
    if (!isModalOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModalOpen(false)
      }
    }

    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isModalOpen])

  useEffect(() => {
    return () => {
      if (transitionFrameRef.current !== null) {
        window.cancelAnimationFrame(transitionFrameRef.current)
      }

      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current)
      }
    }
  }, [])

  const runCarouselTransition = (direction: CarouselDirection) => {
    if (isTransitioning || galleryItems.length <= visibleGalleryCount) {
      return
    }

    const currentStartIndex = carouselStartIndex
    const currentCards = buildSteadyCards(currentStartIndex, visibleGalleryCount)

    setIsTransitioning(true)

    if (transitionFrameRef.current !== null) {
      window.cancelAnimationFrame(transitionFrameRef.current)
    }

    if (transitionTimeoutRef.current !== null) {
      window.clearTimeout(transitionTimeoutRef.current)
    }

    if (direction === "next") {
      const incomingCard: RenderedGalleryCard = {
        key: getGalleryItem(currentStartIndex + visibleGalleryCount).id,
        item: getGalleryItem(currentStartIndex + visibleGalleryCount),
        slot: visibleGalleryCount,
      }

      setRenderedCards([...currentCards, incomingCard])

      transitionFrameRef.current = window.requestAnimationFrame(() => {
        setRenderedCards([
          ...currentCards.map((card, index) => ({ ...card, slot: index - 1 })),
          { ...incomingCard, slot: visibleGalleryCount - 1 },
        ])
      })

      transitionTimeoutRef.current = window.setTimeout(() => {
        const nextStartIndex = (currentStartIndex + 1) % galleryItems.length
        carouselStartIndexRef.current = nextStartIndex
        setCarouselStartIndex(nextStartIndex)
        setRenderedCards(buildSteadyCards(nextStartIndex, visibleGalleryCount))
        setIsTransitioning(false)
      }, carouselTransitionDurationMs)

      return
    }

    const incomingCard: RenderedGalleryCard = {
      key: getGalleryItem(currentStartIndex - 1).id,
      item: getGalleryItem(currentStartIndex - 1),
      slot: -1,
    }

    setRenderedCards([incomingCard, ...currentCards])

    transitionFrameRef.current = window.requestAnimationFrame(() => {
      setRenderedCards([
        { ...incomingCard, slot: 0 },
        ...currentCards.map((card, index) => ({ ...card, slot: index + 1 })),
      ])
    })

    transitionTimeoutRef.current = window.setTimeout(() => {
      const nextStartIndex =
        currentStartIndex === 0 ? galleryItems.length - 1 : currentStartIndex - 1
      carouselStartIndexRef.current = nextStartIndex
      setCarouselStartIndex(nextStartIndex)
      setRenderedCards(buildSteadyCards(nextStartIndex, visibleGalleryCount))
      setIsTransitioning(false)
    }, carouselTransitionDurationMs)
  }

  const showPrevious = () => {
    runCarouselTransition("previous")
  }

  const showNext = () => {
    runCarouselTransition("next")
  }

  const openModal = (visibleIndex: number) => {
    setActiveVisibleIndex(visibleIndex)
    setIsModalOpen(true)
  }

  const handleCardClick = (visibleIndex: number) => {
    if (isTransitioning) {
      return
    }

    if (visibleIndex === activeVisibleIndex) {
      openModal(visibleIndex)
      return
    }

    runCarouselTransition(visibleIndex < activeVisibleIndex ? "previous" : "next")
  }

  return (
    <section id="gallery" className="flex min-h-screen items-center py-6">
      <div className="w-full rounded-3xl  bg-white px-4 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="font-heading text-center text-3xl leading-tight text-foreground sm:text-4xl lg:text-5xl">
            Enjoy the luxury and serenity of living in Aruba
          </p>

          <div className="mt-7 flex items-center gap-4">
            <span className="h-px flex-1 bg-foreground/20" />
            <p className="font-heading text-sm uppercase tracking-widest text-luxury-gold sm:text-base lg:text-lg">
              Luxury & Comfort
            </p>
            <span className="h-px flex-1 bg-foreground/20" />
          </div>

          <div className="mt-8 px-0 py-5 lg:-mx-6">
            <div className="mx-auto flex max-w-7xl items-center justify-center gap-6">
              <button
                type="button"
                className="hidden size-12 shrink-0 items-center justify-center rounded-full border border-luxury-border bg-white text-foreground shadow-lg transition hover:border-luxury-gold hover:text-luxury-gold lg:inline-flex"
                aria-label="Previous image"
                onClick={showPrevious}
              >
                <ChevronLeft className="size-8" aria-hidden="true" />
              </button>

              <div className="min-w-0 flex-1">
                <div className="relative mx-auto h-96 w-full max-w-7xl overflow-hidden sm:h-120` lg:h-136">
                  {renderedCards.map(({ key, item, slot }) => {
                    const slotMetrics = allSlots[slot]

                    if (!slotMetrics) {
                      return null
                    }

                    const isVisibleSlot = slot >= 0 && slot < visibleGalleryCount
                    const visibleIndex = Math.min(Math.max(slot, 0), visibleGalleryCount - 1)

                    return (
                      <GalleryCard
                        key={key}
                        item={item}
                        isActive={isVisibleSlot && activeVisibleIndex === visibleIndex}
                        isTransitioning={isTransitioning}
                        slotMetrics={slotMetrics}
                        onActivate={() => {
                          if (!isTransitioning && isVisibleSlot) {
                            setActiveVisibleIndex(visibleIndex)
                          }
                        }}
                        onClick={() => {
                          if (isVisibleSlot) {
                            handleCardClick(visibleIndex)
                          }
                        }}
                      />
                    )
                  })}
                </div>
              </div>

              <button
                type="button"
                className="hidden size-12 shrink-0 items-center justify-center rounded-full border border-luxury-border bg-white text-foreground shadow-lg transition hover:border-luxury-gold hover:text-luxury-gold lg:inline-flex"
                aria-label="Next image"
                onClick={showNext}
              >
                <ChevronRight className="size-8" aria-hidden="true" />
              </button>
            </div>

            <div className="relative mt-4 flex items-center justify-center gap-4 lg:hidden">
              <button
                type="button"
                className="inline-flex size-12 items-center justify-center rounded-full border border-luxury-border bg-white text-foreground shadow-lg transition hover:border-luxury-gold hover:text-luxury-gold"
                aria-label="Previous image"
                onClick={showPrevious}
              >
                <ChevronLeft className="size-8" aria-hidden="true" />
              </button>

              <button
                type="button"
                className="inline-flex size-12 items-center justify-center rounded-full border border-luxury-border bg-white text-foreground shadow-lg transition hover:border-luxury-gold hover:text-luxury-gold"
                aria-label="Next image"
                onClick={showNext}
              >
                <ChevronRight className="size-8" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen ? <GalleryModal onClose={() => setIsModalOpen(false)} /> : null}
    </section>
  )
}

function GalleryCard({
  item,
  isActive,
  isTransitioning,
  slotMetrics,
  onActivate,
  onClick,
}: {
  item: GalleryItem
  isActive: boolean
  isTransitioning: boolean
  slotMetrics: SlotMetrics
  onActivate: () => void
  onClick: () => void
}) {
  return (
    <figure
      className={`group absolute overflow-hidden rounded-xl border border-white/70 bg-white shadow-lg transition-[left,top,width,height,box-shadow] duration-700 ease-out ${
        isActive ? "shadow-2xl" : "hover:shadow-xl"
      }`}
      style={{
        left: `${slotMetrics.left}%`,
        top: `${slotMetrics.top}%`,
        width: `${slotMetrics.width}%`,
        height: `${slotMetrics.height}%`,
        zIndex: slotMetrics.zIndex,
      }}
      onMouseEnter={onActivate}
    >
      <button
        type="button"
        className="absolute inset-0 z-10 cursor-pointer rounded-full focus-visible:ring-4 focus-visible:ring-luxury-gold/40 focus-visible:outline-none"
        aria-label={isActive ? `Open gallery modal for ${item.title}` : `Move gallery to ${item.title}`}
        onClick={onClick}
        onFocus={onActivate}
      />

      <div className="absolute inset-0">
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes="(min-width: 1280px) 520px, (min-width: 1024px) 38vw, (min-width: 640px) 34vw, 48vw"
          className={`object-cover transition duration-700 ${
            isTransitioning ? "" : "group-hover:scale-105"
          }`}
          style={{ objectPosition: item.objectPosition }}
          loading="lazy"
        />
      </div>

      <div
        className={`absolute inset-0 bg-linear-to-b from-transparent via-black/10 to-black/65 transition-opacity duration-500 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      />

      <figcaption
        className={`absolute inset-x-0 bottom-0 z-20 px-5 pb-8 text-white transition-all duration-500 ${
          isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <p className="font-heading text-2xl leading-tight">{item.title}</p>
        <p className="mt-2 max-w-xs text-sm leading-6 text-white/90">{item.description}</p>
      </figcaption>
    </figure>
  )
}

function GalleryModal({ onClose }: { onClose: () => void }) {
  const [expandedImageIndex, setExpandedImageIndex] = useState<number | null>(null)
  const expandedItem = expandedImageIndex === null ? null : galleryItems[expandedImageIndex]

  const showPreviousExpandedImage = () => {
    setExpandedImageIndex((currentIndex) => {
      if (currentIndex === null) {
        return currentIndex
      }

      return currentIndex === 0 ? galleryItems.length - 1 : currentIndex - 1
    })
  }

  const showNextExpandedImage = () => {
    setExpandedImageIndex((currentIndex) => {
      if (currentIndex === null) {
        return currentIndex
      }

      return (currentIndex + 1) % galleryItems.length
    })
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 top-18 z-50 flex items-center justify-center bg-foreground/70 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gallery-modal-title"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-full w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-luxury-border bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative flex shrink-0 items-center justify-center border-b border-black/10 px-16 py-4 sm:px-20">
          <div className="flex flex-col items-center gap-3">
            <span className="inline-flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-luxury-border bg-white">
              <Image
                src="/Logo_Icono_Dorado.png"
                alt=""
                width={40}
                height={40}
                className="size-full object-cover"
                aria-hidden="true"
              />
            </span>

            <span className="min-w-0 flex flex-col items-center gap-1 text-center">
              <span
                id="gallery-modal-title"
                className="block font-heading text-xl tracking-wide text-black sm:text-2xl"
              >
                Reina Sophia Residences
              </span>
              <span className="block text-xs uppercase tracking-widest text-black/70">
                Aruba Investment
              </span>
            </span>
          </div>

          <button
            type="button"
            className="absolute right-5 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-luxury-border bg-white text-foreground transition hover:border-luxury-gold hover:text-luxury-gold sm:right-6"
            aria-label="Close gallery modal"
            onClick={onClose}
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {galleryItems.map((item, index) => (
              <button
                type="button"
                key={item.id}
                className="overflow-hidden rounded-2xl border border-black/10 bg-white text-left shadow-lg transition hover:shadow-xl focus-visible:ring-4 focus-visible:ring-luxury-gold/40 focus-visible:outline-none"
                aria-label={`Open enlarged image for ${item.title}`}
                onClick={() => setExpandedImageIndex(index)}
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 90vw"
                    className="object-cover"
                    style={{ objectPosition: item.objectPosition }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {expandedItem && typeof document !== "undefined" ? createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/85 px-3 py-4 backdrop-blur-sm sm:px-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gallery-expanded-title"
            aria-describedby="gallery-expanded-description"
            onClick={() => setExpandedImageIndex(null)}
          >
            <div
              className="relative flex h-[90vh] w-full max-w-screen-2xl flex-col"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative min-h-0 flex-1 overflow-hidden rounded-t-2xl bg-black shadow-2xl">
                <Image
                  src={expandedItem.src}
                  alt={expandedItem.alt}
                  fill
                  sizes="80vw"
                  className="object-contain"
                  style={{ objectPosition: expandedItem.objectPosition }}
                  quality={95}
                />

                <button
                  type="button"
                  className="absolute left-3 top-1/2 z-20 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-foreground shadow-lg transition hover:border-luxury-gold hover:text-luxury-gold sm:left-5"
                  aria-label="Previous enlarged image"
                  onClick={showPreviousExpandedImage}
                >
                  <ChevronLeft className="size-7" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  className="absolute right-3 top-1/2 z-20 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-foreground shadow-lg transition hover:border-luxury-gold hover:text-luxury-gold sm:right-5"
                  aria-label="Next enlarged image"
                  onClick={showNextExpandedImage}
                >
                  <ChevronRight className="size-7" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  className="absolute right-3 top-3 z-20 inline-flex size-11 items-center justify-center rounded-full border border-white/70 bg-white/90 text-foreground shadow-lg transition hover:border-luxury-gold hover:text-luxury-gold sm:right-5 sm:top-5"
                  aria-label="Close enlarged image"
                  onClick={() => setExpandedImageIndex(null)}
                >
                  <X className="size-5" aria-hidden="true" />
                </button>
              </div>

              <div
                className="shrink-0 rounded-b-2xl border-t border-luxury-border bg-white px-5 py-4 shadow-2xl sm:px-7 sm:py-5"
                aria-live="polite"
              >
                <p
                  id="gallery-expanded-title"
                  className="font-heading text-xl leading-tight text-foreground sm:text-2xl"
                >
                  {expandedItem.title}
                </p>
                <p
                  id="gallery-expanded-description"
                  className="mt-1 text-sm leading-6 text-foreground/70"
                >
                  {expandedItem.description}
                </p>
              </div>
            </div>
          </div>,
          document.body,
        ) : null}
      </div>
    </div>
  )
}
