import { BenefitsSection } from "@/components/site/benefits-section"
import { ContactSection } from "@/components/site/contact-section"
import { ConstructionProgressSection } from "@/components/site/construction-progress-section"
import { CtaSection } from "@/components/site/cta-section"
import { GallerySection } from "@/components/site/gallery-section"
import { HeroSection } from "@/components/site/hero-section"
import { HomeExperienceLoader } from "@/components/site/home-experience-loader"
import { HomeVideoLoadCoordinator } from "@/components/site/home-video-load-coordinator"
import { ScrollVideoRevealSection } from "@/components/ScrollVideoRevealSection"
import { SiteFooter } from "@/components/site/site-footer"

const homeScrollVideoProjectIds = ["oliver", "luca", "audrey"] as const

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
      {/* Static model cards on mobile; scroll-controlled video reveals on desktop. */}
      <ScrollVideoRevealSection
        id="oliver"
        mobilePrimaryImageAlt="Front view of the Oliver residence"
        mobileSecondaryImageAlt="Oliver residence patio and pool"
        mobileSecondaryImageSrc="/projects/oliver/oliver-front-view-02.webp"
        posterSrc="/front3DOliver.webp"
        videoSrc="/videos/scroll-oliver-desktop-g4-hq-v2.mp4"
        revealOnHashNavigation
      />
      <ScrollVideoRevealSection
        id="luca"
        mobilePrimaryImageAlt="Front view of the Luca residence"
        mobileSecondaryImageAlt="Luca residence exterior at sunset"
        mobileSecondaryImageSrc="/lucaSectionPhotp.webp"
        projectSlug="luca"
        posterSrc="/luca-scroll-poster-v4.jpg"
        videoSrc="/videos/scroll-luca-desktop-g4-hq-v4.mp4"
        revealOnHashNavigation
      />
      <ScrollVideoRevealSection
        id="audrey"
        mobilePrimaryImageAlt="Front view of the Audrey residence"
        mobileSecondaryImageAlt="Audrey residence exterior at sunset"
        mobileSecondaryImageSrc="/projects/audrey/audrey-evening-arrival.webp"
        projectSlug="audrey"
        posterSrc="/audrey-scroll-poster.jpg"
        videoSrc="/videos/scroll-audrey-desktop-g4-hq-v1.mp4"
        revealOnHashNavigation
      />
      <CtaSection />
      <BenefitsSection />
      <ConstructionProgressSection />
      <ContactSection />
      <SiteFooter />
    </main>
  )
}
