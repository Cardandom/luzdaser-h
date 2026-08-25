"use client"

import { useState } from "react"
import { ArrowRight, ChevronLeft, ZoomIn } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { getProjectBySlug, type ProjectSlug } from "@/lib/projects"
import { ProjectImageLightbox } from "./ProjectImageLightbox"

type ArchitectureShowcaseProps = {
  backToProjectsHref: string
  slug: ProjectSlug
}

export function ArchitectureShowcaseTop({
  backToProjectsHref,
  slug,
}: ArchitectureShowcaseProps) {
  const project = getProjectBySlug(slug)

  const [hoveredFeatureIdx, setHoveredFeatureIdx] = useState<number | null>(null)
  const [hoveredHighlightIdx, setHoveredHighlightIdx] = useState<number | null>(null)
  const [isHeroLightboxOpen, setIsHeroLightboxOpen] = useState(false)

  if (!project) {
    return null
  }

  const isOliverProject = project.slug === "oliver-boutique"
  const otherProjectHref = isOliverProject
    ? "/projects/lucas-boutique"
    : "/projects/oliver-boutique"
  const otherProjectLabel = isOliverProject
    ? "View Luca Boutique"
    : "View Oliver Villa"
  const isLucaProject = project.slug === "lucas-boutique"

  const heroImage =
    project.slug === "oliver-boutique"
      ? "/front3DOliver.webp"
      : project.slug === "lucas-boutique"
        ? "/lucaPhotoMain.webp"
      : project.picture

  return (
    <section className="luxury-shell mt-14 sm:mt-16">
      <div className="rounded-4xl border-0 bg-none bg-white px-4 py-10 shadow-none backdrop-blur-none sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl space-y-10">
          <header className="space-y-3 text-center">
            <p className="luxury-eyebrow">{project.eyebrow}</p>
            <h1 className="font-heading text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
              {project.boardTitle}
            </h1>
            <p className="mx-auto max-w-3xl text-xs uppercase tracking-[0.35em] text-foreground/55 sm:text-sm">
              {project.boardSubtitle}
            </p>
            <p className="mx-auto max-w-4xl text-sm leading-7 text-foreground/68 sm:text-base">
              {project.intro}
            </p>
            <nav
              aria-label="Project board navigation"
              className="flex flex-wrap justify-center gap-3 pt-2"
            >
              <Link
                href={backToProjectsHref}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-luxury-border bg-white px-4 text-xs font-medium text-foreground transition hover:border-luxury-gold hover:text-luxury-gold"
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
                Back to projects
              </Link>
              <Link
                href={otherProjectHref}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-linear-to-b from-luxury-gold-soft to-luxury-gold px-4 text-xs font-semibold text-stone-950 shadow-lg transition-transform hover:-translate-y-0.5"
              >
                {otherProjectLabel}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </nav>
          </header>

          <section className="grid gap-8 xl:grid-cols-12">
            <aside className="xl:col-span-3 h-full overflow-hidden rounded-xl border border-slate-200/80 bg-white/50 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md">
              <div className="bg-slate-900 px-5 py-3 text-center text-white">
                <h2 className="font-heading text-sm font-semibold tracking-wider uppercase text-slate-100">
                  Key Features
                </h2>
              </div>

              <div className="flex h-full flex-col gap-0 p-5">
                {project.features.map((feature, idx) => {
                  const IconComponent = feature.icon
                  const isActive = hoveredFeatureIdx === idx

                  return (
                    <button
                      key={feature.label}
                      type="button"
                      onMouseEnter={() => setHoveredFeatureIdx(idx)}
                      onMouseLeave={() => setHoveredFeatureIdx(null)}
                      onFocus={() => setHoveredFeatureIdx(idx)}
                      onBlur={() => setHoveredFeatureIdx(null)}
                      className={`group flex w-full items-center gap-4 rounded-lg border-r-4 p-3 text-left transition-all duration-200 ${
                        isActive
                          ? "border-slate-900 bg-slate-50 pr-2 shadow-sm"
                          : "border-transparent hover:bg-slate-50/50 hover:pr-2"
                      }`}
                    >
                      <div
                        className={`rounded-lg p-2 transition-colors duration-200 ${
                          isActive
                            ? "bg-slate-900 text-slate-100"
                            : "bg-slate-100 text-slate-700 group-hover:bg-slate-200 group-hover:text-slate-900"
                        }`}
                      >
                        <IconComponent className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-heading text-xs font-semibold tracking-wide text-slate-900">
                          {feature.label}
                        </h3>
                      </div>
                    </button>
                  )
                })}
              </div>
            </aside>

            <div className="xl:col-span-6 flex flex-col gap-4">
              <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-md transition-all duration-300 hover:shadow-xl">
                <div className="relative aspect-video overflow-hidden rounded-lg bg-slate-100 xl:aspect-5/3">
                  <Image
                    src={heroImage}
                    alt={project.title}
                    fill
                    sizes="(min-width: 1280px) 50vw, 100vw"
                    loading="eager"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    style={{ objectPosition: project.objectPosition }}
                  />

                  {isLucaProject ? (
                    <button
                      type="button"
                      className="absolute inset-0 z-20 cursor-zoom-in rounded-lg focus-visible:ring-4 focus-visible:ring-luxury-gold/60 focus-visible:outline-none"
                      aria-label="Open enlarged Luca facade image"
                      onClick={() => setIsHeroLightboxOpen(true)}
                    >
                      <span className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/55 px-3 py-1.5 text-xs font-medium text-white shadow-lg backdrop-blur-sm">
                        <ZoomIn className="size-4" aria-hidden="true" />
                        Enlarge
                      </span>
                    </button>
                  ) : null}

                  {hoveredFeatureIdx === 0 && (
                    <div className="absolute left-[20%] top-[30%] right-[20%] h-8 rounded-sm border-2 border-dashed border-white bg-slate-900/45 px-2 py-0.5 text-center font-mono text-[9px] uppercase tracking-wider text-white backdrop-blur-sm">
                      Flat Parapet Roofline / Single-Level Circulation
                    </div>
                  )}

                  {(hoveredFeatureIdx === 2 || hoveredHighlightIdx === 0) && (
                    <div className="absolute left-[40%] top-[45%] right-[22%] bottom-[16%] rounded-md border-2 border-dashed border-sky-400 bg-sky-950/40 p-3 text-center font-mono text-[9px] uppercase tracking-wider text-sky-100 backdrop-blur-sm">
                      Floor-to-Ceiling Glazing / Light Inlets
                    </div>
                  )}

                  {(hoveredFeatureIdx === 3 || hoveredHighlightIdx === 3) && (
                    <div className="absolute bottom-[8%] left-[25%] right-[20%] h-14 rounded-md border-2 border-dashed border-sky-300 bg-sky-900/35 p-2 text-center font-mono text-[9px] uppercase tracking-wider text-sky-200 backdrop-blur-sm">
                      Quartz Swimming Pool Matrix / Evaporative Cooler Base
                    </div>
                  )}

                  {hoveredHighlightIdx === 5 && (
                    <div className="absolute bottom-[12%] left-[35%] right-[35%] h-12 rounded-md border-2 border-dashed border-orange-500 bg-orange-950/40 p-2 text-center font-mono text-[9px] uppercase tracking-wider text-orange-200 backdrop-blur-sm">
                      Concrete Sunken Fire Hearth Lounge
                    </div>
                  )}

                  <div className="absolute left-3 top-3 rounded-full border border-white/20 bg-white/90 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-foreground shadow-lg backdrop-blur">
                    <span className="mr-2 inline-flex size-2 rounded-full bg-luxury-gold" />
                    {project.badge}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between px-2 text-[10px] font-mono text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="h-3.5 w-3.5 rounded-full bg-slate-400" aria-hidden="true" />
                    Structure Classification: High-grade RC-60
                  </span>
                  <span>Project reference: {project.title}</span>
                </div>
              </div>

              {(project.slug === "lucas-boutique" || project.slug === "oliver-boutique") && (
                <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-md transition-all duration-300 hover:shadow-xl">
                  <div className="relative aspect-video overflow-hidden rounded-lg bg-slate-100 xl:aspect-5/3">
                    <Image
                      src="/newComplex.webp"
                      alt="Boutique House complex view"
                      fill
                      sizes="(min-width: 1280px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                      style={{ objectPosition: "center center" }}
                    />

                    <div className="absolute left-3 top-3 rounded-full border border-white/20 bg-white/90 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-foreground shadow-lg backdrop-blur">
                      <span className="mr-2 inline-flex size-2 rounded-full bg-luxury-gold" />
                      {project.badge}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between px-2 text-[10px] font-mono text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <span className="h-3.5 w-3.5 rounded-full bg-slate-400" aria-hidden="true" />
                      Structure Classification: High-grade RC-60
                    </span>
                    <span>Project reference: {project.title}</span>
                  </div>
                </div>
              )}
            </div>

            <aside className="xl:col-span-3 h-full overflow-hidden rounded-xl border border-slate-200/80 bg-white/50 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md">
              <div className="bg-slate-900 px-5 py-3 text-center text-white">
                <h2 className="font-heading text-sm font-semibold tracking-wider uppercase text-slate-100">
                  {project.highlightsTitle ?? "Design Highlights"}
                </h2>
              </div>

              <div className="flex h-full flex-col p-5">
                {project.highlights.map((highlight, idx) => {
                  const IconComponent = highlight.icon
                  const isActive = hoveredHighlightIdx === idx

                  return (
                    <button
                      key={highlight.label}
                      type="button"
                      onMouseEnter={() => setHoveredHighlightIdx(idx)}
                      onMouseLeave={() => setHoveredHighlightIdx(null)}
                      onFocus={() => setHoveredHighlightIdx(idx)}
                      onBlur={() => setHoveredHighlightIdx(null)}
                      className={`group flex w-full items-start gap-4 rounded-lg border-r-4 p-3 text-left transition-all duration-200 ${
                        isActive
                          ? "border-slate-900 bg-slate-50 pr-2 shadow-sm"
                          : "border-transparent hover:bg-slate-50/50 hover:pr-2"
                      }`}
                    >
                      <div
                        className={`rounded-lg p-2 transition-colors duration-200 ${
                          isActive
                            ? "bg-slate-900 text-slate-100"
                            : "bg-slate-100 text-slate-700 group-hover:bg-slate-200 group-hover:text-slate-900"
                        }`}
                      >
                        <IconComponent className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-heading text-xs font-semibold tracking-wide text-slate-900">
                          {highlight.label}
                        </h3>
                        <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                          {highlight.description ?? project.summary}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </aside>
          </section>
        </div>
      </div>

      {isLucaProject ? (
        <ProjectImageLightbox
          src={heroImage}
          alt={`Expanded facade of ${project.title}`}
          title={`${project.boardTitle} facade`}
          isOpen={isHeroLightboxOpen}
          onClose={() => setIsHeroLightboxOpen(false)}
        />
      ) : null}
    </section>
  )
}
