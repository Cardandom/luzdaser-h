import { BenefitsSection } from "@/components/site/benefits-section"
import { ContactSection } from "@/components/site/contact-section"
import { CtaSection } from "@/components/site/cta-section"
import { FeaturedProjectsSection } from "@/components/site/featured-projects-section"
import { GallerySection } from "@/components/site/gallery-section"
import { HeroSection } from "@/components/site/hero-section"
import { ScrollVideoRevealSection } from "@/components/ScrollVideoRevealSection"
import { SiteFooter } from "@/components/site/site-footer"

export default function HomePage() {
  return (
    <main className="relative isolate overflow-hidden pb-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-linear-to-b from-luxury-gold/15 to-transparent"
      />

      <HeroSection />
      <GallerySection />
      {/* Scroll-controlled video reveal section. Move this block if you want it elsewhere. */}
      <ScrollVideoRevealSection id="oliver" revealOnHashNavigation />
      <ScrollVideoRevealSection
        id="luca"
        projectSlug="lucas-boutique"
        posterSrc="/lucaPhotoMain.webp"
        videoSrc="/videos/video_recortado_luca.mp4"
        mobileVideoSrc="/videos/scroll-luca-mobile-g4-hq-v2.mp4"
        revealOnHashNavigation
      />
      <CtaSection />
      <FeaturedProjectsSection />
      <BenefitsSection />
      <ContactSection />
      <SiteFooter />
    </main>
  )
}
