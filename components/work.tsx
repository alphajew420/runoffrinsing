import { BeforeAfter } from "./before-after"
import { getMediaUrl } from "@/lib/payload"

type Job = {
  id?: string
  title: string
  location: string
  body: string
  beforeSrc: string
  afterSrc: string
  aspect: string
  initial: number
  featured?: boolean
}

const DEFAULTS: Job[] = [
  {
    title: "Two-story vinyl, north exposure",
    location: "Morris County",
    body:
      "Mildew climbing up the north-facing siding from years of shade. Soft wash with a low-percentage SH solution, rinsed cold. Half a day on site.",
    beforeSrc: "/images/siding-side-before.jpg",
    afterSrc: "/images/siding-side-after.jpg",
    aspect: "16 / 8",
    initial: 42,
    featured: true,
  },
  {
    title: "Backyard vinyl privacy fence",
    location: "Bergen County",
    body:
      "Algae and pollen ground into the textured side of the panels. Hand-agitated the worst spots, then rinsed at low pressure to avoid driving water behind the caps.",
    beforeSrc: "/images/vinyl-fence-before.jpg",
    afterSrc: "/images/vinyl-fence-after.jpg",
    aspect: "4 / 5",
    initial: 50,
  },
  {
    title: "Soffit + dormer face",
    location: "Union County",
    body:
      "Streaking from a clogged gutter run. Cleaned the underside, hand-treated the gable, and walked the customer through the drip-edge issue we found while we were up there.",
    beforeSrc: "/images/house-windows-before.jpg",
    afterSrc: "/images/house-windows-after.jpg",
    aspect: "4 / 5",
    initial: 38,
  },
  {
    title: "Side panel + brick base",
    location: "Essex County",
    body:
      "A close-up of the kind of result we look for: clean siding without etching the paint, brick still showing its texture, no spray-back streaks on the foundation.",
    beforeSrc: "/images/siding-detail-before.jpg",
    afterSrc: "/images/siding-detail-after.jpg",
    aspect: "4 / 5",
    initial: 62,
  },
]

type CmsJob = {
  id: string
  title: string
  location: string
  body: string
  beforeImage: unknown
  afterImage: unknown
  aspect?: string | null
  initialSliderPosition?: number | null
  featured?: boolean | null
  sortOrder?: number | null
}

function mapCms(j: CmsJob): Job | null {
  const beforeSrc = getMediaUrl(j.beforeImage)
  const afterSrc = getMediaUrl(j.afterImage)
  if (!beforeSrc || !afterSrc) return null
  return {
    id: j.id,
    title: j.title,
    location: j.location,
    body: j.body,
    beforeSrc,
    afterSrc,
    aspect: (j.aspect || "4/5").replace("/", " / "),
    initial: j.initialSliderPosition ?? 50,
    featured: !!j.featured,
  }
}

export function Work({ jobs }: { jobs?: CmsJob[] | null }) {
  let list: Job[]
  if (jobs && jobs.length > 0) {
    const mapped = jobs.map(mapCms).filter((j): j is Job => j !== null)
    list = mapped.length > 0 ? mapped : DEFAULTS
  } else {
    list = DEFAULTS
  }

  const featured = list.find((j) => j.featured) ?? list[0]
  const rest = list.filter((j) => j !== featured)

  return (
    <section id="work" className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <header className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/70">
              The work
            </p>
            <h2 className="mt-3 font-display text-4xl font-black uppercase leading-[0.95] tracking-[-0.01em] text-foreground sm:text-5xl">
              Drag the sponge.
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

        {featured ? (
          <div className="mt-14">
            <BeforeAfter
              beforeSrc={featured.beforeSrc}
              afterSrc={featured.afterSrc}
              alt={featured.title}
              aspect={featured.aspect}
              initial={featured.initial}
            />
            <div className="mt-5 grid gap-x-10 gap-y-2 sm:grid-cols-[1fr_auto] sm:items-baseline">
              <h3 className="font-display text-xl font-bold uppercase tracking-tight text-foreground">
                {featured.title}
              </h3>
              <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {featured.location}
              </p>
              <p className="max-w-3xl font-sans text-[15px] leading-relaxed text-foreground/75 sm:col-span-2">
                {featured.body}
              </p>
            </div>
          </div>
        ) : null}

        {rest.length > 0 ? (
          <div className="mt-20 grid gap-10 md:grid-cols-3 md:gap-7">
            {rest.slice(0, 3).map((j, idx) => (
              <article key={j.id ?? idx}>
                <BeforeAfter
                  beforeSrc={j.beforeSrc}
                  afterSrc={j.afterSrc}
                  alt={j.title}
                  aspect={j.aspect}
                  initial={j.initial}
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
        ) : null}
      </div>
    </section>
  )
}
