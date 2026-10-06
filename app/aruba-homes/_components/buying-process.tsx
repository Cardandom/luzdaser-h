import { Building2, FileCheck2, FileText, Globe, House, LockKeyhole } from "lucide-react"

const purchaseSteps = [
  { title: "Choose your residence", copy: "Explore Luca, Oliver or Audrey.", icon: House },
  { title: "Confirm pricing", copy: "Review current prices and residence options.", icon: FileText },
  { title: "Secure your residence", copy: "Reserve your selected property under the agreement.", icon: LockKeyhole },
  { title: "Construction payments", copy: "Payments follow agreed project milestones.", icon: Building2 },
  { title: "Ownership transfer", copy: "Transfer through an authorized Aruba civil-law notary.", icon: FileCheck2 },
]

export function BuyingProcess() {
  return (
    <section id="buying-in-aruba" data-funnel-block="purchase-process" aria-labelledby="buying-title" className="bg-stone-100">
      <div className="mx-auto max-w-7xl px-5 py-9 sm:px-8 sm:py-12 lg:px-10">
        <p className="luxury-eyebrow">Buying in Aruba</p>
        <h2 id="buying-title" className="luxury-title-sm mt-3 max-w-3xl">A Clear Path to Owning Your Home in Aruba</h2>
        <ol className="relative mt-7 ml-3 grid gap-0 border-l border-luxury-gold/50 sm:grid-cols-2 sm:gap-x-5 lg:ml-0 lg:grid-cols-5 lg:gap-4 lg:border-0">
          {purchaseSteps.map(({ title, copy, icon: Icon }, index) => (
            <li key={title} className="relative flex gap-4 pb-6 pl-6 last:pb-0 lg:flex-col lg:gap-3 lg:border-t lg:border-luxury-border lg:pb-0 lg:pl-0 lg:pt-4">
              <span aria-hidden="true" className="absolute top-0 left-0 -ml-[1.94rem] inline-flex size-8 items-center justify-center rounded-full border border-luxury-gold/60 bg-stone-100 text-xs font-semibold text-luxury-gold-ink lg:static lg:ml-0">0{index + 1}</span>
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-luxury-gold-ink shadow-sm lg:size-12">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-heading text-lg leading-tight">{title}</h3>
                <p className="mt-1 text-sm leading-5 text-muted-foreground">{copy}</p>
              </div>
            </li>
          ))}
        </ol>
        <details className="group mt-6 border-t border-luxury-border pt-3">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-luxury-gold-ink [&::-webkit-details-marker]:hidden">
            Important purchase information
            <span aria-hidden="true" className="text-luxury-gold-ink transition-transform group-open:rotate-45 motion-reduce:transition-none">+</span>
          </summary>
          <ul className="grid gap-2 pb-2 text-sm leading-6 text-muted-foreground md:grid-cols-2">
            <li>An initial non-refundable reservation deposit is required to secure the selected property under the applicable agreement.</li>
            <li>Construction payments follow project milestones as established in the purchase agreement.</li>
            <li>Applicable transfer taxes, notarial, banking and closing costs are separate from the listed property price.</li>
            <li>Current price list and residence availability can change; request the latest information and applicable commercial terms.</li>
          </ul>
        </details>
        <div className="mt-4 flex items-start gap-3 border-t border-luxury-border pt-3">
          <Globe className="mt-0.5 size-5 shrink-0 text-luxury-gold-ink" aria-hidden="true" />
          <div>
            <h3 className="text-sm font-semibold leading-5">Buying from outside Aruba?</h3>
            <p className="text-xs leading-4 text-muted-foreground">Guidance for local and international buyers: current availability, project documentation and next steps.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
