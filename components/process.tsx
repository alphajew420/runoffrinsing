type ProcessStep = { label: string; body: string }

const DEFAULTS: ProcessStep[] = [
  {
    label: "You text us a photo",
    body:
      "Drop us a line with a couple of pictures. Most quotes come back same-day, often within an hour during business hours.",
  },
  {
    label: "We pick a window",
    body:
      "We schedule by neighborhood, so we're already in the area on your day. You don't need to be home — outdoor spigots are all we need.",
  },
  {
    label: "We wash. You inspect.",
    body:
      "Two-person crew, in and out in a few hours for most homes. Walk-through before we pack the truck. If something's off, we fix it on the spot.",
  },
]

export function Process({ steps }: { steps?: ProcessStep[] | null }) {
  const items = steps && steps.length > 0 ? steps : DEFAULTS
  return (
    <section id="process" className="bg-ink py-24 text-primary-foreground lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
            How it works
          </p>
          <h2 className="mt-3 font-display text-4xl font-black uppercase leading-[0.95] tracking-[-0.01em] sm:text-5xl">
            Three steps.
            <br />
            <span className="text-accent">No back-and-forth.</span>
          </h2>
        </div>

        <ol className="mt-14 grid gap-px overflow-hidden rounded-sm bg-primary-foreground/15 lg:grid-cols-3">
          {items.map((s, idx) => (
            <li
              key={`${idx}-${s.label}`}
              className="relative bg-ink p-8 transition-colors hover:bg-ink/80 lg:p-10"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-display text-5xl font-black text-accent lg:text-6xl">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="h-px w-10 bg-primary-foreground/30" aria-hidden="true" />
              </div>
              <h3 className="mt-6 font-display text-2xl font-bold uppercase tracking-tight">
                {s.label}
              </h3>
              <p className="mt-3 font-sans text-[15px] leading-relaxed text-primary-foreground/75">
                {s.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
