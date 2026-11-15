import { defineField, defineType } from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'color',
      title: 'Color Accent',
      type: 'string',
      description: 'Accent theme color for tags and badges',
      options: {
        list: [
          { title: 'Orange', value: 'orange' },
          { title: 'Blue', value: 'blue' },
          { title: 'Emerald', value: 'emerald' },
          { title: 'Purple', value: 'purple' },
          { title: 'Rose', value: 'rose' },
          { title: 'Cyan', value: 'cyan' },
        ],
      },
      initialValue: 'orange',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Sort order for display on homepage (1, 2, 3...)',
      initialValue: 1,
    }),
  ],
})
