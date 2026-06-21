"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import * as Icons from "lucide-react"
import {
  ArrowRight,
  ChevronLeft,
  Compass,
  Info,
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
  siteElements,
} from "./ArchitectureShowcase.data"

type ArchitectureShowcaseProps = {
  slug: ProjectSlug
}
export function ArchitectureShowcase({ slug }: ArchitectureShowcaseProps) {
  const project = getProjectBySlug(slug)

  const [hoveredSiteId, setHoveredSiteId] = useState<string | null>(null)
  const [hoveredSolarTrack, setHoveredSolarTrack] = useState<string | null>(null)
  const [hoveredElevationSpec, setHoveredElevationSpec] = useState<string | null>(null)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  if (!project) {
    return null
  }

  const daytimeImage = project.tiles[0]?.picture ?? project.picture
  const activeSiteElement = siteElements.find((element) => element.id === hoveredSiteId)

  return (
    <section className="space-y-10">
      <ArchitectureShowcaseTop slug={slug} />

      <section id="featured-projects" className="space-y-6">
            <div className="flex items-center gap-2">
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

          <div className="flex items-center gap-2">
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
                <div className="relative flex items-center justify-center overflow-hidden rounded-lg border border-stone-200/60 bg-stone-50 p-4">
                    <svg viewBox="0 0 450 300" className="h-auto w-full max-h-62.5" xmlns="http://www.w3.org/2000/svg">
                    <g transform="translate(415, 45)" className="opacity-75">
                      <circle cx="0" cy="0" r="18" fill="none" stroke="#64748b" strokeWidth="0.75" />
                      <path d="M 0 -15 L 4 -2 L -4 -2 Z" fill="#0f172a" />
                      <line x1="0" y1="-15" x2="0" y2="15" stroke="#64748b" strokeWidth="0.75" />
                      <text x="0" y="24" textAnchor="middle" className="font-mono text-[8px] font-bold fill-slate-500">
                        N
                      </text>
                    </g>

                    <rect x="30" y="30" width="390" height="240" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 2" />
                    <text x="35" y="25" className="font-mono text-[7px] uppercase tracking-wider fill-slate-400">
                      Boundary Limit
                    </text>

                    <g
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredSiteId("site-garden")}
                      onMouseLeave={() => setHoveredSiteId(null)}
                    >
                      <rect x="30" y="30" width="390" height="240" fill="#f0fdf4" opacity="0.7" />
                      <circle cx="70" cy="70" r="16" fill="#bbf7d0" stroke="#16a34a" strokeWidth="0.5" opacity="0.6" />
                      <circle cx="70" cy="70" r="10" fill="#86efac" stroke="#16a34a" strokeWidth="0.5" opacity="0.6" />
                      <circle cx="390" cy="230" r="18" fill="#bbf7d0" stroke="#16a34a" strokeWidth="0.5" opacity="0.6" />
                      <circle cx="390" cy="230" r="11" fill="#86efac" stroke="#16a34a" strokeWidth="0.5" opacity="0.6" />
                      <circle cx="395" cy="110" r="22" fill="#bbf7d0" stroke="#16a34a" strokeWidth="0.5" opacity="0.4" />
                      <circle cx="65" cy="220" r="14" fill="#bbf7d0" stroke="#16a34a" strokeWidth="0.5" opacity="0.6" />
                    </g>

                    <g
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredSiteId("site-car")}
                      onMouseLeave={() => setHoveredSiteId(null)}
                    >
                      <rect x="110" y="30" width="80" height="150" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
                      <g stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="1 3" opacity="0.7">
                        {Array.from({ length: 15 }).map((_, i) => (
                          <line key={`drive-${i}`} x1="110" y1={30 + i * 10} x2="190" y2={30 + i * 10} />
                        ))}
                      </g>
                      <g transform="translate(140, 55)" className="opacity-90">
                        <rect x="-10" y="5" width="4" height="10" fill="#334155" rx="1" />
                        <rect x="26" y="5" width="4" height="10" fill="#334155" rx="1" />
                        <rect x="-10" y="35" width="4" height="10" fill="#334155" rx="1" />
                        <rect x="26" y="35" width="4" height="10" fill="#334155" rx="1" />
                        <rect x="-8" y="0" width="36" height="50" fill="#cbd5e1" stroke="#475569" strokeWidth="1" rx="8" />
                        <path d="M -4 14 L 24 14 L 21 21 L -1 21 Z" fill="#475569" />
                        <path d="M -3 40 L 23 40 L 21 36 L -1 36 Z" fill="#475569" />
                        <line x1="0" y1="6" x2="20" y2="6" stroke="#94a3b8" />
                        <text x="10" y="31" fill="#475569" className="font-mono text-[7px]" textAnchor="middle">
                          CAR
                        </text>
                      </g>
                      <text x="150" y="165" fill="#64748b" className="font-mono text-[7px] uppercase tracking-wider font-semibold" textAnchor="middle">
                        Gravel Driveway
                      </text>
                    </g>

                    <g
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredSiteId("site-lounge")}
                      onMouseLeave={() => setHoveredSiteId(null)}
                    >
                      <rect x="310" y="180" width="80" height="90" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.75" />
                      <rect x="320" y="195" width="60" height="60" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
                      <circle cx="350" cy="225" r="10" fill="#fed7aa" stroke="#f97316" strokeWidth="1" />
                      <circle cx="350" cy="225" r="5" fill="#f97316" />
                      <text x="350" y="275" fill="#64748b" className="font-mono text-[6px] tracking-wide uppercase font-semibold" textAnchor="middle">
                        Gathering Node
                      </text>
                    </g>

                    <g
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredSiteId("site-pool")}
                      onMouseLeave={() => setHoveredSiteId(null)}
                    >
                      <rect x="190" y="180" width="120" height="90" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.75" />
                      <rect x="195" y="195" width="110" height="60" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="1" />
                      <line x1="195" y1="262" x2="305" y2="262" stroke="#0284c7" strokeWidth="0.75" />
                      <line x1="195" y1="259" x2="195" y2="265" stroke="#0284c7" strokeWidth="0.75" />
                      <line x1="305" y1="259" x2="305" y2="265" stroke="#0284c7" strokeWidth="0.75" />
                      <text x="250" y="271" fill="#0284c7" className="font-mono text-[7px] font-bold" textAnchor="middle">
                        11.0m Pool Axis
                      </text>
                    </g>

                    <g
                      className="cursor-pointer transition-all"
                      onMouseEnter={() => setHoveredSiteId("site-house")}
                      onMouseLeave={() => setHoveredSiteId(null)}
                    >
                      <rect
                        x="195"
                        y="55"
                        width="185"
                        height="130"
                        fill="#020617"
                        opacity={hoveredSiteId === "site-house" ? 0.2 : 0.1}
                        className="transition-opacity duration-200"
                      />
                      <rect x="190" y="50" width="185" height="130" fill="#334155" stroke="#0f172a" strokeWidth="1.5" />
                      <rect x="190" y="105" width="45" height="75" fill="#f0fdf4" stroke="#0f172a" strokeWidth="1.5" />
                      <rect x="250" y="70" width="30" height="12" fill="#475569" stroke="#94a3b8" strokeWidth="0.5" />
                      <rect x="310" y="70" width="30" height="12" fill="#475569" stroke="#94a3b8" strokeWidth="0.5" />
                      <line x1="190" y1="50" x2="375" y2="180" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="1" />
                      <text x="282" y="120" fill="#ffffff" className="font-display text-[9px] font-medium uppercase tracking-wider" textAnchor="middle">
                        Residence Footprint
                      </text>
                      <text x="282" y="132" fill="#94a3b8" className="font-mono text-[7px]" textAnchor="middle">
                        218mÃƒâ€šÃ‚Â² Slab Area
                      </text>
                    </g>

                    <g stroke="#94a3b8" strokeWidth="0.5" opacity="0.3" strokeDasharray="3 3">
                      <line x1="30" y1="150" x2="420" y2="150" />
                      <line x1="225" y1="30" x2="225" y2="270" />
                    </g>
                  </svg>

                  <div className="pointer-events-none absolute bottom-4 left-4 right-4 rounded-lg bg-slate-900/95 p-2.5 text-white shadow-xl backdrop-blur-md">
                    {activeSiteElement ? (
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between">
                          <span className="font-heading text-[11px] font-semibold uppercase tracking-wider text-white">
                            {activeSiteElement.name}
                          </span>
                          <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-400">
                            {activeSiteElement.area}
                          </span>
                        </div>
                        <p className="mt-1 text-[10px] leading-tight text-slate-400">
                          {activeSiteElement.description}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 py-1.5 text-[10px] text-slate-400">
                        <Info className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>Hover plan segments for direct plot information, landscape offsets, and zoning bounds.</span>
                      </div>
                    )}
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
              </div>
            </article>
          </section>

          <div className="flex items-center gap-2">
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
                <div className="relative flex min-h-55 items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <svg viewBox="0 0 320 220" className="h-auto w-full max-h-47.5" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="160" cy="140" rx="100" ry="40" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                    <line x1="60" y1="140" x2="260" y2="140" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="2 2" />
                    <line x1="160" y1="100" x2="160" y2="180" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="2 2" />
                    <text x="50" y="143" fill="#94a3b8" className="font-mono text-[7px]" textAnchor="middle">
                      W
                    </text>
                    <text x="270" y="143" fill="#94a3b8" className="font-mono text-[7px]" textAnchor="middle">
                      E
                    </text>

                    <g transform="translate(130, 95)" opacity="0.9">
                      <path d="M 0,25 L 30,10 L 60,25 M 30,10 L 30,40" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" fill="none" />
                      <path d="M 0,25 L 0,55 L 30,70 L 30,40 Z" fill="#e2e8f0" stroke="#334155" strokeWidth="1" />
                      <path d="M 30,40 L 30,70 L 60,55 L 60,25 Z" fill="#cbd5e1" stroke="#334155" strokeWidth="1" />
                      <path d="M 0,25 L 30,10 L 60,25 L 30,40 Z" fill="#f8fafc" stroke="#334155" strokeWidth="1" />
                      <path d="M 10,40 L 25,48 L 25,62 L 10,54 Z" fill="rgba(14, 165, 233, 0.15)" stroke="#0284c7" strokeWidth="0.5" />
                      <path d="M 30,70 L 70,50 L 50,40" stroke="#cbd5e1" strokeWidth="0.5" fill="none" />
                    </g>

                    <g stroke="#0284c7" strokeWidth="1.5" fill="none" strokeLinecap="round">
                      <path d="M 80,165 Q 110,160 145,150" className="animate-pulse" />
                      <path d="M 140,146 L 146,150 L 140,154" fill="#0284c7" />
                      <path d="M 152,145 Q 170,125 180,105" />
                      <path d="M 175,107 L 180,104 L 182,110" fill="#0284c7" />
                      <text x="95" y="177" fill="#0284c7" className="font-mono text-[6px] uppercase tracking-wider font-bold">
                        Inlet Cool Air
                      </text>
                    </g>

                    <g
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredSolarTrack("summer")}
                      onMouseLeave={() => setHoveredSolarTrack(null)}
                    >
                      <path
                        d="M 60,140 Q 160,20 260,140"
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth={hoveredSolarTrack === "summer" ? "2.5" : "1.25"}
                        strokeDasharray="3 3"
                        className="transition-all duration-200"
                      />
                      <circle cx="160" cy="80" r="7" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.5" />
                      <line x1="160" y1="70" x2="160" y2="90" stroke="#f59e0b" strokeWidth="1" />
                      <line x1="150" y1="80" x2="170" y2="80" stroke="#f59e0b" strokeWidth="1" />
                      <text x="160" y="68" fill="#d97706" className="font-mono text-[7px] font-bold" textAnchor="middle">
                        SUMMER
                      </text>
                    </g>

                    <g
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredSolarTrack("winter")}
                      onMouseLeave={() => setHoveredSolarTrack(null)}
                    >
                      <path
                        d="M 60,140 Q 160,85 260,140"
                        fill="none"
                        stroke="#ea580c"
                        strokeWidth={hoveredSolarTrack === "winter" ? "2.5" : "1"}
                        strokeDasharray="2 3"
                        className="transition-all duration-200"
                      />
                      <circle cx="160" cy="112" r="5" fill="#f97316" stroke="#ea580c" strokeWidth="1" />
                      <text x="160" y="124" fill="#c2410c" className="font-mono text-[7px] font-bold" textAnchor="middle">
                        WINTER
                      </text>
                    </g>

                    <text x="60" y="152" fill="#78716c" className="font-mono text-[6px] tracking-wide" textAnchor="middle">
                      AM Sunrise
                    </text>
                    <text x="260" y="152" fill="#78716c" className="font-mono text-[6px] tracking-wide" textAnchor="middle">
                      PM Sunset
                    </text>
                  </svg>

                  <div className="pointer-events-none absolute bottom-3 left-3 right-3 rounded-lg border border-slate-800 bg-slate-900/95 p-2 text-[10px] text-white">
                    {hoveredSolarTrack === "summer" ? (
                      <div>
                        <span className="block font-heading text-[10px] font-semibold uppercase text-yellow-400">
                          Summer Angle Control (62Ãƒâ€šÃ‚Â° Altitude)
                        </span>
                        <p className="mt-0.5 text-[9px] leading-relaxed text-slate-400">
                          High sun rays are completely blocked by custom concrete roof overhang panels to keep interiors cool.
                        </p>
                      </div>
                    ) : hoveredSolarTrack === "winter" ? (
                      <div>
                        <span className="block font-heading text-[10px] font-semibold uppercase text-orange-400">
                          Winter Radiation Penetration (28Ãƒâ€šÃ‚Â° Altitude)
                        </span>
                        <p className="mt-0.5 text-[9px] leading-relaxed text-slate-400">
                          Low winter solar rays penetrate under structural slabs, heating concrete floor tiles for passive release.
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Info className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>
                          Hover <b className="text-slate-300">SUMMER</b> or <b className="text-slate-300">WINTER</b> solar markers to verify dynamic shade controls.
                        </span>
                      </div>
                    )}
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
                <div className="relative flex min-h-55 items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <svg viewBox="0 0 340 220" className="h-auto w-full max-h-47.5" xmlns="http://www.w3.org/2000/svg">
                    <line x1="10" y1="185" x2="330" y2="185" stroke="#0f172a" strokeWidth="2.2" />
                    <g transform="translate(300, 153)" className="opacity-75">
                      <circle cx="0" cy="0" r="3.5" fill="#475569" />
                      <line x1="0" y1="3.5" x2="0" y2="20" stroke="#475569" strokeWidth="2" />
                      <line x1="-2.5" y1="5" x2="2.5" y2="5" stroke="#475569" strokeWidth="1" />
                      <line x1="0" y1="20" x2="-2" y2="32" stroke="#475569" strokeWidth="1.2" />
                      <line x1="0" y1="20" x2="2" y2="32" stroke="#475569" strokeWidth="1.2" />
                      <text x="0" y="38" className="font-mono text-[5px]" textAnchor="middle">
                        H: 1.8m
                      </text>
                    </g>

                    <rect x="40" y="105" width="240" height="80" fill="none" stroke="#0f172a" strokeWidth="2" />
                    <rect x="40" y="100" width="240" height="15" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1.5" />

                    <g>
                      <rect x="110" y="115" width="45" height="70" fill="#fbcfe8" opacity="0.1" />
                      {Array.from({ length: 9 }).map((_, i) => (
                        <line key={`slat-${i}`} x1={111 + i * 5} y1="115" x2={111 + i * 5} y2="185" stroke="#b45309" strokeWidth="1" />
                      ))}
                    </g>

                    <g>
                      <rect x="155" y="115" width="115" height="70" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1" />
                      <line x1="193" y1="115" x2="193" y2="185" stroke="#0f172a" strokeWidth="1" />
                      <line x1="231" y1="115" x2="231" y2="185" stroke="#0f172a" strokeWidth="1" />
                      <line x1="160" y1="125" x2="185" y2="175" stroke="#fed7aa" strokeWidth="0.5" opacity="0.6" />
                      <line x1="198" y1="125" x2="223" y2="175" stroke="#fed7aa" strokeWidth="0.5" opacity="0.6" />
                    </g>

                    <g>
                      <rect x="40" y="115" width="70" height="70" fill="#f5f5f4" stroke="#44403c" strokeWidth="1" />
                      <line x1="40" y1="138" x2="110" y2="138" stroke="#cbd5e1" strokeWidth="0.5" />
                      <line x1="40" y1="161" x2="110" y2="161" stroke="#cbd5e1" strokeWidth="0.5" />
                      <line x1="75" y1="115" x2="75" y2="138" stroke="#cbd5e1" strokeWidth="0.5" />
                      <line x1="60" y1="138" x2="60" y2="161" stroke="#cbd5e1" strokeWidth="0.5" />
                      <line x1="90" y1="161" x2="90" y2="185" stroke="#cbd5e1" strokeWidth="0.5" />
                    </g>

                    <g stroke="#475569" strokeWidth="0.75">
                      <line x1="290" y1="100" x2="290" y2="185" />
                      <line x1="287" y1="100" x2="293" y2="100" />
                      <line x1="287" y1="185" x2="293" y2="185" />
                      <text x="296" y="145" fill="#475569" stroke="none" className="font-mono text-[7px] font-bold">
                        3.40m
                      </text>
                    </g>

                    <g stroke="#475569" strokeWidth="0.75" opacity="0.8">
                      <line x1="40" y1="202" x2="280" y2="202" />
                      <line x1="40" y1="199" x2="40" y2="205" />
                      <line x1="280" y1="199" x2="280" y2="205" />
                      <text x="160" y="212" fill="#475569" stroke="none" className="font-mono text-[7px] font-bold" textAnchor="middle">
                        Total Facade Width: 18.50m
                      </text>
                    </g>

                    <g stroke="#94a3b8" strokeWidth="0.75" fill="none">
                      <path d="M 60,107 L 85,38 L 105,38" />
                      <circle cx="60" cy="107" r="1.5" fill="#0f172a" />
                      <path d="M 130,150 L 140,55 L 160,55" />
                      <circle cx="130" cy="150" r="1.5" fill="#b45309" />
                      <path d="M 193,130 L 195,73 L 210,73" />
                      <circle cx="193" cy="130" r="1.5" fill="#0284c7" />
                      <path d="M 80,165 L 115,90 L 135,90" />
                      <circle cx="80" cy="165" r="1.5" fill="#44403c" />
                    </g>

                    <text x="108" y="36" fill="#475569" className="font-mono text-[6px] tracking-wider font-semibold uppercase">
                      EXPOSED CONCRETE
                    </text>
                    <text x="163" y="53" fill="#475569" className="font-mono text-[6px] tracking-wider font-semibold uppercase">
                      WOOD CLADDING
                    </text>
                    <text x="213" y="71" fill="#475569" className="font-mono text-[6px] tracking-wider font-semibold uppercase">
                      ALUMINUM GLAZING
                    </text>
                    <text x="138" y="88" fill="#475569" className="font-mono text-[6px] tracking-wider font-semibold uppercase">
                      STONE FINISH
                    </text>
                  </svg>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] font-mono text-slate-500">
                  <span>Finishes: Matte Polyurethane & Oil Cedar</span>
                  <span>Cladding Depth: 24mm profile slats</span>
                </div>
              </div>
            </article>
          </section>

          <div className="flex items-center gap-2">
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




