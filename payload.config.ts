import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'

import { User } from './collections/User'
import { Media } from './collections/Media'
import { Service } from './collections/Service'
import { ProcessStep } from './collections/ProcessStep'
import { BeforeAfterJob } from './collections/BeforeAfterJob'
import { PastJob } from './collections/PastJob'

import { Hero } from './globals/Hero'
import { About } from './globals/About'
import { Contact } from './globals/Contact'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// S3 storage turns on whenever the credentials are present. If S3_CDN_HOST is
// also set, served URLs go straight to the CDN host (fast, edge-cached). Without
// it, Payload serves images through /api/media/file/<filename> by streaming from
// S3 — slower but works with a private bucket.
const s3Enabled = !!(
  process.env.S3_BUCKET &&
  process.env.S3_ENDPOINT &&
  process.env.S3_ACCESS_KEY_ID &&
  process.env.S3_SECRET_ACCESS_KEY
)
const cdnHost = process.env.S3_CDN_HOST || ''

export default buildConfig({
  admin: {
    user: 'users',
    meta: {
      titleSuffix: ' | Run Off Rinsing CMS',
    },
  },
  collections: [User, Media, Service, ProcessStep, BeforeAfterJob, PastJob],
  globals: [Hero, About, Contact],
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    push: true,
  }),
  editor: lexicalEditor({}),
  plugins: s3Enabled
    ? [
        s3Storage({
          collections: {
            media: cdnHost
              ? {
                  generateFileURL: ({ filename, prefix }) => {
                    const pre = prefix ? `${prefix}/` : ''
                    return `https://${cdnHost}/${pre}${filename}`
                  },
                  disablePayloadAccessControl: true,
                }
              : {},
          },
          bucket: process.env.S3_BUCKET || '',
          config: {
            endpoint: process.env.S3_ENDPOINT || '',
            region: process.env.S3_REGION || 'auto',
            credentials: {
              accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
            },
            forcePathStyle: true,
          },
        }),
      ]
    : [],
  secret: process.env.PAYLOAD_SECRET || 'CHANGE-ME-IN-PRODUCTION-32-chars-minimum',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  sharp,
})
