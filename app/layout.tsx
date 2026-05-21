import React from "react"
import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "Run Off Rinsing LLC — Pressure Washing in New Jersey",
  description:
    "Soft wash and pressure wash for homes, fences, decks, and driveways across New Jersey. Family-run, fully insured, and obsessive about doing it right the first time.",
  metadataBase: new URL("https://runoff.shinbetsolutions.com"),
  openGraph: {
    title: "Run Off Rinsing LLC",
    description:
      "We take dirt off houses so they look like houses again. Serving all of NJ.",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#0a2447",
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
