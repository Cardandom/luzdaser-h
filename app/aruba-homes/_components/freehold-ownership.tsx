import { LandPlot, MapPin, Sun } from "lucide-react"

const differentiators = [
  { title: "Freehold / Eigendom", copy: "Residences on private freehold land, rather than government leasehold.", icon: LandPlot },
  { title: "Southern Caribbean Location", copy: "Aruba sits on the southern fringe of the hurricane belt.", icon: Sun },
  { title: "Central Paradera", copy: "Everyday conveniences are close to home.", icon: MapPin },
]

export function FreeholdOwnership() {
  return (
    <section data-funnel-block="ownership" aria-labelledby="ownership-title" className="bg-foreground text-white">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
        <p className="text-xs font-medium uppercase tracking-widest text-luxury-gold-soft">Why Reina Sophia</p>
        <h2 id="ownership-title" className="mt-2 font-heading text-3xl leading-tight sm:text-4xl">Own the home. <span className="italic text-luxury-gold-soft">Own the land.</span></h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3 sm:gap-6">
          {differentiators.map(({ title, copy, icon: Icon }) => (
            <div key={title} className="flex items-start gap-3 border-t border-white/15 pt-3">
              <Icon className="mt-0.5 size-5 shrink-0 text-luxury-gold-soft" aria-hidden="true" />
              <div><h3 className="text-sm font-semibold">{title}</h3><p className="mt-1 text-xs leading-5 text-white/75">{copy}</p></div>
            </div>
          ))}
        </div>
        <a href="#buying-in-aruba" data-funnel-event="funnel_primary_cta" data-cta-location="ownership" className="mt-3 inline-flex min-h-11 items-center gap-2 text-xs font-semibold underline decoration-luxury-gold-soft underline-offset-4">
          How buying property in Aruba works <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  )
}
