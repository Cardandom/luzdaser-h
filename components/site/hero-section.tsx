import { ArrowRight, ChefHat, PlaySquare, ShieldCheck, Waves } from "lucide-react"
import Image from "next/image"

const heroFeatures = [
  {
    icon: ShieldCheck,
    label: "Private community",
  },
  {
    icon: PlaySquare,
    label: "Playground",
  },
  {
    icon: Waves,
    label: "Swimming pool",
  },
  {
    icon: ChefHat,
    label: "Luxurious kitchen finishes",
  },
]

export function HeroSection() {
  return (
    <section id="home" className="h-dvh w-full">
      <div className="relative h-full w-full overflow-hidden bg-white shadow-2xl">
        <div className="relative h-full min-h-0">
          <Image
            src="/newComplex.webp"
            alt=""
            fill
            preload
            sizes="100vw"
            className="object-cover object-center"
            aria-hidden="true"
          />

          <video
            className="absolute inset-0 size-full object-cover object-center"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          >
            <source
              src="/videos/hero-reina-mobile-hq-v2.mp4"
              type="video/mp4"
              media="(max-width: 767px)"
            />
            <source
              src="/vid1.mp4"
              type="video/mp4"
              media="(min-width: 768px)"
            />
          </video>

          <div className="absolute inset-y-0 left-0 w-3/5 bg-linear-to-r from-white/85 via-white/55 to-white/0 sm:w-1/2 lg:w-2/5" />

          <div className="absolute inset-x-0 top-0 h-px bg-black/10" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-black/10" />

          <div className="relative z-10 flex h-full items-start px-12 pt-40 pb-44 sm:items-center sm:px-16 sm:py-8 lg:px-20">
            <div className="w-full max-w-4xl text-left text-foreground lg:max-w-3xl">
              <p
                className="max-w-md text-xs font-semibold uppercase tracking-widest text-[#201751] drop-shadow-sm"
                style={{
                  fontFamily:
                    '"TT Commons Pro Expanded", "TT_Commons_Pro_Expanded", var(--font-geist-sans), sans-serif',
                }}
              >
                Exclusive Real Estate in Aruba
              </p>

              <p className="mt-4 max-w-md font-heading text-4xl italic leading-none tracking-tight text-foreground drop-shadow-sm sm:mt-5 sm:text-5xl lg:text-7xl">
                Your Home in
              </p>

              <p className="mt-1 max-w-md font-heading text-4xl italic leading-none tracking-tight text-[#201751] drop-shadow-sm sm:text-5xl lg:text-7xl">
                Paradise
              </p>

              <p className="mt-4 max-w-sm text-balance text-xs font-medium leading-6 text-foreground/90 sm:mt-6 sm:max-w-2xl sm:text-lg sm:leading-7">
                We design and build exclusive residences in Aruba, blending
                contemporary elegance with the serenity of the Caribbean.
              </p>

              <div className="mt-5 flex justify-start sm:mt-8">
                <a
                  href="#featured-projects"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-linear-to-b from-luxury-gold-soft to-luxury-gold px-6 text-xs font-semibold uppercase tracking-widest text-stone-950 shadow-lg transition-transform hover:-translate-y-0.5 sm:h-12 sm:px-7"
                >
                  Explore Projects
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-5 z-10 flex justify-center px-4 sm:bottom-10">
            <div className="grid w-full max-w-sm grid-cols-2 gap-x-3 gap-y-4 rounded-full bg-black/35 p-4 text-xs backdrop-blur-sm sm:flex sm:w-auto sm:max-w-none sm:flex-wrap sm:justify-center sm:gap-x-10 sm:gap-y-6 sm:p-5 md:text-base lg:gap-x-12">
              {heroFeatures.map((item) => {
                const Icon = item.icon

                return (
                  <div key={item.label} className="flex min-w-0 items-center gap-2 sm:w-40 sm:gap-3">
                    <Icon
                      className="size-8 shrink-0 text-luxury-gold drop-shadow-sm sm:size-9"
                      aria-hidden="true"
                    />
                    <p className="font-heading text-xs leading-tight text-stone-100 drop-shadow-sm sm:text-base">
                      {item.label}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
