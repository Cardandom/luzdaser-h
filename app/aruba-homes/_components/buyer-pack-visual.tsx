import { FileText, House } from "lucide-react"
import Image from "next/image"

const buyerPackPages = [
  { label: "PRICE LIST", icon: FileText, className: "top-2 -translate-x-full -rotate-6 sm:top-1/2 sm:-mt-8 sm:-translate-y-1/2" },
  { label: "AVAILABILITY", icon: House, className: "top-2 rotate-6 sm:top-1/2 sm:-mt-8 sm:-translate-y-1/2" },
  { label: "FLOORPLANS", icon: null, className: "top-8 z-10 -translate-x-1/2 sm:top-1/2 sm:-translate-y-1/2" },
]

export function BuyerPackVisual() {
  return (
    <div aria-label="Preview of the Reina Sophia Buyer Pack" className="relative mx-auto h-40 w-full max-w-sm sm:h-60 lg:h-72 lg:max-w-none">
      {buyerPackPages.map(({ label, icon: Icon, className }) => (
        <div key={label} className={`absolute left-1/2 flex h-24 w-32 flex-col gap-2 overflow-hidden rounded-xl border border-luxury-border bg-white p-2 shadow-lg sm:h-48 sm:w-40 sm:rounded-2xl sm:p-3 ${className}`}>
          <p className="shrink-0 text-center text-xs font-semibold leading-4 text-foreground">{label}</p>
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg bg-stone-50">
            {Icon ? (
              <div aria-hidden="true" className="flex h-full flex-col items-center justify-center gap-2 p-2 sm:gap-3">
                <Icon className="size-5 text-luxury-gold-ink sm:size-7" />
                <span className="h-1 w-3/4 rounded-full bg-stone-200" />
                <span className="h-1 w-1/2 rounded-full bg-stone-200" />
              </div>
            ) : (
              <Image src="/projects/oliver/oliver-site-plan.webp" alt="Oliver floorplan preview" fill sizes="160px" className="object-cover" />
            )}
          </div>
        </div>
      ))}
      <span className="absolute inset-x-0 bottom-0 z-20 mx-auto w-fit rounded-full border border-luxury-border bg-white px-3 py-1.5 text-xs font-medium tracking-wide text-muted-foreground shadow-sm sm:bottom-2 sm:px-4 sm:py-2">REINA SOPHIA · BUYER PACK</span>
    </div>
  )
}
