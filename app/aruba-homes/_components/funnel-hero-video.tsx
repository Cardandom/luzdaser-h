import { preload } from "react-dom"

const posterSrc = "/videos/reina-sophia-funnel-hero-v3-poster.webp"

export function FunnelHeroVideo() {
  preload(posterSrc, { as: "image", fetchPriority: "high" })

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={posterSrc}
      width={960}
      height={640}
      aria-label="Architectural render of the Oliver residence with its private pool, Reina Sophia Residences"
      className="absolute inset-0 size-full object-cover"
    >
      <source
        src="/videos/reina-sophia-funnel-hero-mobile.mp4"
        type="video/mp4"
        media="(prefers-reduced-motion: no-preference) and (max-width: 767px)"
      />
      <source
        src="/videos/reina-sophia-funnel-hero-desktop.mp4"
        type="video/mp4"
        media="(prefers-reduced-motion: no-preference) and (min-width: 768px)"
      />
    </video>
  )
}
