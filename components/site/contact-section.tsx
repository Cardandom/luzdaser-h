import { Mail, MapPin, Phone } from "lucide-react"

import { ContactForm } from "@/components/site/contact-form"
import { SectionHeading } from "@/components/site/section-heading"

export function ContactSection() {
  return (
    <section id="contacts" className="luxury-shell mt-6 sm:mt-8">
      <div className="luxury-panel rounded-3xl px-5 py-8 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="Contacts"
          title="Turn visual inspiration into a real investment opportunity"
          description="Tell us what you're looking for and our team will follow up with project information and personalized guidance."
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <ContactForm />

          <aside className="luxury-card relative overflow-hidden rounded-3xl p-5 sm:p-6">
            <div className="absolute inset-0 bg-linear-to-br from-white via-stone-50 to-stone-100" />
            <div className="relative flex h-full min-h-80 flex-col justify-between gap-6">
              <div className="self-start rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-foreground/70">
                Personalized advisory
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-black/10 bg-white p-4">
                  <p className="text-xs uppercase tracking-widest text-foreground/70">
                    Project Information
                  </p>
                  <p className="mt-2 font-heading text-2xl text-luxury-gold-ink">
                    Models &amp; Availability
                  </p>
                  <p className="mt-2 text-sm text-foreground/70">
                    Request current project details and available residence options.
                  </p>
                </div>
                <div className="rounded-3xl border border-black/10 bg-white p-4">
                  <p className="text-xs uppercase tracking-widest text-foreground/70">
                    Personalized Support
                  </p>
                  <p className="mt-2 font-heading text-2xl text-luxury-gold-ink">
                    Next Steps
                  </p>
                  <p className="mt-2 text-sm text-foreground/70">
                    Receive guidance on the purchasing process and verified commercial
                    terms.
                  </p>
                </div>
              </div>

              <div className="space-y-3 rounded-3xl border border-black/10 bg-white p-4 text-sm text-foreground/75">
                <div className="flex items-center gap-3">
                  <Phone className="size-4 text-luxury-gold" aria-hidden="true" />
                  <a href="tel:+2976992222" className="text-inherit no-underline">
                    +297 6992222
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="size-4 text-luxury-gold" aria-hidden="true" />
                  <a
                    href="mailto:info@jbsseco.com"
                    className="text-inherit no-underline"
                  >
                    info@jbsseco.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="size-4 text-luxury-gold" aria-hidden="true" />
                  <span>Paradera 184, Aruba</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
