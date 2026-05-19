export function About() {
  return (
    <section id="about" className="bg-secondary/40 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          <aside className="lg:col-span-5">
            <div className="sticky top-28">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/70">
                About
              </p>
              <h2 className="mt-3 font-display text-4xl font-black uppercase leading-[0.95] tracking-[-0.01em] text-foreground sm:text-5xl">
                We started this
                <br />
                because we
                <br />
                got tired of
                <br />
                <span className="text-primary/40">looking</span>
                <br />
                <span className="text-primary/40">at our</span>
                <br />
                <span className="text-primary/40">own house.</span>
              </h2>
            </div>
          </aside>

          <div className="space-y-6 lg:col-span-7 lg:pt-2">
            <p className="font-sans text-lg leading-relaxed text-foreground/85">
              Run Off Rinsing is family-run out of north-central New Jersey. One truck, one
              trailer, and two people who care more than they probably should about whether
              the soffit by your garage downspout has any algae left on it.
            </p>
            <p className="font-sans text-[17px] leading-relaxed text-foreground/75">
              We don't subcontract. We don't show up with a stranger. We pull up, knock,
              walk the property with you, and leave when it actually looks done — not when
              the clock says it should be.
            </p>
            <p className="font-sans text-[17px] leading-relaxed text-foreground/75">
              Every job uses pH-balanced soaps that won't burn your hostas. Every truck has
              its own water tank, so we don't run yours up. And every quote is in writing —
              no day-of surprises.
            </p>

            <dl className="mt-10 grid grid-cols-2 gap-y-7 gap-x-8 border-t border-border pt-10 sm:grid-cols-3">
              <Fact k="Founded" v="2023" />
              <Fact k="Crew" v="Family of 2" />
              <Fact k="Insurance" v="$2M GL" />
              <Fact k="Service area" v="All of NJ" />
              <Fact k="Water" v="Bring our own" />
              <Fact k="Reviews" v="5.0 / Google" />
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        {k}
      </dt>
      <dd className="mt-1 font-display text-xl font-bold tracking-tight text-foreground">
        {v}
      </dd>
    </div>
  )
}
