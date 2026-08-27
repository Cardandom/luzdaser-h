"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import * as Icons from "lucide-react"
import {
  ArrowRight,
  ChevronLeft,
} from "lucide-react"

import { getProjectBySlug, type ProjectSlug } from "@/lib/projects"
import { ArchitectureShowcaseTop } from "./ArchitectureShowcaseTop"
import {
  constructionSpecs,
  getIcon,
  idealForList,
} from "./ArchitectureShowcase.data"

type ArchitectureShowcaseProps = {
  slug: ProjectSlug
}
export function ArchitectureShowcase({ slug }: ArchitectureShowcaseProps) {
  const project = getProjectBySlug(slug)

  const [hoveredElevationSpec, setHoveredElevationSpec] = useState<string | null>(null)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  if (!project) {
    return null
  }

  const backToProjectsHref = project.slug === "oliver-boutique" ? "/#oliver" : "/#luca"
  const daytimeImage = project.tiles[0]?.picture ?? project.picture

  return (
    <section className="space-y-10">
      <ArchitectureShowcaseTop
        slug={slug}
        backToProjectsHref={backToProjectsHref}
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <section id="featured-projects" className="">
          <div className="flex items-center gap-2 my-14">
            <span className="h-px flex-1 bg-slate-200" />
            <h2 className="font-heading text-sm font-extrabold uppercase tracking-widest text-slate-500">
              Project Gallery
            </h2>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {project.tiles.map((tile) => (
              <figure
                key={tile.title}
                className="overflow-hidden rounded-3xl border border-luxury-border bg-white shadow-lg"
              >
                <div className="relative aspect-4/3 overflow-hidden">
                  <Image
                    src={tile.picture}
                    alt={tile.alt}
                    fill
                    sizes="(min-width: 1280px) 22vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    style={{ objectPosition: tile.objectPosition }}
                  />
                  <div className="absolute inset-0 bg-linear-to-b from-black/0 via-black/0 to-black/30" />
                </div>
                <figcaption className="space-y-2 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-foreground/45">
                    {tile.title}
                  </p>
                  <p className="font-heading text-xl leading-tight text-foreground">
                    {tile.caption}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <div className="flex items-center gap-2 my-14">
          <span className="h-px flex-1 bg-slate-200" />
          <h2 className="font-heading text-sm font-extrabold uppercase tracking-widest text-slate-500">
            Structural Envelopes & Concept Detail
          </h2>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md blueprint-grid">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-sm bg-slate-900" />
                  Construction Systems
                </h3>
                <span className="text-[9px] font-mono font-semibold text-slate-400">Spec Section 03-3000</span>
              </div>
              <div className="space-y-4">
                {constructionSpecs.map((spec) => {
                  const IconComponent = getIcon(spec.iconName)

                  return (
                    <div key={spec.id} className="flex items-start gap-3 rounded-md p-1 transition-colors duration-150 hover:bg-slate-50">
                      <div className="mt-0.5 rounded bg-slate-100 p-1.5 text-slate-700">
                        <IconComponent className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <span className="block font-heading text-[11px] font-bold uppercase tracking-wide text-slate-900">
                          {spec.title}
                        </span>
                        <span className="mt-0.2 block text-[10px] leading-relaxed text-slate-500">
                          {spec.description}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </article>

            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md blueprint-grid">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-sm bg-slate-900" />
                  Adaptive Zoning Uses
                </h3>
                <span className="text-[9px] font-mono font-semibold text-slate-400">Zoning Code R-1</span>
              </div>
              <div className="space-y-4">
                {idealForList.map((ideal) => {
                  const IconComponent = getIcon(ideal.iconName)

                  return (
                    <div key={ideal.id} className="flex items-start gap-3 rounded-md p-1 transition-colors duration-150 hover:bg-slate-50">
                      <div className="mt-0.5 rounded bg-slate-100 p-1.5 text-slate-700">
                        <IconComponent className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <span className="block font-heading text-[11px] font-bold uppercase tracking-wide text-slate-900">
                          {ideal.title}
                        </span>
                        <span className="mt-0.2 block text-[10px] leading-relaxed text-slate-500">
                          {ideal.description}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </article>

            <article className="flex h-full flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md">
              <div
                className="group relative flex min-h-40 flex-1 items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-slate-100"
                onMouseEnter={() => setHoveredElevationSpec("render")}
                onMouseLeave={() => setHoveredElevationSpec(null)}
              >
                <Image
                  src={daytimeImage}
                  alt={`${project.title} concept render`}
                  fill
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ objectPosition: project.tiles[0]?.objectPosition ?? project.objectPosition }}
                />
                <div
                  className={`absolute inset-0 bg-slate-950/20 transition-opacity duration-300 ${
                    hoveredElevationSpec === "render" ? "opacity-100" : "opacity-0"
                  } group-hover:opacity-100`}
                />
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-label="Expand concept render"
                >
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-900 shadow-lg">
                    <Icons.Eye className="h-3.5 w-3.5" aria-hidden="true" />
                    Expand Concept
                  </span>
                </button>
                <div className="absolute bottom-2.5 left-2.5 rounded-sm border border-slate-700 bg-slate-900/90 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-wider text-slate-200 backdrop-blur-sm">
                  Exterior Perspective
                </div>
                {hoveredElevationSpec === "render" ? (
                  <div className="absolute right-2.5 top-2.5 rounded-full border border-white/20 bg-white/90 px-2 py-1 font-mono text-[8px] uppercase tracking-wider text-slate-900 shadow-lg">
                    Concept Render Active
                  </div>
                ) : null}
              </div>

              <div className="mt-3">
                <span className="block font-heading text-[11px] font-bold uppercase tracking-wider text-slate-900">
                  Concept Render Showcase
                </span>
                <p className="mt-0.5 text-[10px] leading-relaxed text-slate-500">
                  Photorealistic rendering illustrating day-cycle micro-shading cast from vertical structural elements.
                </p>
              </div>
            </article>
        </section>

        <footer className="border-t border-slate-200 pt-6 text-center">
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={backToProjectsHref}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-luxury-border bg-white px-5 py-3 text-sm font-medium text-foreground transition hover:border-luxury-gold hover:text-luxury-gold"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Back to projects
            </Link>

            <Link
              href="/#contacts"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-b from-luxury-gold-soft to-luxury-gold px-5 py-3 text-sm font-semibold text-stone-950 shadow-lg transition-transform hover:-translate-y-0.5"
            >
              Talk to us
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </footer>
      </div>

      {isLightboxOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Expanded concept render"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-800 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute right-4 top-4 z-10 rounded-full bg-slate-900/80 p-2 text-white transition-colors duration-150 hover:bg-slate-900"
              aria-label="Close expanded concept render"
            >
              <Icons.X className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12">
              <div className="min-h-75 bg-black md:col-span-8">
                <Image
                  src={daytimeImage}
                  alt="Expanded concept view"
                  width={1200}
                  height={900}
                  className="h-full w-full object-cover"
                  style={{ objectPosition: project.tiles?.[0]?.objectPosition ?? project.objectPosition }}
                />
              </div>

              <div className="flex flex-col justify-between bg-slate-50 p-6 md:col-span-4">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
                    Concept Sheet Render
                  </span>
                  <h3 className="mt-1 font-heading text-lg font-bold uppercase tracking-wide text-slate-900">
                    {project.boardTitle}
                  </h3>

                  <div className="mt-6 space-y-3">
                    <div>
                      <span className="block text-[9px] font-mono uppercase tracking-wider text-slate-400">
                        Exterior Walls
                      </span>
                      <span className="mt-0.5 block text-[11px] font-semibold text-slate-800">
                        Vertical Oiled Redwood Siding & Raw Concrete
                      </span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-mono uppercase tracking-wider text-slate-400">
                        Glazing Frame
                      </span>
                      <span className="mt-0.5 block text-[11px] font-semibold text-slate-800">
                        Black Matte PVC Double-Glazing Profile
                      </span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-mono uppercase tracking-wider text-slate-400">
                        Foundation Base
                      </span>
                      <span className="mt-0.5 block text-[11px] font-semibold text-slate-800">
                        Integrated Hydronic Radiant Heated Concrete Slabs
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mt-8 border-t border-slate-200 pt-4 text-[10px] leading-normal text-slate-400">
                  Concept visualization only. Material parameters, landscape outlines, and spatial configurations are subject to local development approvals.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}




