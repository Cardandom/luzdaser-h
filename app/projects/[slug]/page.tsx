import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"

import { SiteFooter } from "@/components/site/site-footer"
import { getProjectBySlug, projects } from "@/lib/projects"
import { ArchitectureShowcase } from "./_components/ArchitectureShowcase"

type ProjectPageProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    return {
      title: "Project not found",
    }
  }

  const title = `${project.title} | Featured Project`
  const canonicalPath = `/projects/${project.slug}`

  return {
    title,
    description: project.summary,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "website",
      url: canonicalPath,
      title,
      description: project.summary,
      images: [
        {
          url: project.picture,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: project.summary,
      images: [
        {
          url: project.picture,
          alt: project.title,
        },
      ],
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  return (
    <main className="relative isolate overflow-hidden bg-white pb-6">
      <ArchitectureShowcase slug={project.slug} />
      <section className="mx-auto my-12 max-w-7xl px-5 sm:px-8 lg:px-10" aria-labelledby="personalize-title">
        <div className="rounded-3xl bg-stone-100 p-6 sm:p-10">
          <p className="luxury-eyebrow">Your Residence</p>
          <h2 id="personalize-title" className="mt-3 font-heading text-3xl">Personalize Your Residence</h2>
          <p className="mt-3 text-lg font-semibold">{project.price}</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">Base residence + freehold land, based on the lowest currently listed compatible lot.</p>
          <p className="mt-4 text-sm leading-6">Optional upgrades: Pool · Kitchen Packages · Covered Terrace · Custom Closets · Appliances</p>
          <p className="mt-2 text-xs text-muted-foreground">Renders may show optional upgrades. Pricing depends on lot selection, availability and specifications.</p>
          <Link href={`/aruba-homes?model=${project.slug}#build-your-home`} className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-linear-to-b from-luxury-gold-soft to-luxury-gold px-6 py-3 text-sm font-semibold text-stone-950">Build Your Personalized Offer</Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
