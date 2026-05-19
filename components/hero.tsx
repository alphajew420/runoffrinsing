import { ArrowRight, MapPin } from "lucide-react"

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-ink">
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/siding-side-after.jpg"
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-90"
        aria-hidden="true"
      >
        <source src="/hero.mp4" type="video/mp4" />
        <source src="/hero.mov" type="video/quicktime" />
      </video>

      {/* Vignette + gradient — pulls focus to the headline without flattening the video */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/55 to-ink/30"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_40%,transparent_0%,hsl(var(--ink)/.4)_100%)]"
        aria-hidden="true"
      />

      <div className="mx-auto grid min-h-[92vh] max-w-7xl grid-cols-1 items-end gap-12 px-5 pb-16 pt-36 lg:grid-cols-12 lg:px-8 lg:pb-24 lg:pt-40">
        <div className="lg:col-span-8">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3 py-1.5 backdrop-blur-sm">
            <MapPin className="h-3.5 w-3.5 text-accent" />
            <span className="font-sans text-xs font-medium uppercase tracking-[0.18em] text-primary-foreground/90">
              Family-run · All of New Jersey
            </span>
          </div>

          <h1 className="font-display text-[44px] font-black uppercase leading-[0.92] tracking-[-0.01em] text-primary-foreground sm:text-6xl lg:text-[88px]">
            We take dirt
            <br />
            off houses
            <br />
            <span className="text-accent">so they look</span>
            <br />
            like houses again.
          </h1>

          <p className="mt-7 max-w-xl font-sans text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
            Soft-wash for siding and roofs. Power-wash for concrete and decks.
            Done by people who actually answer the phone.
          </p>

          <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
            <a
              href="#contact"
              className="group inline-flex items-center gap-3 rounded-sm bg-accent px-6 py-4 font-display text-sm font-bold uppercase tracking-[0.14em] text-accent-foreground transition-transform hover:translate-y-[-1px]"
            >
              Get your free quote
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#work"
              className="font-sans text-sm font-semibold text-primary-foreground/90 underline decoration-accent decoration-2 underline-offset-[6px] hover:text-primary-foreground"
            >
              See before & after →
            </a>
          </div>
        </div>

        {/* Lower-right meta strip */}
        <aside className="lg:col-span-4 lg:pb-2">
          <dl className="grid grid-cols-3 gap-4 border-t border-primary-foreground/20 pt-6 lg:grid-cols-1 lg:gap-6 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <Stat k="Insured" v="$2M GL" />
            <Stat k="Booked through" v="Saturdays" />
            <Stat k="Avg. quote" v="< 24 hrs" />
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
