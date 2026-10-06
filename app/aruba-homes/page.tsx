import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowDown, ArrowRight, BedDouble, MapPin, MessageCircleMore, ShieldCheck, Waves } from "lucide-react"

import { BuyerPackVisual } from "./_components/buyer-pack-visual"
import { BuyingProcess } from "./_components/buying-process"
import { FreeholdOwnership } from "./_components/freehold-ownership"
import { CookieSettingsButton } from "@/components/site/cookie-settings-button"
import { ConstructionProgressSection } from "@/components/site/construction-progress-section"
import { LifestyleBento } from "./_components/lifestyle-bento"
import { LocationStory } from "./_components/location-story"
import { contactPhone, contactPhoneDisplay, getWhatsAppUrl } from "@/lib/contact-config"
import { brandName, legalEntityName, privacyEmail, registeredAddress } from "@/lib/legal-config"
import { getProjectBySlug, priceListNote } from "@/lib/projects"
import { FunnelForm, FunnelProvider, VideoConsultationRequest } from "./_components/funnel-interactions"
import { MobileFunnelActions } from "./_components/mobile-funnel-actions"
import { FunnelHeroVideo } from "./_components/funnel-hero-video"
import { ResidenceShowcase } from "./_components/residence-showcase"
import styles from "./funnel.module.css"

const whatsappHref = getWhatsAppUrl(
  "Hi, I'm interested in Reina Sophia Residences. I'd like to receive current pricing and availability.",
)

const residences = (["luca", "oliver", "audrey"] as const).map((slug) => {
  const project = getProjectBySlug(slug)
  if (!project) throw new Error(`Missing residence: ${slug}`)
  return project
})

const projectPillars = [
  { label: "Freehold Land", icon: ShieldCheck },
  { label: "Private Pool", icon: Waves },
  { label: "2–4 Bedrooms", icon: BedDouble },
  { label: "Central Aruba", icon: MapPin },
]

const primaryButtonClass = "inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-linear-to-b from-luxury-gold-soft to-luxury-gold px-6 py-3 text-sm font-semibold text-stone-950 shadow-sm transition-shadow hover:shadow-md motion-reduce:transition-none"

