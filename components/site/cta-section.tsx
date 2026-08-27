import Image from "next/image"

// Wikimedia Commons sources: Wider perspective; California Lighthouse, Aruba.jpg
// (Rose Buckley, CC BY-SA 4.0), Aruba Divi Tree.jpg (sbmeaper1, CC0), and
// Plaza Daniel Leo, Oranjestad, Aruba - February 2020.jpg
// (Martin Falbisoner, CC BY-SA 4.0).
const islandImages = {
  lighthouse: {
    src: "/aruba/california-lighthouse.webp",
    alt: "California Lighthouse overlooking the Aruba landscape",
    title: "California Lighthouse",
    descriptor: "Aruba's northwestern landmark",
  },
  diviDivi: {
    src: "/aruba/divi-divi.webp",
    alt: "Divi-Divi tree shaped by Aruba's trade winds",
    title: "Divi-Divi",
    descriptor: "Shaped by the island's trade winds",
  },
  heritage: {
    src: "/aruba/oranjestad-downtown.webp",
    alt: "Colorful architecture at Plaza Daniel Leo in downtown Oranjestad, Aruba",
    title: "Downtown Oranjestad",
    descriptor: "Historic Waterfront & Urban Charm",
  },
} as const

export function CtaSection() {
  return (
    <section
      aria-labelledby="island-context-title"
      className="overflow-hidden bg-stone-50 py-20 sm:py-24 lg:py-32"
    >
      <div className="luxury-shell">
        <div className="mx-auto max-w-7xl">
          <header className="grid gap-8 border-t border-stone-300 pt-8 lg:grid-cols-12 lg:items-end lg:gap-10">
            <div className="lg:col-span-7">
              <p className="luxury-eyebrow">Island Context</p>
              <h2
                id="island-context-title"
                className="mt-5 max-w-3xl font-heading text-4xl leading-none tracking-tight text-stone-950 sm:text-5xl lg:text-6xl"
              >
                <span className="block">Designed for Aruba.</span>
                <span className="mt-2 block text-stone-500">
                  Connected to its character.
                </span>
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-7 text-foreground/65 sm:text-base lg:col-span-4 lg:col-start-9">
              Beyond the residence, Aruba offers a distinctive landscape shaped by
              light, trade winds, heritage, and Caribbean character.
            </p>
          </header>

          <div className="mt-12 grid gap-4 sm:mt-16 lg:grid-cols-5 lg:grid-rows-2 lg:gap-5">
            <figure className="group relative aspect-4/5 overflow-hidden bg-stone-900 lg:col-span-3 lg:row-span-2 lg:aspect-auto lg:min-h-192 xl:min-h-200">
              <Image
                src={islandImages.heritage.src}
                alt={islandImages.heritage.alt}
                fill
                sizes="(min-width: 1280px) 760px, (min-width: 1024px) 57vw, calc(95vw - 32px)"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-103 motion-reduce:transition-none"
              />
              <div className="absolute inset-0 bg-black/5 transition-colors duration-700 group-hover:bg-black/15 motion-reduce:transition-none" />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/85 via-black/30 to-transparent" />

              <figcaption className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8 lg:p-10">
                <span className="mb-4 block h-px w-8 bg-luxury-gold transition-all duration-700 group-hover:w-12 motion-reduce:transition-none" />
                <span className="block font-heading text-3xl leading-tight sm:text-4xl">
                  {islandImages.heritage.title}
                </span>
                <span className="mt-2 block text-xs uppercase tracking-widest text-white/75 sm:text-sm">
                  {islandImages.heritage.descriptor}
                </span>
                <a
                  href="https://commons.wikimedia.org/wiki/File:Plaza_Daniel_Leo,_Oranjestad,_Aruba_-_February_2020.jpg"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block w-fit text-xs text-white/60"
                >
                  Photo: Martin Falbisoner · CC BY-SA 4.0
                </a>
              </figcaption>
            </figure>

            <figure className="group relative aspect-4/3 overflow-hidden bg-stone-900 lg:col-span-2 lg:aspect-auto lg:min-h-0">
              <Image
                src={islandImages.diviDivi.src}
                alt={islandImages.diviDivi.alt}
                fill
                sizes="(min-width: 1280px) 500px, (min-width: 1024px) 38vw, calc(95vw - 32px)"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-103 motion-reduce:transition-none"
              />
              <div className="absolute inset-0 bg-black/5 transition-colors duration-700 group-hover:bg-black/15 motion-reduce:transition-none" />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/85 via-black/30 to-transparent" />

              <figcaption className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-7">
                <span className="mb-3 block h-px w-8 bg-luxury-gold transition-all duration-700 group-hover:w-12 motion-reduce:transition-none" />
                <span className="block font-heading text-2xl leading-tight sm:text-3xl">
                  {islandImages.diviDivi.title}
                </span>
                <span className="mt-1.5 block text-xs uppercase tracking-widest text-white/75">
                  {islandImages.diviDivi.descriptor}
                </span>
              </figcaption>
            </figure>

            <figure className="group relative aspect-4/3 overflow-hidden bg-stone-900 lg:col-span-2 lg:aspect-auto lg:min-h-0">
              <Image
                src={islandImages.lighthouse.src}
                alt={islandImages.lighthouse.alt}
                fill
                sizes="(min-width: 1280px) 500px, (min-width: 1024px) 38vw, calc(95vw - 32px)"
                className="object-cover object-left transition-transform duration-700 group-hover:scale-103 motion-reduce:transition-none"
              />
              <div className="absolute inset-0 bg-black/5 transition-colors duration-700 group-hover:bg-black/15 motion-reduce:transition-none" />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/85 via-black/30 to-transparent" />

              <figcaption className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-7">
                <span className="mb-3 block h-px w-8 bg-luxury-gold transition-all duration-700 group-hover:w-12 motion-reduce:transition-none" />
                <span className="block font-heading text-2xl leading-tight sm:text-3xl">
                  {islandImages.lighthouse.title}
                </span>
                <span className="mt-1.5 block text-xs uppercase tracking-widest text-white/75">
                  {islandImages.lighthouse.descriptor}
                </span>
                <a
                  href="https://commons.wikimedia.org/wiki/File:Wider_perspective%3B_California_Lighthouse,_Aruba.jpg"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1.5 block w-fit text-xs text-white/60"
                >
                  Photo: Rose Buckley · CC BY-SA 4.0
                </a>
              </figcaption>
            </figure>
          </div>

          <div className="mt-5 grid gap-7 border-y border-stone-300 py-8 sm:py-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <p className="font-heading text-3xl leading-tight tracking-tight text-stone-950 sm:text-4xl">
                Find your place in Aruba.
              </p>
              <p className="mt-2 text-xs uppercase tracking-widest text-stone-500">
                Reina Sophia Residences · Paradera, Aruba
              </p>
            </div>

            <a
              href="#contacts"
              className="inline-flex h-12 w-fit items-center justify-center rounded-full bg-linear-to-b from-luxury-gold-soft to-luxury-gold px-8 text-sm font-semibold text-stone-950 shadow-lg transition duration-500 hover:-translate-y-0.5 hover:shadow-xl focus-visible:ring-4 focus-visible:ring-luxury-gold/40 focus-visible:outline-none motion-reduce:transition-none lg:col-span-3 lg:col-start-10 lg:justify-self-end"
            >
              Talk to us
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
