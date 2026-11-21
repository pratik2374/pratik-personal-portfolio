import { defineField, defineType } from 'sanity'
import { altField } from './imageWithAlt'

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
      description: 'e.g., "AI Engineer Intern" or "Senior Software Engineer"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'employmentType',
      title: 'Employment Type',
      type: 'string',
      description: 'e.g., "Full-time · Remote" or "Internship"',
    }),
    defineField({
      name: 'date',
      title: 'Date / Duration',
      type: 'string',
      description: 'e.g., "Apr 2025 – Mar 2026" or "Jan 2022 - Present"',
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
      name: 'order',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower number appears first (e.g. 1 for current job)',
      initialValue: 1,
    }),
    defineField({
      name: 'image',
      title: 'Company Logo / Badge',
      type: 'image',
      options: { hotspot: true },
      fields: [altField],
    }),
    defineField({
      name: 'skills',
      title: 'Key Technologies / Skills',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'e.g., RAG, LLMs, Python, OpenCV, SQL',
    }),
    defineField({
      name: 'highlights',
      title: 'Key Bullet Points / Achievements',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Add individual bullet points for your achievements here for ultra-clean rendering.',
    }),
    defineField({
      name: 'description',
      title: 'Full Description / Notes',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'link',
      title: 'Company / Project URL',
      type: 'url',
    }),
    defineField({
      name: 'video',
      title: 'Video Embed URL',
      type: 'url',
    }),
    defineField({
      name: 'gallery',
      title: 'Image Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true }, fields: [altField] }],
    }),
  ],
  orderings: [
    {
      title: 'Manual Order',
      name: 'manualOrder',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { company: 'companyName', role: 'role', date: 'date', media: 'image' },
    prepare({ company, role, date, media }) {
      return {
        title: company,
        subtitle: [role, date].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
