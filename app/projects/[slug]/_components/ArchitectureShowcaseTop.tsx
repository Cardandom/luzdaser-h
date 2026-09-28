"use client"

import { useState } from "react"
import { ArrowRight, ChevronLeft, ZoomIn } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import {
  getProjectBySlug,
  type Project,
  type ProjectFeature,
  type ProjectSlug,
} from "@/lib/projects"
import { ProjectImageLightbox } from "./ProjectImageLightbox"

type ArchitectureShowcaseProps = {
  backToProjectsHref: string
  slug: ProjectSlug
}

type ProjectMainImageProps = {
  heroImage: string
  hoveredFeatureIdx: number | null
  hoveredHighlightIdx: number | null
  onOpen: () => void
  project: Project
}

type ProjectAmenitiesProps = {
  activeItemIdx: number | null
  className?: string
  items: ProjectFeature[]
  onActiveItemChange: (index: number | null) => void
  summary: string
  title: string
  withDescriptions?: boolean
}

type ProjectMapProps = {
  className?: string
  instructionsId: string
  isHighlighted: boolean
  isSelected: boolean
  onPreviewChange: (isPreviewed: boolean) => void
  onSelectedChange: () => void
  project: Project
}

function ProjectMainImage({
  heroImage,
  hoveredFeatureIdx,
  hoveredHighlightIdx,
  onOpen,
  project,
}: ProjectMainImageProps) {
  const isAudreyProject = project.slug === "audrey"

  return (
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

        <button
          type="button"
          className="absolute inset-0 z-20 cursor-zoom-in rounded-lg focus-visible:ring-4 focus-visible:ring-luxury-gold/60 focus-visible:outline-none"
          aria-label={`Open enlarged facade image for ${project.title}`}
          onClick={onOpen}
        >
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/55 px-3 py-1.5 text-xs font-medium text-white shadow-lg backdrop-blur-sm">
            <ZoomIn className="size-4" aria-hidden="true" />
            Enlarge
          </span>
        </button>

        {!isAudreyProject && hoveredFeatureIdx === 0 ? (
          <div className="absolute left-[20%] top-[30%] right-[20%] h-8 rounded-sm border-2 border-dashed border-white bg-slate-900/45 px-2 py-0.5 text-center font-mono text-[9px] uppercase tracking-wider text-white backdrop-blur-sm">
            Flat Parapet Roofline / Single-Level Circulation
          </div>
        ) : null}

        {!isAudreyProject &&
        (hoveredFeatureIdx === 2 || hoveredHighlightIdx === 0) ? (
          <div className="absolute left-[40%] top-[45%] right-[22%] bottom-[16%] rounded-md border-2 border-dashed border-sky-400 bg-sky-950/40 p-3 text-center font-mono text-[9px] uppercase tracking-wider text-sky-100 backdrop-blur-sm">
            Floor-to-Ceiling Glazing / Light Inlets
          </div>
        ) : null}

        {!isAudreyProject &&
        (hoveredFeatureIdx === 3 || hoveredHighlightIdx === 3) ? (
          <div className="absolute bottom-[8%] left-[25%] right-[20%] h-14 rounded-md border-2 border-dashed border-sky-300 bg-sky-900/35 p-2 text-center font-mono text-[9px] uppercase tracking-wider text-sky-200 backdrop-blur-sm">
            Quartz Swimming Pool Matrix / Evaporative Cooler Base
          </div>
        ) : null}

        {!isAudreyProject && hoveredHighlightIdx === 5 ? (
          <div className="absolute bottom-[12%] left-[35%] right-[35%] h-12 rounded-md border-2 border-dashed border-orange-500 bg-orange-950/40 p-2 text-center font-mono text-[9px] uppercase tracking-wider text-orange-200 backdrop-blur-sm">
            Concrete Sunken Fire Hearth Lounge
          </div>
        ) : null}

        <div className="absolute left-3 top-3 rounded-full border border-white/20 bg-white/90 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-foreground shadow-lg backdrop-blur">
          <span className="mr-2 inline-flex size-2 rounded-full bg-luxury-gold" />
          {project.badge}
        </div>
      </div>

      <div className="mt-3 flex justify-end px-2 text-right font-mono text-[10px] text-slate-500">
        <span>Project reference: {project.title}</span>
      </div>
    </div>
  )
}

