import type { GlobalConfig } from 'payload'

export const About: GlobalConfig = {
  slug: 'about',
  admin: {
    description: 'The "About" section on the homepage.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'About',
    },
    {
      name: 'headlineParts',
      type: 'array',
      labels: { singular: 'Headline line', plural: 'Headline lines' },
      minRows: 1,
      defaultValue: [
        { text: 'We started this', muted: false },
        { text: 'because we', muted: false },
        { text: 'got tired of', muted: false },
        { text: 'looking', muted: true },
        { text: 'at our', muted: true },
        { text: 'own house.', muted: true },
      ],
      fields: [
        { name: 'text', type: 'text', required: true },
        {
          name: 'muted',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Show this line in the lighter grey.' },
        },
      ],
    },
    {
      name: 'paragraphs',
      type: 'array',
      labels: { singular: 'Paragraph', plural: 'Paragraphs' },
      minRows: 1,
      defaultValue: [
        {
          body:
            'Run Off Rinsing is family-run out of north-central New Jersey. One truck, one trailer, and two people who care more than they probably should about whether the soffit by your garage downspout has any algae left on it.',
        },
        {
          body:
            "We don't subcontract. We don't show up with a stranger. We pull up, knock, walk the property with you, and leave when it actually looks done — not when the clock says it should be.",
        },
        {
          body:
            "Every job uses pH-balanced soaps that won't burn your hostas. Every truck has its own water tank, so we don't run yours up. And every quote is in writing — no day-of surprises.",
        },
      ],
      fields: [{ name: 'body', type: 'textarea', required: true }],
    },
    {
      name: 'facts',
      type: 'array',
      labels: { singular: 'Fact', plural: 'Facts' },
      minRows: 0,
      defaultValue: [
        { label: 'Founded', value: '2023' },
        { label: 'Crew', value: 'Family of 2' },
        { label: 'Insurance', value: '$2M GL' },
        { label: 'Service area', value: 'All of NJ' },
        { label: 'Water', value: 'Bring our own' },
        { label: 'Reviews', value: '5.0 / Google' },
      ],
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
  ],
}
