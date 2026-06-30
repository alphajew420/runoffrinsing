import { withPayload } from "@payloadcms/next/withPayload"

// Central CMS proxy — sends /admin/* and /api/* to the shared shinbet-cms
// service over the internal docker network. The site’s own pages remain
// untouched.
const CMS_INTERNAL = process.env.CMS_INTERNAL_URL || "http://cms:3000"
const USE_CENTRAL = process.env.USE_CENTRAL_CMS === "true" || process.env.USE_CENTRAL_CMS === "1"


const cdnHost = process.env.S3_CDN_HOST

// Headers applied to every route (frontend + admin + api). HSTS, click-jack
// protection, MIME sniffing, referrer hygiene. We deliberately don't drop a
// strict CSP here because the Payload admin uses inline scripts + eval for
// the Lexical editor and a CSP without 'unsafe-eval' breaks it.
const baseHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
]

// CSP for the public-facing site only. Notes:
// - 'unsafe-inline' on script-src is needed for our JSON-LD <script> tags.
//   We accept it because the frontend doesn't render user-supplied HTML —
//   all content comes from the CMS escaped through React.
// - 'unsafe-inline' on style-src is needed by Tailwind's inline style attrs
//   and Next.js' style injection.
// - img-src includes data:/blob: for fonts and the sponge SVG drop-shadow,
//   plus the R2 host (in case we later set S3_CDN_HOST and serve from there).
// - media-src 'self' for the hero video; same-origin from /public.
const cspParts = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob:${cdnHost ? ` https://${cdnHost}` : ""}`,
  "font-src 'self' data:",
  "connect-src 'self'",
  "media-src 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
]
const frontendCSP = {
  key: "Content-Security-Policy",
  value: cspParts.join("; "),
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    if (!USE_CENTRAL) return []
    return {
      beforeFiles: [
        { source: "/admin", destination: `${CMS_INTERNAL}/admin` },
        { source: "/admin/:path*", destination: `${CMS_INTERNAL}/admin/:path*` },
        { source: "/api/:path*", destination: `${CMS_INTERNAL}/api/:path*` },
      ],
      afterFiles: [
        { source: "/_next/:path*", destination: `${CMS_INTERNAL}/_next/:path*` },
      ],
    }
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: "standalone",
  poweredByHeader: false,
  images: {
    remotePatterns: cdnHost ? [{ protocol: "https", hostname: cdnHost }] : [],
    unoptimized: true,
  },
  async headers() {
    return [
      // Always-on hardening across every path.
      { source: "/(.*)", headers: baseHeaders },
      // CSP only on the marketing site — Next's negative lookahead pattern
      // excludes the Payload admin and the API surface.
      { source: "/((?!admin|api).*)", headers: [frontendCSP] },
    ]
  },
}

export default nextConfig
