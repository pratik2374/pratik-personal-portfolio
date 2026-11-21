"use client"

import { useState, useMemo, useRef, useDeferredValue, ViewTransition } from "react"
import Link from "next/link"
import Image from "next/image"
import type { BlogPost, Category } from "@/lib/sanity"
import { formatDate, readTimeOf, hasImageAsset } from "@/lib/format"
import { SanityImage } from "./SanityImage"
import { Search, X } from "lucide-react"

interface BlogHomeViewProps {
  categories: Category[]
  allPosts: BlogPost[]
}

export function BlogHomeView({ categories, allPosts }: BlogHomeViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  // Typing stays instant; filtering the list happens at lower priority.
  const deferredQuery = useDeferredValue(searchQuery)
  const articlesRef = useRef<HTMLDivElement>(null)

  // Filter posts based on category and search query
  const filteredPosts = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase()
    return allPosts.filter((post) => {
      const matchesCategory =
        selectedCategory === "all" || post.category?.slug === selectedCategory

      const matchesSearch =
        q === "" ||
        post.title.toLowerCase().includes(q) ||
        Boolean(post.summary?.toLowerCase().includes(q)) ||
        Boolean(post.tags?.some((t) => t.toLowerCase().includes(q)))

      return matchesCategory && matchesSearch
    })
  }, [allPosts, selectedCategory, deferredQuery])

  // Group posts by category for default "All" topic-wise display
  const topicSections = useMemo(() => {
    return categories
      .map((cat) => {
        const catPosts = allPosts.filter((p) => p.category?.slug === cat.slug)
        return {
          category: cat,
          posts: catPosts,
        }
      })
      .filter((section) => section.posts.length > 0)
  }, [categories, allPosts])

  // Posts without a category (or whose category was deleted) would otherwise never show in the default view.
  const uncategorizedPosts = useMemo(() => {
    const known = new Set(categories.map((c) => c.slug))
    return allPosts.filter((p) => !p.category?.slug || !known.has(p.category.slug))
  }, [categories, allPosts])

  // PDF Test 3: Tap active tab scrolls to the top of the list
  const handleCategorySelect = (slug: string) => {
    if (selectedCategory === slug) {
      articlesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    } else {
      setSelectedCategory(slug)
    }
  }

  return (
    <div className="space-y-12">
      {/* 1. Quiet, Confident Editorial Heading */}
      <div className="max-w-3xl pt-2">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.02em] text-gray-900 dark:text-white mb-5 leading-[1.1]">
          Exploring <span className="text-orange-500">ideas</span>, engineering, and the future of web.
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-normal">
          A collection of thoughts on software development, artificial intelligence, and building scalable systems by Pratik Gond.
        </p>
      </div>

      {/* 2. Homepage Cover Image (Anchoring visual banner, not an article card) */}
      <div className="relative aspect-[21/9] sm:aspect-[21/8] w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200/80 dark:border-gray-800/80 shadow-xs">
        <Image
          src="/cover.jpg"
          alt="Pratik Gond's Engineering Blog Cover"
          fill
          preload
          sizes="(max-width: 1200px) 100vw, 1024px"
          className="object-cover"
        />
      </div>

      {/* 3. Responsive Topic Navigation & Native Touch-Friendly Search */}
      <div
        ref={articlesRef}
        className="pt-2 pb-6 border-b border-gray-200 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4 scroll-mt-24"
      >
        {/* Topic tabs: one swipeable row on phones (no 3-line wrap), wrapping row from md up */}
        <div
          role="group"
          aria-label="Filter by topic"
          className="-mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 flex flex-nowrap md:flex-wrap items-center gap-1.5 sm:gap-2 overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <button
            onClick={() => handleCategorySelect("all")}
            aria-pressed={selectedCategory === "all"}
            className={`min-h-[44px] px-3.5 py-1.5 rounded-lg text-sm whitespace-nowrap snap-start transition-[background-color,color,transform] duration-150 cursor-pointer shrink-0 active:scale-[0.96] flex items-center ${
              selectedCategory === "all"
                ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 font-semibold"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/60 font-medium"
            }`}
          >
            All Articles
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug
            return (
              <button
                key={cat._id}
                onClick={() => handleCategorySelect(cat.slug)}
                aria-pressed={isSelected}
                className={`min-h-[44px] px-3.5 py-1.5 rounded-lg text-sm whitespace-nowrap snap-start transition-[background-color,color,transform] duration-150 cursor-pointer shrink-0 active:scale-[0.96] flex items-center ${
                  isSelected
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 font-semibold"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/60 font-medium"
                }`}
              >
                {cat.title}
              </button>
            )
          })}
        </div>

        {/* Search Input: text-base on mobile to avoid iOS Safari zoom (PDF Rule 2) */}
        <div className="relative w-full md:w-60 shrink-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="search"
            aria-label="Search articles"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-9 pr-10 text-base sm:text-sm rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:border-orange-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 4. Content Area: Topic-Wise Distribution OR Filtered Results */}
      {selectedCategory !== "all" || searchQuery.trim() !== "" ? (
        /* Filtered List View */
        <div className="pt-2">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {searchQuery.trim() !== ""
                ? `Search results for "${searchQuery}"`
                : categories.find((c) => c.slug === selectedCategory)?.title || "Articles"}
            </h2>
            <button
              onClick={() => {
                setSelectedCategory("all")
                setSearchQuery("")
              }}
              className="text-xs text-orange-500 hover:underline cursor-pointer"
            >
              Reset to all
            </button>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="py-16 text-center text-gray-500 text-sm">
              No matching articles found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <ArticleCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Topic-Wise Distribution across Categories */
        <div className="space-y-16 pt-2">
          {topicSections.map(({ category, posts }) => (
            <section key={category._id}>
              {/* Category Header */}
              <div data-reveal className="flex items-baseline justify-between mb-8 pb-3 border-b border-gray-200 dark:border-gray-800">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                    {category.title}
                  </h2>
                  {category.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl font-normal">
                      {category.description}
                    </p>
                  )}
                </div>

                <Link
                  href={`/category/${category.slug}`}
                  className="inline-flex items-center min-h-[44px] px-2 -mr-2 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors shrink-0 ml-4 active:scale-95"
                >
                  View all →
                </Link>
              </div>

              {/* Grid of articles for this category */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <ArticleCard key={post._id} post={post} />
                ))}
              </div>
            </section>
          ))}

          {uncategorizedPosts.length > 0 && (
            <section>
              <div data-reveal className="mb-8 pb-3 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">More articles</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {uncategorizedPosts.map((post) => (
                  <ArticleCard key={post._id} post={post} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}

function ArticleCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      data-reveal
      className="card-lift card-lift-flat group flex flex-col rounded-xl"
    >
      {/* Thumbnail morphs into the post's hero image on navigation (same ViewTransition name) */}
      <ViewTransition name={`cover-${post.slug}`} share="morph" default="none">
      <div className="card-lift-thumb relative aspect-video w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-4 border border-gray-200/60 dark:border-gray-800/60">
        {hasImageAsset(post.image) ? (
          <SanityImage
            image={post.image}
            alt=""
            fill
            aspectRatio={16 / 9}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-50 dark:bg-gray-900/60 flex items-center justify-center p-6 text-center">
            <span className="text-sm font-medium text-gray-400 dark:text-gray-500 group-hover:text-orange-500 transition-colors line-clamp-2">
              {post.title}
            </span>
          </div>
        )}
      </div>
      </ViewTransition>

      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
          {post.date && (
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          )}
          {post.date && <span aria-hidden="true">·</span>}
          <span>{readTimeOf(post)}</span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-orange-500 transition-colors line-clamp-2 leading-snug">
          {post.title}
        </h3>

        {post.summary && (
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed">
            {post.summary}
          </p>
        )}
      </div>
    </Link>
  )
}
