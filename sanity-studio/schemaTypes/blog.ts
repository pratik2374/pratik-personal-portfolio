import {defineArrayMember, defineField, defineType} from 'sanity'

// Languages offered in code blocks. `value` is what the blog uses for highlighting;
// `mode` only picks the closest built-in highlighter inside the studio editor.
const CODE_LANGUAGES = [
  {title: 'TypeScript', value: 'typescript'},
  {title: 'JavaScript', value: 'javascript'},
  {title: 'TSX', value: 'tsx'},
  {title: 'JSX', value: 'jsx'},
  {title: 'Python', value: 'python'},
  {title: 'Bash / Shell', value: 'bash', mode: 'sh'},
  {title: 'JSON', value: 'json'},
  {title: 'HTML', value: 'html'},
  {title: 'CSS', value: 'css'},
  {title: 'SQL', value: 'sql'},
  {title: 'Go', value: 'go', mode: 'golang'},
  {title: 'Rust', value: 'rust', mode: 'text'},
  {title: 'Java', value: 'java'},
  {title: 'C++', value: 'cpp', mode: 'java'},
  {title: 'YAML', value: 'yaml'},
  {title: 'Markdown (tables render as tables)', value: 'markdown'},
  {title: 'Mermaid diagram', value: 'mermaid', mode: 'text'},
  {title: 'Plain text', value: 'text'},
]

export const blog = defineType({
  name: 'blog',
  title: 'Posts',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'meta', title: 'Details'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Shown on cards and used as the default search/social description.',
      validation: (rule) => [
        rule.required(),
        rule.max(200),
        rule.max(160).warning('Search engines usually cut descriptions after ~160 characters.'),
      ],
    }),
    defineField({
      name: 'image',
      title: 'Cover Image',
      type: 'image',
      group: 'content',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Describe the image for screen readers and search engines.',
          validation: (rule) =>
            rule.custom((alt, context) => {
              const parent = context.parent as {asset?: unknown} | undefined
              if (parent?.asset && !alt) return 'Alt text is required when a cover image is set.'
              return true
            }),
        }),
      ],
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({type: 'block'}),
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Describe the image for screen readers and search engines.',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Text displayed below the image.',
            }),
          ],
        }),
        defineArrayMember({
          type: 'code',
          options: {
            language: 'typescript',
            languageAlternatives: CODE_LANGUAGES,
          },
        }),
      ],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      group: 'meta',
      to: [{type: 'category'}],
      description: 'The primary topic or category for this blog post.',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'meta',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
      description: 'Keywords and tags for search & SEO (e.g. Next.js, AI, Architecture)',
    }),
    defineField({
      name: 'date',
      title: 'Published Date',
      type: 'date',
      group: 'meta',
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Last updated',
      type: 'date',
      group: 'meta',
      description: 'Set when you meaningfully revise the post',
      validation: (rule) =>
        rule.custom((updatedAt, context) => {
          const date = (context.document as {date?: string} | undefined)?.date
          if (updatedAt && date && updatedAt < date) {
            return 'Last updated cannot be before the published date.'
          }
          return true
        }),
    }),
    defineField({
      name: 'readTime',
      title: 'Read Time',
      type: 'string',
      group: 'meta',
      description: 'Leave empty to auto-calculate from content',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured / Cover Story',
      type: 'boolean',
      group: 'meta',
      description:
        'Showcased as the cover story at the top of the blog homepage. Only one post can be featured.',
      initialValue: false,
      validation: (rule) =>
        rule.custom(async (isFeatured, context) => {
          if (!isFeatured || !context.document?._id) return true
          const baseId = context.document._id.replace(/^drafts\./, '')
          const client = context.getClient({apiVersion: '2024-01-01'})
          const other = await client.fetch<string | null>(
            `*[_type == "blog" && isFeatured == true && !(_id in path("drafts.**")) && !(_id in [$id, $draftId])][0].title`,
            {id: baseId, draftId: `drafts.${baseId}`},
          )
          return other
            ? `"${other}" is already the featured post. Unfeature it first.`
            : true
        }),
    }),
    defineField({
      name: 'featuredInDesignThoughts',
      title: 'Show on portfolio home',
      type: 'boolean',
      group: 'meta',
      description: 'Pin this article in the blog section of the portfolio home page.',
      initialValue: false,
    }),
    defineField({
      name: 'seo',
      title: 'SEO overrides',
      type: 'object',
      group: 'seo',
      description: 'Optional. Leave empty to use the title, summary and cover image.',
      options: {collapsible: true, collapsed: false},
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta title',
          type: 'string',
          validation: (rule) => rule.max(70),
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta description',
          type: 'text',
          rows: 3,
          validation: (rule) => rule.max(160),
        }),
        defineField({
          name: 'ogImage',
          title: 'Social share image',
          type: 'image',
          description: 'Recommended 1200 × 630.',
        }),
        defineField({
          name: 'noIndex',
          title: 'Hide from search engines',
          type: 'boolean',
          description:
            'Adds noindex and removes the post from the sitemap. Use for test or thin posts.',
          initialValue: false,
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: 'Published date, newest first',
      name: 'dateDesc',
      by: [{field: 'date', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category.title',
      date: 'date',
      media: 'image',
      featured: 'isFeatured',
    },
    prepare({title, category, date, media, featured}) {
      const parts = [featured ? '★ Featured' : null, category, date].filter(Boolean)
      return {title, subtitle: parts.join(' · '), media}
    },
  },
})
