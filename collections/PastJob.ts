import type { CollectionConfig } from 'payload'

export const PastJob: CollectionConfig = {
  slug: 'past-jobs',
  labels: {
    singular: 'Past job',
    plural: 'Past jobs',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'location', 'serviceType', 'date', 'status'],
    description:
      'Each past job here becomes its own page under /work — great for ranking on long-tail searches like "vinyl siding cleaning Morristown NJ".',
  },
  access: {
    read: () => true,
  },
  defaultSort: '-date',
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if ((operation === 'create' || operation === 'update') && data?.title && !data?.slug) {
          data.slug = String(data.title)
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description:
          'Include the service + location for SEO, e.g. "Vinyl siding soft wash in Morristown, NJ".',
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Auto-fills from the title. Leave blank to regenerate.',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      required: true,
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly' },
        description: 'When the job was done. Used to sort the archive.',
      },
    },
    {
      name: 'location',
      type: 'text',
      required: true,
      admin: { description: 'Town + state, e.g. "Morristown, NJ"' },
    },
    {
      name: 'serviceType',
      type: 'select',
      options: [
        { label: 'House washing', value: 'house-washing' },
        { label: 'Roof cleaning', value: 'roof-cleaning' },
        { label: 'Concrete / driveway', value: 'concrete' },
        { label: 'Deck / fence', value: 'deck-fence' },
        { label: 'Fleet / equipment', value: 'fleet' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Categorise so visitors can filter later.',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      admin: {
        description:
          'One or two sentences shown on the archive grid card. Also used as the SEO description if you leave that blank.',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'The hero image for this post. Shows on the card and at the top of the page.' },
    },
    {
      name: 'beforeImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional — pair with the after image and a before/after sponge slider shows up on the page.',
      },
    },
    {
      name: 'afterImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
      admin: {
        description:
          'The full job writeup. Use headings and lists — search engines like structure. Mention the town, the service, and what made the job interesting.',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      labels: { singular: 'Photo', plural: 'Gallery photos' },
      admin: { description: 'Extra photos shown in a grid below the writeup.' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
    {
      name: 'seoTitle',
      type: 'text',
      admin: {
        description: 'Optional — overrides the browser tab + Google result title. Defaults to the post title.',
      },
    },
    {
      name: 'seoDescription',
      type: 'textarea',
      admin: {
        description: 'Optional — overrides the Google result snippet. Defaults to the summary.',
      },
    },
  ],
}
