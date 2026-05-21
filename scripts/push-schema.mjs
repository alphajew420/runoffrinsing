// Push database schema, generate admin import map, and seed initial content.
// Must be run with: NODE_OPTIONS="--require ./scripts/patch-next-env.cjs"
process.env.NODE_ENV = 'development'
process.env.PAYLOAD_FORCE_DRIZZLE_PUSH = 'true'

const { getPayload, generateImportMap } = await import('payload')
const configModule = await import('../payload.config.ts')
const config = await configModule.default

// ---------------------------------------------------------------------------
// Default content (same copy that lives in the React fallbacks)
// ---------------------------------------------------------------------------

const services = [
  {
    title: 'House washing',
    subtitle: 'Siding, soffits, gutters',
    body:
      'Low-pressure soft wash with a surfactant blend that lifts mildew, algae, and bug debris without driving water behind the siding. We rinse plants, not just buildings.',
  },
  {
    title: 'Roof cleaning',
    subtitle: 'Shingles, tile, metal',
    body:
      'Black streaks are gloeocapsa magma — a living organism feeding on shingle limestone. We kill it with a soft chemical wash, no high pressure on your roof, ever.',
  },
  {
    title: 'Concrete & driveways',
    subtitle: 'Sealcoat-safe surface cleaning',
    body:
      'Surface cleaner + hot rinse for even flatwork results. No zebra-striping. Oil-stain pre-treatment included on every drive.',
  },
  {
    title: 'Deck & fence',
    subtitle: 'Vinyl, composite, cedar',
    body:
      'We meter pressure by material — vinyl fences and composite boards get the same care as wood, just different recipes. Brightener available on natural wood.',
  },
  {
    title: 'Fleet & equipment',
    subtitle: 'Box trucks, trailers, machinery',
    body:
      'On-site rinses for landscapers, contractors, and small fleets. Quick turnarounds, biodegradable degreasers, and we tip out our wash water responsibly.',
  },
]

const processSteps = [
  {
    label: 'You text us a photo',
    body:
      'Drop us a line with a couple of pictures. Most quotes come back same-day, often within an hour during business hours.',
  },
  {
    label: 'We pick a window',
    body:
      "We schedule by neighborhood, so we're already in the area on your day. You don't need to be home — outdoor spigots are all we need.",
  },
  {
    label: 'We wash. You inspect.',
    body:
      "Two-person crew, in and out in a few hours for most homes. Walk-through before we pack the truck. If something's off, we fix it on the spot.",
  },
]

// Local public/ image files — used when S3 isn't configured.
// When S3 is configured, the seed will upload these via local file path.
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PUBLIC = path.resolve(__dirname, '..', 'public')

