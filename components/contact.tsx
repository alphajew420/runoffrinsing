import { Phone, Mail, MapPin } from "lucide-react"
import { ContactForm } from "./contact-form"

type ContactData = {
  eyebrow?: string | null
  headlineLine1?: string | null
  headlineLine2?: string | null
  headlineAccentLine?: string | null
  subheading?: string | null
  phone?: string | null
  email?: string | null
  serviceArea?: string | null
  hours?: Array<{ line: string }> | null
  serviceOptions?: Array<{ label: string }> | null
  formNote?: string | null
}

const DEFAULT_OPTIONS = [
  "House (siding + soffits)",
  "Roof (soft wash)",
  "Driveway / concrete",
  "Deck or fence",
  "Fleet / equipment",
  "Not sure — help me figure it out",
]

export function Contact({ contact }: { contact?: ContactData | null }) {
  const eyebrow = contact?.eyebrow || "Get a quote"
  const l1 = contact?.headlineLine1 || "Pictures"
  const l2 = contact?.headlineLine2 || "beat"
  const l3 = contact?.headlineAccentLine || "paragraphs."
  const sub =
    contact?.subheading ||
    "Text a couple of photos to the number below or fill the form. Either way you'll hear back the same day."
  const phone = contact?.phone || "(973) 555-1212"
  const email = contact?.email || "hello@runoffrinsing.com"
  const serviceArea = contact?.serviceArea || "All of New Jersey"
  const formNote =
    contact?.formNote ||
    "We reply to every quote — usually within an hour during business hours."
  const options =
    contact?.serviceOptions && contact.serviceOptions.length > 0
      ? contact.serviceOptions.map((o) => o.label)
      : DEFAULT_OPTIONS

  return (
    <section id="contact" className="relative bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <aside className="lg:col-span-4">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/70">
              {eyebrow}
            </p>
            <h2 className="mt-3 font-display text-4xl font-black uppercase leading-[0.95] tracking-[-0.01em] text-foreground sm:text-5xl">
              {l1}
              <br />
              {l2}
              <br />
              <span className="text-accent">{l3}</span>
            </h2>
            <p className="mt-6 max-w-sm font-sans text-base leading-relaxed text-muted-foreground">
              {sub}
            </p>

            <ul className="mt-10 space-y-5">
              <ContactLine icon={Phone} label="Call or text" value={phone} href={`tel:${phone.replace(/[^+\d]/g, "")}`} />
              <ContactLine icon={Mail} label="Email" value={email} href={`mailto:${email}`} />
              <ContactLine icon={MapPin} label="Service area" value={serviceArea} />
            </ul>
          </aside>

          <ContactForm options={options} email={email} note={formNote} />
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
