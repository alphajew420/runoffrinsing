import { withPayload } from "@payloadcms/next/withPayload"

const cdnHost = process.env.S3_CDN_HOST

// Global security headers. Notes:
// - We intentionally skip a strict CSP because the Payload admin uses
//   inline scripts/eval (Lexical) and would need a long allowlist of
//   hashes. Adding a CSP later requires testing /admin doesn't break.
// - HSTS preload requires Cloudflare's "Always Use HTTPS" already on
//   (it is, since the proxy enforces it).
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  output: "standalone",
  poweredByHeader: false, // remove "X-Powered-By: Next.js" disclosure
  images: {
    remotePatterns: cdnHost ? [{ protocol: "https", hostname: cdnHost }] : [],
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ]
  },
}

export default withPayload(nextConfig)
