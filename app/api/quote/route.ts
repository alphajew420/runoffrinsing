import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// ---------------------------------------------------------------------------
// Rate limit — tiny in-memory token bucket per IP.
// Survives within one container, not across restarts; good enough for a small
// site. For multi-replica or DDoS-grade abuse, switch to Redis / Upstash.
// ---------------------------------------------------------------------------

const WINDOW_MS = 5 * 60 * 1000 // 5 minutes
const MAX_REQ = 3 // 3 submissions per window per IP

type Bucket = { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()

function rateLimit(ip: string): { ok: boolean; retryAfter?: number } {
  const now = Date.now()
  const b = buckets.get(ip)
  if (!b || b.resetAt < now) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return { ok: true }
  }
  if (b.count >= MAX_REQ) {
    return { ok: false, retryAfter: Math.ceil((b.resetAt - now) / 1000) }
  }
  b.count += 1
  return { ok: true }
}

// Periodic cleanup so the map can't grow unbounded.
setInterval(() => {
  const now = Date.now()
  for (const [ip, b] of buckets) if (b.resetAt < now) buckets.delete(ip)
}, WINDOW_MS).unref?.()

// ---------------------------------------------------------------------------

type Body = {
  name?: unknown
  phone?: unknown
  email?: unknown
  address?: unknown
  service?: unknown
  notes?: unknown
  website?: unknown // honeypot
}

const MAX_LEN = {
  name: 100,
  phone: 40,
  email: 120,
  address: 200,
  service: 120,
  notes: 2000,
}

function clean(v: unknown, max: number): string {
  if (typeof v !== "string") return ""
  // strip control chars except newline/tab and trim
  return v.replace(/[\x00-\x08\x0B-\x1F\x7F]/g, "").slice(0, max).trim()
}

const esc = (v: string) =>
  v.replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!
  ))

const isLikelyEmail = (s: string) => !s || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s)

export async function POST(req: Request) {
  // Identify the caller — prefer the Cloudflare-supplied client IP.
  const ip =
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"

  const rl = rateLimit(ip)
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests. Try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter ?? 60) } },
    )
  }

  // Limit body size to ~16KB to stop someone POSTing megabytes.
  const buf = await req.arrayBuffer().catch(() => null)
  if (!buf || buf.byteLength > 16_384) {
    return NextResponse.json({ error: "Payload too large." }, { status: 413 })
  }
  let raw: Body
  try {
    raw = JSON.parse(new TextDecoder().decode(buf))
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 })
  }

  // Honeypot — silently accept so bots don't retry.
  if (typeof raw.website === "string" && raw.website.length > 0) {
    return NextResponse.json({ ok: true })
  }

  const name = clean(raw.name, MAX_LEN.name)
  const phone = clean(raw.phone, MAX_LEN.phone)
  const email = clean(raw.email, MAX_LEN.email)
  const address = clean(raw.address, MAX_LEN.address)
  const service = clean(raw.service, MAX_LEN.service)
  const notes = clean(raw.notes, MAX_LEN.notes)

  if (!name || !phone) {
    return NextResponse.json({ error: "Name and phone are required." }, { status: 400 })
  }
  if (!isLikelyEmail(email)) {
    return NextResponse.json({ error: "That email doesn't look right." }, { status: 400 })
  }

  const apiKey = process.env.BREVO_API_KEY
  const toEmail = process.env.NOTIFICATION_EMAIL
  const fromEmail = process.env.NOTIFICATION_FROM || "info@runoffrinsing.com"
  if (!apiKey || !toEmail) {
    console.error("[quote] missing BREVO_API_KEY or NOTIFICATION_EMAIL")
    return NextResponse.json({ error: "Email not configured on the server." }, { status: 500 })
  }

  const rows = [
    ["Name", name],
    ["Phone", phone],
    ["Email", email],
    ["Property address", address],
    ["What needs washing", service],
  ]
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 14px 6px 0;color:#5a6473;font:600 12px/1.4 system-ui,sans-serif;text-transform:uppercase;letter-spacing:.08em;white-space:nowrap;vertical-align:top">${esc(k)}</td><td style="padding:6px 0;color:#0a2447;font:500 15px/1.5 system-ui,sans-serif">${esc(v) || "&mdash;"}</td></tr>`,
    )
    .join("")

  const html = `<!doctype html><html><body style="margin:0;background:#f5f7fa;padding:24px;font-family:system-ui,sans-serif">
  <table cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5ebf2;border-radius:6px;overflow:hidden">
    <tr><td style="background:#0a2447;color:#fff;padding:18px 24px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;font-size:13px">Run Off Rinsing &mdash; New quote request</td></tr>
    <tr><td style="padding:24px"><table cellpadding="0" cellspacing="0">${rows}</table>
      ${notes ? `<div style="margin-top:18px"><div style="font:600 12px/1.4 system-ui,sans-serif;color:#5a6473;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px">Notes</div><div style="font:400 15px/1.55 system-ui,sans-serif;color:#0a2447;white-space:pre-wrap">${esc(notes)}</div></div>` : ""}
    </td></tr>
    <tr><td style="background:#f5f7fa;padding:12px 24px;font:500 12px/1.5 system-ui,sans-serif;color:#5a6473">From: ${esc(name)} &mdash; reply to write back to ${esc(email || phone)}. (IP: ${esc(ip)})</td></tr>
  </table></body></html>`

  const text = [
    `New quote request — Run Off Rinsing`,
    ``,
    `Name:             ${name}`,
    `Phone:            ${phone}`,
    `Email:            ${email}`,
    `Property address: ${address}`,
    `Service:          ${service}`,
    ``,
    `Notes:`,
    notes || "(none)",
    ``,
    `(IP: ${ip})`,
  ].join("\n")

  const subject = address
    ? `Quote request from ${name} — ${address}`
    : `Quote request from ${name}`

  const payload: Record<string, unknown> = {
    sender: { name: "Run Off Rinsing Website", email: fromEmail },
    to: [{ email: toEmail }],
    subject,
    htmlContent: html,
    textContent: text,
    tags: ["quote-request"],
  }
  if (email) payload.replyTo = { email, name }

  const resp = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!resp.ok) {
    const errBody = await resp.text().catch(() => "")
    console.error("[quote] brevo error", resp.status, errBody)
    return NextResponse.json(
      { error: "Could not send right now. Please call or text us instead." },
      { status: 502 },
    )
  }

  return NextResponse.json({ ok: true })
}
