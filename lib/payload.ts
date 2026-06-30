import { cms, cmsGlobal } from "./cms-central"

/** Returns a Payload-find-compatible shim that hits the central CMS over HTTP.
 *  Site slug is added by cms() so callers pass the BASE collection name. */
export const getPayloadClient = async (): Promise<any> => ({
  find: async ({ collection, ...rest }: any) => cms(collection, rest as any),
  findGlobal: async ({ slug }: any) => cmsGlobal(slug),
  findByID: async ({ collection, id }: any) => {
    const r = await cms(collection, { where: { id: { equals: id } }, limit: 1 } as any)
    return (r as any).docs[0]
  },
})

/** Backwards-compat alias for repos that imported the function as `getPayload`. */
export const getPayload = getPayloadClient

/** Extract URL from a Payload media field (object with .url or a raw ID). */
export function getMediaUrl(field: unknown): string {
  if (typeof field === "object" && field !== null && "url" in field) {
    return (field as { url: string }).url || ""
  }
  return ""
}
