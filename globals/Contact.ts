import type { GlobalConfig } from 'payload'

export const Contact: GlobalConfig = {
  slug: 'contact',
  admin: {
    description: 'Phone, email, hours, and the copy in the contact section + footer.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'Get a quote',
    },
    {
      name: 'headlineLine1',
      type: 'text',
      defaultValue: 'Pictures',
    },
    {
      name: 'headlineLine2',
      type: 'text',
      defaultValue: 'beat',
    },
    {
      name: 'headlineAccentLine',
      type: 'text',
      defaultValue: 'paragraphs.',
      admin: { description: 'Shown in the accent color.' },
    },
    {
      name: 'subheading',
      type: 'textarea',
      defaultValue:
        "Text a couple of photos to the number below or fill the form. Either way you'll hear back the same day.",
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      defaultValue: '(609) 664-6258',
      admin: { description: 'Displayed in the navbar, contact section, and footer.' },
    },
    {
      name: 'email',
      type: 'text',
      required: true,
      defaultValue: 'runoffrinsing@gmail.com',
    },
    {
      name: 'serviceArea',
      type: 'text',
      defaultValue: 'All of New Jersey',
    },
    {
      name: 'hours',
      type: 'array',
      labels: { singular: 'Day', plural: 'Hours' },
      defaultValue: [
        { line: 'Mon – Fri · 7a – 7p' },
        { line: 'Sat · 8a – 4p' },
        { line: 'Sun · text us anyway' },
      ],
      fields: [{ name: 'line', type: 'text', required: true }],
    },
    {
      name: 'serviceOptions',
      type: 'array',
      labels: { singular: 'Service option', plural: 'Service options' },
      admin: { description: 'Items shown in the form\'s "what needs washing?" dropdown.' },
      defaultValue: [
        { label: 'House (siding + soffits)' },
        { label: 'Roof (soft wash)' },
        { label: 'Driveway / concrete' },
        { label: 'Deck or fence' },
        { label: 'Fleet / equipment' },
        { label: 'Not sure — help me figure it out' },
      ],
      fields: [{ name: 'label', type: 'text', required: true }],
    },
    {
      name: 'formNote',
      type: 'text',
      defaultValue: 'We reply to every quote — usually within an hour during business hours.',
    },
  ],
}