function ProjectAmenities({
  activeItemIdx,
  className = "",
  items,
  onActiveItemChange,
  summary,
  title,
  withDescriptions = false,
}: ProjectAmenitiesProps) {
  return (
    <aside
      className={`${className} h-full overflow-hidden rounded-xl border border-slate-200/80 bg-white/50 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md`}
    >
      <div className="bg-slate-900 px-5 py-3 text-center text-white">
        <h2 className="font-heading text-sm font-semibold tracking-wider text-slate-100 uppercase">
          {title}
        </h2>
      </div>

      <div className="flex h-full flex-col p-5">
        {items.map((item, idx) => {
          const IconComponent = item.icon
          const isActive = activeItemIdx === idx

          return (
            <button
              key={item.label}
              type="button"
              onMouseEnter={() => onActiveItemChange(idx)}
              onMouseLeave={() => onActiveItemChange(null)}
              onFocus={() => onActiveItemChange(idx)}
              onBlur={() => onActiveItemChange(null)}
              className={`group flex w-full ${withDescriptions ? "items-start" : "items-center"} gap-4 rounded-lg border-r-4 p-3 text-left transition-all duration-200 ${
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
                <IconComponent
                  className="size-5"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-xs font-semibold tracking-wide text-slate-900">
                  {item.label}
                </h3>
                {withDescriptions ? (
                  <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                    {item.description ?? summary}
                  </p>
                ) : null}
              </div>
            </button>
          )
        })}
      </div>
    </aside>
  )
}

function ProjectMap({
  className = "",
  instructionsId,
  isHighlighted,
  isSelected,
  onPreviewChange,
  onSelectedChange,
  project,
}: ProjectMapProps) {
  const isAudreyProject = project.slug === "audrey"
  const isLucaProject = project.slug === "luca"

  return (
    <div
      className={`${className} group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-md transition-all duration-300 hover:shadow-xl`}
    >
      <div className="relative aspect-video overflow-hidden rounded-lg bg-slate-100 xl:aspect-5/3">
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.02]">
          <Image
            src="/newComplex.webp"
            alt={
              isAudreyProject
                ? "Aerial master plan for Audrey"
                : "Residential complex view"
            }
            fill
            sizes="(min-width: 1280px) 50vw, 100vw"
            className="object-cover"
            style={{ objectPosition: "center center" }}
          />

          {isLucaProject ? (
            <svg
              viewBox="0 0 2480 1654"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 size-full"
            >
              <defs>
                <filter
                  id={`luca-complex-glow-${instructionsId}`}
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                >
                  <feGaussianBlur stdDeviation="9" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <mask
                  id={`luca-complex-mask-${instructionsId}`}
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="2480"
                  height="1654"
                >
                  <rect width="2480" height="1654" fill="white" />
                  <polygon
                    points="555,720 2150,720 2180,1195 2120,1240 585,1240 530,1185 530,790"
                    fill="black"
                  />
                </mask>
              </defs>

              {isHighlighted ? (
                <rect
                  width="2480"
                  height="1654"
                  fill="#2f1c3b"
                  fillOpacity="0.46"
                  mask={`url(#luca-complex-mask-${instructionsId})`}
                  pointerEvents="none"
                />
              ) : null}

              <polygon
                points="555,720 2150,720 2180,1195 2120,1240 585,1240 530,1185 530,790"
                fill="#dcb56d"
                fillOpacity={isHighlighted ? "0.32" : "0.07"}
                stroke="#f4ddb0"
                strokeOpacity={isHighlighted ? "1" : "0.58"}
                strokeWidth={isHighlighted ? "3" : "2"}
                filter={
                  isHighlighted
                    ? `url(#luca-complex-glow-${instructionsId})`
                    : undefined
                }
                vectorEffect="non-scaling-stroke"
                pointerEvents="none"
                className="transition-all duration-300 motion-reduce:transition-none"
              />
            </svg>
          ) : null}
        </div>

        {isLucaProject ? (
          <>
            <button
              type="button"
              aria-label="Highlight Luca units 19 through 38 on the project map"
              aria-describedby={instructionsId}
              aria-pressed={isSelected}
              className="absolute inset-0 z-10 cursor-pointer touch-manipulation rounded-lg focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-luxury-gold/60 focus-visible:outline-none"
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") {
                  onPreviewChange(true)
                }
              }}
              onPointerLeave={(event) => {
                if (event.pointerType === "mouse") {
                  onPreviewChange(false)
                }
              }}
              onFocus={(event) => {
                if (event.currentTarget.matches(":focus-visible")) {
                  onPreviewChange(true)
                }
              }}
              onBlur={() => onPreviewChange(false)}
              onClick={onSelectedChange}
            />

            <span
              id={instructionsId}
              className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-white/25 bg-stone-950/75 px-2.5 py-1.5 text-[9px] font-semibold tracking-wider text-white uppercase shadow-lg backdrop-blur-sm sm:text-[10px]"
            >
              <span className="sm:hidden">Tap Luca 19–38</span>
              <span className="hidden sm:inline">Explore Luca · Units 19–38</span>
            </span>

            {isHighlighted ? (
              <span className="pointer-events-none absolute right-3 top-3 rounded-xl border border-luxury-gold/50 bg-stone-950/80 px-3 py-2 text-white shadow-lg backdrop-blur-sm">
                <span className="block text-[10px] font-semibold tracking-widest text-luxury-gold-soft uppercase">
                  Luca
                </span>
                <span className="block font-heading text-sm">Units 19–38</span>
              </span>
            ) : null}
          </>
        ) : null}

        <div className="absolute left-3 top-3 rounded-full border border-white/20 bg-white/90 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-foreground shadow-lg backdrop-blur">
          <span className="mr-2 inline-flex size-2 rounded-full bg-luxury-gold" />
          {project.badge}
        </div>
      </div>

      <div className="mt-3 flex justify-end px-2 text-right font-mono text-[10px] text-slate-500">
        <span>Project reference: {project.title}</span>
      </div>
    </div>
  )
}

