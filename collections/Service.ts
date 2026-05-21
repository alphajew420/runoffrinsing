import type { CollectionConfig } from 'payload'

export const Service: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'subtitle', 'sortOrder'],
    description: 'Each row shows up as a numbered service on the homepage.',
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
      admin: { description: 'e.g. "House washing"' },
    },
    {
      name: 'subtitle',
      type: 'text',
      required: true,
      admin: { description: 'Short clarifier — e.g. "Siding, soffits, gutters"' },
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      admin: { description: 'A paragraph or two about how you handle this service.' },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers show first.',
      },
    },
  ],
}
