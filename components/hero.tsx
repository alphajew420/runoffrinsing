import { ArrowRight, MapPin } from "lucide-react"
import { getMediaUrl } from "@/lib/payload"

type Stat = { label: string; value: string }
type HeroData = {
  eyebrow?: string | null
  headlineLine1?: string | null
  headlineLine2?: string | null
  headlineAccentLine?: string | null
  headlineLine4?: string | null
  subheading?: string | null
  primaryCtaText?: string | null
  primaryCtaLink?: string | null
  secondaryCtaText?: string | null
  secondaryCtaLink?: string | null
  video?: unknown
  posterImage?: unknown
  stats?: Stat[] | null
}

const DEFAULT_STATS: Stat[] = [
  { label: "Insured", value: "$2M GL" },
  { label: "Booked through", value: "Saturdays" },
  { label: "Avg. quote", value: "< 24 hrs" },
]

export function Hero({ hero }: { hero?: HeroData | null }) {
  const eyebrow = hero?.eyebrow || "Family-run · All of New Jersey"
  const l1 = hero?.headlineLine1 || "We take dirt"
  const l2 = hero?.headlineLine2 || "off houses"
  const l3 = hero?.headlineAccentLine || "so they look"
  const l4 = hero?.headlineLine4 || "like houses again."
  const sub =
    hero?.subheading ||
    "Soft-wash for siding and roofs. Power-wash for concrete and decks. Done by people who actually answer the phone."
  const primaryText = hero?.primaryCtaText || "Get your free quote"
  const primaryLink = hero?.primaryCtaLink || "#contact"
  const secondaryText = hero?.secondaryCtaText || "See before & after →"
  const secondaryLink = hero?.secondaryCtaLink || "#work"
  const stats = hero?.stats && hero.stats.length > 0 ? hero.stats : DEFAULT_STATS

  const videoUrl = getMediaUrl(hero?.video) || "/hero.mp4"
  const posterUrl = getMediaUrl(hero?.posterImage) || "/images/siding-side-after.jpg"

  return (
    <section id="top" className="relative isolate overflow-hidden bg-ink">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={posterUrl}
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-90"
        aria-hidden="true"
      >
        <source src={videoUrl} type="video/mp4" />
        <source src="/hero.mov" type="video/quicktime" />
      </video>

      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/55 to-ink/30" aria-hidden="true" />
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_40%,transparent_0%,hsl(var(--ink)/.4)_100%)]"
        aria-hidden="true"
      />

      <div className="mx-auto grid min-h-[92vh] max-w-7xl grid-cols-1 items-end gap-12 px-5 pb-16 pt-36 lg:grid-cols-12 lg:px-8 lg:pb-24 lg:pt-40">
        <div className="lg:col-span-8">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3 py-1.5 backdrop-blur-sm">
            <MapPin className="h-3.5 w-3.5 text-accent" />
            <span className="font-sans text-xs font-medium uppercase tracking-[0.18em] text-primary-foreground/90">
              {eyebrow}
            </span>
          </div>

          <h1 className="font-display text-[44px] font-black uppercase leading-[0.92] tracking-[-0.01em] text-primary-foreground sm:text-6xl lg:text-[88px]">
            {l1}
            <br />
            {l2}
            <br />
            <span className="text-accent">{l3}</span>
            <br />
            {l4}
          </h1>

          <p className="mt-7 max-w-xl font-sans text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
            {sub}
          </p>

          <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
            <a
              href={primaryLink}
              className="group inline-flex items-center gap-3 rounded-sm bg-accent px-6 py-4 font-display text-sm font-bold uppercase tracking-[0.14em] text-accent-foreground transition-transform hover:translate-y-[-1px]"
            >
              {primaryText}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href={secondaryLink}
              className="font-sans text-sm font-semibold text-primary-foreground/90 underline decoration-accent decoration-2 underline-offset-[6px] hover:text-primary-foreground"
            >
              {secondaryText}
            </a>
          </div>
        </div>

        <aside className="lg:col-span-4 lg:pb-2">
          <dl className="grid grid-cols-3 gap-4 border-t border-primary-foreground/20 pt-6 lg:grid-cols-1 lg:gap-6 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            {stats.slice(0, 3).map((s, idx) => (
              <Stat key={idx} k={s.label} v={s.value} />
            ))}
          </dl>
        </aside>
      </div>
    </section>
  )
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="font-sans text-[11px] uppercase tracking-[0.18em] text-primary-foreground/55">
        {k}
      </dt>
      <dd className="mt-1 font-display text-xl font-bold text-primary-foreground">{v}</dd>
    </div>
  )
}
