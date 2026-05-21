// Resolve URLs for static assets that live under R2's `static/` prefix.
//
// When S3_CDN_HOST is set (e.g. cdn.runoffrinsing.com), assets serve from
// Cloudflare's edge: https://cdn.runoffrinsing.com/static/logo.png
//
// When it's not set, we fall back to the local /public/ copy, so the site
// keeps working before the CDN domain is wired up (or in dev).

const CDN = process.env.NEXT_PUBLIC_CDN_HOST || ""

export function staticUrl(filename: string): string {
  const name = filename.replace(/^\/+/, "")
  if (CDN) return `https://${CDN}/static/${name}`
  return `/${name}`
}
