import { Archivo, Inter_Tight } from "next/font/google"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getPayload } from "@/lib/payload"
import { staticUrl } from "@/lib/assets"

// Globals + Tailwind preflight only load on /frontend pages; admin uses its own.
import "@/app/globals.css"

const SITE = process.env.NEXT_PUBLIC_SERVER_URL || "https://runoffrinsing.com"

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

function digits(v: string) {
  return v.replace(/[^+\d]/g, "")
}

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

  const phone = contact?.phone || "(609) 664-6258"
  const email = contact?.email || "runoffrinsing@gmail.com"
  const phoneTel = digits(phone).startsWith("+") ? digits(phone) : `+1${digits(phone)}`
  const serviceArea = contact?.serviceArea || "All of New Jersey"

  // Schema.org LocalBusiness — gives Google the NAP (name/address/phone),
  // service area, and aggregate of services. Helps for local-pack results
  // like "pressure washing morristown nj".
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE}/#business`,
    name: "Run Off Rinsing LLC",
    alternateName: "Run Off Rinsing",
    description:
      "Family-run soft-wash and pressure-washing service for homes, roofs, decks, fences, and driveways across New Jersey.",
    url: SITE,
    telephone: phoneTel,
    email,
    image: staticUrl("og-image.jpg").startsWith("http")
      ? staticUrl("og-image.jpg")
      : `${SITE}${staticUrl("og-image.jpg")}`,
    logo: staticUrl("logo.png").startsWith("http")
      ? staticUrl("logo.png")
      : `${SITE}${staticUrl("logo.png")}`,
    priceRange: "$$",
    areaServed: {
      "@type": "State",
      name: "New Jersey",
    },
    address: {
      "@type": "PostalAddress",
      addressRegion: "NJ",
      addressCountry: "US",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "08:00",
        closes: "16:00",
      },
    ],
    sameAs: [],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Pressure & Soft Wash Services",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "House washing" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Roof cleaning" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Driveway & concrete cleaning" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Deck & fence cleaning" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Fleet & equipment washing" } },
      ],
    },
  }

  return (
    <div
      className={`${display.variable} ${body.variable} font-sans antialiased bg-background text-foreground`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar contact={contact} />
      <main>{children}</main>
      <Footer contact={contact} />
    </div>
  )
}