export const metadata: Metadata = {
  title: "Homes in Aruba | Reina Sophia Residences",
  description:
    "Explore freehold homes with private pools at Reina Sophia Residences in Paradera, central Aruba. Request the current Buyer Pack, pricing and availability.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/aruba-homes" },
  openGraph: {
    type: "website",
    url: "/aruba-homes",
    title: "Own the home. Own the land. | Reina Sophia Residences",
    description: "Freehold homes with private pools in Paradera, central Aruba. Request current prices, floorplans and availability.",
    images: [{ url: "/front3DOliver.webp", alt: "Architectural render of the Oliver residence at sunset" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Own the home. Own the land. | Reina Sophia Residences",
    description: "Freehold homes with private pools in Paradera, central Aruba. Request current prices, floorplans and availability.",
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
          <section id="funnel-hero" data-funnel-block="hero" aria-labelledby="hero-title" className="mx-auto grid max-w-7xl items-center gap-4 px-5 pt-4 pb-5 sm:gap-8 sm:px-8 sm:py-8 lg:grid-cols-12 lg:gap-10 lg:px-10">
            <figure className="relative order-1 aspect-square overflow-hidden rounded-3xl bg-stone-200 lg:order-2 lg:col-span-7 lg:aspect-4/3">
              <FunnelHeroVideo />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/80 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-white sm:p-8">
                <span className="rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">Paradera · Aruba</span>
              </figcaption>
            </figure>
            <div className="relative z-10 order-2 -mt-8 mx-2 rounded-3xl border border-luxury-border bg-white p-4 shadow-lg sm:mx-0 sm:p-6 lg:order-1 lg:col-span-5 lg:mt-0 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
              <p className="luxury-eyebrow">New Freehold Homes in Central Aruba</p>
              <h1 id="hero-title" className="mt-3 font-heading text-4xl leading-none tracking-tight sm:text-5xl lg:text-5xl xl:text-6xl">
                Own the home.<br /><span className="italic text-luxury-gold-ink">Own the land.</span>
              </h1>
              <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                Private residences in Paradera with freehold land, private pools and the privacy of a residential community in central Aruba.
              </p>
              <p className="mt-3 text-lg font-semibold text-foreground">{residences[0].price.replace(/^From /, "Homes from ")}</p>
              <div className="mt-3 flex flex-col items-start gap-1 sm:mt-4 sm:gap-2">
                <a href="#request-prices" data-funnel-event="funnel_primary_cta" data-cta-location="hero" className={`${primaryButtonClass} w-full sm:w-auto`}>
                  <span>Get Prices &amp; Availability</span> <ArrowDown className="size-4 shrink-0" aria-hidden="true" />
                </a>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" data-funnel-event="funnel_whatsapp_click" data-cta-location="hero" className="inline-flex min-h-11 w-full items-center justify-center gap-2 text-sm font-medium sm:w-auto sm:px-4">
                  <MessageCircleMore className="size-4 shrink-0 text-[#25D366]" aria-hidden="true" /> WhatsApp Us
                </a>
              </div>
            </div>
            <ul aria-label="Project at a glance" className="order-3 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-luxury-border pt-4 md:grid-cols-4 lg:col-span-12">
              {projectPillars.map(({ label, icon: Icon }) => <li key={label} className="flex items-center justify-center gap-2 text-xs leading-5 text-muted-foreground"><Icon className="size-4 shrink-0 text-luxury-gold-ink" aria-hidden="true" />{label}</li>)}
            </ul>
          </section>

          <section data-funnel-block="models" aria-labelledby="residences-title" className="bg-white py-8 sm:py-12">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <p className="luxury-eyebrow">The Residences</p>
                  <h2 id="residences-title" className="luxury-title-sm mt-3">Choose Your Residence</h2>
                </div>
                <p className="pb-1 text-xs text-muted-foreground lg:hidden">Swipe to compare <span aria-hidden="true">→</span></p>
              </div>
              <div aria-label="Residence cards. Scroll horizontally to compare." tabIndex={0} className="-mx-5 mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-luxury-gold-ink sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-0">
                {residences.map((project) => <ResidenceShowcase key={project.slug} project={project} />)}
              </div>
              <details className="group mt-4 border-t border-luxury-border pt-2">
                <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 text-xs font-medium text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-luxury-gold-ink [&::-webkit-details-marker]:hidden">
                  About prices &amp; current availability
                  <span aria-hidden="true" className="transition-transform group-open:rotate-45 motion-reduce:transition-none">+</span>
                </summary>
                <p className="pb-2 text-xs leading-5 text-muted-foreground">{priceListNote}</p>
              </details>
            </div>
          </section>

          <FreeholdOwnership />

          <section data-funnel-block="request" aria-labelledby="request-prices-title" className="bg-white">
            <div className="mx-auto grid max-w-7xl items-center gap-3 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-12 lg:gap-10 lg:px-10">
              <div className="lg:col-span-5"><BuyerPackVisual /></div>
              <div className="lg:col-span-7">
                <FunnelForm id="request-prices" submitLabel="Send Me the Buyer Pack" whatsappHref={whatsappHref} />
              </div>
            </div>
          </section>

          <BuyingProcess />

          <ConstructionProgressSection />

          <LocationStory />
          <LifestyleBento />

          <section data-funnel-block="consultation" aria-labelledby="consultation-title" className="bg-foreground text-white">
            <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
              <p className="text-xs font-medium uppercase tracking-widest text-luxury-gold-soft">Personal Guidance</p>
              <h2 id="consultation-title" className="mt-3 font-heading text-3xl leading-tight sm:text-4xl">Prefer to speak with someone first?</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">Schedule a private video consultation with the Reina Sophia team to discuss your options and next steps.</p>
              <ul aria-label="Topics for the consultation" className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/85 sm:text-sm">
                {["Residence Options", "Current Pricing", "Buying Process"].map((item) => <li key={item} className="flex items-center gap-2"><span aria-hidden="true" className="size-1.5 rounded-full bg-luxury-gold-soft" />{item}</li>)}
              </ul>
              <VideoConsultationRequest whatsappHref={whatsappHref} />
            </div>
          </section>

          <section id="funnel-closing" data-funnel-block="conversion" aria-labelledby="options-title" className="bg-white">
            <div className="mx-auto grid max-w-7xl gap-6 px-5 pt-10 pb-8 sm:px-8 lg:grid-cols-12 lg:items-center lg:px-10">
              <div className="lg:col-span-7">
                <h2 id="options-title" className="font-heading text-3xl leading-tight sm:text-4xl">Ready to Discover Your Options?</h2>
                <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">Request current pricing and availability for Reina Sophia Residences.</p>
              </div>
              <div className="flex flex-col gap-3 lg:col-span-5 lg:items-end">
                <a href="#request-prices" data-funnel-event="funnel_primary_cta" data-cta-location="conversion-banner" className={primaryButtonClass}>Get Prices &amp; Availability <ArrowRight className="size-4" aria-hidden="true" /></a>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" data-funnel-event="funnel_whatsapp_click" data-cta-location="conversion-banner" className="inline-flex min-h-11 items-center justify-center gap-2 px-5 text-sm text-foreground underline underline-offset-4"><MessageCircleMore className="size-4 text-[#25D366]" aria-hidden="true" />WhatsApp Us</a>
              </div>
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
