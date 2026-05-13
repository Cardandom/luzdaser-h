import { Clock3, MapPin, Percent, Route } from "lucide-react"

import { SectionHeading } from "@/components/site/section-heading"

const milestones = [
  {
    icon: Percent,
    value: "30%",
    label: "Initial reservation",
  },
  {
    icon: Clock3,
    value: "5 min.",
    label: "From the beach",
  },
  {
    icon: Route,
    value: "15 min.",
    label: "From restaurants",
  },
]

export function PaymentSection() {
  return (
    <section id="project-progress" className="luxury-shell mt-6 sm:mt-8">
      <div className="luxury-panel rounded-[32px] px-5 py-8 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="Project Progress"
          title="A simple, visual structure that is easy to compare on any device"
          description="The mockup composition uses a data strip and a visual map. Here we solve it with an informative card that adapts well to mobile and tablet without losing hierarchy."
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          <div className="luxury-card relative overflow-hidden rounded-[28px] p-5 sm:p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(220,181,109,0.16),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(43,43,43,0.05),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.94),rgba(247,247,243,0.98))]" />
            <div className="relative flex flex-col gap-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <span className="inline-flex size-12 items-center justify-center rounded-full border border-luxury-border bg-white text-luxury-gold">
                    <MapPin className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[#2B2B2B]/50">
                      Project location
                    </p>
                    <p className="mt-1 font-heading text-2xl text-[#2B2B2B]">Palm Beach, Aruba</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-luxury-border bg-white px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#2B2B2B]/50">
                    Suggested entry
                  </p>
                  <p className="mt-1 font-heading text-3xl text-luxury-gold">30%</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {milestones.map((item) => {
                  const Icon = item.icon

                  return (
                    <div
                      key={item.label}
                      className="rounded-[22px] border border-black/10 bg-white p-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="inline-flex size-10 items-center justify-center rounded-full border border-luxury-border bg-white text-luxury-gold">
                          <Icon className="size-4" aria-hidden="true" />
                        </span>
                        <div>
                          <p className="font-heading text-2xl text-[#2B2B2B]">{item.value}</p>
                          <p className="text-sm text-[#2B2B2B]/70">{item.label}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="luxury-card rounded-[28px] p-5 sm:p-6">
              <p className="luxury-eyebrow">Quick summary</p>
              <p className="mt-4 text-lg leading-relaxed text-[#2B2B2B]/75">
                The user should understand in seconds what they get, how much they
                contribute initially, and how close the main points of interest really
                are.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="luxury-card rounded-[24px] p-5">
                <p className="text-sm uppercase tracking-[0.28em] text-[#2B2B2B]/50">
                  Advantage
                </p>
                <p className="mt-3 font-heading text-3xl text-luxury-gold">Exemption</p>
                <p className="mt-1 text-sm text-[#2B2B2B]/70">
                  Potential tax benefits and a more efficient structure.
                </p>
              </div>

              <div className="luxury-card rounded-[24px] p-5">
                <p className="text-sm uppercase tracking-[0.28em] text-[#2B2B2B]/50">
                  Access
                </p>
                <p className="mt-3 font-heading text-3xl text-luxury-gold">Reservation</p>
                <p className="mt-1 text-sm text-[#2B2B2B]/70">
                  A clear initial reservation to make conversion easier.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
