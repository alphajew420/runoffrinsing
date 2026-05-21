import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft, ArrowUpRight } from "lucide-react"
import { RichText } from "@payloadcms/richtext-lexical/react"
import { BeforeAfter } from "@/components/before-after"
import { getPayload, getMediaUrl } from "@/lib/payload"

const SITE = process.env.NEXT_PUBLIC_SERVER_URL || "https://runoffrinsing.com"

export const dynamic = "force-dynamic"

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
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  } catch {
    return ""
  }
}

async function findAllPosts() {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: "past-jobs",
      where: { status: { equals: "published" } },
      sort: "-date",
      limit: 200,
    })
    return result.docs as any[]
  } catch {
    return [] as any[]
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const posts = await findAllPosts()
  const post = posts.find((p) => p.slug === slug)
  if (!post) return { title: "Job not found" }

  const title =
    post.seoTitle || `${post.title} | Run Off Rinsing — pressure washing in NJ`
  const description = post.seoDescription || post.summary
  const ogImage = getMediaUrl(post.featuredImage)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
    },
  }
}

export default async function PastJobPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const posts = await findAllPosts()
  const idx = posts.findIndex((p) => p.slug === slug)
  const post = posts[idx]
  if (!post) notFound()

  const prev = idx > 0 ? posts[idx - 1] : null
  const next = idx < posts.length - 1 ? posts[idx + 1] : null

  const featuredUrl = getMediaUrl(post.featuredImage)
  const beforeUrl = getMediaUrl(post.beforeImage)
  const afterUrl = getMediaUrl(post.afterImage)
  const hasSlider = !!(beforeUrl && afterUrl)
  const serviceLabel = post.serviceType ? SERVICE_LABELS[post.serviceType] : null
  const gallery: Array<{ image: unknown; caption?: string }> = post.gallery ?? []

  // Article JSON-LD for rich previews in Google. Tied back to the business
  // entity declared in (frontend)/layout.tsx via the publisher id.
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    dateModified: post.updatedAt || post.date,
    image: featuredUrl ? [featuredUrl] : undefined,
    author: {
      "@type": "Organization",
      name: "Run Off Rinsing LLC",
    },
    publisher: { "@id": `${SITE}/#business` },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}/work/${post.slug}` },
    locationCreated: post.location,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {/* Header */}
      <section className="relative isolate overflow-hidden bg-ink pt-36 pb-16 text-primary-foreground lg:pt-44 lg:pb-20">
        {featuredUrl ? (
          <>
            <img
              src={featuredUrl}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
          </>
        ) : null}

        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <Link
            href="/work"
            className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/70 hover:text-accent"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            All work
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3 font-sans text-[11px] uppercase tracking-[0.2em] text-primary-foreground/75">
            <span>{post.location}</span>
            {post.date ? <span aria-hidden>·</span> : null}
            {post.date ? <span>{formatDate(post.date)}</span> : null}
            {serviceLabel ? (
              <>
                <span aria-hidden>·</span>
                <span className="text-accent">{serviceLabel}</span>
              </>
            ) : null}
          </div>
          <h1 className="mt-4 font-display text-4xl font-black uppercase leading-[0.95] tracking-[-0.01em] sm:text-5xl lg:text-6xl text-balance">
            {post.title}
          </h1>
          <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
            {post.summary}
          </p>
        </div>
      </section>

      {/* Optional before/after slider */}
      {hasSlider ? (
        <section className="bg-background py-12 lg:py-16">
          <div className="mx-auto max-w-5xl px-5 lg:px-8">
            <BeforeAfter
              beforeSrc={beforeUrl!}
              afterSrc={afterUrl!}
              alt={post.title}
              aspect="16 / 10"
              initial={42}
            />
          </div>
        </section>
      ) : null}

      {/* Body */}
      <section className="bg-background pb-20 pt-8 lg:pb-28">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <article
            className="prose-job space-y-5 font-sans text-[17px] leading-relaxed text-foreground/85"
          >
            <RichText data={post.body} />
          </article>

          {gallery.length > 0 ? (
            <div className="mt-16">
              <h2 className="font-display text-2xl font-black uppercase tracking-tight text-foreground">
                More from this job
              </h2>
              <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {gallery.map((g, i) => {
                  const url = getMediaUrl(g.image)
                  if (!url) return null
                  return (
                    <li key={i}>
                      <figure>
                        <img
                          src={url}
                          alt={g.caption || post.title}
                          className="w-full rounded-sm bg-secondary"
                        />
                        {g.caption ? (
                          <figcaption className="mt-2 font-sans text-xs text-muted-foreground">
                            {g.caption}
                          </figcaption>
                        ) : null}
                      </figure>
                    </li>
                  )
                })}
              </ul>
            </div>
          ) : null}

          {/* Prev / next */}
          <nav className="mt-16 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
            {prev ? (
              <Link
                href={`/work/${prev.slug}`}
                className="group block rounded-sm border border-border p-5 hover:border-primary/30 hover:bg-secondary/30"
              >
                <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  ← Previous job
                </p>
                <p className="mt-1 font-display text-sm font-bold uppercase tracking-tight text-foreground group-hover:text-primary">
                  {prev.title}
                </p>
              </Link>
            ) : <span />}
            {next ? (
              <Link
                href={`/work/${next.slug}`}
                className="group block rounded-sm border border-border p-5 text-right hover:border-primary/30 hover:bg-secondary/30"
              >
                <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Next job →
                </p>
                <p className="mt-1 font-display text-sm font-bold uppercase tracking-tight text-foreground group-hover:text-primary">
                  {next.title}
                </p>
              </Link>
            ) : <span />}
          </nav>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink py-16 text-primary-foreground lg:py-20">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 px-5 sm:flex-row sm:items-center lg:px-8">
          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
              Got something similar?
            </p>
            <h3 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">
              Text us a picture — we'll get back today.
            </h3>
          </div>
          <Link
            href="/#contact"
            className="group inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-4 font-display text-sm font-bold uppercase tracking-[0.14em] text-accent-foreground"
          >
            Get a free quote
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </section>
    </>
  )
}
