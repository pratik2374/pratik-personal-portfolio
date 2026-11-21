/**
 * Merge the Sanity `siteSettings` document over the static fallback in
 * src/data/settings.js, field by field: a missing document, a missing field or
 * an empty value always keeps the static value, so the UI never goes blank.
 */

const isFilled = (value) => {
  if (value == null) return false
  if (typeof value === 'string') return value.trim() !== ''
  if (Array.isArray(value)) return value.length > 0
  return true
}

const pick = (value, fallback) => (isFilled(value) ? value : fallback)

/** `{ value, label }` rows, keeping only rows that have both. */
function cleanStats(stats) {
  if (!Array.isArray(stats)) return null
  const rows = stats
    .filter((s) => s && isFilled(s.value) && isFilled(s.label))
    .map((s) => ({ value: String(s.value).trim(), label: String(s.label) }))
  return rows.length ? rows : null
}

const HEADING_KEYS = ['projects', 'allProjects', 'experience', 'workExperience', 'tools', 'blog']

export function mergeSettings(base, doc) {
  if (!doc || typeof doc !== 'object' || Array.isArray(doc)) return base

  const headings = { ...base.headings }
  const remote = doc.portfolioHeadings || {}
  for (const key of HEADING_KEYS) headings[key] = pick(remote[key], headings[key])

  const avatar = doc.avatar?.asset ? doc.avatar : base.avatar

  return {
    ...base,
    name: pick(doc.name, base.name),
    jobTitle: pick(doc.jobTitle, base.jobTitle),
    tagline: pick(doc.tagline, base.tagline),
    bio: pick(doc.bio, base.bio),
    bioSnippet: pick(doc.bioSnippet, base.bioSnippet),
    avatar,
    email: pick(doc.email, base.email),
    location: pick(doc.location, base.location),
    github: pick(doc.github, base.github),
    linkedin: pick(doc.linkedin, base.linkedin),
    twitter: pick(doc.twitter, base.twitter),
    stats: cleanStats(doc.stats) || base.stats,
    portfolioUrl: pick(doc.portfolioUrl, base.portfolioUrl),
    blogUrl: pick(doc.blogUrl, base.blogUrl)?.replace(/\/+$/, ''),
    headings,
  }
}

/**
 * Split a section heading into its white first line and grey second line.
 * An explicit line break wins; otherwise the last word goes on line two,
 * pulling a one-letter word with it ("TOOLS I USE" → "TOOLS" / "I USE").
 */
export function splitHeading(text = '') {
  const value = String(text).trim()
  if (value.includes('\n')) {
    const [first, ...rest] = value.split('\n')
    return [first.trim(), rest.join(' ').trim()]
  }
  const words = value.split(/\s+/).filter(Boolean)
  if (words.length < 2) return [value, '']
  let cut = words.length - 1
  if (cut > 1 && words[cut - 1].length === 1) cut -= 1
  return [words.slice(0, cut).join(' '), words.slice(cut).join(' ')]
}
