import { cache } from 'react'
import { stegaClean } from '@sanity/client/stega'
import { sanityFetch, IMAGE_FIELDS, type SanityImage } from './sanity'
import { AUTHOR } from './seo'

/**
 * The shared "Profile & Site Settings" document from the studio (also read by
 * the portfolio). Every field falls back to the built-in defaults in seo.ts, so
 * the site renders correctly before the document is published.
 */
export interface Profile {
  name: string
  jobTitle: string
  bio: string
  email: string
  location?: string
  url: string
  blogUrl: string
  github: string
  linkedin: string
  twitter?: string
  avatar?: SanityImage
  /** Every public profile, for structured data `sameAs`. */
  sameAs: string[]
}

interface SiteSettingsDoc {
  name?: string
  jobTitle?: string
  bio?: string
  bioSnippet?: string
  email?: string
  location?: string
  github?: string
  linkedin?: string
  twitter?: string
  portfolioUrl?: string
  blogUrl?: string
  avatar?: SanityImage
}

const pick = (value: string | undefined, fallback: string) => (value && value.trim() ? value : fallback)

export const getProfile = cache(async (): Promise<Profile> => {
  const doc = await sanityFetch<SiteSettingsDoc | null>(
    `*[_id == "siteSettings"][0]{
      name, jobTitle, bio, bioSnippet, email, location,
      github, linkedin, twitter, portfolioUrl, blogUrl,
      avatar${IMAGE_FIELDS}
    }`
  ).catch(() => null)

  const profile: Profile = {
    name: pick(doc?.name, AUTHOR.name),
    jobTitle: pick(doc?.jobTitle, AUTHOR.jobTitle),
    bio: pick(doc?.bio, AUTHOR.bio),
    email: pick(doc?.email, AUTHOR.email),
    location: doc?.location || undefined,
    url: pick(doc?.portfolioUrl, AUTHOR.url),
    blogUrl: pick(doc?.blogUrl, 'https://blog.pratikgond.tech'),
    github: pick(doc?.github, AUTHOR.github),
    linkedin: pick(doc?.linkedin, AUTHOR.linkedin),
    twitter: doc?.twitter || undefined,
    avatar: doc?.avatar?.asset ? doc.avatar : undefined,
    sameAs: [],
  }
  profile.sameAs = [profile.github, profile.linkedin, profile.twitter]
    .filter((u): u is string => Boolean(u))
    .map((u) => stegaClean(u))
  return profile
})

/** Stable entity id shared by the blog and portfolio so search engines merge them into one person. */
export const PERSON_ID = `${AUTHOR.url}/#person`
