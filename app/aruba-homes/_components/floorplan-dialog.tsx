"use client"

import { Dialog } from "@base-ui/react/dialog"
import { X, ZoomIn, ZoomOut } from "lucide-react"
import Image from "next/image"
import { useRef, useState } from "react"

import type { ProjectBlueprintSheet, ProjectSlug } from "@/lib/projects"
import type { ResidenceName } from "../_lib/contact-payload"
import { RequestAvailabilityLink } from "./funnel-interactions"
import styles from "../funnel.module.css"

export function FloorplanDialog({ residence, slug, sheet }: {
  residence: ResidenceName
  slug: ProjectSlug
  sheet: ProjectBlueprintSheet
}) {
  const [open, setOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const closeRef = useRef<HTMLButtonElement>(null)
  const requestAvailability = useRef(false)

  return (
    <Dialog.Root
      open={open}
      modal
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          setZoom(1)
          requestAvailability.current = false
        }
        setOpen(nextOpen)
      }}
      onOpenChangeComplete={(nextOpen) => {
        if (!nextOpen && requestAvailability.current) {
          document.getElementById("request-prices")?.scrollIntoView({ block: "start" })
        }
      }}
    >
      <Dialog.Trigger
        data-funnel-event="funnel_floorplan_click"
        data-cta-location={`model-${slug}`}
        aria-label={`View Floorplan for ${residence}`}
        aria-haspopup="dialog"
        className="inline-flex min-h-11 items-center justify-center gap-2 text-sm font-medium underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-luxury-gold-ink"
      >
        View Floorplan <span aria-hidden="true">→</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
        <Dialog.Popup
          aria-modal="true"
          initialFocus={closeRef}
          finalFocus={() => requestAvailability.current ? document.getElementById("request-prices-name") : true}
          className={`${styles.floorplanDialog} fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-dvh w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl border border-luxury-border bg-white text-foreground shadow-2xl sm:inset-x-6 sm:bottom-auto sm:top-1/2 sm:w-auto sm:-translate-y-1/2 sm:rounded-3xl`}
        >
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-luxury-border px-5 py-4 sm:px-6">
            <Dialog.Title className="font-heading text-2xl sm:text-3xl">{residence} Floorplan</Dialog.Title>
            <Dialog.Close ref={closeRef} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-luxury-border px-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-luxury-gold-ink">
              <X className="size-4" aria-hidden="true" /> Close
            </Dialog.Close>
          </div>
          <div className="flex shrink-0 items-center justify-between gap-2 px-5 py-2 sm:px-6">
            <Dialog.Description className="text-xs text-muted-foreground">{sheet.title}</Dialog.Description>
            <div className="flex items-center gap-2">
              <button type="button" aria-label="Zoom out floorplan" disabled={zoom === 1} onClick={() => setZoom(zoom - 0.5)} className="inline-flex size-11 items-center justify-center rounded-full border border-luxury-border disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-luxury-gold-ink">
                <ZoomOut className="size-4" aria-hidden="true" />
              </button>
              <span aria-live="polite" className="w-10 text-center text-xs tabular-nums">{zoom * 100}%</span>
              <button type="button" aria-label="Zoom in floorplan" disabled={zoom === 3} onClick={() => setZoom(zoom + 0.5)} className="inline-flex size-11 items-center justify-center rounded-full border border-luxury-border disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-luxury-gold-ink">
                <ZoomIn className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div aria-label={`${residence} floorplan. Zoom in and scroll to inspect details.`} tabIndex={0} className={`${styles.floorplanViewport} min-h-0 overflow-auto overscroll-contain bg-stone-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-luxury-gold-ink`}>
            <div className="relative" style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}>
              <Image src={sheet.picture} alt={sheet.alt} fill unoptimized className="object-contain" />
            </div>
          </div>
          <div className={`${styles.floorplanActions} shrink-0 border-t border-luxury-border px-5 pt-4 sm:px-6`}>
            <RequestAvailabilityLink residence={residence} onClick={(event) => {
              event.preventDefault()
              requestAvailability.current = true
              setOpen(false)
            }} />
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
