import { toPlainText, type PortableTextBlock } from '@portabletext/react'
import { stegaClean } from '@sanity/client/stega'
import type { ContentItem } from './sanity'

export interface TocHeading {
  id: string
  text: string
  level: 2 | 3
}

/** URL-safe id that keeps non-Latin letters (e.g. Hindi headings) instead of dropping them. */
export function slugify(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/(^-|-$)/g, '')
}

function isHeading(item: ContentItem): item is PortableTextBlock & { style: 'h2' | 'h3'; _key: string } {
  return item._type === 'block' && ((item as PortableTextBlock).style === 'h2' || (item as PortableTextBlock).style === 'h3')
}

/**
 * Collects h2/h3 headings with ids that are unique within the post.
 * Returns the list for the table of contents plus a block-key → id map, so the
 * rendered heading and its TOC entry always agree even when two headings share text.
 */
export function extractHeadings(content: ContentItem[] = []): { headings: TocHeading[]; idByKey: Record<string, string> } {
  const headings: TocHeading[] = []
  const idByKey: Record<string, string> = {}
  const used = new Map<string, number>()

  for (const block of content) {
    if (!isHeading(block)) continue
    // In live preview strings carry invisible edit markers; ids must be built from clean text.
    const text = stegaClean(toPlainText(block)).trim()
    if (!text) continue

    const base = slugify(text) || `section-${headings.length + 1}`
    const seen = used.get(base) ?? 0
    used.set(base, seen + 1)
    const id = seen === 0 ? base : `${base}-${seen + 1}`

    idByKey[block._key] = id
    headings.push({ id, text, level: block.style === 'h2' ? 2 : 3 })
  }

  return { headings, idByKey }
}
