/* Payload admin entry point. */
import type { AdminViewProps } from "payload"

import { DefaultTemplate } from "@payloadcms/next/templates"
import { importMap } from "../importMap.js"
import config from "@payload-config"

import { RootPage, generatePageMetadata } from "@payloadcms/next/views"

export const dynamic = "force-dynamic"

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

export const generateMetadata = ({ params, searchParams }: Args) =>
  generatePageMetadata({ config, params, searchParams })

const Page = ({ params, searchParams }: Args) =>
  RootPage({ config, params, searchParams, importMap })

export default Page
