const services = [
  {
    num: "01",
    title: "House washing",
    sub: "Siding, soffits, gutters",
    body: "Low-pressure soft wash with a surfactant blend that lifts mildew, algae, and bug debris without driving water behind the siding. We rinse plants, not just buildings.",
  },
  {
    num: "02",
    title: "Roof cleaning",
    sub: "Shingles, tile, metal",
    body: "Black streaks are gloeocapsa magma — a living organism feeding on shingle limestone. We kill it with a soft chemical wash, no high pressure on your roof, ever.",
  },
  {
    num: "03",
    title: "Concrete & driveways",
    sub: "Sealcoat-safe surface cleaning",
    body: "Surface cleaner + hot rinse for even flatwork results. No zebra-striping. Oil-stain pre-treatment included on every drive.",
  },
  {
    num: "04",
    title: "Deck & fence",
    sub: "Vinyl, composite, cedar",
    body: "We meter pressure by material — vinyl fences and composite boards get the same care as wood, just different recipes. Brightener available on natural wood.",
  },
  {
    num: "05",
    title: "Fleet & equipment",
    sub: "Box trucks, trailers, machinery",
    body: "On-site rinses for landscapers, contractors, and small fleets. Quick turnarounds, biodegradable degreasers, and we tip out our wash water responsibly.",
  },
]

export function Services() {
  return (
    <section id="services" className="relative bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <header className="lg:col-span-4">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/70">
              What we wash
            </p>
            <h2 className="mt-3 font-display text-4xl font-black uppercase leading-[0.95] tracking-[-0.01em] text-foreground sm:text-5xl">
              Five things
              <br />
              we do
              <br />
              <span className="text-primary/35">all day,</span>
              <br />
              every day.
            </h2>
            <p className="mt-6 max-w-sm font-sans text-base leading-relaxed text-muted-foreground">
              If your house, drive, deck, or fleet picked up a winter's worth of New Jersey,
              we probably wash one of these every Tuesday. Not in the list?{" "}
              <a href="#contact" className="font-semibold text-primary underline decoration-accent decoration-2 underline-offset-4">
                Ask anyway.
              </a>
            </p>
          </header>

          <ul className="lg:col-span-8">
            {services.map((s, idx) => (
              <li
                key={s.num}
                className={
                  "group grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-t border-border py-7 transition-colors hover:bg-secondary/40 sm:grid-cols-[auto_1fr_auto] sm:py-8 " +
                  (idx === services.length - 1 ? "border-b" : "")
                }
              >
                <span className="font-display text-2xl font-bold text-accent sm:text-3xl">
                  {s.num}
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-xl font-bold uppercase tracking-tight text-foreground sm:text-2xl">
                    {s.title}
                  </h3>
                  <p className="mt-1 font-sans text-sm text-muted-foreground sm:text-[15px]">
                    {s.sub}
                  </p>
                  <p className="mt-3 max-w-2xl font-sans text-[15px] leading-relaxed text-foreground/75">
                    {s.body}
                  </p>
                </div>
                <span className="hidden self-center font-sans text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground sm:block">
                  →
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
