import Image from "next/image"

export function CtaSection() {
  return (
    <section className="luxury-shell">
      <div className="relative overflow-hidden border border-luxury-border bg-white shadow-xl">
        <div className="relative min-h-72 sm:min-h-80 lg:min-h-96">
          <Image
            src="/sunset.webp"
            alt="Aruba coastline at sunset"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-gold/15 to-transparent" />

          <div className="relative z-10 flex min-h-64 items-center justify-center px-4 py-8 sm:min-h-72 sm:px-8 lg:min-h-80">
            <div className="flex w-full max-w-3xl flex-col items-center text-center">
              <p className="font-heading text-3xl leading-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
                Live your dream in Aruba
              </p>

              <a
                href="#contacts"
                className="mt-5 inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-b from-luxury-gold-soft to-luxury-gold px-8 font-semibold text-stone-950 shadow-lg transition-transform hover:-translate-y-0.5"
              >
                Contact us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
