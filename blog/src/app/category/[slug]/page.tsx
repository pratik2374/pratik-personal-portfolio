import { client, urlFor, BlogPost, Category } from "@/lib/sanity"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { ArrowLeft, Clock, Calendar, Tag, ArrowRight } from "lucide-react"

export const revalidate = 3600

async function getCategoryData(slug: string): Promise<{ category: Category; posts: BlogPost[] } | null> {
  const categoryQuery = `*[_type == "category" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    color,
    order
  }`

  const category = await client.fetch(categoryQuery, { slug })
  if (!category) return null

  const postsQuery = `*[_type == "blog" && category._ref == $categoryId && !(_id in path("drafts.**"))] | order(date desc) {
    _id,
    title,
    "slug": slug.current,
    summary,
    date,
    readTime,
    tags,
    image,
    category->{ title, "slug": slug.current, color }
  }`

  const posts = await client.fetch(postsQuery, { categoryId: category._id })
  return { category, posts }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const data = await getCategoryData(slug)
  if (!data) return { title: "Category Not Found" }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://blog.pratikgond.tech"
  const catUrl = `${baseUrl}/category/${slug}`

  return {
    title: `${data.category.title} | Pratik Gond Blog`,
    description:
      data.category.description ||
      `Articles and engineering deep dives in ${data.category.title} by Pratik Gond.`,
    alternates: {
      canonical: catUrl,
    },
    openGraph: {
      title: `${data.category.title} | Pratik Gond Blog`,
      description: data.category.description || `Articles on ${data.category.title}`,
      url: catUrl,
      type: "website",
    },
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = await getCategoryData(slug)

  if (!data) {
    notFound()
  }

  const { category, posts } = data
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://blog.pratikgond.tech"

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": category.title,
    "description": category.description || "",
    "url": `${baseUrl}/category/${slug}`,
    "publisher": {
      "@type": "Person",
      "name": "Pratik Gond",
      "url": "https://pratikgond.tech",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8" aria-label="Breadcrumb">
          <Link
            href="/"
            className="inline-flex items-center gap-1 hover:text-orange-500 transition-colors min-h-[44px] py-2 active:scale-[0.98] duration-150"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Articles</span>
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium">{category.title}</span>
        </nav>

        {/* Category Header */}
        <header className="mb-14 border-b border-gray-200 dark:border-gray-800 pb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 mb-4">
            <Tag className="w-3 h-3" />
            <span>Topic Category</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.02em] text-gray-900 dark:text-white mb-4 leading-[1.12]">
            {category.title}
          </h1>
          {category.description && (
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed font-normal">
              {category.description}
            </p>
          )}
          <div className="mt-4 text-sm text-gray-500 font-normal">
            {posts.length} {posts.length === 1 ? "article" : "articles"} published in this topic
          </div>
        </header>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl p-8">
            <p className="text-gray-500 text-lg mb-4">No articles published in this category yet.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 active:scale-[0.98] transition-all duration-150"
            >
              <span>Back to Homepage</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-[#151515] overflow-hidden active:scale-[0.99] transition-transform duration-150"
              >
                {/* Clean Thumbnail without hover scale jump */}
                <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {post.image ? (
                    <Image
                      src={urlFor(post.image).width(700).height(394).url()}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-50 dark:bg-gray-900/60 flex items-center justify-center p-6 text-center">
                      <span className="text-base font-medium text-gray-400 dark:text-gray-500 group-hover:text-orange-500 transition-colors line-clamp-2">
                        {post.title}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                      {post.date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
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
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{post.readTime || "5 min read"}</span>
                      </div>
                    </div>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-orange-500 transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h2>

                    {post.summary && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 leading-relaxed font-normal">
                        {post.summary}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs font-medium text-orange-500">
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4 group-hover:text-orange-600 transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
