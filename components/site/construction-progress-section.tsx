import Image from "next/image"

type ConstructionPhoto = {
  src: string
  alt: string
  residence: (typeof constructionResidences)[number]
  monthYear: string
}

const constructionResidences = ["Luca", "Oliver", "Audrey"] as const

// Add only real construction photos explicitly assigned to this section.
// An empty collection keeps the section out of the rendered page entirely.
const constructionPhotos: ConstructionPhoto[] = []

export function ConstructionProgressSection() {
  if (constructionPhotos.length === 0) return null

  return (
    <section id="construction-progress" aria-labelledby="construction-progress-title" className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12 lg:px-10">
      <p className="luxury-eyebrow">Construction Progress</p>
      <h2 id="construction-progress-title" className="luxury-title-sm mt-3">Reina Sophia is taking shape.</h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">Follow the progress of Luca, Oliver and Audrey as construction advances in Paradera.</p>
      <ul aria-label="Residence models" className="mt-4 flex flex-wrap gap-2">
        {constructionResidences.map((residence) => (
          <li key={residence} className="rounded-full border border-luxury-border bg-white px-3 py-1.5 text-xs font-medium">{residence}</li>
        ))}
      </ul>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {constructionPhotos.slice(0, 3).map((photo) => (
          <figure key={photo.src} className="overflow-hidden rounded-3xl border border-luxury-border bg-white">
            <div className="relative aspect-4/3">
              <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1280px) 385px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, calc(100vw - 40px)" className="object-cover" />
            </div>
            <figcaption className="flex items-center justify-between gap-2 px-4 py-3 text-sm">
              <span className="font-medium">{photo.residence} · {photo.monthYear}</span>
              <span className="shrink-0 rounded-full bg-luxury-gold-soft/40 px-2.5 py-1 text-xs">In Progress</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
