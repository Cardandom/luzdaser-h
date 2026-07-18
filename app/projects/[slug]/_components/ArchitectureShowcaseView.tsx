"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import * as Icons from "lucide-react"
import {
  ArrowRight,
  ChevronLeft,
  Compass,
  Layers,
  Move,
  Sun,
  Wind,
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

  const daytimeImage = project.tiles[0]?.picture ?? project.picture
  return (
    <section className="space-y-10">
      <ArchitectureShowcaseTop slug={slug} />

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
            Interactive Blueprint Sheets
          </h2>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <article className="blueprint-grid flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center justify-between border-b border-slate-100 p-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                    Sheet A-101
                  </span>
                  <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-slate-900">
                    SITE PLAN
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 rounded border border-slate-200 bg-slate-100 px-2 py-1">
                  <Compass className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                  <span className="text-[9px] font-mono uppercase font-semibold text-slate-600">
                    Site Scale 1 : 250
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between p-4">
                <div className="relative overflow-hidden rounded-lg border border-stone-200/60 bg-stone-50 p-4">
                  <div className="relative aspect-[3/2] w-full overflow-hidden rounded-md bg-white">
                    <Image
                      src="/planoOliver.webp"
                      alt="Site plan for Oliver Boutique"
                      fill
                      sizes="(min-width: 1280px) 38vw, (min-width: 1024px) 48vw, 100vw"
                      className="object-contain p-2"
                    />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded border border-slate-150 bg-slate-50 p-2">
                    <span className="block text-[8px] font-mono font-bold uppercase tracking-widest text-slate-400">
                      Residency Calc
                    </span>
                    <span className="block text-xs font-mono font-semibold text-slate-800">27.8% Plot Ratio</span>
                  </div>
                  <div className="rounded border border-slate-150 bg-slate-50 p-2">
                    <span className="block text-[8px] font-mono font-bold uppercase tracking-widest text-slate-400">
                      Hardscape Deck
                    </span>
                    <span className="block text-xs font-mono font-semibold text-slate-800">185 mÃƒâ€šÃ‚Â² Total</span>
                  </div>
                  <div className="rounded border border-slate-150 bg-slate-50 p-2">
                    <span className="block text-[8px] font-mono font-bold uppercase tracking-widest text-slate-400">
                      Permeable Land
                    </span>
                    <span className="block text-xs font-mono font-semibold text-slate-800">430 mÃƒâ€šÃ‚Â² (54%)</span>
                  </div>
                </div>
              </div>
            </article>

            <article className="blueprint-grid flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center justify-between border-b border-slate-100 p-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                    Sheet A-105
                  </span>
                  <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-slate-900">
                    EXPLODED AXONOMETRIC
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 rounded border border-slate-200 bg-slate-100 px-2 py-1">
                  <Layers className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                  <span className="text-[9px] font-mono uppercase font-semibold text-slate-600">
                    3D Vector Package
                  </span>
                </div>
              </div>

              <div className="p-4">
                {project.slug === "oliver-boutique" ? (
                  <div className="relative min-h-130 overflow-hidden rounded-lg border border-slate-100 bg-slate-50/40">
                    <Image
                      src="/oliverRender.webp"
                      alt="Exploded axonometric render for Oliver Boutique"
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-contain p-4"
                    />
                  </div>
                ) : (
                  <div className="group/image relative min-h-130 overflow-hidden rounded-lg border border-slate-100 bg-slate-50/40">
                    <Image
                      src="/exploded-axonometric-1.png"
                      alt="Exploded axonometric view, angle one"
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-contain p-4 opacity-100 transition-all duration-700 ease-in-out group-hover/image:opacity-0 group-hover/image:scale-105 group-hover/image:blur-sm group-hover/image:brightness-95"
                    />
                    <Image
                      src="/exploded-axonometric-2.png"
                      alt="Exploded axonometric view, angle two"
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-contain p-4 opacity-0 transition-all duration-700 ease-in-out group-hover/image:opacity-100 group-hover/image:scale-100"
                    />

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-white/95 via-white/55 to-transparent p-4">
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-slate-500">
                          Hover to render the alternate view
                        </span>
                        <span className="rounded-full border border-slate-200 bg-white/90 px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-wider text-slate-600 shadow-sm">
                          Interactive compare
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </article>
        </section>

        <div className="flex items-center gap-2 my-14">
          <span className="h-px flex-1 bg-slate-200" />
          <h2 className="font-heading text-sm font-extrabold uppercase tracking-widest text-slate-500">
            Technical Performance Visualizations
          </h2>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <article className="blueprint-grid flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between border-b border-slate-100 p-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                  Sheet A-108
                </span>
                <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-slate-900">
                  SUN PATH & VENTILATION
                </h3>
              </div>
              <div className="flex items-center gap-1.5 rounded border border-orange-100 bg-orange-50 px-2 py-1">
                <Sun className="h-3.5 w-3.5 text-orange-500" aria-hidden="true" />
                <span className="text-[9px] font-mono uppercase font-semibold text-orange-600">
                  Passive Solar Simulation
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-between p-4">
              <div className="relative overflow-hidden rounded-lg border border-slate-100 bg-slate-50/40 p-3">
                <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-white">
                  <Image
                    src="/front3DOliver.webp"
                    alt="Front perspective for Oliver Boutique"
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover object-center"
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] font-mono text-slate-500">
                <span className="flex items-center gap-1">
                  <Wind className="h-3 w-3 text-sky-500" aria-hidden="true" />
                  Breezeway Cross flow
                </span>
                <span>Passive Thermal Efficiency: High A++</span>
              </div>
            </div>
          </article>

          <article className="blueprint-grid flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between border-b border-slate-100 p-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                  Sheet A-106
                </span>
                <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-slate-900">
                  FRONT ELEVATION
                </h3>
              </div>
              <div className="flex items-center gap-1.5 rounded border border-slate-200 bg-slate-100 px-2 py-1">
                <Move className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                <span className="text-[9px] font-mono uppercase font-semibold text-slate-600">
                  Scale 1 : 150
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-between p-4">
              <div className="relative overflow-hidden rounded-lg border border-slate-100 bg-slate-50/40 p-3">
                <div className="relative aspect-[3/2] overflow-hidden rounded-md bg-white">
                  <Image
                    src="/front2DLuca.webp"
                    alt="Front elevation for Luca Boutique House"
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-contain p-2"
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] font-mono text-slate-500">
                <span>Finishes: Matte Polyurethane & Oil Cedar</span>
                <span>Cladding Depth: 24mm profile slats</span>
              </div>
            </div>
          </article>
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
          <span className="mb-1 block font-mono text-[9px] font-bold uppercase tracking-widest text-slate-400">
            DISCLAIMER: Concept only. Subject to change. Architectural and structural parameters represent speculative visualization packages.
          </span>
          <span className="block font-mono text-[8px] text-slate-400">
            Ãƒâ€šÃ‚Â© 2026 Modern Single-Storey Commission Group. Code generated with React 19 and Tailwind CSS.
          </span>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/#featured-projects"
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
                        Anodized Black Matt Aluminum Double Profile
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




