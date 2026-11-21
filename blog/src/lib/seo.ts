export const AUTHOR = {
  name: 'Pratik Gond',
  url: 'https://pratikgond.tech',
  email: 'pratik.gond.dev@gmail.com',
  github: 'https://github.com/pratik2374',
  linkedin: 'https://linkedin.com/in/pratikgond',
  jobTitle: 'Software & AI Engineer',
  bio: 'Software & AI Engineer with 2 years of experience building with LLMs, RAG and generative AI, from prototypes to production web apps.',
} as const

/**
 * Serialise structured data for a <script type="application/ld+json"> tag.
 * Escaping `<` stops content such as a title containing `</script>` from
 * closing the tag early and injecting markup.
 */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
