import { Mail, MapPin, Phone } from "lucide-react"

import { SectionHeading } from "@/components/site/section-heading"

export function ContactSection() {
  return (
    <section id="contacts" className="luxury-shell mt-6 sm:mt-8">
      <div className="luxury-panel rounded-3xl px-5 py-8 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="Contacts"
          title="Turn visual inspiration into a real investment opportunity"
          description="This section closes the journey with a clear form, a high-impact card, and visual accessibility on small and medium screens."
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <form className="luxury-card rounded-3xl p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm text-foreground/75">
                Name
                <input className="luxury-input" placeholder="Your name" />
              </label>
              <label className="grid gap-2 text-sm text-foreground/75">
                Phone
                <input className="luxury-input" placeholder="+297 000 0000" />
              </label>
              <label className="grid gap-2 text-sm text-foreground/75">
                Email
                <input className="luxury-input" placeholder="name@example.com" />
              </label>
              <label className="grid gap-2 text-sm text-foreground/75">
                City
                <input className="luxury-input" placeholder="Your city" />
              </label>
              <label className="grid gap-2 text-sm text-foreground/75 sm:col-span-2">
                Comments
                <textarea
                  className="luxury-input min-h-36 resize-y"
                  placeholder="Tell us what kind of villa you are interested in"
                />
              </label>
            </div>

            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-foreground/60">
                We will respond with commercial information and personalized support.
              </p>
              <button
                type="button"
                className="inline-flex h-12 items-center justify-center rounded-full bg-linear-to-b from-luxury-gold-soft to-luxury-gold px-6 font-semibold text-stone-950 shadow-lg transition-transform hover:-translate-y-0.5"
              >
                Send request
              </button>
            </div>
          </form>

          <aside className="luxury-card relative overflow-hidden rounded-3xl p-5 sm:p-6">
            <div className="absolute inset-0 bg-linear-to-br from-white via-stone-50 to-stone-100" />
            <div className="relative flex h-full min-h-80 flex-col justify-between gap-6">
              <div className="self-start rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-foreground/70">
                Personalized advisory
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-black/10 bg-white p-4">
                  <p className="text-xs uppercase tracking-widest text-foreground/50">
                    Returns
                  </p>
                  <p className="mt-2 font-heading text-4xl text-luxury-gold">30%</p>
                  <p className="text-sm text-foreground/70">Of the initial deposit.</p>
                </div>
                <div className="rounded-3xl border border-black/10 bg-white p-4">
                  <p className="text-xs uppercase tracking-widest text-foreground/50">
                    Benefit
                  </p>
                  <p className="mt-2 font-heading text-4xl text-luxury-gold">100%</p>
                  <p className="text-sm text-foreground/70">Tax exemption.</p>
                </div>
              </div>

              <div className="space-y-3 rounded-3xl border border-black/10 bg-white p-4 text-sm text-foreground/75">
                <div className="flex items-center gap-3">
                  <Phone className="size-4 text-luxury-gold" aria-hidden="true" />
                  <span>+297 6992222</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="size-4 text-luxury-gold" aria-hidden="true" />
                  <span>info@jbsseco.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="size-4 text-luxury-gold" aria-hidden="true" />
                  <span>Palm Beach, Aruba</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
