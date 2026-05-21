import { Archivo, Inter_Tight } from "next/font/google"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getPayload } from "@/lib/payload"

// Globals + Tailwind preflight only load on /frontend pages; admin uses its own.
import "@/app/globals.css"

const display = Archivo({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800", "900"],
  display: "swap",
})

const body = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
})

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
    <div
      className={`${display.variable} ${body.variable} font-sans antialiased bg-background text-foreground`}
    >
      <Navbar contact={contact} />
      <main>{children}</main>
      <Footer contact={contact} />
    </div>
  )
}
