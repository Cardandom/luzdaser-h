import { Gem, MapPin, ShieldCheck, Sparkles } from "lucide-react"

import { SectionHeading } from "@/components/site/section-heading"

const benefits = [
  {
    icon: Gem,
    title: "High-end design",
    description:
      "Refined interiors, premium finishes, and a visual style designed to attract an aspirational market.",
  },
  {
    icon: MapPin,
    title: "Strategic location",
    description:
      "Close to the beach, services, and tourist spots that support occupancy and long-term appreciation.",
  },
  {
    icon: ShieldCheck,
    title: "Secure asset",
    description:
      "A more stable investment structure, ideal for diversifying wealth with a long-term view.",
  },
]

export function BenefitsSection() {
  return (
    <section id="projects" className="luxury-shell">
      <div className="luxury-panel rounded-[32px] px-5 py-8 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="Projects"
          title="A proposal designed for those seeking presence, exclusivity, and performance"
          description="The mockup page combines visual aspiration with concrete data. This section turns that idea into a responsive and clear structure for desktop, tablet, and mobile."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon

            return (
              <article key={benefit.title} className="luxury-card rounded-[24px] p-5">
                <div className="flex items-start gap-4">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-luxury-border bg-white text-luxury-gold">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-heading text-2xl text-[#2B2B2B]">{benefit.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#2B2B2B]/70">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <div className="mt-6 flex flex-col gap-3 rounded-[24px] border border-luxury-border bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-10 items-center justify-center rounded-full border border-luxury-border bg-white text-luxury-gold">
              <Sparkles className="size-4" aria-hidden="true" />
            </span>
            <p className="text-sm text-[#2B2B2B]/75">
              The goal is for the user to understand the proposal in a few seconds,
              without losing the premium tone of the design.
            </p>
          </div>
          <a
            href="#project-progress"
            className="inline-flex items-center justify-center rounded-full border border-luxury-border px-5 py-2.5 text-sm font-medium text-[#2B2B2B] transition hover:border-luxury-gold hover:text-luxury-gold"
          >
            View project progress
          </a>
        </div>
      </div>
    </section>
  )
}
