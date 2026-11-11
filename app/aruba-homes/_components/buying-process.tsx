"use client"

import { useEffect, useRef } from "react"
import { ArrowRight, Building2, FileCheck2, FileText, Globe, House, LockKeyhole } from "lucide-react"
import styles from "./buying-process.module.css"

const purchaseSteps = [
  { title: "Choose Your Residence", copy: "Luca, Oliver or Audrey.", icon: House },
  { title: "Confirm Current Pricing", copy: "Review the residence, lot and available upgrades.", icon: FileText },
  { title: "Secure Your Residence", copy: "Reserve the selected property under the agreed terms.", icon: LockKeyhole },
  { title: "Construction Payments", copy: "Payments follow the agreed construction milestones.", icon: Building2 },
  { title: "Property Transfer", copy: "Transfer through an authorized Aruba civil-law notary.", icon: FileCheck2 },
]

const paymentItems = [
  { label: "Land", value: "10%", copy: "Initial land payment within 10 consecutive days of signing the offer." },
  { label: "Construction", value: "10% + 20%", copy: "Security deposit + initial payment upon signing the construction contract." },
  { label: "Progress", value: "By Milestones", copy: "Remaining payments follow physical progress and agreed project milestones." },
]

export function BuyingProcess() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let disposed = false
    let generation = 0
    let cleanup = () => {}

    async function setup() {
      const current = ++generation
      cleanup()
      cleanup = () => {}
      if (reducedMotion.matches) return

      try {
        const [gsapModule, scrollTriggerModule] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
        if (disposed || current !== generation || reducedMotion.matches || !section) return
        const gsap = gsapModule.gsap
        const ScrollTrigger = scrollTriggerModule.ScrollTrigger
        gsap.registerPlugin(ScrollTrigger)

        const media = gsap.matchMedia(section)
        media.add({ desktop: "(min-width: 1024px)", mobile: "(max-width: 1023px)" }, (context) => {
          const desktop = Boolean(context.conditions?.desktop)
          const journey = section.querySelector<HTMLOListElement>("[data-journey]")
          const rail = section.querySelector<HTMLElement>("[data-progress]")
          const steps = gsap.utils.toArray<HTMLElement>("[data-step]", section)
          if (!journey || !rail || steps.length === 0) return

          section.dataset.motion = "enabled"
          const setProgress = (progress: number) => {
            gsap.set(rail, desktop ? { scaleX: progress } : { scaleY: progress })
            const active = Math.min(steps.length - 1, Math.floor(progress * steps.length))
            steps.forEach((step, index) => { step.dataset.state = index < active ? "past" : index === active ? "active" : "future" })
          }
          setProgress(0)
          ScrollTrigger.create({
            trigger: desktop ? section : journey,
            start: "top 75%",
            end: desktop ? "bottom 75%" : "bottom 50%",
            onUpdate: (self) => setProgress(self.progress),
            onRefresh: (self) => setProgress(self.progress),
          })

          // Leave content already in view visible when the module loads late.
          const reveal = (target: Element | null, vars: gsap.TweenVars) => {
            if (!target || target.getBoundingClientRect().top < window.innerHeight) return
            gsap.from(target, { ...vars, duration: 0.55, ease: "power2.out", scrollTrigger: { trigger: target, start: "top 92%", once: true } })
          }
          reveal(section.querySelector("[data-heading]"), { autoAlpha: 0, y: 20 })
          if (desktop) {
            reveal(journey, { autoAlpha: 0, y: 12 })
            if (journey.getBoundingClientRect().top >= window.innerHeight) {
              gsap.from(rail.parentElement, { scaleX: 0, transformOrigin: "left", duration: 0.7, ease: "power2.out", scrollTrigger: { trigger: journey, start: "top 92%", once: true } })
              gsap.from(steps.map((step) => step.querySelector("[data-step-content]")), { autoAlpha: 0, y: 10, stagger: 0.09, duration: 0.45, ease: "power2.out", scrollTrigger: { trigger: journey, start: "top 92%", once: true } })
              gsap.from(steps.map((step) => step.querySelector("[data-step-icon]")), { scale: 0.85, stagger: 0.09, duration: 0.45, ease: "power2.out", scrollTrigger: { trigger: journey, start: "top 92%", once: true } })
            }
          } else {
            steps.forEach((step) => reveal(step.querySelector("[data-step-content]"), { autoAlpha: 0, x: 16 }))
          }
          const payments = gsap.utils.toArray<HTMLElement>("[data-payment]", section)
          const paymentBlock = section.querySelector<HTMLElement>("[data-payments]")
          if (paymentBlock && paymentBlock.getBoundingClientRect().top >= window.innerHeight) {
            gsap.from(payments, { autoAlpha: 0, scale: 0.92, stagger: 0.1, duration: 0.45, ease: "power2.out", scrollTrigger: { trigger: paymentBlock, start: "top 90%", once: true } })
            gsap.from(payments.map((payment) => payment.querySelector("[data-payment-line]")), { scaleX: 0, transformOrigin: "left", stagger: 0.1, duration: 0.5, ease: "power2.out", scrollTrigger: { trigger: paymentBlock, start: "top 90%", once: true } })
          }
          return () => {
            delete section.dataset.motion
            steps.forEach((step) => delete step.dataset.state)
            rail.style.removeProperty("transform")
          }
        })
        cleanup = () => media.revert()
      } catch {
        // The complete journey remains readable if animation fails to load.
      }
    }
    void setup()
    reducedMotion.addEventListener("change", setup)
    return () => {
      disposed = true
      generation++
      reducedMotion.removeEventListener("change", setup)
      cleanup()
    }
  }, [])

  return (
    <section ref={sectionRef} id="buying-in-aruba" data-funnel-block="purchase-process" aria-labelledby="buying-title" className={`${styles.section} bg-stone-100`}>
      <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12 lg:px-10">
        <div data-heading>
          <p className="luxury-eyebrow">Buying in Aruba</p>
          <h2 id="buying-title" className="luxury-title-sm mt-2 max-w-3xl">A Clear Path to Owning Your Home in Aruba</h2>
          <p className="mt-2 text-sm text-muted-foreground">Five clear steps from choosing your residence to ownership.</p>
        </div>

        <div className="relative mt-7 lg:mt-9">
          <span aria-hidden="true" className={styles.rail}><span data-progress className={styles.progress} /></span>
          <ol data-journey className="relative grid gap-0 lg:grid-cols-5 lg:gap-3">
          {purchaseSteps.map(({ title, copy, icon: Icon }, index) => (
            <li key={title} data-step className={styles.step}>
              <span aria-hidden="true" className={styles.node}>{String(index + 1).padStart(2, "0")}</span>
              <div data-step-content className={styles.stepCard}>
                <span data-step-icon className={styles.stepIcon}><Icon className="size-5" aria-hidden="true" /></span>
                <div><h3 className="font-heading text-lg leading-tight">{title}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{copy}</p></div>
              </div>
            </li>
          ))}
          </ol>
        </div>

        <div data-payments className="mt-7 rounded-3xl border border-luxury-border bg-foreground p-5 text-white sm:p-6 lg:mt-8">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-luxury-gold-soft">Payment Structure</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3 sm:gap-0">
            {paymentItems.map((item) => <div key={item.label} data-payment className="border-t border-white/15 pt-3 sm:border-t-0 sm:border-l sm:px-5 sm:pt-0 sm:first:border-l-0 sm:first:pl-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/70">{item.label}</p>
              <p className="mt-1 font-heading text-3xl leading-tight text-luxury-gold-soft sm:text-4xl">{item.value}</p>
              <span data-payment-line aria-hidden="true" className="mt-2 block h-px w-10 bg-luxury-gold" />
              <p className="mt-2 max-w-xs text-xs leading-5 text-white/75">{item.copy}</p>
            </div>)}
          </div>
          <p className="mt-4 border-t border-white/15 pt-3 text-xs leading-5 text-white/65">Payment terms are subject to the definitive purchase and construction agreements.</p>
        </div>

        <details className="group mt-3 rounded-2xl border border-luxury-border bg-white">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-luxury-gold-ink [&::-webkit-details-marker]:hidden">
            <span><span className="block text-sm font-semibold">Important Purchase Details</span><span className="mt-0.5 block text-xs text-muted-foreground">Taxes, closing costs, availability and definitive agreements.</span></span>
            <span aria-hidden="true" className="text-xl text-luxury-gold-ink transition-transform group-open:rotate-45 motion-reduce:transition-none">+</span>
          </summary>
          <ul className="grid gap-2 border-t border-luxury-border px-5 py-4 text-sm leading-6 text-muted-foreground md:grid-cols-2">
            <li>Land and construction payments follow the terms of the definitive agreements.</li>
            <li>Applicable transfer taxes, notarial, banking and closing costs are separate from the listed property price.</li>
            <li>Current price list and residence availability can change; request the latest information and applicable commercial terms.</li>
          </ul>
        </details>

        <div className="mt-3 flex flex-wrap items-center gap-3 rounded-2xl border border-luxury-border bg-stone-50 px-5 py-4">
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-luxury-gold/50 text-luxury-gold-ink"><Globe className="size-5" aria-hidden="true" /></span>
          <div className="min-w-0 flex-1"><h3 className="text-xs font-semibold uppercase tracking-wider">Buying from abroad?</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">Guidance for local and international buyers on availability, project documentation and next steps.</p></div>
          <a href="#request-prices" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-luxury-gold-ink underline underline-offset-4">Request Buyer Pack <ArrowRight className="size-4" aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  )
}
