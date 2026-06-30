import { getPayload as getPayloadHQ } from "payload"
import config from "@payload-config"

/** Extract URL from a Payload media field (can be an object with `.url` or a raw id). */
export function getMediaUrl(field: unknown): string {
  if (typeof field === "object" && field !== null && "url" in field) {
    return (field as { url: string }).url || ""
  }
  return ""
}

import { cms, cmsGlobal, USE_CENTRAL } from "./cms-central"

/** When USE_CENTRAL_CMS=true, returns a shim that proxies find /
 *  findGlobal / findByID calls to the central CMS. Site slug is added
 *  by cms() so existing call sites pass the BASE collection name
 *  (e.g. "blog") unchanged. Otherwise returns the real local Payload
 *  client. Flip the env flag to roll back. */
export const getPayload = async (): Promise<any> => {
  if (USE_CENTRAL) {
    return {
      find: async ({ collection, ...rest }: any) =>
        cms(collection, rest as any),
      findGlobal: async ({ slug }: any) => cmsGlobal(slug),
      findByID: async ({ collection, id }: any) => {
        const r = await cms(collection, { where: { id: { equals: id } }, limit: 1 } as any)
        return (r as any).docs[0]
      },
    }
  }
  return getPayloadHQ({ config })
}
