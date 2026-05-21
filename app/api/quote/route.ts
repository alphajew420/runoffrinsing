import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

type Body = {
  name?: string
  phone?: string
  email?: string
  address?: string
  service?: string
  notes?: string
  // basic honeypot — bots fill all visible fields
  website?: string
}

const esc = (v: unknown) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!
  ))

export async function POST(req: Request) {
  let body: Body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  // Honeypot — silently accept so bots don't retry
  if (body.website) return NextResponse.json({ ok: true })

  const name = (body.name || "").trim()
  const phone = (body.phone || "").trim()
  if (!name || !phone) {
    return NextResponse.json({ error: "Name and phone are required." }, { status: 400 })
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
    ["Email", body.email || ""],
    ["Property address", body.address || ""],
    ["What needs washing", body.service || ""],
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
      ${body.notes ? `<div style="margin-top:18px"><div style="font:600 12px/1.4 system-ui,sans-serif;color:#5a6473;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px">Notes</div><div style="font:400 15px/1.55 system-ui,sans-serif;color:#0a2447;white-space:pre-wrap">${esc(body.notes)}</div></div>` : ""}
    </td></tr>
    <tr><td style="background:#f5f7fa;padding:12px 24px;font:500 12px/1.5 system-ui,sans-serif;color:#5a6473">Reply to this message to write back to ${esc(body.email || name)}.</td></tr>
  </table></body></html>`

  const text = [
    `New quote request — Run Off Rinsing`,
    ``,
    `Name:             ${name}`,
    `Phone:            ${phone}`,
    `Email:            ${body.email || ""}`,
    `Property address: ${body.address || ""}`,
    `Service:          ${body.service || ""}`,
    ``,
    `Notes:`,
    body.notes || "(none)",
  ].join("\n")

  const subjectParts = [`Quote request from ${name}`]
  if (body.address) subjectParts.push(body.address)
  const subject = subjectParts.join(" — ")

  const payload: Record<string, unknown> = {
    sender: { name: "Run Off Rinsing Website", email: fromEmail },
    to: [{ email: toEmail }],
    subject,
    htmlContent: html,
    textContent: text,
    tags: ["quote-request"],
  }
  // If the customer gave us an email, set replyTo so hitting reply in Gmail
  // writes back to them directly instead of to info@runoffrinsing.com.
  if (body.email) {
    payload.replyTo = { email: body.email, name }
  }

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
