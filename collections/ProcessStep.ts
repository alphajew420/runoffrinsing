import type { CollectionConfig } from 'payload'

export const ProcessStep: CollectionConfig = {
  slug: 'process-steps',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'sortOrder'],
    description: 'The "How it works" steps on the homepage.',
  },
  access: {
    read: () => true,
  },
  defaultSort: 'sortOrder',
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      admin: { description: 'e.g. "You text us a photo"' },
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
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
