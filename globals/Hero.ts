import type { GlobalConfig } from 'payload'

export const Hero: GlobalConfig = {
  slug: 'hero',
  admin: {
    description:
      'The big top section of the homepage. Each headline line shows on its own row; the accent line is styled in the pale-ice color.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'Family-run · All of New Jersey',
      admin: { description: 'Small pill above the headline.' },
    },
    {
      name: 'headlineLine1',
      type: 'text',
      required: true,
      defaultValue: 'We take dirt',
    },
    {
      name: 'headlineLine2',
      type: 'text',
      required: true,
      defaultValue: 'off houses',
    },
    {
      name: 'headlineAccentLine',
      type: 'text',
      defaultValue: 'so they look',
      admin: { description: 'This line gets the pale-blue accent color.' },
    },
    {
      name: 'headlineLine4',
      type: 'text',
      defaultValue: 'like houses again.',
    },
    {
      name: 'subheading',
      type: 'textarea',
      defaultValue:
        'Soft-wash for siding and roofs. Power-wash for concrete and decks. Done by people who actually answer the phone.',
    },
    {
      name: 'primaryCtaText',
      type: 'text',
      defaultValue: 'Get your free quote',
    },
    {
      name: 'primaryCtaLink',
      type: 'text',
      defaultValue: '#contact',
    },
    {
      name: 'secondaryCtaText',
      type: 'text',
      defaultValue: 'See before & after →',
    },
    {
      name: 'secondaryCtaLink',
      type: 'text',
      defaultValue: '#work',
    },
    {
      name: 'video',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional video background. Leave blank to use the poster image.' },
    },
    {
      name: 'posterImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Image shown before the video loads (or always, if no video).' },
    },
    {
      name: 'stats',
      type: 'array',
      minRows: 0,
      maxRows: 4,
      labels: { singular: 'Stat', plural: 'Stats' },
      defaultValue: [
        { label: 'Insured', value: '$2M GL' },
        { label: 'Booked through', value: 'Saturdays' },
        { label: 'Avg. quote', value: '< 24 hrs' },
      ],
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
  ],
}
