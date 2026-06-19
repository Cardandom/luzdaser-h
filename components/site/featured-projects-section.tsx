import Image from "next/image"
import Link from "next/link"

import { featuredProjects } from "@/lib/projects"

export function FeaturedProjectsSection() {
  return (
    <section id="featured-projects" className="luxury-shell mt-6 sm:mt-8">
      <div className="luxury-panel rounded-3xl px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-center font-heading text-3xl leading-tight text-foreground sm:text-4xl lg:text-5xl">
            Featured Projects
          </p>

          <div className="mx-auto mt-8 grid max-w-5xl gap-5 md:grid-cols-2 lg:gap-6">
            {featuredProjects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                aria-label={`Open ${project.title} project board`}
                className="group block overflow-hidden rounded-3xl border border-black/10 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <article>
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={project.picture}
                      alt={project.title}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ objectPosition: project.objectPosition }}
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-white/5 to-black/10" />
                  </div>

                  <div className="space-y-3 px-5 py-5 sm:px-6">
                    <div>
                      <p className="font-heading text-2xl leading-tight text-foreground sm:text-3xl">
                        {project.title}
                      </p>
                    </div>

                    <p className="text-lg text-foreground">
                      From{" "}
                      <span className="font-heading text-xl text-luxury-gold">
                        {project.price}
                      </span>
                    </p>

                    <span className="inline-flex h-11 items-center justify-center rounded-full bg-linear-to-b from-luxury-gold-soft to-luxury-gold px-6 text-sm font-semibold text-stone-950 shadow-lg transition-transform group-hover:-translate-y-0.5">
                      Open project board
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
