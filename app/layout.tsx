import React from "react"
import type { Metadata, Viewport } from "next"
import { Archivo, Inter_Tight } from "next/font/google"

import "./globals.css"

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

export const metadata: Metadata = {
  title: "Run Off Rinsing LLC — Pressure Washing in New Jersey",
  description:
    "Soft wash and pressure wash for homes, fences, decks, and driveways across New Jersey. Family-run, fully insured, and obsessive about doing it right the first time.",
  metadataBase: new URL("https://runoffrinsing.com"),
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${display.variable} ${body.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
