import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getPayload } from "@/lib/payload"

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let contact: any = null
  try {
    const payload = await getPayload()
    contact = await payload.findGlobal({ slug: "contact" })
  } catch {
    // CMS unavailable — components fall back to defaults
  }
  return (
    <>
      <Navbar contact={contact} />
      <main>{children}</main>
      <Footer contact={contact} />
    </>
  )
}
