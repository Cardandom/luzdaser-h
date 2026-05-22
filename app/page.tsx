import { BenefitsSection } from "@/components/site/benefits-section"
import { ContactSection } from "@/components/site/contact-section"
import { CtaSection } from "@/components/site/cta-section"
import { FeaturedProjectsSection } from "@/components/site/featured-projects-section"
import { GallerySection } from "@/components/site/gallery-section"
import { HeroSection } from "@/components/site/hero-section"
import { PaymentSection } from "@/components/site/payment-section"
import { SiteFooter } from "@/components/site/site-footer"

export default function HomePage() {
  return (
    <main className="relative isolate overflow-hidden pb-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-gradient-to-b from-luxury-gold/15 to-transparent"
      />

      <HeroSection />
      <GallerySection />
      <CtaSection />
      <FeaturedProjectsSection />
      <BenefitsSection />
      {/* <PaymentSection /> */}
      <ContactSection />
      <SiteFooter />
    </main>
  )
}
