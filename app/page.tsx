import { BenefitsSection } from "@/components/site/benefits-section"
import { ContactSection } from "@/components/site/contact-section"
import { CtaSection } from "@/components/site/cta-section"
import { FeaturedProjectsSection } from "@/components/site/featured-projects-section"
import { GallerySection } from "@/components/site/gallery-section"
import { HeroSection } from "@/components/site/hero-section"
import { HomeExperienceLoader } from "@/components/site/home-experience-loader"
import { HomeVideoLoadCoordinator } from "@/components/site/home-video-load-coordinator"
import { ScrollVideoRevealSection } from "@/components/ScrollVideoRevealSection"
import { SiteFooter } from "@/components/site/site-footer"

const homeScrollVideoProjectIds = ["oliver", "luca"] as const

export default function HomePage() {
  return (
    <main className="relative isolate overflow-hidden pb-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-linear-to-b from-luxury-gold/15 to-transparent"
      />

      <HomeExperienceLoader />
      <HomeVideoLoadCoordinator projectIds={homeScrollVideoProjectIds} />
      <HeroSection />
      <GallerySection />
      {/* Scroll-controlled video reveal section. Move this block if you want it elsewhere. */}
      <ScrollVideoRevealSection
        id="oliver"
        videoSrc="/videos/scroll-oliver-desktop-g4-hq-v2.mp4"
        mobileVideoSrc="/videos/scroll-oliver-mobile-g8-hq-v3.mp4"
        revealOnHashNavigation
      />
      <ScrollVideoRevealSection
        id="luca"
        projectSlug="luca-boutique"
        posterSrc="/lucaPhotoMain.webp"
        videoSrc="/videos/scroll-luca-desktop-g4-hq-v2.mp4"
        mobileVideoSrc="/videos/scroll-luca-mobile-g8-hq-v3.mp4"
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
