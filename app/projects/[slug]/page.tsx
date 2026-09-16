import type { Metadata } from "next"
import { notFound } from "next/navigation"

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
      <SiteFooter />
    </main>
  )
}
