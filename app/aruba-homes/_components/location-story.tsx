import Image from "next/image"
import { ShieldCheck } from "lucide-react"

const nearbyPlaces = [
  "Cheng Xing Supermarket",
  "Banco Di Caribe ATM",
  "Paradera's Local Experience",
  "Sunday Food Mart",
]

export function LocationStory() {
  return (
    <section data-funnel-block="reasons" aria-labelledby="location-title" className="bg-white py-9 sm:py-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <p className="luxury-eyebrow">Why Reina Sophia</p>
        <div className="mt-3 grid gap-5 lg:grid-cols-12 lg:items-end">
          <h2 id="location-title" className="luxury-title-sm lg:col-span-5">Central Aruba.<br /><span className="italic text-luxury-gold-ink">Connected to the island.</span></h2>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground lg:col-span-6 lg:col-start-7">A quiet residential community in Paradera with convenient access across Aruba.</p>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-12 lg:items-stretch">
          <figure className="relative min-h-52 overflow-hidden rounded-3xl bg-stone-200 sm:min-h-64 lg:col-span-7 lg:min-h-80">
            <Image src="/newComplex.webp" alt="Aerial view of Reina Sophia Residences and its private residential community in Paradera" fill sizes="(min-width: 1280px) 760px, (min-width: 1024px) 60vw, calc(100vw - 40px)" className="object-cover" />
            <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent px-5 pt-14 pb-4 text-sm font-medium text-white">Private residential setting · Paradera</figcaption>
          </figure>
          <div className="grid grid-cols-2 gap-3 lg:col-span-5 lg:content-stretch">
            {[
              "Central Paradera",
              "Residential Setting",
              "Everyday Essentials Nearby",
              "Easy Island Access",
            ].map((item) => (
              <div key={item} className="flex min-h-20 items-center gap-3 rounded-2xl border border-luxury-border bg-stone-50 px-3 py-3 sm:min-h-24 sm:px-4">
                <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-luxury-gold" />
                <p className="text-xs font-medium leading-snug sm:text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-luxury-border bg-stone-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-luxury-gold-ink" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold">Southern Caribbean Location</p>
              <p className="mt-1 max-w-3xl text-xs leading-5 text-muted-foreground">Aruba sits on the southern fringe of the Caribbean hurricane belt; significant tropical-cyclone impacts have historically been infrequent.</p>
            </div>
          </div>
          <details className="group shrink-0 sm:max-w-72">
            <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 text-xs font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-luxury-gold-ink [&::-webkit-details-marker]:hidden">
              What&apos;s nearby?
              <span aria-hidden="true" className="transition-transform group-open:rotate-45 motion-reduce:transition-none">+</span>
            </summary>
            <ul className="grid gap-2 pb-2 text-xs leading-5 text-muted-foreground sm:grid-cols-2">
              {nearbyPlaces.map((place) => <li key={place}>{place}</li>)}
            </ul>
            <p className="text-xs text-muted-foreground">Nearby places shown for general location reference.</p>
          </details>
        </div>
      </div>
    </section>
  )
}
