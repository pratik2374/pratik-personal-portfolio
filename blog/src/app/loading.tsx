export default function GlobalLoading() {
  return (
    <div className="container mx-auto px-4 max-w-5xl py-12 animate-pulse space-y-12">
      {/* Top Hero Skeleton */}
      <div className="space-y-4 max-w-2xl">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg" />
        <div className="h-4 w-full bg-gray-200/80 dark:bg-gray-800/80 rounded-md" />
        <div className="h-4 w-3/4 bg-gray-200/80 dark:bg-gray-800/80 rounded-md" />
      </div>

      {/* Featured Card Skeleton */}
      <div className="w-full aspect-[21/9] min-h-[300px] rounded-3xl bg-gray-200 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-800" />

      {/* Article Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-[#151515]/50 space-y-4"
          >
            <div className="h-4 w-20 bg-orange-500/10 rounded-md" />
            <div className="space-y-2">
              <div className="h-5 w-full bg-gray-200 dark:bg-gray-800 rounded-md" />
              <div className="h-5 w-4/5 bg-gray-200 dark:bg-gray-800 rounded-md" />
            </div>
            <div className="space-y-1.5 pt-2">
              <div className="h-3.5 w-full bg-gray-200/70 dark:bg-gray-800/70 rounded-md" />
              <div className="h-3.5 w-5/6 bg-gray-200/70 dark:bg-gray-800/70 rounded-md" />
            </div>
            <div className="pt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-800/80">
              <div className="h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded-md" />
              <div className="h-3 w-16 bg-gray-200 dark:bg-gray-800 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
