import { BeforeAfter } from "./before-after"

const jobs = [
  {
    slug: "siding-side",
    title: "Two-story vinyl, north exposure",
    location: "Morris County",
    body: "Mildew climbing up the north-facing siding from years of shade. Soft wash with a low-percentage SH solution, rinsed cold. Half a day on site.",
    aspect: "16 / 8",
  },
  {
    slug: "vinyl-fence",
    title: "Backyard vinyl privacy fence",
    location: "Bergen County",
    body: "Algae and pollen ground into the textured side of the panels. Hand-agitated the worst spots, then rinsed at low pressure to avoid driving water behind the caps.",
    aspect: "4 / 5",
  },
  {
    slug: "house-windows",
    title: "Soffit + dormer face",
    location: "Union County",
    body: "Streaking from a clogged gutter run. Cleaned the underside, hand-treated the gable, and walked the customer through the drip-edge issue we found while we were up there.",
    aspect: "4 / 5",
  },
  {
    slug: "siding-detail",
    title: "Side panel + brick base",
    location: "Essex County",
    body: "A close-up of the kind of result we look for: clean siding without etching the paint, brick still showing its texture, no spray-back streaks on the foundation.",
    aspect: "4 / 5",
  },
]

export function Work() {
  return (
    <section id="work" className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <header className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/70">
              The work
            </p>
            <h2 className="mt-3 font-display text-4xl font-black uppercase leading-[0.95] tracking-[-0.01em] text-foreground sm:text-5xl">
              Drag the slider.
              <br />
              <span className="text-primary/40">Watch it</span>{" "}
              <span className="text-primary">disappear.</span>
            </h2>
          </div>
          <p className="max-w-sm font-sans text-sm leading-relaxed text-muted-foreground">
            Every photo below is real — same day, same camera, same angle. No filters, no
            color-correction. Just before, and after a couple of hours with our crew.
          </p>
        </header>

        {/* Featured wide hero */}
        <div className="mt-14">
          <BeforeAfter
            beforeSrc={`/images/${jobs[0].slug}-before.jpg`}
            afterSrc={`/images/${jobs[0].slug}-after.jpg`}
            alt={jobs[0].title}
            aspect={jobs[0].aspect}
            initial={42}
          />
          <div className="mt-5 grid gap-x-10 gap-y-2 sm:grid-cols-[1fr_auto] sm:items-baseline">
            <h3 className="font-display text-xl font-bold uppercase tracking-tight text-foreground">
              {jobs[0].title}
            </h3>
            <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {jobs[0].location}
            </p>
            <p className="max-w-3xl font-sans text-[15px] leading-relaxed text-foreground/75 sm:col-span-2">
              {jobs[0].body}
            </p>
          </div>
        </div>

        {/* Three-up grid */}
        <div className="mt-20 grid gap-10 md:grid-cols-3 md:gap-7">
          {jobs.slice(1).map((j, i) => (
            <article key={j.slug}>
              <BeforeAfter
                beforeSrc={`/images/${j.slug}-before.jpg`}
                afterSrc={`/images/${j.slug}-after.jpg`}
                alt={j.title}
                aspect={j.aspect}
                initial={i === 0 ? 50 : i === 1 ? 38 : 62}
              />
              <div className="mt-4">
                <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {j.location}
                </p>
                <h3 className="mt-1 font-display text-base font-bold uppercase tracking-tight text-foreground">
                  {j.title}
                </h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-foreground/70">
                  {j.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
