import type { MetadataRoute } from "next"
import { getPayload } from "@/lib/payload"

const SITE = process.env.NEXT_PUBLIC_SERVER_URL || "https://runoffrinsing.com"

export const dynamic = "force-dynamic"
export const revalidate = 3600 // sitemap is OK to be slightly stale

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE}/work`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ]

  let dynamicRoutes: MetadataRoute.Sitemap = []
  try {
    const payload = await getPayload()
    const { docs } = await payload.find({
      collection: "past-jobs",
      where: { status: { equals: "published" } },
      sort: "-date",
      limit: 500,
    })
    dynamicRoutes = (docs as any[])
      .filter((d) => d.slug)
      .map((d) => ({
        url: `${SITE}/work/${d.slug}`,
        lastModified: d.updatedAt ? new Date(d.updatedAt) : new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }))
  } catch {
    // CMS unreachable — fall back to static routes only
  }

  return [...staticRoutes, ...dynamicRoutes]
}
