FROM node:22-alpine AS base

# ---
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps --no-audit --no-fund

# ---
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Build-time args (needed for Payload schema push + admin import map)
ARG DATABASE_URL
ARG PAYLOAD_SECRET
ARG NEXT_PUBLIC_SERVER_URL
ARG S3_BUCKET
ARG S3_ENDPOINT
ARG S3_REGION
ARG S3_ACCESS_KEY_ID
ARG S3_SECRET_ACCESS_KEY
ARG S3_CDN_HOST
ENV DATABASE_URL=${DATABASE_URL}
ENV PAYLOAD_SECRET=${PAYLOAD_SECRET}
ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}
ENV S3_BUCKET=${S3_BUCKET}
ENV S3_ENDPOINT=${S3_ENDPOINT}
ENV S3_REGION=${S3_REGION}
ENV S3_ACCESS_KEY_ID=${S3_ACCESS_KEY_ID}
ENV S3_SECRET_ACCESS_KEY=${S3_SECRET_ACCESS_KEY}
ENV S3_CDN_HOST=${S3_CDN_HOST}

# Push DB schema + generate admin importMap + seed default content.
# Fails silently if DB unreachable at build time (e.g. for static-only build).
RUN NODE_OPTIONS="--require /app/scripts/patch-next-env.cjs" npx tsx scripts/push-schema.mjs \
  || echo "(skipped — db unreachable at build time)"

ENV NODE_ENV=production
RUN npm run build

# ---
FROM base AS runner
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
