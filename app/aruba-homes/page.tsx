import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowDown, ArrowRight, MessageCircleMore } from "lucide-react"

import { CookieSettingsButton } from "@/components/site/cookie-settings-button"
import { contactPhone, contactPhoneDisplay, getWhatsAppUrl } from "@/lib/contact-config"
import { brandName, legalEntityName, privacyEmail, registeredAddress } from "@/lib/legal-config"
import { getProjectBySlug } from "@/lib/projects"
import { FunnelForm, FunnelProvider, RequestAvailabilityLink } from "./_components/funnel-interactions"
import { MobileFunnelActions } from "./_components/mobile-funnel-actions"
import { FunnelHeroVideo } from "./_components/funnel-hero-video"
import styles from "./funnel.module.css"

const whatsappHref = getWhatsAppUrl(
  "Hi, I'm interested in Reina Sophia Residences. I'd like to receive current pricing and availability.",
)

const residences = (["oliver", "luca", "audrey"] as const).map((slug) => {
  const project = getProjectBySlug(slug)
  if (!project) throw new Error(`Missing residence: ${slug}`)
  return {
    ...project,
    // Keep commercial specifications tied to the approved project record.
    cardFeatures: project.features.filter(({ label }) =>
      /m² House|Bedrooms|Pool/i.test(label),
    ).slice(0, 3),
  }
})

// Sources: the existing hero, model records, and Paradera context in benefits-section.tsx.
const benefits = [
  { title: "Private residential setting", copy: "A private community with a children's park." },
  { title: "Contemporary home models", copy: "Minimalist homes with two, three or four bedrooms." },
  { title: "Outdoor living", copy: "Private swimming pools and outdoor spaces." },
  { title: "Central location in Aruba", copy: "Paradera, with access to shops, restaurants and schools." },
]

const steps = ["Request Information", "Receive Current Options", "Speak With the Reina Sophia Team"]

const primaryButtonClass = "inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-linear-to-b from-luxury-gold-soft to-luxury-gold px-6 py-3 text-sm font-semibold text-stone-950 shadow-sm transition-shadow hover:shadow-md motion-reduce:transition-none"

