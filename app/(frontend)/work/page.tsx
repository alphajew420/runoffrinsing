import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { getPayload, getMediaUrl } from "@/lib/payload"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "All work — Past jobs across New Jersey | Run Off Rinsing",
  description:
    "Photos and writeups from every pressure-washing and soft-wash job we've taken on around New Jersey. Real houses, real driveways, real before-and-afters.",
}

const SERVICE_LABELS: Record<string, string> = {
  "house-washing": "House washing",
  "roof-cleaning": "Roof cleaning",
  "concrete": "Concrete",
  "deck-fence": "Deck / fence",
  "fleet": "Fleet",
  "other": "Other",
}

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    })
  } catch {
    return ""
  }
}

export default async function WorkArchivePage() {
  let posts: any[] = []
  let cmsAvailable = false
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: "past-jobs",
      where: { status: { equals: "published" } },
      sort: "-date",
      limit: 100,
    })
    posts = result.docs
    cmsAvailable = true
  } catch {
    // CMS unreachable — render empty state below
  }

  return (
    <>
      {/* Header */}
      <section className="bg-ink pt-36 pb-20 text-primary-foreground lg:pt-44 lg:pb-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
            All work
          </p>
          <h1 className="mt-3 font-display text-5xl font-black uppercase leading-[0.92] tracking-[-0.01em] sm:text-6xl lg:text-7xl">
            Every house
            <br />
            we've washed.
          </h1>
          <p className="mt-7 max-w-2xl font-sans text-base leading-relaxed text-primary-foreground/75 sm:text-lg">
            Each post below is a real job — town, date, what we ran into, and a stack of
            before/after photos. Browse around if you're shopping for someone in your
            neighborhood.
          </p>
        </div>
      </section>

      {/* Archive */}
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          {posts.length === 0 ? (
            <EmptyState cmsAvailable={cmsAvailable} />
          ) : (
            <ul className="grid gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => {
                const img = getMediaUrl(p.featuredImage)
                const serviceLabel = p.serviceType ? SERVICE_LABELS[p.serviceType] : null
                return (
                  <li key={p.id}>
                    <Link href={`/work/${p.slug}`} className="group block">
                      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-secondary ring-1 ring-ink/5">
                        {img ? (
                          <img
                            src={img}
                            alt={p.title}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center font-display text-3xl font-black text-primary/15">
                            Run Off
                          </div>
                        )}
                        {serviceLabel ? (
                          <span className="absolute left-3 top-3 rounded-sm bg-background/95 px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                            {serviceLabel}
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-4">
                        <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                          {p.location}
                          {p.date ? ` · ${formatDate(p.date)}` : ""}
                        </p>
                        <h2 className="mt-1 font-display text-lg font-bold uppercase tracking-tight text-foreground group-hover:text-primary/80">
                          {p.title}
                        </h2>
                        <p className="mt-2 line-clamp-3 font-sans text-sm leading-relaxed text-foreground/70">
                          {p.summary}
                        </p>
                        <span className="mt-3 inline-flex items-center gap-1 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                          Read it
                          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}

function EmptyState({ cmsAvailable }: { cmsAvailable: boolean }) {
  return (
    <div className="mx-auto max-w-xl rounded-sm border border-dashed border-border bg-secondary/30 p-10 text-center">
      <h2 className="font-display text-2xl font-black uppercase tracking-tight text-foreground">
        Nothing posted yet.
      </h2>
      <p className="mt-3 font-sans text-sm text-muted-foreground">
        {cmsAvailable
          ? "New jobs land here every week — check back soon."
          : "We're updating the archive. Try again in a minute."}
      </p>
      <Link
        href="/#contact"
        className="mt-6 inline-flex items-center rounded-sm bg-primary px-5 py-3 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-primary-foreground"
      >
        Get a quote anyway
      </Link>
    </div>
  )
}
