"use client"

import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { label: "Projects", href: "#featured-projects" },
  { label: "Gallery", href: "#gallery" },
  { label: "Location", href: "#location" },
  { label: "Project Progress", href: "#project-progress" },
  { label: "Contacts", href: "#contacts" },
]

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false)
      }
    }

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : ""

    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  const closeMenu = () => setIsMenuOpen(false)
  const isSolidHeader = isHovered || hasScrolled || isMenuOpen
  const getNavHref = (href: string) => (pathname === "/" ? href : `/${href}`)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b transition-colors duration-300 ${
        isSolidHeader ? "border-black/10 bg-white" : "border-transparent bg-transparent"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="luxury-shell relative">
        <div className="flex items-center justify-between gap-3 py-4 md:gap-6">
          <a
            href={getNavHref("#home")}
            className="flex items-center gap-3 transition-opacity hover:opacity-90"
            onClick={closeMenu}
          >
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
              <span className="block font-heading text-xl tracking-wide text-black">
                Reina Sophia Residences
              </span>
              <span className="block text-xs uppercase tracking-widest text-black/55">
                Aruba Investment
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-10 text-lg font-medium leading-none tracking-tight text-foreground drop-shadow-sm md:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={getNavHref(item.href)}
                className="transition-colors hover:text-luxury-gold"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/client-login"
              className="hidden items-center justify-center gap-2 rounded-full bg-linear-to-b from-luxury-gold-soft to-luxury-gold px-5 py-2.5 text-sm font-semibold text-stone-950 shadow-lg transition-transform hover:-translate-y-0.5 md:inline-flex"
            >
              Client Login
            </Link>

            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-full border border-luxury-border bg-white text-black transition hover:border-luxury-gold hover:text-luxury-gold md:hidden"
              aria-controls="site-mobile-menu"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              onClick={() => setIsMenuOpen((current) => !current)}
            >
              {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        <div
          id="site-mobile-menu"
          className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}
        >
          <div className="absolute inset-x-0 top-full mt-3 rounded-3xl border border-luxury-border bg-white p-4 shadow-2xl backdrop-blur-xl">
            <nav className="flex flex-col gap-2 text-sm text-black/75">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={getNavHref(item.href)}
                  className="rounded-2xl border border-transparent px-4 py-3 transition-colors hover:border-luxury-border hover:bg-stone-50 hover:text-luxury-gold"
                  onClick={closeMenu}
                >
                  {item.label}
                </a>
              ))}
              <Link
                href="/client-login"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-b from-luxury-gold-soft to-luxury-gold px-4 py-3 text-sm font-semibold text-stone-950 shadow-lg transition-transform hover:-translate-y-0.5"
                onClick={closeMenu}
              >
                Client Login
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
