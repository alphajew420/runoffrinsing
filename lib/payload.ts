import { getPayload as getPayloadHQ } from "payload"
import config from "@payload-config"

export const getPayload = () => getPayloadHQ({ config })

/** Extract URL from a Payload media field (can be an object with `.url` or a raw id). */
export function getMediaUrl(field: unknown): string {
  if (typeof field === "object" && field !== null && "url" in field) {
    return (field as { url: string }).url || ""
  }
  return ""
}
