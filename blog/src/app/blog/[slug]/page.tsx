import { cache, ViewTransition } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { PortableText, type PortableTextComponents } from "@portabletext/react"
import { Clock, Calendar, ArrowLeft, Tag, ArrowRight } from "lucide-react"
import {
  sanityFetch,
  formatDate,
  readTimeOf,
  hasImageAsset,
  PUBLISHED,
  IMAGE_FIELDS,
  CATEGORY_FIELDS,
  POST_CARD_FIELDS,
  SITE_URL,
  type BlogPost,
  type CodeValue,
  type SanityImage as SanityImageValue,
} from "@/lib/sanity"
import { extractHeadings } from "@/lib/headings"
import { jsonLd } from "@/lib/seo"
import { ReadingProgressBar } from "@/components/ReadingProgressBar"
import { CodeBlock } from "@/components/CodeBlock"
import { ShareButtons } from "@/components/ShareButtons"
import { TableOfContents } from "@/components/TableOfContents"
import { SanityImage } from "@/components/SanityImage"
import { AuthorBox } from "@/components/AuthorBox"
import { getProfile, PERSON_ID } from "@/lib/profile"
import { stegaClean } from "@sanity/client/stega"

export const revalidate = 3600 // Fallback; publishing in Sanity revalidates immediately via /api/revalidate

type PageProps = { params: Promise<{ slug: string }> }

// Wrapped in cache() so generateMetadata and the page share one request.
const getPost = cache(async (slug: string) => {
  const post = await sanityFetch<BlogPost | null>(
    `*[_type == "blog" && slug.current == $slug && ${PUBLISHED}][0] {
      _id,
      title,
      "slug": slug.current,
      summary,
      date,
      updatedAt,
      _updatedAt,
      readTime,
      "wordCount": length(string::split(pt::text(content), " ")),
      tags,
      seo,
      image${IMAGE_FIELDS},
      content[]{
        ...,
        _type == "image" => ${IMAGE_FIELDS}
      },
      category->${CATEGORY_FIELDS}
    }`,
    { slug }
  )
  // Posts migrated from Firestore have blocks without `_key`. Give each a stable key so
  // headings, TOC anchors and React list keys all line up.
  if (post?.content) {
    post.content = post.content.map((block, i) => (block._key ? block : { ...block, _key: `block-${i}` }))
  }
  return post
})

/** Up to three posts from the same category, topped up with the newest posts. */
async function getRelatedPosts(currentId: string, categoryId?: string): Promise<BlogPost[]> {
  const { sameCategory, latest } = await sanityFetch<{ sameCategory: BlogPost[]; latest: BlogPost[] }>(
    `{
      "sameCategory": *[_type == "blog" && ${PUBLISHED} && defined(slug.current) && _id != $currentId && category._ref == $categoryId] | order(date desc)[0...3] { ${POST_CARD_FIELDS} },
      "latest": *[_type == "blog" && ${PUBLISHED} && defined(slug.current) && _id != $currentId] | order(date desc)[0...3] { ${POST_CARD_FIELDS} }
    }`,
    { currentId, categoryId: categoryId ?? "" }
  )
  const seen = new Set<string>()
  return [...sameCategory, ...latest].filter((p) => !seen.has(p._id) && seen.add(p._id)).slice(0, 3)
}

