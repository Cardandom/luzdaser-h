import Image from "next/image"

const lifestyleViews = [
  {
    title: "Residence at Dusk",
    description: "A contemporary home in Paradera.",
    src: "/projects/audrey/audrey-evening-arrival.webp",
    alt: "Audrey residence and outdoor approach at dusk",
    size: "col-span-2 lg:col-span-7 lg:row-span-2",
  },
  {
    title: "Individual Residences",
    description: "Personal space within the community.",
    src: "/projects/audrey/audrey-villa-collection.webp",
    alt: "Audrey villa collection in the residential community",
    size: "col-span-1 lg:col-span-5",
  },
  {
    title: "Residential Community",
    description: "Contemporary homes in Paradera.",
    src: "/projects/audrey/audrey-community-streetscape.webp",
    alt: "Homes along a residential street in the Reina Sophia community",
    size: "col-span-1 lg:col-span-5",
  },
]

export function LifestyleBento() {
  return (
    <section data-funnel-block="lifestyle" aria-labelledby="lifestyle-title" className="bg-stone-100 py-9 sm:py-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <p className="luxury-eyebrow">A place of your own</p>
        <h2 id="lifestyle-title" className="luxury-title-sm mt-3">Private living in central Aruba.</h2>
        <div className="mt-6 grid grid-cols-2 auto-rows-[minmax(11rem,1fr)] gap-3 lg:grid-cols-12 lg:auto-rows-[12rem] lg:gap-4">
          {lifestyleViews.map((view) => (
            <figure key={view.title} className={`group relative min-h-52 overflow-hidden rounded-3xl bg-stone-300 ${view.size}`}>
              <Image src={view.src} alt={view.alt} fill sizes="(min-width: 1024px) 60vw, (min-width: 640px) 75vw, calc(100vw - 40px)" className="object-cover transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 via-black/25 to-transparent px-5 pt-14 pb-4 text-white">
                <p className="font-heading text-xl">{view.title}</p>
                <p className="mt-1 text-xs leading-5 text-white/85">{view.description}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
