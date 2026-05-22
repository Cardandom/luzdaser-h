import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section id="home" className="h-dvh w-full">
      <div className="relative h-full w-full overflow-hidden bg-white shadow-2xl">
        <div className="relative h-full min-h-0">
          <Image
            src="/hero_sections.webp"
            alt="Luxury villa in Aruba at sunset"
            fill
            priority
            sizes="100vw"
            className="scale-105 object-cover object-center"
          />

          <div className="absolute inset-0 bg-linear-to-r from-white/80 via-white/50 to-white/25" />
          <div className="absolute inset-0 bg-linear-to-b from-white/10 to-white/25" />
          <div className="absolute inset-0 bg-linear-to-br from-luxury-gold/15 via-transparent to-cyan-400/10" />

          <div className="absolute inset-x-0 top-0 h-px bg-black/10" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-black/10" />

          <div className="relative z-10 flex h-full items-center px-4 py-8 sm:px-8 lg:px-12">
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

              <p className="mt-5 max-w-md font-heading text-4xl italic leading-none tracking-tight text-foreground drop-shadow-sm sm:text-5xl lg:text-7xl">
                Your Home in
              </p>

              <p className="mt-1 max-w-md font-heading text-4xl italic leading-none tracking-tight text-[#201751] drop-shadow-sm sm:text-5xl lg:text-7xl">
                Paradise
              </p>

              <p className="mt-6 max-w-2xl text-balance text-sm leading-7 text-foreground/90 sm:text-base">
                We design and build exclusive residences in Aruba, blending
                contemporary elegance with the serenity of the Caribbean.
              </p>

              <div className="mt-8 flex justify-start">
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
        </div>
      </div>
    </section>
  );
}
