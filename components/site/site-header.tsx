import Image from "next/image"

const navItems = [
  { label: "Projects", href: "#projects" },
  { label: "Gallery", href: "#gallery" },
  { label: "Project Progress", href: "#project-progress" },
  { label: "Contacts", href: "#contacts" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[rgba(255,255,255,0.88)] backdrop-blur-xl">
      <div className="luxury-shell">
        <div className="flex flex-col gap-4 py-4 sm:gap-3 md:flex-row md:items-center md:justify-between">
          <a href="#home" className="flex items-center gap-3">
            <span className="inline-flex size-10 items-center justify-center overflow-hidden rounded-full border border-luxury-border bg-white">
              <Image
                src="/Logo_Icono_Dorado.png"
                alt=""
                width={40}
                height={40}
                className="size-full object-cover"
                aria-hidden="true"
              />
            </span>
            <span>
              <span className="block font-heading text-xl tracking-wide text-[#2B2B2B]">
                Reina Sophia Residences
              </span>
              <span className="block text-[10px] uppercase tracking-[0.34em] text-[#2B2B2B]/55">
                Aruba Investment
              </span>
            </span>
          </a>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#2B2B2B]/72 md:justify-center">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="transition-colors hover:text-luxury-gold"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href="#contacts"
            className="inline-flex items-center justify-center rounded-full border border-luxury-border bg-white px-5 py-2.5 text-sm font-medium text-[#2B2B2B] transition hover:border-luxury-gold hover:text-luxury-gold"
          >
            Client Login
          </a>
        </div>
      </div>
    </header>
  )
}
