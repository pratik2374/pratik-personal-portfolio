import {defineField} from 'sanity'

/** Alt-text field for image types. Required whenever an image is actually set. */
export const altField = defineField({
  name: 'alt',
  type: 'string',
  title: 'Alternative text',
  description: 'Describe the image for screen readers and search engines.',
  validation: (rule) =>
    rule.custom((alt, context) => {
      const parent = context.parent as {asset?: unknown} | undefined
      if (parent?.asset && !alt) return 'Alt text is required when an image is set.'
      return true
    }),
})
