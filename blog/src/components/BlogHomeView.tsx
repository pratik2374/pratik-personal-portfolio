"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { BlogPost, Category, urlFor } from "@/lib/sanity"
import { Search } from "lucide-react"

interface BlogHomeViewProps {
  categories: Category[]
  allPosts: BlogPost[]
}

export function BlogHomeView({ categories, allPosts }: BlogHomeViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  // Filter posts based on category and search query
  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const matchesCategory =
        selectedCategory === "all" || post.category?.slug === selectedCategory

      const matchesSearch =
        searchQuery.trim() === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.summary && post.summary.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesCategory && matchesSearch
    })
  }, [allPosts, selectedCategory, searchQuery])

  // Group posts by category for the default "All" topic-wise display
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

  return (
    <div className="space-y-12">
      {/* 1. Clean, High-End Editorial Hero Header */}
      <div className="max-w-3xl pt-2">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
          Exploring <span className="text-orange-500">ideas</span>, engineering, and the future of web.
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-normal">
          A collection of thoughts on software development, artificial intelligence, and building scalable systems by Pratik Gond.
        </p>
      </div>

      {/* 2. Homepage Cover Image (Dedicated artwork banner, not tied to a post) */}
      <div className="relative aspect-[21/9] sm:aspect-[21/8] w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200/80 dark:border-gray-800/80 shadow-xs">
        <Image
          src="/cover.jpg"
          alt="Pratik Gond's Engineering Blog Cover"
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 1024px"
          className="object-cover"
        />
      </div>

      {/* 3. Clean, Responsive Topic Navigation & Search (Full flex-wrap, no cutoffs or hidden items) */}
      <div className="pt-2 pb-6 border-b border-gray-200 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Wrapping Tabs so all categories are fully visible */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3.5 py-1.5 rounded-lg text-sm transition-colors cursor-pointer shrink-0 ${
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
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3.5 py-1.5 rounded-lg text-sm transition-colors cursor-pointer shrink-0 ${
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

        {/* Clean, Non-intrusive Search Input */}
        <div className="relative w-full md:w-56 shrink-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:border-orange-500 transition-colors"
          />
        </div>
      </div>

      {/* 4. Content Area: Topic-Wise Distribution OR Filtered Results */}
      {selectedCategory !== "all" || searchQuery.trim() !== "" ? (
        /* Filtered List View */
        <div className="pt-2">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredPosts.map((post) => (
                <ArticleCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Topic-Wise Distribution across Categories */
        <div className="space-y-20 pt-2">
          {topicSections.map(({ category, posts }) => (
            <section key={category._id}>
              {/* Category Header */}
              <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-gray-200 dark:border-gray-800">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                    {category.title}
                  </h2>
                  {category.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">
                      {category.description}
                    </p>
                  )}
                </div>

                <Link
                  href={`/category/${category.slug}`}
                  className="text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors shrink-0 ml-4"
                >
                  View all →
                </Link>
              </div>

              {/* Grid of articles for this category */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {posts.map((post) => (
                  <ArticleCard key={post._id} post={post} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

function ArticleCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col">
      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-4 border border-gray-200/50 dark:border-gray-800/50">
        {post.image ? (
          <Image
            src={urlFor(post.image).width(600).height(340).url()}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center p-6 text-center">
            <span className="text-sm font-semibold text-gray-400 dark:text-gray-500 group-hover:text-orange-500 transition-colors line-clamp-2">
              {post.title}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
          {post.date && (
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          )}
          {post.date && <span>·</span>}
          <span>{post.readTime || "5 min read"}</span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-500 transition-colors line-clamp-2 leading-snug">
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