export function ArchitectureShowcaseTop({
  backToProjectsHref,
  slug,
}: ArchitectureShowcaseProps) {
  const project = getProjectBySlug(slug)

  const [hoveredFeatureIdx, setHoveredFeatureIdx] = useState<number | null>(null)
  const [hoveredHighlightIdx, setHoveredHighlightIdx] = useState<number | null>(
    null,
  )
  const [isHeroLightboxOpen, setIsHeroLightboxOpen] = useState(false)
  const [isLucaComplexSelected, setIsLucaComplexSelected] = useState(false)
  const [isLucaComplexPreviewed, setIsLucaComplexPreviewed] = useState(false)

  if (!project) {
    return null
  }

  const isOliverProject = project.slug === "oliver"
  const isLucaProject = project.slug === "luca"
  const otherProjectHref = isOliverProject
    ? "/projects/luca"
    : isLucaProject
      ? "/projects/audrey"
      : "/projects/oliver"
  const otherProjectLabel = isOliverProject
    ? "View Luca"
    : isLucaProject
      ? "View Audrey"
      : "View Oliver"
  const isLucaComplexHighlighted =
    isLucaComplexSelected || isLucaComplexPreviewed
  const heroImage = isOliverProject
    ? "/front3DOliver.webp"
    : isLucaProject
      ? "/luca-scroll-poster-v4.jpg"
      : project.picture

  return (
    <section className="luxury-shell mt-14 sm:mt-16">
      <div className="rounded-4xl border-0 bg-white bg-none px-4 py-10 shadow-none backdrop-blur-none sm:px-8 lg:px-10">
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

          <div className="space-y-8 md:hidden">
            <ProjectMainImage
              heroImage={heroImage}
              hoveredFeatureIdx={hoveredFeatureIdx}
              hoveredHighlightIdx={hoveredHighlightIdx}
              onOpen={() => setIsHeroLightboxOpen(true)}
              project={project}
            />
            <ProjectAmenities
              activeItemIdx={hoveredFeatureIdx}
              items={project.features}
              onActiveItemChange={setHoveredFeatureIdx}
              summary={project.summary}
              title="Key Features"
            />
            <ProjectMap
              instructionsId="luca-complex-instructions-mobile"
              isHighlighted={isLucaComplexHighlighted}
              isSelected={isLucaComplexSelected}
              onPreviewChange={setIsLucaComplexPreviewed}
              onSelectedChange={() => {
                setIsLucaComplexSelected((isSelected) => !isSelected)
              }}
              project={project}
            />
            <ProjectAmenities
              activeItemIdx={hoveredHighlightIdx}
              items={project.highlights}
              onActiveItemChange={setHoveredHighlightIdx}
              summary={project.summary}
              title={project.highlightsTitle ?? "Design Highlights"}
              withDescriptions
            />
          </div>

          <div className="hidden gap-8 md:grid xl:grid-cols-12">
            <ProjectAmenities
              activeItemIdx={hoveredFeatureIdx}
              className="xl:col-span-3"
              items={project.features}
              onActiveItemChange={setHoveredFeatureIdx}
              summary={project.summary}
              title="Key Features"
            />

            <div className="flex flex-col gap-4 xl:col-span-6">
              <ProjectMainImage
                heroImage={heroImage}
                hoveredFeatureIdx={hoveredFeatureIdx}
                hoveredHighlightIdx={hoveredHighlightIdx}
                onOpen={() => setIsHeroLightboxOpen(true)}
                project={project}
              />
              <ProjectMap
                instructionsId="luca-complex-instructions-desktop"
                isHighlighted={isLucaComplexHighlighted}
                isSelected={isLucaComplexSelected}
                onPreviewChange={setIsLucaComplexPreviewed}
                onSelectedChange={() => {
                  setIsLucaComplexSelected((isSelected) => !isSelected)
                }}
                project={project}
              />
            </div>

            <ProjectAmenities
              activeItemIdx={hoveredHighlightIdx}
              className="xl:col-span-3"
              items={project.highlights}
              onActiveItemChange={setHoveredHighlightIdx}
              summary={project.summary}
              title={project.highlightsTitle ?? "Design Highlights"}
              withDescriptions
            />
          </div>
        </div>
      </div>

      <ProjectImageLightbox
        src={heroImage}
        alt={`Expanded facade of ${project.title}`}
        title={`${project.boardTitle} facade`}
        isOpen={isHeroLightboxOpen}
        onClose={() => setIsHeroLightboxOpen(false)}
      />
    </section>
  )
}
