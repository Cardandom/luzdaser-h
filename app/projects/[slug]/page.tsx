import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"

import { getProjectBySlug, projects } from "@/lib/projects"
import { ArchitectureShowcase } from "./_components/ArchitectureShowcase"

type ProjectPageProps = {
  params: Promise<{
    slug: string
  }>
}

const legacyLucaProjectSlug = "lucas-boutique"
const lucaProjectSlug = "luca-boutique"

function redirectLegacyLucaProject(slug: string) {
  if (slug === legacyLucaProjectSlug) {
    permanentRedirect(`/projects/${lucaProjectSlug}`)
  }
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
  redirectLegacyLucaProject(slug)
  const project = getProjectBySlug(slug)

  if (!project) {
    return {
      title: "Project not found",
    }
  }

  return {
    title: `${project.title} | Featured Project`,
    description: project.summary,
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  redirectLegacyLucaProject(slug)
  const project = getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  return (
    <main className="relative isolate overflow-hidden bg-white pb-6">
      <ArchitectureShowcase slug={project.slug} />
    </main>
  )
}
