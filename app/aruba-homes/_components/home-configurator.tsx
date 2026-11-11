"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { commercialPricing, emptyUpgrades, formatAwg, getConfiguration, type KitchenChoice, type ResidenceSlug, type UpgradeSelection } from "@/lib/commercial-pricing"
import { useResidence } from "./funnel-interactions"

const models: ResidenceSlug[] = ["luca", "oliver", "audrey"]

export function HomeConfigurator() {
  const { residence, selectResidence, setConfiguration } = useResidence()
  const [selection, setSelection] = useState<UpgradeSelection>(emptyUpgrades)
  const slug = (residence?.toLowerCase() ?? "luca") as ResidenceSlug
  const pricing = commercialPricing[slug]
  const configuration = getConfiguration(slug, selection)

  function updateSelection(next: UpgradeSelection) {
    setSelection(next)
    setConfiguration(null)
  }

  const options = [
    { key: "pool", label: "Private Pool", price: pricing.pool },
    { key: "appliances", label: "Appliance Set", price: pricing.appliances },
    { key: "terrace", label: "Covered Terrace", price: pricing.terrace },
    { key: "closets", label: "Custom Closets", price: pricing.closets },
  ] as const

  return (
    <section id="build-your-home" tabIndex={-1} aria-labelledby="build-title" className="scroll-mt-8 bg-stone-100 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <p className="luxury-eyebrow">Make It Yours</p>
        <h2 id="build-title" className="luxury-title-sm mt-3">Build Your Reina Sophia</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">Start with your residence and personalize the features that matter to you.</p>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <fieldset className="rounded-3xl border border-luxury-border bg-white p-5 sm:p-6">
              <legend className="sr-only">Choose your residence</legend>
              <h3 className="font-heading text-xl">01 · Choose Your Residence</h3>
              <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
                {models.map((model) => <label key={model} className={`cursor-pointer rounded-xl border px-3 py-3 text-center text-sm font-semibold transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-luxury-gold-ink ${slug === model ? "border-luxury-gold bg-luxury-gold-soft/30" : "border-luxury-border hover:bg-stone-50"}`}>
                  <input className="sr-only" type="radio" name="residence-model" value={model} checked={slug === model} onChange={() => selectResidence(commercialPricing[model].name)} />
                  {commercialPricing[model].name}
                </label>)}
              </div>
              <p className="mt-5 text-xs uppercase tracking-wider text-muted-foreground">Starting package</p>
              <p className="mt-1 font-heading text-2xl">{formatAwg(pricing.startingPackage)}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">Based on the lowest currently listed compatible lot and the base home configuration.</p>
            </fieldset>
            <fieldset className="rounded-3xl border border-luxury-border bg-white p-5 sm:p-6">
              <legend className="sr-only">Personalize your home</legend>
              <h3 className="font-heading text-xl">02 · Personalize Your Home</h3>
              <div className="mt-4 grid gap-2">
                <label className="grid gap-2 rounded-xl border border-luxury-border p-4 text-sm font-medium">
                  Kitchen
                  <select className="luxury-input min-h-11 w-full text-sm" value={selection.kitchen} onChange={(event) => {
                    const kitchen = event.target.value as KitchenChoice
                    updateSelection({ ...selection, kitchen, appliances: kitchen === "fullKitchen" ? false : selection.appliances })
                  }}>
                    <option value="none">Base / none</option>
                    <option value="standardKitchen">Standard Kitchen · + {formatAwg(pricing.standardKitchen)}</option>
                    <option value="fullKitchen">Full Integrated Kitchen · + {formatAwg(pricing.fullKitchen)}</option>
                  </select>
                  <span className="text-xs font-normal text-muted-foreground">Full Integrated Kitchen includes appliances.</span>
                </label>
                {options.map(({ key, label, price }) => {
                  const disabled = key === "appliances" && selection.kitchen === "fullKitchen"
                  return <label key={key} className={`flex items-center justify-between gap-3 rounded-xl border border-luxury-border p-4 text-sm ${disabled ? "opacity-50" : "cursor-pointer hover:bg-stone-50"}`}>
                    <span className="flex items-center gap-3"><input type="checkbox" className="size-4 accent-stone-800" checked={selection[key]} disabled={disabled} onChange={(event) => updateSelection({ ...selection, [key]: event.target.checked })} />{label}</span>
                    <span className="shrink-0 font-semibold">+ {formatAwg(price)}</span>
                  </label>
                })}
              </div>
            </fieldset>
          </div>
          <div className="h-fit rounded-3xl bg-foreground p-6 text-white lg:sticky lg:top-6">
            <p className="text-xs uppercase tracking-widest text-luxury-gold-soft">Your Residence</p>
            <h3 className="mt-3 font-heading text-2xl">{pricing.name}</h3>
            <p className="mt-2 text-sm leading-6 text-white/70">{configuration.upgrades.map((upgrade) => upgrade.label).join(" · ") || "Base home + freehold land"}</p>
            <div className="mt-6 border-t border-white/20 pt-5" aria-live="polite">
              <p className="text-xs uppercase tracking-wider text-white/70">Estimated starting configuration</p>
              <p className="mt-2 font-heading text-3xl">{formatAwg(configuration.total)}</p>
            </div>
            <p className="mt-3 text-xs leading-5 text-white/70">Final pricing depends on selected lot, availability, specifications and the definitive purchase documentation.</p>
            <a href="#request-prices" onClick={() => { if (!residence) selectResidence(pricing.name); setConfiguration(configuration) }} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-linear-to-b from-luxury-gold-soft to-luxury-gold px-5 py-3 text-sm font-semibold text-stone-950">Get My Personalized Offer <ArrowRight className="size-4" aria-hidden="true" /></a>
          </div>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Renders may show optional upgrades.</p>
      </div>
    </section>
  )
}
