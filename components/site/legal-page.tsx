import type { ReactNode } from "react"
import Link from "next/link"

import { SiteFooter } from "@/components/site/site-footer"

type LegalPageProps = {
  children: ReactNode
  eyebrow: string
  introduction: string
  lastUpdated: string
  title: string
}

type LegalSectionProps = {
  children: ReactNode
  id: string
  title: string
}

type LegalListProps = {
  children: ReactNode
}

export function LegalPage({
  children,
  eyebrow,
  introduction,
  lastUpdated,
  title,
}: LegalPageProps) {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-white pb-6 pt-28 sm:pt-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-linear-to-b from-luxury-gold/15 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-72 right-0 -z-10 size-72 rounded-full bg-luxury-gold-soft/30 blur-3xl"
      />

      <article className="luxury-shell relative" aria-labelledby="legal-page-title">
        <header className="mx-auto max-w-5xl rounded-3xl border border-luxury-border bg-white/95 p-6 shadow-xl sm:p-10 lg:p-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-luxury-gold-ink transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-luxury-gold"
          >
            <span aria-hidden="true">&larr;</span>
            Back to website
          </Link>
          <p className="luxury-eyebrow mt-10">{eyebrow}</p>
          <h1 id="legal-page-title" className="luxury-title mt-4 text-foreground">
            {title}
          </h1>
          <p className="luxury-copy mt-5 max-w-3xl text-base sm:text-lg">
            {introduction}
          </p>
          <p className="mt-6 text-sm text-foreground/65">
            Last updated: {lastUpdated}
          </p>
        </header>

        <div className="mx-auto mt-6 max-w-5xl space-y-10 rounded-3xl border border-luxury-border bg-white p-6 shadow-xl sm:p-10 lg:p-12">
          {children}
        </div>
      </article>

      <SiteFooter />
    </main>
  )
}

export function LegalSection({ children, id, title }: LegalSectionProps) {
  return (
    <section aria-labelledby={id} className="scroll-mt-28">
      <h2 id={id} className="font-heading text-2xl text-foreground sm:text-3xl">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-foreground/75 sm:text-base">
        {children}
      </div>
    </section>
  )
}

export function LegalList({ children }: LegalListProps) {
  return (
    <ul className="list-disc space-y-2 pl-5 marker:text-luxury-gold-ink">
      {children}
    </ul>
  )
}
