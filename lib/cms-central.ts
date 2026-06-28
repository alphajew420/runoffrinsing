/** Server-only fetch helpers for the central Shinbet CMS.
 *  Cutover swap: replace `getPayload({config}).find({collection:'X'})` calls
 *  with `cms('SITESLUG_X', {...})`. The shape matches Payload's REST API
 *  (docs, totalDocs, hasNextPage, etc.) so call sites need minimal changes.
 */
import "server-only"

const CMS_BASE =
  process.env.CMS_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_CMS_URL ||
  "http://cms:3000"

const SITE = "runoffrinsing"

type FindParams = {
  where?: Record<string, unknown>
  sort?: string
  limit?: number
  page?: number
  depth?: number
}

function qs(params: FindParams = {}) {
  const u = new URLSearchParams()
  if (params.limit) u.set("limit", String(params.limit))
  if (params.page) u.set("page", String(params.page))
  if (params.sort) u.set("sort", params.sort)
  if (params.depth != null) u.set("depth", String(params.depth))
  if (params.where) {
    // Payload REST uses bracket notation: where[field][operator]=value
    const flat = flattenWhere(params.where)
    for (const [k, v] of flat) u.set(k, v)
  }
  const s = u.toString()
  return s ? "?" + s : ""
}

function flattenWhere(
  obj: Record<string, unknown>,
  prefix = "where",
  out: [string, string][] = [],
): [string, string][] {
  for (const [k, v] of Object.entries(obj)) {
    const key = `${prefix}[${k}]`
    if (v && typeof v === "object" && !Array.isArray(v)) {
      flattenWhere(v as Record<string, unknown>, key, out)
    } else {
      out.push([key, String(v)])
    }
  }
  return out
}

/** Fetch a list from a per-site collection.
 *  Pass the BASE slug (e.g. 'events', 'blog'); the site prefix is added.
 */
export async function cms<T = unknown>(
  baseSlug: string,
  params: FindParams = {},
  { revalidate = 60 }: { revalidate?: number | false } = {},
): Promise<{
  docs: T[]
  totalDocs: number
  hasNextPage: boolean
  hasPrevPage: boolean
  page: number
  totalPages: number
}> {
  const url = `${CMS_BASE}/api/${SITE}_${baseSlug}${qs(params)}`
  const res = await fetch(url, {
    next: revalidate === false ? undefined : { revalidate },
    cache: revalidate === false ? "no-store" : "default",
  })
  if (!res.ok) {
    throw new Error(`[cms] ${url} -> ${res.status}`)
  }
  return res.json()
}

/** Fetch a single global by base slug (e.g. 'hero' -> SITE_hero). */
export async function cmsGlobal<T = unknown>(
  baseSlug: string,
  { revalidate = 60 }: { revalidate?: number | false } = {},
): Promise<T> {
  const url = `${CMS_BASE}/api/globals/${SITE}_${baseSlug}`
  const res = await fetch(url, {
    next: revalidate === false ? undefined : { revalidate },
    cache: revalidate === false ? "no-store" : "default",
  })
  if (!res.ok) {
    throw new Error(`[cms-global] ${url} -> ${res.status}`)
  }
  return res.json()
}
