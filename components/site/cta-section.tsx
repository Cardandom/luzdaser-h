import Image from "next/image"

export function CtaSection() {
  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2">
      <div className="relative w-full overflow-hidden border-y border-luxury-border bg-white shadow-[0_20px_45px_rgba(43,43,43,0.1)]">
        <div className="relative min-h-[18rem] sm:min-h-[22rem] lg:min-h-[26rem] w-full">
          <Image
            src="/sunset.webp"
            alt="Aruba coastline at sunset"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(0,0,0,0.18))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,181,109,0.16),transparent_40%)]" />

          <div className="relative z-10 flex min-h-[16rem] items-center justify-center px-4 py-8 sm:min-h-[18rem] sm:px-8 lg:min-h-[20rem]">
            <div className="flex w-full max-w-3xl flex-col items-center text-center">
              <p className="font-heading text-[clamp(1.8rem,4vw,3.3rem)] leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]">
                Live your dream in Aruba
              </p>

              <a
                href="#contacts"
                className="mt-5 inline-flex h-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,#f4ddb0,#c58f3c)] px-8 font-semibold text-[#151007] shadow-[0_16px_30px_rgba(220,181,109,0.35)] transition-transform hover:-translate-y-0.5"
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