// Pre-build every published post so the first visit is as fast as the second.
export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>(
    `*[_type == "blog" && ${PUBLISHED} && defined(slug.current)].slug.current`
  )
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: "Post Not Found" }

  const profile = await getProfile()
  const postUrl = `${SITE_URL}/blog/${slug}`
  // stegaClean: in live preview, strings carry invisible edit markers that must not reach <head>.
  const title = stegaClean(post.seo?.metaTitle || post.title)
  const description = stegaClean(post.seo?.metaDescription || post.summary || `Read ${post.title} by ${profile.name}`)
  const tags = post.tags?.map((t) => stegaClean(t))

  // The share image itself comes from ./opengraph-image.tsx.
  return {
    title,
    description,
    keywords: tags?.length ? tags : [stegaClean(post.category?.title) || "Engineering"],
    authors: [{ name: profile.name, url: profile.url }],
    alternates: { canonical: postUrl },
    ...(post.seo?.noIndex && { robots: { index: false, follow: true } }),
    openGraph: {
      title: `${title} | ${profile.name}`,
      description,
      type: "article",
      publishedTime: stegaClean(post.date),
      modifiedTime: stegaClean(post.updatedAt || post._updatedAt),
      url: postUrl,
      authors: [profile.url],
      section: stegaClean(post.category?.title),
      tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const postUrl = `${SITE_URL}/blog/${slug}`
  const { headings, idByKey } = extractHeadings(post.content)
  const relatedPosts = await getRelatedPosts(post._id, post.category?._id)
  const readTime = readTimeOf(post)
  const modified = stegaClean(post.updatedAt || post._updatedAt)
  const published = stegaClean(post.date)
  const profile = await getProfile()
  const minutes = Number.parseInt(readTime, 10) || 1

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${postUrl}#article`,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        headline: stegaClean(post.title),
        description: stegaClean(post.summary) || "",
        url: postUrl,
        mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
        inLanguage: "en-US",
        ...(published && { datePublished: published }),
        ...((modified || published) && { dateModified: modified || published }),
        // Same @id as the portfolio and the site-wide graph, so engines see one author entity.
        author: { "@type": "Person", "@id": PERSON_ID, name: profile.name, url: profile.url, sameAs: profile.sameAs },
        publisher: { "@id": PERSON_ID },
        image: {
          "@type": "ImageObject",
          url: `${postUrl}/opengraph-image`,
          width: 1200,
          height: 630,
        },
        articleSection: stegaClean(post.category?.title) || "Technology",
        keywords: post.tags?.map((t) => stegaClean(t)).join(", ") || "",
        ...(post.wordCount && { wordCount: post.wordCount }),
        timeRequired: `PT${minutes}M`,
        isAccessibleForFree: true,
        copyrightHolder: { "@id": PERSON_ID },
        ...(published && { copyrightYear: Number(published.slice(0, 4)) }),
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "[data-speakable]"] },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${postUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          ...(post.category
            ? [{ "@type": "ListItem", position: 2, name: post.category.title, item: `${SITE_URL}/category/${post.category.slug}` }]
            : []),
          { "@type": "ListItem", position: post.category ? 3 : 2, name: post.title, item: postUrl },
        ],
      },
    ],
  }

  const ptComponents: PortableTextComponents = {
    types: {
      image: ({ value }: { value: SanityImageValue }) => {
        if (!hasImageAsset(value)) return null
        return (
          <figure className="my-10 not-prose">
            <div className="relative w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 shadow-md">
              <SanityImage
                image={value}
                alt={value.alt || ""}
                sizes="(max-width: 768px) 100vw, 768px"
                className="w-full h-auto max-h-[700px] object-contain mx-auto"
              />
            </div>
            {value.caption && (
              <figcaption className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                {value.caption}
              </figcaption>
            )}
          </figure>
        )
      },
      code: ({ value }: { value: CodeValue }) => (
        <CodeBlock language={value.language} code={value.code || ""} filename={value.filename} />
      ),
    },
    block: {
      h2: ({ value, children }) => {
        const id = idByKey[value._key ?? ""]
        return (
          <h2 id={id} className="scroll-mt-24 group flex items-center gap-2">
            <span>{children}</span>
            {id && (
              <a
                href={`#${id}`}
                className="inline-flex items-center justify-center w-11 h-11 -my-3 shrink-0 rounded-md opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-orange-500 text-base transition-opacity"
                aria-label="Link to this section"
              >
                #
              </a>
            )}
          </h2>
        )
      },
      h3: ({ value, children }) => {
        const id = idByKey[value._key ?? ""]
        return (
          <h3 id={id} className="scroll-mt-24 group flex items-center gap-2">
            <span>{children}</span>
            {id && (
              <a
                href={`#${id}`}
                className="inline-flex items-center justify-center w-11 h-11 -my-3 shrink-0 rounded-md opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-orange-500 text-sm transition-opacity"
                aria-label="Link to this section"
              >
                #
              </a>
            )}
          </h3>
        )
      },
    },
  }

  return (
    <>
      <ReadingProgressBar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />

      <article className="pb-24">
        {/* Top Header & Breadcrumb */}
        <header className="border-b border-gray-200/80 dark:border-gray-800/80 bg-gray-50/50 dark:bg-[#131313]/50 py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-6 flex-wrap">
              <Link
                href="/"
                className="inline-flex items-center gap-1 hover:text-orange-500 transition-colors min-h-[44px] py-2 active:scale-[0.98] duration-150"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Articles</span>
              </Link>
              {post.category && (
                <>
                  <span aria-hidden="true">/</span>
                  <Link
                    href={`/category/${post.category.slug}`}
                    className="hover:text-orange-500 transition-colors font-medium text-gray-700 dark:text-gray-300 min-h-[44px] py-2 inline-flex items-center active:scale-[0.98] duration-150"
                  >
                    {post.category.title}
                  </Link>
                </>
              )}
            </nav>

            {post.category && (
              <div className="mb-4">
                <Link
                  href={`/category/${post.category.slug}`}
                  className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 active:scale-95 transition-[background-color,transform] duration-150 before:absolute before:-inset-y-2 before:inset-x-0 before:content-['']"
                >
                  <Tag className="w-3 h-3" />
                  <span>{post.category.title}</span>
                </Link>
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.02em] text-gray-900 dark:text-white mb-6 leading-[1.12]">
              {post.title}
            </h1>

            {post.summary && (
              <p data-speakable className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">{post.summary}</p>
            )}

            <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-x-4 gap-y-2 text-xs md:text-sm text-gray-600 dark:text-gray-400 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold" aria-hidden="true">
                    P
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white block">{profile.name}</span>
                    <span className="text-[11px] text-gray-400">Author &amp; AI Engineer</span>
                  </div>
                </div>

                {post.date && (
                  <>
                    <span aria-hidden="true" className="hidden sm:inline">·</span>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                    </div>
                  </>
                )}

                <span aria-hidden="true" className="hidden sm:inline">·</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>{readTime}</span>
                </div>
              </div>

              <ShareButtons title={post.title} url={postUrl} />
            </div>
          </div>
        </header>

        {/* Hero image: preloaded as the LCP element, blurred placeholder while it loads */}
        {hasImageAsset(post.image) && (
          <div className="w-full max-w-5xl mx-auto px-4 pt-8 sm:pt-10 pb-6">
            <ViewTransition name={`cover-${slug}`} share="morph" default="none">
            <div className="relative w-full aspect-[16/9] rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 shadow-lg">
              <SanityImage
                image={post.image}
                alt={post.image.alt || ""}
                fill
                aspectRatio={16 / 9}
                preload
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
              />
            </div>
            </ViewTransition>
          </div>
        )}

        {/* Article Body + Table of Contents */}
        <div className="w-full px-4 mt-8">
          <div className="max-w-[1600px] mx-auto xl:grid xl:grid-cols-[1fr_minmax(0,48rem)_1fr] xl:gap-8 2xl:gap-14 items-start">
            {headings.length > 0 ? (
              <aside className="hidden xl:block justify-self-end w-48 xl:w-52 2xl:w-60 sticky top-24 self-start">
                <TableOfContents headings={headings} variant="desktop" />
              </aside>
            ) : (
              <div className="hidden xl:block" aria-hidden="true" />
            )}

            {/* Not <main>: the root layout already provides the page's single main landmark */}
            <div className="w-full max-w-3xl mx-auto min-w-0">
              {headings.length > 0 && (
                <div className="xl:hidden mb-8">
                  <TableOfContents headings={headings} variant="mobile" />
                </div>
              )}

              <div
                className="prose prose-lg md:prose-xl dark:prose-invert max-w-none
                prose-headings:font-semibold prose-headings:tracking-[-0.015em] prose-headings:text-gray-900 dark:prose-headings:text-white
                prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
                prose-a:text-orange-500 hover:prose-a:underline
                prose-strong:text-gray-900 dark:prose-strong:text-white
                prose-code:text-orange-500 dark:prose-code:text-orange-400 prose-code:font-mono prose-code:text-sm prose-code:bg-gray-100 dark:prose-code:bg-gray-800/80 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md
                prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 prose-blockquote:bg-orange-500/5 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg"
              >
                {post.content?.length ? (
                  <PortableText value={post.content} components={ptComponents} />
                ) : (
                  <p>No content available.</p>
                )}
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium text-gray-500 mr-2">Tagged in:</span>
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <AuthorBox />
            </div>

            <div className="hidden xl:block" aria-hidden="true" />
          </div>
        </div>

        {relatedPosts.length > 0 && (
          <section aria-labelledby="related-heading" className="container mx-auto px-4 max-w-5xl mt-20 pt-16 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 id="related-heading" className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                  {post.category ? `More on ${post.category.title}` : "Related Articles"}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Continue exploring deep engineering insights</p>
              </div>
              <Link href="/" className="text-sm font-medium text-orange-500 hover:underline hidden sm:inline-flex items-center gap-1 min-h-[44px] px-2 -mr-2 active:scale-95 duration-150">
                <span>View all posts</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rPost) => (
                <Link
                  key={rPost._id}
                  href={`/blog/${rPost.slug}`}
                  data-reveal
                  className="card-lift group p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151515] hover:border-orange-500/50 flex flex-col justify-between"
                >
                  <div>
                    {rPost.category && (
                      <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-medium bg-orange-500/10 text-orange-600 dark:text-orange-400 mb-3">
                        {rPost.category.title}
                      </span>
                    )}
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors mb-2 line-clamp-2 leading-snug">
                      {rPost.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed font-normal">{rPost.summary}</p>
                  </div>
                  <div className="text-[11px] text-gray-500 flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800 font-medium">
                    <span>{readTimeOf(rPost)}</span>
                    <span className="text-orange-500 group-hover:text-orange-600 transition-colors">Read →</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  )
}
