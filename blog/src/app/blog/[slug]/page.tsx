import { client, urlFor, BlogPost } from "@/lib/sanity"
import { PortableText } from "@portabletext/react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { ReadingProgressBar } from "@/components/ReadingProgressBar"
import { CodeBlock } from "@/components/CodeBlock"
import { ShareButtons } from "@/components/ShareButtons"
import { TableOfContents, TocHeading } from "@/components/TableOfContents"
import { Clock, Calendar, ArrowLeft, Tag, ArrowRight, BookOpen } from "lucide-react"

export const revalidate = 3600 // ISR revalidation

async function getPost(slug: string): Promise<BlogPost | null> {
  const query = `*[_type == "blog" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    _id,
    title,
    summary,
    date,
    readTime,
    image,
    content,
    tags,
    category->{
      _id,
      title,
      "slug": slug.current,
      color,
      description
    }
  }`
  return client.fetch(query, { slug })
}

async function getRelatedPosts(currentId: string, categoryRef?: string): Promise<BlogPost[]> {
  if (!categoryRef) {
    const fallbackQuery = `*[_type == "blog" && _id != $currentId && !(_id in path("drafts.**"))] | order(date desc)[0...3] {
      _id,
      title,
      "slug": slug.current,
      summary,
      date,
      readTime,
      category->{ title, "slug": slug.current, color },
      image
    }`
    return client.fetch(fallbackQuery, { currentId })
  }

  const query = `*[_type == "blog" && (category._ref == $categoryRef || _id != $currentId) && _id != $currentId && !(_id in path("drafts.**"))] | order(date desc)[0...3] {
    _id,
    title,
    "slug": slug.current,
    summary,
    date,
    readTime,
    category->{ title, "slug": slug.current, color },
    image
  }`
  return client.fetch(query, { currentId, categoryRef })
}

