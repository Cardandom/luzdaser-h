import { House, LandPlot, ShieldCheck } from "lucide-react"

const ownershipParts = [
  { label: "Home", icon: House },
  { operator: "+" },
  { label: "Land", icon: LandPlot },
  { operator: "=" },
  { label: "Eigendom", icon: ShieldCheck, note: "Freehold" },
]

export function FreeholdOwnership() {
  return (
    <section data-funnel-block="ownership" aria-labelledby="ownership-title" className="bg-foreground text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-7 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-2 lg:gap-14 lg:px-10 lg:py-14">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-luxury-gold-soft">Freehold Ownership</p>
          <h2 id="ownership-title" className="mt-3 font-heading text-3xl leading-tight sm:text-4xl">Own the home.<br /><span className="italic text-luxury-gold-soft">Own the land.</span></h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/75">Reina Sophia Residences offers Freehold (Eigendom) land ownership on private land rather than government leasehold.</p>
          <details className="group mt-4 max-w-xl border-t border-white/15 pt-3">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-luxury-gold-soft [&::-webkit-details-marker]:hidden">
              What does Freehold (Eigendom) mean?
              <span aria-hidden="true" className="text-luxury-gold-soft transition-transform group-open:rotate-45 motion-reduce:transition-none">+</span>
            </summary>
            <p className="pb-3 text-sm leading-6 text-white/70">Your residence stands on land that you own under private eigendom ownership, rather than government leasehold land.</p>
          </details>
          <a href="#buying-in-aruba" data-funnel-event="funnel_primary_cta" data-cta-location="ownership" className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline decoration-luxury-gold-soft underline-offset-4">
            How buying property in Aruba works <span aria-hidden="true">→</span>
          </a>
        </div>
        <div role="img" aria-label="Home and land together under Freehold Eigendom ownership" className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1 rounded-3xl border border-white/10 bg-white/5 p-3 sm:gap-3 sm:p-5">
          {ownershipParts.map((part) => {
            if ("operator" in part) {
              return <span key={part.operator} aria-hidden="true" className="text-lg text-luxury-gold-soft">{part.operator}</span>
            }

            const Icon = part.icon
            return (
              <div key={part.label} className="flex min-w-0 flex-col items-center gap-2 text-center">
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/10 text-luxury-gold-soft sm:size-16">
                  <Icon className="size-6 sm:size-8" aria-hidden="true" />
                </span>
                <span className="text-xs font-medium leading-tight sm:text-sm">{part.label}</span>
                {part.note && <span className="text-[0.6rem] leading-tight text-white/60 sm:text-xs">{part.note}</span>}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
