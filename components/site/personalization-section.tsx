import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { commercialPricing, formatAwg } from "@/lib/commercial-pricing"

const steps = [
  { number: "01", title: "Choose Your Home", copy: "Luca · Oliver · Audrey" },
  { number: "02", title: "Own Your Land", copy: "Freehold / Eigendom ownership in Reina Sophia Residences." },
  { number: "03", title: "Personalize Your Residence", copy: "Pool · Kitchen · Terrace · Closets · Appliances" },
]

export function PersonalizationSection() {
  return (
    <section className="bg-stone-100 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <p className="luxury-eyebrow">Your Residence</p>
        <h2 className="mt-4 max-w-3xl font-heading text-4xl leading-tight sm:text-5xl">A Home Built Around You.</h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">Choose your residence. Own your land. Personalize the details that shape your lifestyle.</p>
        <div className="mt-10 grid gap-8 border-t border-luxury-border pt-8 md:grid-cols-3">
          {steps.map((step) => <div key={step.number}>
            <span className="text-xs font-semibold tracking-widest text-luxury-gold-ink">{step.number}</span>
            <h3 className="mt-3 font-heading text-2xl">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.copy}</p>
          </div>)}
        </div>
        <div className="mt-10 grid gap-4 border-y border-luxury-border py-6 sm:grid-cols-3">
          {Object.values(commercialPricing).map((model) => <div key={model.name}>
            <p className="font-heading text-xl">{model.name}</p>
            <p className="mt-1 text-sm font-semibold text-luxury-gold-ink">From {formatAwg(model.startingPackage)}</p>
          </div>)}
        </div>
        <p className="mt-4 max-w-2xl text-xs leading-5 text-muted-foreground">Starting prices combine the base residence with the lowest currently listed compatible lot. Optional upgrades available. Renders may show optional upgrades.</p>
        <Link href="/aruba-homes#build-your-home" className="mt-6 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-linear-to-b from-luxury-gold-soft to-luxury-gold px-6 py-3 text-sm font-semibold text-stone-950">Build Your Residence <ArrowRight className="size-4" aria-hidden="true" /></Link>
      </div>
    </section>
  )
}
