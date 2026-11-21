import {defineArrayMember, defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons/User'
import {altField} from './imageWithAlt'

/**
 * Singleton (document id "siteSettings") read by both the portfolio and the blog,
 * so name, bio, contact details and links live in one place.
 * Initial values mirror what the sites showed before this document existed:
 * open it once and click Publish.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Profile & Site Settings',
  type: 'document',
  icon: UserIcon,
  groups: [
    {name: 'identity', title: 'Identity', default: true},
    {name: 'contact', title: 'Contact & social'},
    {name: 'portfolio', title: 'Portfolio'},
  ],
  fields: [
    // ─── Identity ───────────────────────────────────────────────
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'identity',
      initialValue: 'Pratik Gond',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'jobTitle',
      title: 'Job title',
      type: 'string',
      group: 'identity',
      initialValue: 'Software & AI Engineer',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'text',
      rows: 3,
      group: 'identity',
      description: 'Shown as lines in the portfolio hero: put each line on its own row.',
      initialValue: 'PROBLEM SOLVING\nRAG · LLM · GEN AI\nC++ · PYTHON',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 4,
      group: 'identity',
      initialValue:
        'Passionate about creating intuitive and engaging user experiences. Specialize in transforming ideas into beautifully crafted products.',
    }),
    defineField({
      name: 'bioSnippet',
      title: 'Short bio',
      type: 'string',
      group: 'identity',
      description: 'One line, used where space is tight.',
      initialValue: 'A Software Engineer who has developed countless innovative solutions.',
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      group: 'identity',
      options: {hotspot: true},
      fields: [altField],
    }),

    // ─── Contact & social ───────────────────────────────────────
    defineField({
      name: 'email',
      title: 'Public email',
      type: 'string',
      group: 'contact',
      initialValue: 'pratik.gond.dev@gmail.com',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'github',
      title: 'GitHub URL',
      type: 'url',
      group: 'contact',
      initialValue: 'https://github.com/pratik2374',
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn URL',
      type: 'url',
      group: 'contact',
      initialValue: 'https://linkedin.com/in/pratikgond',
    }),
    defineField({
      name: 'twitter',
      title: 'X / Twitter URL',
      type: 'url',
      group: 'contact',
    }),
    defineField({
      name: 'portfolioUrl',
      title: 'Portfolio URL',
      type: 'url',
      group: 'contact',
      initialValue: 'https://pratikgond.tech',
    }),
    defineField({
      name: 'blogUrl',
      title: 'Blog URL',
      type: 'url',
      group: 'contact',
      initialValue: 'https://blog.pratikgond.tech',
    }),

    // ─── Portfolio ──────────────────────────────────────────────
    defineField({
      name: 'stats',
      title: 'Hero stats',
      type: 'array',
      group: 'portfolio',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'stat',
          fields: [
            defineField({name: 'value', title: 'Value', type: 'string', description: 'e.g. "+2"'}),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'text',
              rows: 2,
              description: 'Put each line on its own row (shown stacked).',
            }),
          ],
          preview: {
            select: {value: 'value', label: 'label'},
            prepare: ({value, label}) => ({
              title: [value, (label as string | undefined)?.replace(/\n/g, ' ')].filter(Boolean).join(' '),
            }),
          },
        }),
      ],
      initialValue: [
        {_type: 'stat', value: '+2', label: 'Years of\nExperience'},
        {_type: 'stat', value: '+46', label: 'Projects\nCompleted'},
        {_type: 'stat', value: '+10', label: 'Worldwide\nClients'},
      ],
    }),
    defineField({
      name: 'portfolioHeadings',
      title: 'Portfolio section headings',
      type: 'object',
      group: 'portfolio',
      options: {collapsible: true, collapsed: false},
      fields: [
        defineField({name: 'projects', title: 'Projects (home)', type: 'string'}),
        defineField({name: 'allProjects', title: 'All projects page', type: 'string'}),
        defineField({name: 'experience', title: 'Experience (home)', type: 'string'}),
        defineField({name: 'workExperience', title: 'Experience page', type: 'string'}),
        defineField({name: 'tools', title: 'Tools', type: 'string'}),
        defineField({name: 'blog', title: 'Blog', type: 'string'}),
      ],
      initialValue: {
        projects: 'RECENT PROJECTS',
        allProjects: 'ALL PROJECTS',
        experience: '2 YEARS OF EXPERIENCE',
        workExperience: 'WORK EXPERIENCE',
        tools: 'TOOLS I USE',
        blog: 'FROM THE BLOG',
      },
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'jobTitle', media: 'avatar'},
    prepare: ({title, subtitle, media}) => ({
      title: 'Profile & Site Settings',
      subtitle: [title, subtitle].filter(Boolean).join(' · '),
      media,
    }),
  },
})
