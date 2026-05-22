import Image from "next/image"
import { MapPin } from "lucide-react"

const stats = [
  {
    value: "15 Min.",
    label: "From the Beach",
  },
  {
    value: "5 Min.",
    label: "Near Hooiberg Hill",
  },
  {
    value: "Nearby",
    label: "centrally located",
  },
]

export function BenefitsSection() {
  return (
    <section id="location" className="luxury-shell mt-6 sm:mt-8">
      <div className="overflow-hidden rounded-3xl border border-luxury-border bg-white shadow-xl">
        <div className="bg-[radial-gradient(circle_at_top_left,rgba(220,181,109,0.12),transparent_28%),radial-gradient(circle_at_100%_0%,rgba(43,43,43,0.04),transparent_22%),linear-gradient(180deg,#ffffff,#fbfaf7)] px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="font-heading text-3xl leading-tight text-foreground sm:text-4xl lg:text-5xl">
                Exclusive Location
              </p>
              <p className="mt-3 text-xs uppercase tracking-widest text-luxury-gold sm:text-sm">
                Paradera 184, Aruba
              </p>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div className="relative overflow-hidden rounded-3xl border border-luxury-border bg-linear-to-b from-white to-stone-50 p-4 sm:p-6 lg:p-8">
                <div className="absolute inset-x-0 top-0 h-20 bg-linear-to-b from-luxury-gold/10 to-transparent" />

                <div className="absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border border-luxury-border bg-white/90 px-3 py-1.5 text-xs uppercase tracking-widest text-foreground/70 shadow-sm backdrop-blur">
                  <MapPin className="size-3.5 text-luxury-gold" aria-hidden="true" />
                  Aruba
                </div>

                <div className="relative aspect-video overflow-hidden rounded-2xl">
                  <Image
                    src="/aruba-map.png"
                    alt="Golden map of Aruba"
                    fill
                    priority={false}
                    sizes="(min-width: 1024px) 52vw, 100vw"
                    className="object-contain object-center drop-shadow-[0_18px_40px_rgba(43,43,43,0.16)]"
                  />

                  <div
                    className="absolute -translate-x-1/2 -translate-y-full"
                    style={{ left: "42%", top: "46%" }}
                  >
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-2 rounded-full border border-luxury-gold/25 bg-white/95 px-3 py-1.5 text-xs font-medium text-foreground shadow-lg backdrop-blur">
                        <MapPin className="size-3.5 text-luxury-gold" aria-hidden="true" />
                        Paradera 184
                      </div>
                      <div className="mt-2 size-4 rounded-full bg-luxury-gold shadow-[0_0_0_8px_rgba(220,181,109,0.14)]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-luxury-border bg-white shadow-lg">
                <div className="grid divide-y divide-luxury-border md:grid-cols-3 md:divide-x md:divide-y-0">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex flex-col items-center justify-center px-5 py-6 text-center md:min-h-44 md:px-6"
                    >
                      <p className="font-heading leading-none text-luxury-gold sm:text-4xl lg:text-5xl">
                        {stat.value}
                      </p>
                      <p className="mt-2 text-sm uppercase tracking-widest text-foreground/70">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-luxury-border px-5 py-5 sm:px-6">
                  <p className="text-sm leading-7 text-foreground/70">
                    It offers the perfect combination of tranquility, security, and a prime location, as it is a modern private residential community situated in a central area of the island. It is ideal for those seeking a more exclusive and relaxed environment away from the tourist crowds, while still enjoying easy access to supermarkets, restaurants, schools, and being only 10–15 minutes from famous beaches such as Eagle Beach and Palm Beach. It also stands out as an excellent option for living or investing thanks to its comfort, privacy, and quality of life.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
