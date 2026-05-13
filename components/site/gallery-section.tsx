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
    objectPosition: "center right",
    picture: "/frontHouse.webp",
  },
]

export function GallerySection() {
  return (
    <section id="gallery" className="luxury-shell">
      <div className="rounded-[32px] border border-luxury-border bg-white px-4 py-10 shadow-[0_18px_40px_rgba(43,43,43,0.08)] sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <p className="font-heading text-[clamp(1.7rem,3.2vw,2.9rem)] leading-tight text-center text-[#2B2B2B]">
            Enjoy the luxury and serenity of living in Aruba
          </p>

          <div className="mt-7 flex items-center gap-4">
            <span className="h-px flex-1 bg-[#2B2B2B]/20" />
            <p className="font-heading text-[clamp(1rem,2vw,1.35rem)] tracking-[0.2em] text-luxury-gold uppercase">
              Luxury & Comfort
            </p>
            <span className="h-px flex-1 bg-[#2B2B2B]/20" />
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {galleryItems.map((item) => (
              <figure
                key={item.title}
                className="overflow-hidden border border-black/10 bg-white shadow-[0_16px_32px_rgba(43,43,43,0.08)]"
              >
                <div className="relative aspect-[1.18] overflow-hidden">
                  <Image
                    src={item.picture}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover"
                    style={{ objectPosition: item.objectPosition }}
                    priority={false}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.1))]" />
                </div>

                <figcaption className="border-t border-black/10 bg-white px-4 py-4 text-center">
                  <p className="font-heading text-xl text-[#2B2B2B]">{item.title}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
