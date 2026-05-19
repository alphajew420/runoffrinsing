"use client"

import { useState } from "react"
import { ArrowUpRight, Phone, Mail, MapPin } from "lucide-react"

export function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("sending")
    const form = new FormData(e.currentTarget)
    const subject = encodeURIComponent("Quote request — Run Off Rinsing")
    const body = encodeURIComponent(
      `Name: ${form.get("name")}\n` +
      `Phone: ${form.get("phone")}\n` +
      `Email: ${form.get("email")}\n` +
      `Address: ${form.get("address")}\n` +
      `Service: ${form.get("service")}\n\n` +
      `Notes:\n${form.get("notes")}`,
    )
    window.location.href = `mailto:hello@runoffrinsing.com?subject=${subject}&body=${body}`
    setStatus("sent")
  }

  return (
    <section id="contact" className="relative bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <aside className="lg:col-span-4">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/70">
              Get a quote
            </p>
            <h2 className="mt-3 font-display text-4xl font-black uppercase leading-[0.95] tracking-[-0.01em] text-foreground sm:text-5xl">
              Pictures
              <br />
              beat
              <br />
              <span className="text-accent">paragraphs.</span>
            </h2>
            <p className="mt-6 max-w-sm font-sans text-base leading-relaxed text-muted-foreground">
              Text a couple of photos to the number below or fill the form. Either way you'll
              hear back the same day.
            </p>

            <ul className="mt-10 space-y-5">
              <ContactLine icon={Phone} label="Call or text" value="(973) 555-1212" href="tel:+19735551212" />
              <ContactLine icon={Mail} label="Email" value="hello@runoffrinsing.com" href="mailto:hello@runoffrinsing.com" />
              <ContactLine icon={MapPin} label="Service area" value="All of New Jersey" />
            </ul>
          </aside>

          <form
            onSubmit={onSubmit}
            className="rounded-sm border border-border bg-card p-7 lg:col-span-8 lg:p-10"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field name="name" label="Your name" required />
              <Field name="phone" label="Phone" type="tel" required />
              <Field name="email" label="Email" type="email" className="sm:col-span-2" />
              <Field name="address" label="Property address" className="sm:col-span-2" />
              <SelectField
                name="service"
                label="What needs washing?"
                className="sm:col-span-2"
                options={[
                  "House (siding + soffits)",
                  "Roof (soft wash)",
                  "Driveway / concrete",
                  "Deck or fence",
                  "Fleet / equipment",
                  "Not sure — help me figure it out",
                ]}
              />
              <TextField name="notes" label="Anything we should know?" className="sm:col-span-2" />
            </div>

            <div className="mt-7 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
              <p className="font-sans text-xs text-muted-foreground">
                We reply to every quote — usually within an hour during business hours.
              </p>
              <button
                type="submit"
                disabled={status === "sending"}
                className="group inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-4 font-display text-sm font-bold uppercase tracking-[0.14em] text-primary-foreground transition-transform hover:translate-y-[-1px] disabled:opacity-60"
              >
                {status === "sending" ? "Sending…" : status === "sent" ? "Check your mail app" : "Send it"}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

function ContactLine({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  href?: string
}) {
  const inner = (
    <div className="flex items-start gap-4">
      <span className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-sm bg-secondary text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 font-display text-lg font-bold text-foreground">{value}</p>
      </div>
    </div>
  )
  return <li>{href ? <a href={href} className="block hover:opacity-80">{inner}</a> : inner}</li>
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
