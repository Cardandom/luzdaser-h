import Image from "next/image"

const projects = [
  {
    title: "Lucas Deluxe",
    price: "$280,000 USD",
    picture: "/LucaStandard.webp",
    objectPosition: "center center",
  },
  {
    title: "Lucas Premium",
    price: "$320,000 USD",
    picture: "/LucaPremium.webp",
    objectPosition: "center center",
  },
  {
    title: "Oliver Premium",
    price: "$350,000 USD",
    picture: "/Oliver.webp",
    objectPosition: "center center",
  },
]

export function FeaturedProjectsSection() {
  return (
    <section id="featured-projects" className="luxury-shell mt-6 sm:mt-8">
      <div className="rounded-[32px] border border-luxury-border bg-white px-4 py-10 shadow-[0_18px_40px_rgba(43,43,43,0.08)] sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-center font-heading text-[clamp(1.7rem,3.2vw,2.9rem)] leading-tight text-[#2B2B2B]">
            Featured Projects
          </p>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.title}
                className="overflow-hidden rounded-[26px] border border-black/10 bg-white shadow-[0_16px_32px_rgba(43,43,43,0.08)]"
              >
                <div className="relative aspect-[1.08] overflow-hidden">
                  <Image
                    src={project.picture}
                    alt={project.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover"
                    style={{ objectPosition: project.objectPosition }}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.08))]" />
                </div>

                <div className="space-y-3 px-5 py-5 sm:px-6">
                  <div>
                    <p className="font-heading text-[clamp(1.45rem,2.4vw,2rem)] leading-tight text-[#2B2B2B]">
                      {project.title}
                    </p>
                  </div>

                  <p className="text-lg text-[#2B2B2B]">
                    From{" "}
                    <span className="font-heading text-xl text-luxury-gold">
                      {project.price}
                    </span>
                  </p>

                  <a
                    href="#contacts"
                    className="inline-flex h-11 items-center justify-center rounded-full bg-[linear-gradient(180deg,#f4ddb0,#c58f3c)] px-6 text-sm font-semibold text-[#151007] shadow-[0_14px_28px_rgba(220,181,109,0.32)] transition-transform hover:-translate-y-0.5"
                  >
                    View more
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
