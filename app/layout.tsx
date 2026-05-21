import React from "react"
import type { Metadata, Viewport } from "next"

const SITE = process.env.NEXT_PUBLIC_SERVER_URL || "https://runoffrinsing.com"

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Run Off Rinsing LLC — Pressure & Soft Washing in New Jersey",
    template: "%s · Run Off Rinsing",
  },
  description:
    "Family-run soft-wash and pressure-wash for siding, roofs, decks, driveways, and fences across New Jersey. Real photos, written quotes, same-day response.",
  keywords: [
    "pressure washing NJ",
    "soft wash New Jersey",
    "house washing Morris County",
    "roof cleaning NJ",
    "vinyl siding cleaning",
    "driveway pressure washing",
    "deck cleaning NJ",
    "Run Off Rinsing",
  ],
  authors: [{ name: "Run Off Rinsing LLC" }],
  alternates: { canonical: SITE },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Run Off Rinsing LLC",
    url: SITE,
    title: "Run Off Rinsing LLC — Pressure & Soft Washing in New Jersey",
    description:
      "We take dirt off houses so they look like houses again. Family-run, fully insured, serving all of NJ.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "A two-story NJ home after a Run Off Rinsing soft-wash treatment.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Run Off Rinsing LLC — NJ Pressure & Soft Washing",
    description:
      "Real photos, written quotes, same-day response. Family-run pressure washing across New Jersey.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#0a2447",
  width: "device-width",
  initialScale: 1,
}

// Intentionally minimal: no global CSS or fonts here so the Payload admin
// route group can use its own. Fonts + globals.css live in (frontend)/layout.tsx.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>{children}</body>
    </html>
  )
}
