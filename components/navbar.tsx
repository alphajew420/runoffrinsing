"use client"

import { useEffect, useState } from "react"
import { Phone } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/work", label: "All work" },
  { href: "/#services", label: "What we wash" },
  { href: "/#process", label: "How it works" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Get a quote" },
]

type NavbarContact = { phone?: string | null } | null | undefined

export function Navbar({ contact }: { contact?: NavbarContact }) {
  const phone = contact?.phone || "(609) 664-6258"
  const telHref = `tel:${phone.replace(/[^+\d]/g, "")}`
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-background/85 backdrop-blur-md shadow-[0_1px_0_0_hsl(var(--border))]"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
        <a href="#top" className="flex items-center gap-3" aria-label="Run Off Rinsing home">
          <img
            src="/logo.png"
            alt=""
            className="h-12 w-12 object-contain"
            aria-hidden="true"
          />
          <span
            className={cn(
              "hidden font-display text-[15px] font-extrabold uppercase leading-none tracking-[0.14em] sm:block",
              scrolled ? "text-primary" : "text-primary-foreground",
            )}
          >
            Run Off Rinsing
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.slice(0, -1).map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "font-sans text-sm font-medium transition-colors",
                scrolled
                  ? "text-foreground/70 hover:text-primary"
                  : "text-primary-foreground/80 hover:text-primary-foreground",
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={telHref}
            className={cn(
              "hidden items-center gap-2 rounded-full px-3 py-2 font-sans text-sm font-semibold transition-colors md:inline-flex",
              scrolled
                ? "text-primary hover:bg-primary/5"
                : "text-primary-foreground hover:bg-primary-foreground/10",
            )}
          >
            <Phone className="h-4 w-4" />
            {phone}
          </a>
          <a
            href="/#contact"
            className="inline-flex items-center rounded-sm bg-primary px-4 py-2.5 font-display text-[13px] font-bold uppercase tracking-[0.12em] text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Free quote
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
            className={cn(
              "ml-1 inline-flex h-10 w-10 items-center justify-center rounded-sm lg:hidden",
              scrolled ? "text-primary" : "text-primary-foreground",
            )}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              {open ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </>
              ) : (
                <>
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="13" x2="20" y2="13" />
                  <line x1="4" y1="19" x2="20" y2="19" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-3">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-sm px-3 py-2.5 font-sans text-base text-foreground/80 hover:bg-secondary"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  )
}
