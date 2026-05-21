import { withPayload } from "@payloadcms/next/withPayload"

const cdnHost = process.env.S3_CDN_HOST

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  output: "standalone",
  images: {
    remotePatterns: cdnHost
      ? [{ protocol: "https", hostname: cdnHost }]
      : [],
    unoptimized: true,
  },
}

export default withPayload(nextConfig)