function extractHeadings(content: any[]): TocHeading[] {
  if (!Array.isArray(content)) return []
  const headings: TocHeading[] = []

  for (const block of content) {
    if (block._type === "block" && (block.style === "h2" || block.style === "h3")) {
      const text = block.children?.map((c: any) => c.text).join("") || ""
      if (text.trim()) {
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
        headings.push({
          id,
          text,
          level: block.style === "h2" ? 2 : 3,
        })
      }
    }
  }
  return headings
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: "Post Not Found" }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://blog.pratikgond.tech"
  const postUrl = `${baseUrl}/blog/${slug}`
  const ogImage = post.image
    ? urlFor(post.image).width(1200).height(630).url()
    : `${baseUrl}/favicon.png`

  return {
    title: post.title,
    description: post.summary || `Read ${post.title} by Pratik Gond`,
    keywords: post.tags || [post.category?.title || "Engineering"],
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: `${post.title} | Pratik Gond`,
      description: post.summary || "",
      type: "article",
      publishedTime: post.date,
      url: postUrl,
      authors: ["Pratik Gond"],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary || "",
      creator: "@pratikgond",
      images: [ogImage],
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://blog.pratikgond.tech"
  const postUrl = `${baseUrl}/blog/${slug}`
  const headings = extractHeadings(post.content || [])
  const relatedPosts = await getRelatedPosts(post._id, post.category?._id)

  // Full Rich JSON-LD for Google Extreme Ranking & Sitelinks
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${postUrl}#article`,
        "isPartOf": {
          "@type": "WebSite",
          "@id": `${baseUrl}/#website`,
          "name": "Pratik Gond Blog",
        },
        "headline": post.title,
        "description": post.summary || "",
        "url": postUrl,
        "mainEntityOfPage": postUrl,
        "datePublished": post.date || "2026-09-01",
        "dateModified": post.date || "2026-09-01",
        "author": {
          "@type": "Person",
          "name": "Pratik Gond",
          "url": "https://pratikgond.tech",
        },
        "publisher": {
          "@type": "Person",
          "name": "Pratik Gond",
          "url": "https://pratikgond.tech",
        },
        "image": post.image ? [urlFor(post.image).width(1200).height(630).url()] : [`${baseUrl}/favicon.png`],
        "articleSection": post.category?.title || "Technology",
        "keywords": post.tags?.join(", ") || "",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${postUrl}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": baseUrl,
          },
          ...(post.category
            ? [
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": post.category.title,
                  "item": `${baseUrl}/category/${post.category.slug}`,
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": post.title,
                  "item": postUrl,
                },
              ]
            : [
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": post.title,
                  "item": postUrl,
                },
              ]),
        ],
      },
    ],
  }

  const ptComponents = {
    types: {
      image: ({ value }: any) => {
        if (!value?.asset?._ref) return null
        return (
          <figure className="my-10 flex flex-col items-center">
            <div className="relative w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 shadow-md">
              <img
                src={urlFor(value).width(1400).url()}
                alt={value.alt || post.title || "Article visual"}
                className="w-full h-auto max-h-[700px] object-contain mx-auto"
                loading="lazy"
              />
            </div>
            {(value.caption || value.alt) && (
              <figcaption className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400 max-w-xl">
                {value.caption || value.alt}
              </figcaption>
            )}
          </figure>
        )
      },
      code: ({ value }: any) => {
        return <CodeBlock language={value.language} code={value.code || ""} />
      },
    },
    block: {
      h2: ({ children }: any) => {
        const text = String(children)
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
        return (
          <h2 id={id} className="scroll-mt-24 group flex items-center gap-2">
            <span>{children}</span>
            <a
              href={`#${id}`}
              className="opacity-0 group-hover:opacity-100 text-orange-500 text-base transition-opacity"
              aria-label="Direct anchor link"
            >
              #
            </a>
          </h2>
        )
      },
      h3: ({ children }: any) => {
        const text = String(children)
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
        return (
          <h3 id={id} className="scroll-mt-24 group flex items-center gap-2">
            <span>{children}</span>
            <a
              href={`#${id}`}
              className="opacity-0 group-hover:opacity-100 text-orange-500 text-sm transition-opacity"
              aria-label="Direct anchor link"
            >
              #
            </a>
          </h3>
        )
      },
    },
  }

  return (
    <>
      <ReadingProgressBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="pb-24">
        {/* Top Header & Breadcrumb */}
        <header className="border-b border-gray-200/80 dark:border-gray-800/80 bg-gray-50/50 dark:bg-[#131313]/50 py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-6 flex-wrap">
              <Link
                href="/"
                className="inline-flex items-center gap-1 hover:text-orange-500 transition-colors min-h-[44px] py-2 active:scale-[0.98] duration-150"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Articles</span>
              </Link>
              {post.category && (
                <>
                  <span>/</span>
                  <Link
                    href={`/category/${post.category.slug}`}
                    className="hover:text-orange-500 transition-colors font-medium text-gray-700 dark:text-gray-300 min-h-[44px] py-2 inline-flex items-center active:scale-[0.98] duration-150"
                  >
                    {post.category.title}
                  </Link>
                </>
              )}
            </div>

            {/* Category Badge */}
            {post.category && (
              <div className="mb-4">
                <Link
                  href={`/category/${post.category.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 active:scale-95 transition-all duration-150"
                >
                  <Tag className="w-3 h-3" />
                  <span>{post.category.title}</span>
                </Link>
              </div>
            )}

            {/* Article Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.02em] text-gray-900 dark:text-white mb-6 leading-[1.12]">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.summary && (
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                {post.summary}
              </p>
            )}

            {/* Metadata strip & Share buttons */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                    P
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white block">Pratik Gond</span>
                    <span className="text-[11px] text-gray-400">Author &amp; AI Engineer</span>
                  </div>
                </div>

                <span>·</span>

                {post.date && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                  </div>
                )}

                <span>·</span>

                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>{post.readTime || "5 min read"}</span>
                </div>
              </div>

              <ShareButtons title={post.title} url={postUrl} />
            </div>
          </div>
        </header>

        {/* Hero Image Showcase */}
        {post.image && (
          <div className="w-full max-w-5xl mx-auto px-4 pt-10 pb-6 flex justify-center">
            <div className="relative w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 shadow-lg">
              <img
                src={urlFor(post.image).width(1600).url()}
                alt={post.title || "Featured cover image"}
                className="w-full h-auto max-h-[600px] object-cover"
              />
            </div>
          </div>
        )}

        {/* Article Body + Table of Contents */}
        <div className="w-full px-4 mt-8">
          <div className="max-w-[1600px] mx-auto xl:grid xl:grid-cols-[1fr_minmax(0,48rem)_1fr] xl:gap-8 2xl:gap-14 items-start">
            {/* Desktop Left Sticky TOC Rail */}
            {headings.length > 0 ? (
              <aside className="hidden xl:block justify-self-end w-48 xl:w-52 2xl:w-60 sticky top-24 self-start max-h-[calc(100vh-8rem)] overflow-y-auto pr-4">
                <TableOfContents headings={headings} variant="desktop" />
              </aside>
            ) : (
              <div className="hidden xl:block" aria-hidden="true" />
            )}

            {/* Main Content Column - ALWAYS CENTERED */}
            <main className="w-full max-w-3xl mx-auto min-w-0">
              {/* Mobile / Tablet Collapsible Expander TOC */}
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
                {post.content ? (
                  <PortableText value={post.content} components={ptComponents} />
                ) : (
                  <p>No content available.</p>
                )}
              </div>

              {/* Tags Footer */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium text-gray-500 mr-2">
                    Tagged in:
                  </span>
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

              {/* Author Box */}
              <div className="mt-16 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-[#141414] flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center text-white text-xl font-medium shrink-0">
                  P
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Written by Pratik Gond</h3>
                    <a
                      href="https://pratikgond.tech"
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-medium text-orange-500 hover:underline active:scale-95 duration-150"
                    >
                      Portfolio ↗
                    </a>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                    Software &amp; AI Engineer with 12+ years of experience building modern web architectures, autonomous LLM agents, and distributed applications.
                  </p>
                  <div className="flex items-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                    <a href="https://github.com/pratikgond" target="_blank" rel="noreferrer" className="hover:text-black dark:hover:text-white active:scale-95 duration-150">
                      GitHub
                    </a>
                    <span>·</span>
                    <a href="https://linkedin.com/in/pratikgond" target="_blank" rel="noreferrer" className="hover:text-blue-500 active:scale-95 duration-150">
                      LinkedIn
                    </a>
                    <span>·</span>
                    <Link href="/contact" className="hover:text-orange-500 active:scale-95 duration-150">
                      Contact
                    </Link>
                  </div>
                </div>
              </div>
            </main>

            {/* Right Column Balancer Spacer - Ensures Column 2 is 100% mathematically centered */}
            <div className="hidden xl:block" aria-hidden="true" />
          </div>
        </div>

        {/* Related Posts Grid */}
        {relatedPosts.length > 0 && (
          <div className="container mx-auto px-4 max-w-5xl mt-20 pt-16 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">Related Articles</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Continue exploring deep engineering insights</p>
              </div>
              <Link href="/" className="text-sm font-medium text-orange-500 hover:underline hidden sm:inline-flex items-center gap-1 active:scale-95 duration-150">
                <span>View all posts</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rPost) => (
                <Link
                  key={rPost._id}
                  href={`/blog/${rPost.slug}`}
                  className="group p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151515] hover:border-orange-500/50 active:scale-[0.99] transition-all duration-150 flex flex-col justify-between"
                >
                  <div>
                    {rPost.category && (
                      <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-medium bg-orange-500/10 text-orange-600 dark:text-orange-400 mb-3">
                        {rPost.category.title}
                      </span>
                    )}
                    <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors mb-2 line-clamp-2 leading-snug">
                      {rPost.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed font-normal">
                      {rPost.summary}
                    </p>
                  </div>
                  <div className="text-[11px] text-gray-500 flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800 font-medium">
                    <span>{rPost.readTime || "5 min read"}</span>
                    <span className="text-orange-500 group-hover:text-orange-600 transition-colors">Read →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  )
}
