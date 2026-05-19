export function Footer() {
  return (
    <footer className="bg-ink py-14 text-primary-foreground">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="" className="h-10 w-10 object-contain" aria-hidden="true" />
              <span className="font-display text-base font-extrabold uppercase tracking-[0.16em]">
                Run Off Rinsing LLC
              </span>
            </div>
            <p className="mt-4 max-w-xs font-sans text-sm leading-relaxed text-primary-foreground/65">
              Family-run soft- and pressure-washing. Serving homeowners across New Jersey.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:col-span-7 lg:grid-cols-3">
            <Col label="Visit">
              <a href="#work" className="block py-1 hover:text-accent">Our work</a>
              <a href="#services" className="block py-1 hover:text-accent">What we wash</a>
              <a href="#process" className="block py-1 hover:text-accent">How it works</a>
              <a href="#about" className="block py-1 hover:text-accent">About us</a>
            </Col>
            <Col label="Reach us">
              <a href="tel:+19735551212" className="block py-1 hover:text-accent">(973) 555-1212</a>
              <a href="mailto:hello@runoffrinsing.com" className="block py-1 hover:text-accent">hello@runoffrinsing.com</a>
              <a href="#contact" className="block py-1 hover:text-accent">Quote form →</a>
            </Col>
            <Col label="Hours">
              <p className="py-1 text-primary-foreground/65">Mon – Fri · 7a – 7p</p>
              <p className="py-1 text-primary-foreground/65">Sat · 8a – 4p</p>
              <p className="py-1 text-primary-foreground/65">Sun · text us anyway</p>
            </Col>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-primary-foreground/15 pt-6 sm:flex-row sm:items-center">
          <p className="font-sans text-xs text-primary-foreground/55">
            © {new Date().getFullYear()} Run Off Rinsing LLC · Licensed & insured in NJ
          </p>
          <p className="font-sans text-xs text-primary-foreground/45">
            Built around here, by us.
          </p>
        </div>
      </div>
    </footer>
  )
}

function Col({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
        {label}
      </p>
      <div className="mt-3 space-y-0.5 font-sans text-sm text-primary-foreground/85">
        {children}
      </div>
    </div>
  )
}
