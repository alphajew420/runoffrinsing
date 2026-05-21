import { Hero } from "@/components/hero"
import { Work } from "@/components/work"
import { Services } from "@/components/services"
import { Process } from "@/components/process"
import { About } from "@/components/about"
import { Contact } from "@/components/contact"
import { getPayload } from "@/lib/payload"

export const dynamic = "force-dynamic"

export default async function Page() {
  let hero: any = null
  let about: any = null
  let contact: any = null
  let services: any[] | null = null
  let processSteps: any[] | null = null
  let jobs: any[] | null = null

  try {
    const payload = await getPayload()
    const [heroRes, aboutRes, contactRes, servicesRes, stepsRes, jobsRes] =
      await Promise.all([
        payload.findGlobal({ slug: "hero" }),
        payload.findGlobal({ slug: "about" }),
        payload.findGlobal({ slug: "contact" }),
        payload.find({ collection: "services", sort: "sortOrder", limit: 50 }),
        payload.find({ collection: "process-steps", sort: "sortOrder", limit: 20 }),
        payload.find({ collection: "before-after-jobs", sort: "sortOrder", limit: 50 }),
      ])
    hero = heroRes
    about = aboutRes
    contact = contactRes
    services = servicesRes.docs
    processSteps = stepsRes.docs
    jobs = jobsRes.docs
  } catch {
    // CMS unavailable — every section falls back to its hardcoded defaults
  }

  return (
    <>
      <Hero hero={hero} />
      <Work jobs={jobs} />
      <Services services={services} />
      <Process steps={processSteps} />
      <About about={about} />
      <Contact contact={contact} />
    </>
  )
}
