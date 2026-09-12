"use client"

import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import Image from "next/image"

type ProjectImageLightboxProps = {
  alt: string
  eyebrow?: string
  isOpen: boolean
  onClose: () => void
  onNext?: () => void
  onPrevious?: () => void
  src: string
  title: string
}

export function ProjectImageLightbox({
  alt,
  eyebrow,
  isOpen,
  onClose,
  onNext,
  onPrevious,
  src,
  title,
}: ProjectImageLightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previousActiveElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }

      if (event.key === "ArrowLeft") {
        onPrevious?.()
      }

      if (event.key === "ArrowRight") {
        onNext?.()
      }
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleKeyDown)
      previousActiveElement?.focus()
    }
  }, [isOpen, onClose, onNext, onPrevious])

  if (!isOpen || typeof document === "undefined") {
    return null
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-3 backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Expanded view of ${title}`}
      onClick={onClose}
    >
      <div
        className="relative h-full w-full max-w-7xl overflow-hidden rounded-2xl border border-white/15 bg-black shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          className="object-contain"
          quality={95}
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 via-black/25 to-transparent px-5 pb-5 pt-16 sm:px-7 sm:pb-7">
          {eyebrow ? (
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-white/65 sm:text-xs">
              {eyebrow}
            </p>
          ) : null}
          <p className="font-heading text-xl text-white drop-shadow-sm sm:text-2xl">
            {title}
          </p>
        </div>

        {onPrevious ? (
          <button
            type="button"
            className="absolute left-3 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/60 text-white shadow-lg backdrop-blur-sm transition hover:border-white hover:bg-black/80 focus-visible:ring-4 focus-visible:ring-luxury-gold/40 focus-visible:outline-none sm:left-5"
            aria-label="View previous project gallery image"
            onClick={onPrevious}
          >
            <ChevronLeft className="size-6" aria-hidden="true" />
          </button>
        ) : null}

        {onNext ? (
          <button
            type="button"
            className="absolute right-3 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/60 text-white shadow-lg backdrop-blur-sm transition hover:border-white hover:bg-black/80 focus-visible:ring-4 focus-visible:ring-luxury-gold/40 focus-visible:outline-none sm:right-5"
            aria-label="View next project gallery image"
            onClick={onNext}
          >
            <ChevronRight className="size-6" aria-hidden="true" />
          </button>
        ) : null}

        <button
          ref={closeButtonRef}
          type="button"
          className="absolute right-3 top-3 z-10 inline-flex size-11 items-center justify-center rounded-full border border-white/40 bg-black/60 text-white shadow-lg backdrop-blur-sm transition hover:border-white hover:bg-black/80 focus-visible:ring-4 focus-visible:ring-luxury-gold/40 focus-visible:outline-none sm:right-5 sm:top-5"
          aria-label={`Close expanded view of ${title}`}
          onClick={onClose}
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>
    </div>,
    document.body,
  )
}
