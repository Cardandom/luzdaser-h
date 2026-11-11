import Image from "next/image"
import type { Project } from "@/lib/projects"
import { RequestAvailabilityLink } from "./funnel-interactions"

export function ResidenceShowcase({ project }: { project: Project }) {
  return (
      <article aria-labelledby={`residence-${project.slug}`} className="group flex w-[86vw] max-w-md shrink-0 snap-center flex-col overflow-hidden rounded-3xl border border-luxury-border bg-white shadow-sm transition-shadow hover:shadow-lg motion-reduce:transition-none lg:w-auto lg:max-w-none">
        <div className="relative aspect-video overflow-hidden bg-stone-200">
          <Image
            src={project.picture}
            alt={project.galleryImages[0].alt}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 448px, 86vw"
            className="object-cover"
            style={{ objectPosition: project.objectPosition }}
          />
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <h3 id={`residence-${project.slug}`} className="font-heading text-2xl uppercase tracking-wide">{project.title}</h3>
          <p className="mt-1 text-sm font-semibold text-luxury-gold-ink">{project.price}</p>
          <p className="mt-1 text-xs text-muted-foreground">Base home + freehold land</p>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-xs leading-5 sm:text-sm">
            {project.comparisonFeatures.slice(0, 2).map(({ label, icon: Icon }) => (
              <li key={label} className="flex min-w-0 items-center gap-2">
                <Icon className="size-4 shrink-0 text-luxury-gold-ink" aria-hidden="true" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-3">
            <RequestAvailabilityLink residence={project.title as "Oliver" | "Luca" | "Audrey"} />
          </div>
        </div>
      </article>
  )
}
