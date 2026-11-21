import { ArticleCardSkeleton } from "@/components/Skeletons"

export default function CategoryLoading() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl motion-safe:animate-pulse" role="status" aria-label="Loading articles">
      <div className="flex items-center gap-2 mb-8 min-h-[44px]">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded-md" />
        <div className="h-4 w-3 bg-gray-200 dark:bg-gray-800 rounded-md" />
        <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded-md" />
      </div>

      <div className="mb-14 border-b border-gray-200 dark:border-gray-800 pb-10 space-y-4">
        <div className="h-6 w-32 bg-orange-500/10 rounded-lg border border-orange-500/20" />
        <div className="h-12 md:h-14 w-2/3 bg-gray-200 dark:bg-gray-800 rounded-xl" />
        <div className="h-5 w-full max-w-3xl bg-gray-200/80 dark:bg-gray-800/80 rounded-md" />
        <div className="h-4 w-48 bg-gray-200/70 dark:bg-gray-800/70 rounded-md" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }, (_, i) => (
          <ArticleCardSkeleton key={i} boxed />
        ))}
      </div>
    </div>
  )
}