const pastJobs = [
  {
    title: 'Vinyl siding soft wash in Morristown, NJ',
    location: 'Morristown, NJ',
    serviceType: 'house-washing',
    date: '2026-04-12',
    summary:
      'Two-story colonial with heavy mildew on the north-facing siding. Soft wash + cold rinse, half a day on site.',
    paragraphs: [
      'This Morristown colonial sits at the edge of a wooded lot, and the north-facing wall had been picking up moss and mildew for the better part of a decade. By the time the owner called us, the lower courses of vinyl were closer to forest-green than the cream they were supposed to be.',
      "We pre-rinsed the foundation plantings, masked off the air-conditioner intake, and ran our soft-wash blend through a 12 GPM downstream injector at low pressure. The trick on north-facing siding is dwell time, not pressure — give the SH solution five or six minutes to actually kill the biology before you rinse it. That way you don't have to come back in six months when the mildew rebounds.",
      "We finished with a hand-wipe on the gutters' painted face and a fresh-water rinse on every plant within ten feet of the foundation. Total: about four hours, including setup and breakdown.",
    ],
    beforeFile: 'images/siding-side-before.jpg',
    afterFile: 'images/siding-side-after.jpg',
    featured: true,
  },
  {
    title: 'Vinyl privacy fence cleaning in Glen Rock, NJ',
    location: 'Glen Rock, NJ',
    serviceType: 'deck-fence',
    date: '2026-03-28',
    summary:
      "Textured-side vinyl panels with algae and pollen ground in. Hand-agitated the worst panels, then a low-pressure rinse.",
    paragraphs: [
      'Vinyl fences look maintenance-free in the catalog, but the textured "wood-grain" side picks up everything that blows past it: pollen, road dust, and after a wet spring, algae. This Glen Rock backyard had six runs of six-foot privacy panels that hadn\'t been cleaned since they were installed.',
      "We used a 1.5% SH mix with surfactant, brushed the worst panels by hand to break the algae's grip on the texture, then rinsed at about 500 psi — high enough to clear the residue, low enough to avoid driving water past the gasket caps.",
      'The hostas at the base of the fence were rinsed before and after. The shade-loving plants in the corner stayed shade-loving plants.',
    ],
    beforeFile: 'images/vinyl-fence-before.jpg',
    afterFile: 'images/vinyl-fence-after.jpg',
  },
  {
    title: 'Soffit and dormer cleaning in Westfield, NJ',
    location: 'Westfield, NJ',
    serviceType: 'house-washing',
    date: '2026-03-15',
    summary:
      'Gutter-line streaking from a clogged downspout. Cleaned the soffit underside, hand-treated the gable, found a drip-edge issue while we were up there.',
    paragraphs: [
      "Gutter-line streaks like the ones on this Westfield colonial are almost always a downspout problem upstream of the visible mess. Water sheets over the lip of the gutter during heavy rain, carries roof grit down the face of the soffit, and bakes it on in the next sunny week.",
      "We cleared the downspout, soft-washed the soffit underside, hand-treated the gable peak with a low-foaming detergent, and rinsed everything from the top down. While we were up there we noticed the drip edge over the porch had pulled away from the fascia — pointed it out to the homeowner, who got it fixed by their roofer the next week.",
      "Worth saying: we don't do roofing work. But we'll always flag what we see while we're up on the ladder.",
    ],
    beforeFile: 'images/house-windows-before.jpg',
    afterFile: 'images/house-windows-after.jpg',
  },
]

const jobs = [
  {
    title: 'Two-story vinyl, north exposure',
    location: 'Morris County',
    body:
      'Mildew climbing up the north-facing siding from years of shade. Soft wash with a low-percentage SH solution, rinsed cold. Half a day on site.',
    beforeFile: 'images/siding-side-before.jpg',
    afterFile: 'images/siding-side-after.jpg',
    aspect: '16/8',
    initialSliderPosition: 42,
    featured: true,
  },
  {
    title: 'Backyard vinyl privacy fence',
    location: 'Bergen County',
    body:
      'Algae and pollen ground into the textured side of the panels. Hand-agitated the worst spots, then rinsed at low pressure to avoid driving water behind the caps.',
    beforeFile: 'images/vinyl-fence-before.jpg',
    afterFile: 'images/vinyl-fence-after.jpg',
    aspect: '4/5',
    initialSliderPosition: 50,
  },
  {
    title: 'Soffit + dormer face',
    location: 'Union County',
    body:
      'Streaking from a clogged gutter run. Cleaned the underside, hand-treated the gable, and walked the customer through the drip-edge issue we found while we were up there.',
    beforeFile: 'images/house-windows-before.jpg',
    afterFile: 'images/house-windows-after.jpg',
    aspect: '4/5',
    initialSliderPosition: 38,
  },
  {
    title: 'Side panel + brick base',
    location: 'Essex County',
    body:
      'A close-up of the kind of result we look for: clean siding without etching the paint, brick still showing its texture, no spray-back streaks on the foundation.',
    beforeFile: 'images/siding-detail-before.jpg',
    afterFile: 'images/siding-detail-after.jpg',
    aspect: '4/5',
    initialSliderPosition: 62,
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toLexical(paragraphs) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        textFormat: 0,
        children: [
          { type: 'text', format: 0, text, version: 1, detail: 0, mode: 'normal', style: '' },
        ],
      })),
    },
  }
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

async function uploadLocal(payload, relPath, alt) {
  const abs = path.resolve(PUBLIC, relPath)
  const buffer = await readFile(abs)
  const name = path.basename(abs)
  const mimetype = name.endsWith('.png')
    ? 'image/png'
    : name.endsWith('.webp')
    ? 'image/webp'
    : 'image/jpeg'
  const media = await payload.create({
    collection: 'media',
    data: { alt },
    file: { data: buffer, mimetype, name, size: buffer.length },
  })
  return media.id
}

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------

