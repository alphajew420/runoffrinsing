"use client"

import { useState } from "react"
import { ArrowUpRight, CheckCircle2 } from "lucide-react"

type Status = "idle" | "sending" | "sent" | "error"

export function ContactForm({
  options,
  email: _email, // kept for compat with parent; no longer used as mailto target
  note,
}: {
  options: string[]
  email: string
  note: string
}) {
  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMsg(null)
    setStatus("sending")
    const form = new FormData(e.currentTarget)
    const data = {
      name: form.get("name"),
      phone: form.get("phone"),
      email: form.get("email"),
      address: form.get("address"),
      service: form.get("service"),
      notes: form.get("notes"),
      website: form.get("website"), // honeypot
    }
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setStatus("error")
        setErrorMsg(json.error || "Something went wrong. Try calling or texting us instead.")
        return
      }
      setStatus("sent")
      // Clear the form so they don't double-submit
      ;(e.target as HTMLFormElement).reset()
    } catch {
      setStatus("error")
      setErrorMsg("We couldn't reach the server. Try calling or texting us instead.")
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-start gap-4 rounded-sm border border-border bg-card p-7 lg:col-span-8 lg:p-10">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/30 text-primary">
          <CheckCircle2 className="h-6 w-6" />
        </span>
        <div>
          <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">
            Got it — we'll be in touch.
          </h3>
          <p className="mt-3 max-w-md font-sans text-[15px] leading-relaxed text-muted-foreground">
            Your request is in. Most quotes go out the same day — usually within an hour
            during business hours. If you need to add photos or details, just reply to the
            email we send you.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="font-sans text-sm font-semibold text-primary underline decoration-accent decoration-2 underline-offset-4"
        >
          Send another →
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="rounded-sm border border-border bg-card p-7 lg:col-span-8 lg:p-10">
      {/* Honeypot — hidden from users, bots will fill it */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="name" label="Your name" required />
        <Field name="phone" label="Phone" type="tel" required />
        <Field name="email" label="Email" type="email" className="sm:col-span-2" />
        <Field name="address" label="Property address" className="sm:col-span-2" />
        <SelectField name="service" label="What needs washing?" className="sm:col-span-2" options={options} />
        <TextField name="notes" label="Anything we should know?" className="sm:col-span-2" />
      </div>

      <div className="mt-7 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
        <p className="font-sans text-xs text-muted-foreground">
          {status === "error" && errorMsg ? (
            <span className="text-destructive">{errorMsg}</span>
          ) : (
            note
          )}
        </p>
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-4 font-display text-sm font-bold uppercase tracking-[0.14em] text-primary-foreground transition-transform hover:translate-y-[-1px] disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send it"}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </form>
  )
}

function Field({
  name,
  label,
  type = "text",
  required,
  className,
}: {
  name: string
  label: string
  type?: string
  required?: boolean
  className?: string
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="block font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full rounded-sm border border-border bg-background px-3 py-2.5 font-sans text-[15px] text-foreground outline-none ring-0 transition-colors focus:border-primary"
      />
    </label>
  )
}

function TextField({
  name,
  label,
  className,
}: {
  name: string
  label: string
  className?: string
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="block font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <textarea
        name={name}
        rows={4}
        className="mt-2 w-full resize-y rounded-sm border border-border bg-background px-3 py-2.5 font-sans text-[15px] text-foreground outline-none transition-colors focus:border-primary"
      />
    </label>
  )
}

function SelectField({
  name,
  label,
  options,
  className,
}: {
  name: string
  label: string
  options: string[]
  className?: string
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="block font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <select
        name={name}
        className="mt-2 w-full rounded-sm border border-border bg-background px-3 py-2.5 font-sans text-[15px] text-foreground outline-none transition-colors focus:border-primary"
      >
        <option value="">Pick one…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}
