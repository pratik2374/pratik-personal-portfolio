import { ArticleCardSkeleton } from "@/components/Skeletons"

export default function GlobalLoading() {
  return (
    <div className="container mx-auto px-4 max-w-5xl py-12 motion-safe:animate-pulse space-y-12" role="status" aria-label="Loading">
      {/* Top Hero Skeleton */}
      <div className="space-y-4 max-w-2xl">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg" />
        <div className="h-4 w-full bg-gray-200/80 dark:bg-gray-800/80 rounded-md" />
        <div className="h-4 w-3/4 bg-gray-200/80 dark:bg-gray-800/80 rounded-md" />
      </div>

      {/* Featured Card Skeleton */}
      <div className="w-full aspect-[21/9] sm:aspect-[21/8] rounded-2xl bg-gray-200 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-800" />

      {/* Article Cards Grid Skeleton (matches ArticleCard) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }, (_, i) => (
          <ArticleCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