async function seedContent(payload) {
  // Admin user
  const existingUsers = await payload.find({ collection: 'users', limit: 1 })
  if (existingUsers.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email: process.env.SEED_ADMIN_EMAIL || 'admin@runoffrinsing.com',
        password: process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!',
        name: 'Admin',
        role: 'admin',
      },
    })
    console.log('  Created admin user.')
  } else {
    console.log('  Admin user exists, skipping.')
  }

  // Services
  const existingServices = await payload.find({ collection: 'services', limit: 50 })
  if (existingServices.totalDocs === 0) {
    for (let i = 0; i < services.length; i++) {
      const s = services[i]
      await payload.create({
        collection: 'services',
        data: { ...s, sortOrder: i + 1 },
      })
    }
    console.log(`  Seeded ${services.length} services.`)
  } else {
    console.log('  Services exist, skipping.')
  }

  // Process steps
  const existingSteps = await payload.find({ collection: 'process-steps', limit: 20 })
  if (existingSteps.totalDocs === 0) {
    for (let i = 0; i < processSteps.length; i++) {
      const s = processSteps[i]
      await payload.create({
        collection: 'process-steps',
        data: { ...s, sortOrder: i + 1 },
      })
    }
    console.log(`  Seeded ${processSteps.length} process steps.`)
  } else {
    console.log('  Process steps exist, skipping.')
  }

  // Before/after jobs (requires media upload — needs S3 in production)
  const existingJobs = await payload.find({ collection: 'before-after-jobs', limit: 50 })
  if (existingJobs.totalDocs === 0) {
    try {
      for (let i = 0; i < jobs.length; i++) {
        const j = jobs[i]
        const beforeId = await uploadLocal(payload, j.beforeFile, `${j.title} — before`)
        const afterId = await uploadLocal(payload, j.afterFile, `${j.title} — after`)
        await payload.create({
          collection: 'before-after-jobs',
          data: {
            title: j.title,
            location: j.location,
            body: j.body,
            beforeImage: beforeId,
            afterImage: afterId,
            aspect: j.aspect,
            initialSliderPosition: j.initialSliderPosition,
            featured: !!j.featured,
            sortOrder: i + 1,
          },
        })
        console.log(`  Job ${i + 1}/${jobs.length}: ${j.title}`)
      }
    } catch (err) {
      console.log(`  Job seeding skipped (media upload failed): ${err.message}`)
    }
  } else {
    console.log('  Before/after jobs exist, skipping.')
  }

  // Past-job posts for the /work archive
  const existingPast = await payload.find({ collection: 'past-jobs', limit: 50 })
  if (existingPast.totalDocs === 0) {
    try {
      for (const p of pastJobs) {
        const featuredId = await uploadLocal(payload, p.afterFile, p.title)
        const beforeId = await uploadLocal(payload, p.beforeFile, `${p.title} — before`)
        const afterId = await uploadLocal(payload, p.afterFile, `${p.title} — after`)
        await payload.create({
          collection: 'past-jobs',
          data: {
            title: p.title,
            slug: slugify(p.title),
            status: 'published',
            date: p.date,
            location: p.location,
            serviceType: p.serviceType,
            summary: p.summary,
            featuredImage: featuredId,
            beforeImage: beforeId,
            afterImage: afterId,
            body: toLexical(p.paragraphs),
          },
        })
        console.log(`  Past job: ${p.title}`)
      }
    } catch (err) {
      console.log(`  Past job seeding skipped (media upload failed): ${err.message}`)
    }
  } else {
    console.log('  Past jobs exist, skipping.')
  }

  // Globals get their defaultValues automatically on first read — no seed needed.
  // But trigger an upsert so they exist in the DB.
  for (const slug of ['hero', 'about', 'contact']) {
    const g = await payload.findGlobal({ slug })
    await payload.updateGlobal({ slug, data: g })
    console.log(`  Global "${slug}" initialised.`)
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

console.log('[1/3] Pushing database schema...')
const payload = await getPayload({ config })
console.log('[1/3] Database schema pushed.')

console.log('[2/3] Generating admin import map...')
await generateImportMap(config, { log: false })
console.log('[2/3] Import map generated.')

console.log('[3/3] Seeding content...')
await seedContent(payload)
console.log('[3/3] Seeding complete.')

await payload.db.destroy()
process.exit(0)
