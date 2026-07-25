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

const locationAddress = "Paradera 184, Aruba"
const googleMapsUrl =
  "https://www.google.com/maps/search/?api=1&query=Paradera%20184%2C%20Aruba"
const googleMapsEmbedUrl =
  "https://maps.google.com/maps?q=Paradera%20184%2C%20Aruba&output=embed"

export function BenefitsSection() {
  return (
    <section id="location">
      <div className="overflow-hidden bg-white">
        <div className="bg-[radial-gradient(circle_at_top_left,rgba(220,181,109,0.12),transparent_28%),radial-gradient(circle_at_100%_0%,rgba(43,43,43,0.04),transparent_22%),linear-gradient(180deg,#ffffff,#fbfaf7)] px-5 py-20 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="font-heading text-3xl leading-tight text-foreground sm:text-4xl lg:text-5xl">
                Exclusive Location
              </p>
              <p className="mt-3 text-xs uppercase tracking-widest text-luxury-gold-ink sm:text-sm">
                Paradera 184, Aruba
              </p>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-stretch">
              <div className="relative flex h-full overflow-hidden rounded-3xl border border-luxury-border bg-linear-to-b from-white to-stone-50 p-4 sm:p-6 lg:p-8">
                <div className="absolute inset-x-0 top-0 h-20 bg-linear-to-b from-luxury-gold/10 to-transparent" />

                <div className="absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border border-luxury-border bg-white/90 px-3 py-1.5 text-xs uppercase tracking-widest text-foreground/70 shadow-sm backdrop-blur">
                  <MapPin className="size-3.5 text-luxury-gold" aria-hidden="true" />
                  Aruba
                </div>

                <div className="relative min-h-80 w-full overflow-hidden rounded-2xl lg:min-h-96">
                  <Image
                    src="/aruba-map.png"
                    alt="Golden map of Aruba"
                    fill
                    sizes="(min-width: 1024px) 560px, calc(100vw - 40px)"
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

              <div className="flex h-full flex-col rounded-3xl border border-luxury-border bg-white shadow-lg">
                <div className="grid divide-y divide-luxury-border md:grid-cols-3 md:divide-x md:divide-y-0">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex flex-col items-center justify-center px-5 py-6 text-center md:min-h-44 md:px-6"
                    >
                      <p className="font-heading leading-none text-luxury-gold-ink sm:text-4xl lg:text-5xl">
                        {stat.value}
                      </p>
                      <p className="mt-2 text-sm uppercase tracking-widest text-foreground/70">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-1 items-center border-t border-luxury-border px-5 py-5 sm:px-6">
                  <p className="text-sm leading-7 text-foreground/70">
                    It offers the perfect combination of tranquility, security, and a prime location, as it is a modern private residential community situated in a central area of the island. It is ideal for those seeking a more exclusive and relaxed environment away from the tourist crowds, while still enjoying easy access to supermarkets, restaurants, schools, and being only 10–15 minutes from famous beaches such as Eagle Beach and Palm Beach. It also stands out as an excellent option for living or investing thanks to its comfort, privacy, and quality of life.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-3xl border border-luxury-border bg-white shadow-lg">
              <div className="relative aspect-video min-h-80">
                <iframe
                  src={googleMapsEmbedUrl}
                  title={`Google Maps location for ${locationAddress}`}
                  className="absolute inset-0 size-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute inset-0"
                  aria-label={`Open ${locationAddress} in Google Maps`}
                >
                  <span className="sr-only">Open {locationAddress} in Google Maps</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
