import { defineField, defineType } from 'sanity'

export const experience = defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  fields: [
    defineField({
      name: 'companyName',
      title: 'Company Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role / Job Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'companyName',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date / Duration',
      type: 'string',
      description: 'e.g., "Jan 2022 - Present"',
    }),
    defineField({
      name: 'order',
      title: 'Sort Order',
      type: 'number',
      initialValue: 1,
    }),
    defineField({
      name: 'image',
      title: 'Company Logo / Cover',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'gallery',
      title: 'Image Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'link',
      title: 'Company URL',
      type: 'url',
    }),
    defineField({
      name: 'video',
      title: 'Video Embed URL',
      type: 'url',
    }),
  ],
  orderings: [
    {
      title: 'Manual Order',
      name: 'manualOrder',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
})
