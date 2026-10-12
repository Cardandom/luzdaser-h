"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { ArrowRight, ChevronLeft, ChevronRight, Images, X } from "lucide-react"

import type { ProjectGalleryImage } from "@/lib/projects"

type ResidenceImageGalleryProps = {
  residence: string
  images: ProjectGalleryImage[]
  children: ReactNode
}

type ResidenceGalleryImageTriggerProps = {
  mainImage: string
  mainAlt: string
  objectPosition?: string
}

type GalleryContextValue = {
  residence: string
  imageCount: number
  openGallery: (opener: HTMLButtonElement) => void
}

const GalleryContext = createContext<GalleryContextValue | null>(null)

function useResidenceGallery() {
  const gallery = useContext(GalleryContext)
  if (!gallery) throw new Error("Residence gallery trigger requires its gallery")
  return gallery
}

export function ResidenceImageGallery({
  residence,
  images,
  children,
}: ResidenceImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const openerRef = useRef<HTMLButtonElement | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  const openGallery = useCallback((opener: HTMLButtonElement) => {
    openerRef.current = opener
    setIndex(0)
    setIsOpen(true)
  }, [])
  const closeGallery = useCallback(() => setIsOpen(false), [])
  const showPrevious = useCallback(() => {
    setIndex((current) => (current - 1 + images.length) % images.length)
  }, [images.length])
  const showNext = useCallback(() => {
    setIndex((current) => (current + 1) % images.length)
  }, [images.length])
  const contextValue = useMemo(
    () => ({ residence, imageCount: images.length, openGallery }),
    [residence, images.length, openGallery],
  )

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    const opener = openerRef.current
    document.body.style.overflow = "hidden"
    closeRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        closeGallery()
      } else if (event.key === "ArrowLeft" && images.length > 1) {
        event.preventDefault()
        showPrevious()
      } else if (event.key === "ArrowRight" && images.length > 1) {
        event.preventDefault()
        showNext()
      } else if (event.key === "Tab") {
        const controls = dialogRef.current?.querySelectorAll<HTMLButtonElement>(
          '[data-residence-gallery-control="true"]',
        )
        const first = controls?.[0]
        const last = controls ? controls[controls.length - 1] : undefined
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = previousOverflow
      opener?.focus()
    }
  }, [closeGallery, images.length, isOpen, showNext, showPrevious])

  const currentImage = images[index]

  return (
    <GalleryContext.Provider value={contextValue}>
      {children}

      {isOpen && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={dialogRef}
              className="fixed inset-0 z-100 flex items-center justify-center bg-stone-950/95 p-3 backdrop-blur-sm sm:p-6"
              role="dialog"
              aria-modal="true"
              aria-label={`${residence} image gallery`}
              onClick={(event) => {
                if (event.target === event.currentTarget) closeGallery()
              }}
            >
              <div className="relative h-11/12 w-full max-w-6xl overflow-hidden rounded-2xl border border-white/15 bg-black shadow-2xl">
                <Image
                  key={currentImage.src}
                  src={currentImage.src}
                  alt={currentImage.alt}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent px-5 pt-16 pb-5 text-white sm:px-7 sm:pb-7">
                  <p className="font-heading text-lg sm:text-xl">
                    {currentImage.title ?? residence}
                  </p>
                  <p className="mt-1 text-xs text-white/80" aria-live="polite">
                    {index + 1} / {images.length}
                  </p>
                </div>
                {images.length > 1 ? (
                  <>
                    <button
                      type="button"
                      data-residence-gallery-control="true"
                      className="absolute top-1/2 left-3 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/70 text-white transition hover:bg-black focus-visible:ring-4 focus-visible:ring-luxury-gold/60 focus-visible:outline-none sm:left-5"
                      aria-label={`Previous ${residence} image`}
                      onClick={showPrevious}
                    >
                      <ChevronLeft className="size-6" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      data-residence-gallery-control="true"
                      className="absolute top-1/2 right-3 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/70 text-white transition hover:bg-black focus-visible:ring-4 focus-visible:ring-luxury-gold/60 focus-visible:outline-none sm:right-5"
                      aria-label={`Next ${residence} image`}
                      onClick={showNext}
                    >
                      <ChevronRight className="size-6" aria-hidden="true" />
                    </button>
                  </>
                ) : null}
                <button
                  ref={closeRef}
                  type="button"
                  data-residence-gallery-control="true"
                  className="absolute top-3 right-3 z-10 inline-flex size-11 items-center justify-center rounded-full border border-white/40 bg-black/70 text-white transition hover:bg-black focus-visible:ring-4 focus-visible:ring-luxury-gold/60 focus-visible:outline-none sm:top-5 sm:right-5"
                  aria-label={`Close ${residence} image gallery`}
                  onClick={closeGallery}
                >
                  <X className="size-5" aria-hidden="true" />
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </GalleryContext.Provider>
  )
}

export function ResidenceGalleryImageTrigger({
  mainImage,
  mainAlt,
  objectPosition,
}: ResidenceGalleryImageTriggerProps) {
  const { residence, openGallery } = useResidenceGallery()

  return (
    <button
      type="button"
      className="relative block size-full cursor-pointer overflow-hidden text-left focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-luxury-gold-ink focus-visible:outline-none"
      aria-label={`View photos of the ${residence} residence`}
      onClick={(event) => openGallery(event.currentTarget)}
    >
      <Image
        src={mainImage}
        alt={mainAlt}
        fill
        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 448px, 86vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
        style={{ objectPosition }}
      />
      <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs font-medium text-white shadow-sm backdrop-blur-sm">
        <Images className="size-3.5" aria-hidden="true" />
        View photos
      </span>
    </button>
  )
}

export function ResidenceGalleryExploreTrigger() {
  const { residence, imageCount, openGallery } = useResidenceGallery()

  return (
    <button
      type="button"
      className="mt-3 flex min-h-12 w-full cursor-pointer items-center gap-2 rounded-xl border border-luxury-border bg-stone-50 px-3 py-2.5 text-left text-xs font-semibold text-foreground/80 transition-colors hover:bg-stone-100 focus-visible:ring-4 focus-visible:ring-luxury-gold/40 focus-visible:outline-none motion-reduce:transition-none"
      aria-label={`Open ${residence} photo gallery`}
      onClick={(event) => openGallery(event.currentTarget)}
    >
      <Images className="size-4 shrink-0 text-luxury-gold-ink" aria-hidden="true" />
      <span>Explore {imageCount} photos</span>
      <ArrowRight className="ml-auto size-4 shrink-0 text-foreground/55" aria-hidden="true" />
    </button>
  )
}
