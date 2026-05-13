import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section id="home" className="w-full">
      <div className="relative w-full overflow-hidden border-y border-luxury-border bg-white shadow-[0_28px_90px_rgba(0,0,0,0.55)]">
        <div className="relative min-h-128 sm:min-h-168 lg:min-h-200">
          <Image
            src="/hero_section.webp"
            alt="Luxury villa in Aruba at sunset"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />

          <div className="absolute inset-0" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,214,140,0.12),transparent_26%),radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.06),transparent_12%)]" />

          <div className="absolute inset-x-0 top-0 h-px bg-[#2B2B2B]/10" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-[#2B2B2B]/10" />

          <div className="relative z-10 flex min-h-[32rem] flex-col px-4 py-5 sm:min-h-[42rem] sm:px-8 sm:py-8 lg:min-h-[50rem] lg:px-12 lg:py-10">
            <div className="flex w-full max-w-4xl flex-1 flex-col text-left text-white">
              <p
                className="text-[clamp(1.15rem,2.2vw,1.8rem)] leading-[0.96] tracking-[-0.04em]  drop-shadow-[0_2px_12px_rgba(0,0,0,0.12)]"
                style={{
                  fontFamily:
                    '"TT Commons Pro Expanded", "TT_Commons_Pro_Expanded", var(--font-geist-sans), sans-serif',
                }}
              >
                Premium Homes
              </p>

              <p className="mt-4 text-[clamp(2rem,7vw,5rem)] leading-[1.2]">
                Turning dream homes into reality
              </p>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