export const metadata: Metadata = {
  title: "Homes in Aruba | Reina Sophia Residences",
  description:
    "Explore Oliver, Luca and Audrey at Reina Sophia Residences in Paradera, Aruba. Request current pricing and availability from our team.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/aruba-homes" },
  openGraph: {
    type: "website",
    url: "/aruba-homes",
    title: "Own Your Place in Aruba. | Reina Sophia Residences",
    description: "Explore our home models in Paradera and request current pricing and availability.",
    images: [{ url: "/front3DOliver.webp", alt: "Architectural render of the Oliver residence at sunset" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Own Your Place in Aruba. | Reina Sophia Residences",
    description: "Explore our home models in Paradera and request current pricing and availability.",
    images: ["/front3DOliver.webp"],
  },
}

export default function ArubaHomesPage() {
  return (
    <div className={`${styles.page} aruba-homes-page bg-stone-50`}>
      <FunnelProvider>
        <a href="#funnel-main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-white focus:p-4">
          Skip to content
        </a>
        <header className="border-b border-white/10 bg-foreground text-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-3 sm:px-8 lg:px-10">
            <div className="min-w-0 flex-1 border-l border-luxury-gold/70 pl-3">
              <p className="font-heading text-base leading-tight tracking-wide text-white sm:text-lg">Secure Your Residence</p>
              <p className="mt-0.5 text-xs leading-tight text-white/65">Initial reservation deposit · Construction payments by project milestones</p>
            </div>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" data-funnel-event="funnel_whatsapp_click" data-cta-location="header" className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-white/10 bg-green-700 py-1.5 pr-3 pl-1.5 text-xs font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:shadow-xl sm:gap-3 sm:py-2 sm:pr-4 sm:pl-2 sm:text-sm">
              <span className="inline-flex size-8 items-center justify-center rounded-full bg-white/15">
                <MessageCircleMore className="size-4" aria-hidden="true" />
              </span>
              WhatsApp
            </a>
          </div>
        </header>

        <main id="funnel-main">
          <section id="funnel-hero" data-funnel-block="hero" aria-labelledby="hero-title" className="mx-auto grid max-w-7xl items-center gap-6 px-5 py-6 sm:gap-8 sm:px-8 sm:py-8 lg:grid-cols-12 lg:gap-10 lg:px-10">
            <div className="order-2 lg:order-1 lg:col-span-5">
              <p className="luxury-eyebrow">New Homes for Sale in Aruba</p>
              <h1 id="hero-title" className="mt-4 font-heading text-5xl leading-none tracking-tight sm:text-6xl lg:text-5xl xl:text-6xl">
                Own Your Place<br />in <span className="italic text-luxury-gold-ink">Aruba.</span>
              </h1>
              <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
                Discover Reina Sophia Residences in Paradera and request current pricing and availability.
              </p>
              <div className="mt-6 flex flex-col items-start gap-2">
                <a href="#request-prices" data-funnel-event="funnel_primary_cta" data-cta-location="hero" className={`${primaryButtonClass} w-full sm:w-auto`}>
                  Get Prices &amp; Availability <ArrowDown className="size-4" aria-hidden="true" />
                </a>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" data-funnel-event="funnel_whatsapp_click" data-cta-location="hero" className="inline-flex min-h-11 w-full items-center justify-center gap-2 text-sm font-medium sm:w-auto sm:px-4">
                  <MessageCircleMore className="size-4 text-[#25D366]" aria-hidden="true" /> WhatsApp Us
                </a>
              </div>
            </div>

            <figure className="relative order-1 aspect-7/5 overflow-hidden rounded-3xl bg-stone-200 lg:order-2 lg:col-span-7 lg:aspect-4/3">
              <FunnelHeroVideo />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/80 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8">
                <p className="text-xs uppercase tracking-widest text-luxury-gold-soft">Paradera, Aruba</p>
              </figcaption>
            </figure>

          </section>

          <section data-funnel-block="request" aria-labelledby="request-prices-title" className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <FunnelForm id="request-prices" submitLabel="Send Me Prices & Availability" whatsappHref={whatsappHref}>
              <ul aria-label="Project at a glance" className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-luxury-border pt-4 text-center text-xs leading-5 text-muted-foreground md:grid-cols-4">
                {["Paradera, Aruba", "Private Residential Project", "Three Home Models", "Direct Project Information"].map((item) => <li key={item}>{item}</li>)}
              </ul>
            </FunnelForm>
          </section>

          <section data-funnel-block="models" aria-labelledby="residences-title" className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12 lg:px-10">
            <div>
              <p className="luxury-eyebrow">The Residences</p>
              <h2 id="residences-title" className="luxury-title-sm mt-3">Choose Your Residence</h2>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {residences.map((project) => (
                <article key={project.slug} aria-labelledby={`residence-${project.slug}`} className="flex min-w-0 flex-col overflow-hidden rounded-3xl border border-luxury-border bg-white">
                  <div className="relative aspect-video bg-stone-200">
                    <Image src={project.picture} alt={`Architectural render of the ${project.title} residence`} fill sizes="(min-width: 1280px) 385px, (min-width: 768px) 30vw, (min-width: 640px) calc(100vw - 64px), calc(100vw - 40px)" className="object-cover" style={{ objectPosition: project.objectPosition }} />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 id={`residence-${project.slug}`} className="font-heading text-2xl uppercase tracking-wide">{project.title}</h3>
                    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs leading-5">
                      {project.cardFeatures.map(({ label, icon: Icon }) => (
                        <li key={label} className="flex items-center gap-2"><Icon className="size-4 shrink-0 text-luxury-gold-ink" aria-hidden="true" />{label}</li>
                      ))}
                    </ul>
                    <div className="mt-auto pt-4">
                      <RequestAvailabilityLink residence={project.title as "Oliver" | "Luca" | "Audrey"} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section data-funnel-block="reasons" aria-labelledby="why-title" className="border-t border-luxury-border bg-white py-10 sm:py-12">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
              <p className="luxury-eyebrow">Why Reina Sophia</p>
              <h2 id="why-title" className="luxury-title-sm mt-3">A place of your own <span className="italic text-luxury-gold-ink">in Aruba.</span></h2>
              <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {benefits.map((benefit) => (
                  <li key={benefit.title} className="border-l-2 border-luxury-gold/60 pl-4">
                    <h3 className="font-heading text-lg">{benefit.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{benefit.copy}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section id="funnel-closing" data-funnel-block="conversion" aria-labelledby="options-title" className="bg-foreground text-white">
            <div className="mx-auto grid max-w-7xl gap-6 px-5 pt-10 pb-8 sm:px-8 lg:grid-cols-12 lg:items-center lg:px-10">
              <div className="lg:col-span-7">
                <h2 id="options-title" className="font-heading text-3xl leading-tight sm:text-4xl">Ready to Discover Your Options?</h2>
                <p className="mt-3 max-w-lg text-sm leading-6 text-white/80">Request current pricing and availability for Reina Sophia Residences.</p>
              </div>
              <div className="flex flex-col gap-3 lg:col-span-5 lg:items-end">
                <a href="#request-prices" data-funnel-event="funnel_primary_cta" data-cta-location="conversion-banner" className={primaryButtonClass}>Get Prices &amp; Availability <ArrowRight className="size-4" aria-hidden="true" /></a>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" data-funnel-event="funnel_whatsapp_click" data-cta-location="conversion-banner" className="inline-flex min-h-11 items-center justify-center gap-2 px-5 text-sm text-white underline underline-offset-4"><MessageCircleMore className="size-4 text-[#25D366]" aria-hidden="true" />WhatsApp Us</a>
              </div>
            </div>
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
              <ol aria-label="What happens next" className="grid gap-4 border-t border-white/20 py-6 text-xs text-white/85 sm:grid-cols-3">
                {steps.map((step, index) => (
                  <li key={step} className="flex items-center gap-3"><span className="text-luxury-gold-soft">0{index + 1}</span>{step}</li>
                ))}
              </ol>
            </div>
          </section>
        </main>

        <footer id="funnel-footer" className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
          <div className="flex flex-col justify-between gap-6 sm:flex-row">
            <div>
              <div className="flex items-center gap-2.5 sm:gap-3">
                <Image src="/Logo_Icono_Dorado.png" alt="" width={44} height={44} className="size-10 rounded-full border border-luxury-border sm:size-11" />
                <span>
                  <span className="block font-heading text-lg leading-tight tracking-wide sm:text-2xl">Reina Sophia</span>
                  <span className="mt-0.5 block text-xs uppercase tracking-widest text-muted-foreground">Residences</span>
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{legalEntityName}</p>
              <p className="mt-1 text-xs text-muted-foreground">{registeredAddress}</p>
              <div className="mt-2 flex flex-wrap gap-x-5">
                <a href={`tel:${contactPhone}`} className="inline-flex min-h-11 items-center text-xs text-muted-foreground">{contactPhoneDisplay}</a>
                <a href={`mailto:${privacyEmail}`} className="inline-flex min-h-11 items-center text-xs text-muted-foreground">{privacyEmail}</a>
              </div>
            </div>
            <nav aria-label="Legal and website links" className="flex flex-wrap items-start gap-x-5 gap-y-1 self-start text-xs text-muted-foreground sm:max-w-xs sm:justify-end">
              <Link href="/privacy-policy" prefetch={false} className="inline-flex min-h-11 items-center underline underline-offset-4">Privacy Policy</Link>
              <Link href="/cookie-policy" prefetch={false} className="inline-flex min-h-11 items-center underline underline-offset-4">Cookie Policy</Link>
              <Link href="/terms-of-use" prefetch={false} className="inline-flex min-h-11 items-center underline underline-offset-4">Terms of Use</Link>
              <CookieSettingsButton className="inline-flex min-h-11 items-center underline underline-offset-4" />
              <Link href="/" prefetch={false} className="inline-flex min-h-11 items-center gap-2">View Full Website <ArrowRight className="size-3.5" aria-hidden="true" /></Link>
            </nav>
          </div>
          <p className="mt-5 border-t border-luxury-border pt-5 text-xs text-muted-foreground">© 2026 {brandName}. All rights reserved.</p>
        </footer>
        <MobileFunnelActions whatsappHref={whatsappHref} />
      </FunnelProvider>
    </div>
  )
}
