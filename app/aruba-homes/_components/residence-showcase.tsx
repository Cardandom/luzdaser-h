import Image from "next/image"

import type { Project } from "@/lib/projects"
import { RequestAvailabilityLink } from "./funnel-interactions"
import { FloorplanDialog } from "./floorplan-dialog"

const residenceTypes = {
  luca: "Boutique Home",
  oliver: "Private Villa",
  audrey: "Two-Level Villa",
} as const

export function ResidenceShowcase({ project }: { project: Project }) {
  return (
    <article aria-labelledby={`residence-${project.slug}`} className="group flex w-[85vw] max-w-md shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-luxury-border bg-white shadow-sm transition-shadow hover:shadow-lg motion-reduce:transition-none lg:w-auto lg:max-w-none">
      <div className="relative aspect-4/3 overflow-hidden bg-stone-200">
        <Image
          src={project.picture}
          alt={`Architectural render of the ${project.title} residence`}
          fill
          sizes="(min-width: 1024px) 30vw, 85vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none"
          style={{ objectPosition: project.objectPosition }}
        />
        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm">
          {residenceTypes[project.slug]}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h3 id={`residence-${project.slug}`} className="font-heading text-2xl uppercase tracking-wide">{project.title}</h3>
          <p className="text-sm font-semibold text-luxury-gold-ink">{project.price}</p>
        </div>
        <ul className="mt-4 grid grid-cols-2 gap-3 text-xs leading-5 sm:text-sm">
          {project.comparisonFeatures.map(({ label, icon: Icon }) => (
            <li key={label} className="flex min-w-0 items-center gap-2">
              <Icon className="size-4 shrink-0 text-luxury-gold-ink" aria-hidden="true" />
              <span>{label}</span>
            </li>
          ))}
        </ul>
        {project.comparisonNote && (
          <p className="mt-3 rounded-xl bg-stone-50 px-3 py-2 text-xs leading-5 text-muted-foreground">{project.comparisonNote}</p>
        )}
        <div className="mt-auto grid gap-2 pt-4">
          <FloorplanDialog residence={project.title as "Oliver" | "Luca" | "Audrey"} slug={project.slug} sheet={project.blueprintSheets[0]} />
          <RequestAvailabilityLink residence={project.title as "Oliver" | "Luca" | "Audrey"} />
        </div>
      </div>
    </article>
  )
}
