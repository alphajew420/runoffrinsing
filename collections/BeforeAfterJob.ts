import type { CollectionConfig } from 'payload'

export const BeforeAfterJob: CollectionConfig = {
  slug: 'before-after-jobs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'location', 'featured', 'sortOrder'],
    description:
      'Real customer jobs. The "featured" one shows full-width up top; the rest fill the 3-up grid below.',
  },
  access: {
    read: () => true,
  },
  defaultSort: 'sortOrder',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'e.g. "Two-story vinyl, north exposure"' },
    },
    {
      name: 'location',
      type: 'text',
      required: true,
      admin: { description: 'County or town, e.g. "Morris County"' },
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      admin: { description: 'How the job went and what you used.' },
    },
    {
      name: 'beforeImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'afterImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show this one big at the top of the work section. (Pick one.)',
      },
    },
    {
      name: 'aspect',
      type: 'select',
      defaultValue: '4/5',
      options: [
        { label: 'Portrait (4 / 5)', value: '4/5' },
        { label: 'Wide (16 / 8)', value: '16/8' },
        { label: 'Squarish (4 / 3)', value: '4/3' },
        { label: 'Landscape (16 / 10)', value: '16/10' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Match this to the source photo so it doesn\'t get cropped weirdly.',
      },
    },
    {
      name: 'initialSliderPosition',
      type: 'number',
      defaultValue: 50,
      min: 0,
      max: 100,
      admin: {
        position: 'sidebar',
        description:
          'Where the sponge starts (0 = all dirty, 100 = all clean, 50 = half-and-half).',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
