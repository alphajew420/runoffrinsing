type HeadlinePart = { text: string; muted?: boolean | null }
type Fact = { label: string; value: string }
type AboutData = {
  eyebrow?: string | null
  headlineParts?: HeadlinePart[] | null
  paragraphs?: Array<{ body: string }> | null
  facts?: Fact[] | null
}

const DEFAULT_HEADLINE: HeadlinePart[] = [
  { text: "We started this" },
  { text: "because we" },
  { text: "got tired of" },
  { text: "looking", muted: true },
  { text: "at our", muted: true },
  { text: "own house.", muted: true },
]

const DEFAULT_PARAGRAPHS = [
  {
    body:
      "Run Off Rinsing is family-run out of north-central New Jersey. One truck, one trailer, and two people who care more than they probably should about whether the soffit by your garage downspout has any algae left on it.",
  },
  {
    body:
      "We don't subcontract. We don't show up with a stranger. We pull up, knock, walk the property with you, and leave when it actually looks done — not when the clock says it should be.",
  },
  {
    body:
      "Every job uses pH-balanced soaps that won't burn your hostas. Every truck has its own water tank, so we don't run yours up. And every quote is in writing — no day-of surprises.",
  },
]

const DEFAULT_FACTS: Fact[] = [
  { label: "Founded", value: "2023" },
  { label: "Crew", value: "Family of 2" },
  { label: "Insurance", value: "$2M GL" },
  { label: "Service area", value: "All of NJ" },
  { label: "Water", value: "Bring our own" },
  { label: "Reviews", value: "5.0 / Google" },
]

export function About({ about }: { about?: AboutData | null }) {
  const eyebrow = about?.eyebrow || "About"
  const headline =
    about?.headlineParts && about.headlineParts.length > 0
      ? about.headlineParts
      : DEFAULT_HEADLINE
  const paragraphs =
    about?.paragraphs && about.paragraphs.length > 0
      ? about.paragraphs
      : DEFAULT_PARAGRAPHS
  const facts = about?.facts && about.facts.length > 0 ? about.facts : DEFAULT_FACTS

  return (
    <section id="about" className="bg-secondary/40 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          <aside className="lg:col-span-5">
            <div className="sticky top-28">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/70">
                {eyebrow}
              </p>
              <h2 className="mt-3 font-display text-4xl font-black uppercase leading-[0.95] tracking-[-0.01em] text-foreground sm:text-5xl">
                {headline.map((part, idx) => (
                  <span key={idx}>
                    <span className={part.muted ? "text-primary/40" : undefined}>
                      {part.text}
                    </span>
                    {idx < headline.length - 1 ? <br /> : null}
                  </span>
                ))}
              </h2>
            </div>
          </aside>

          <div className="space-y-6 lg:col-span-7 lg:pt-2">
            {paragraphs.map((p, idx) => (
              <p
                key={idx}
                className={
                  idx === 0
                    ? "font-sans text-lg leading-relaxed text-foreground/85"
                    : "font-sans text-[17px] leading-relaxed text-foreground/75"
                }
              >
                {p.body}
              </p>
            ))}

            <dl className="mt-10 grid grid-cols-2 gap-y-7 gap-x-8 border-t border-border pt-10 sm:grid-cols-3">
              {facts.map((f, idx) => (
                <div key={idx}>
                  <dt className="font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {f.label}
                  </dt>
                  <dd className="mt-1 font-display text-xl font-bold tracking-tight text-foreground">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
