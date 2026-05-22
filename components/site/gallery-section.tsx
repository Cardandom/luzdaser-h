import Image from "next/image"

const galleryItems = [
  {
    title: "Elegant Kitchens",
    objectPosition: "center left",
    picture: "/kitchen.webp",
  },
  {
    title: "Confort living rooms",
    objectPosition: "center center",
    picture: "/livingroom.webp",
  },
  {
    title: "View front house",
    objectPosition: "center left",
    picture: "/frontHouse1.webp",
  },
]

export function GallerySection() {
  return (
    <section id="gallery" className="luxury-shell">
      <div className="rounded-3xl border border-luxury-border bg-white px-4 py-10 shadow-xl sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <p className="font-heading text-center text-3xl leading-tight text-foreground sm:text-4xl lg:text-5xl">
            Enjoy the luxury and serenity of living in Aruba
          </p>

          <div className="mt-7 flex items-center gap-4">
            <span className="h-px flex-1 bg-foreground/20" />
            <p className="font-heading text-sm uppercase tracking-widest text-luxury-gold sm:text-base lg:text-lg">
              Luxury & Comfort
            </p>
            <span className="h-px flex-1 bg-foreground/20" />
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {galleryItems.map((item) => (
              <figure
                key={item.title}
                className="overflow-hidden border border-black/10 bg-white shadow-lg"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={item.picture}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover"
                    style={{ objectPosition: item.objectPosition }}
                    priority={false}
                  />
                  <div className="absolute inset-0 bg-linear-to-b from-white/5 to-black/10" />
                </div>

                <figcaption className="border-t border-black/10 bg-white px-4 py-4 text-center">
                  <p className="font-heading text-xl text-foreground">{item.title}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
