export default function BlogPostLoading() {
  return (
    <article className="pb-24 animate-pulse">
      {/* Top Header & Breadcrumb Skeleton */}
      <header className="border-b border-gray-200/80 dark:border-gray-800/80 bg-gray-50/50 dark:bg-[#131313]/50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb Navigation Skeleton */}
          <div className="flex items-center gap-2 mb-6">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded-md" />
            <div className="h-4 w-3 bg-gray-200 dark:bg-gray-800 rounded-md" />
            <div className="h-4 w-36 bg-gray-200 dark:bg-gray-800 rounded-md" />
          </div>

          {/* Category Badge Skeleton */}
          <div className="mb-4">
            <div className="h-6 w-32 bg-orange-500/10 dark:bg-orange-500/20 rounded-lg border border-orange-500/20" />
          </div>

          {/* Headline Skeleton */}
          <div className="space-y-3 mb-6">
            <div className="h-10 sm:h-12 w-11/12 bg-gray-200 dark:bg-gray-800 rounded-xl" />
            <div className="h-10 sm:h-12 w-3/4 bg-gray-200 dark:bg-gray-800 rounded-xl" />
          </div>

          {/* Summary Excerpt Skeleton */}
          <div className="space-y-2 mb-8 max-w-3xl">
            <div className="h-5 w-full bg-gray-200/80 dark:bg-gray-800/80 rounded-md" />
            <div className="h-5 w-5/6 bg-gray-200/80 dark:bg-gray-800/80 rounded-md" />
          </div>

          {/* Metadata Strip Skeleton */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="space-y-1.5">
              <div className="h-3.5 w-24 bg-gray-200 dark:bg-gray-800 rounded-md" />
              <div className="h-2.5 w-32 bg-gray-200/70 dark:bg-gray-800/70 rounded-md" />
            </div>
            <div className="h-3.5 w-3 bg-gray-200 dark:bg-gray-800 rounded-md" />
            <div className="h-3.5 w-20 bg-gray-200 dark:bg-gray-800 rounded-md" />
            <div className="h-3.5 w-3 bg-gray-200 dark:bg-gray-800 rounded-md" />
            <div className="h-3.5 w-16 bg-gray-200 dark:bg-gray-800 rounded-md" />
          </div>
        </div>
      </header>

      {/* Hero Image Showcase Skeleton */}
      <div className="w-full max-w-5xl mx-auto px-4 pt-10 pb-6 flex justify-center">
        <div className="w-full aspect-[16/9] max-h-[500px] rounded-2xl bg-gray-200 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-800 shadow-md" />
      </div>

      {/* Article Body + Table of Contents Skeleton (Matches 3-Column Grid) */}
      <div className="w-full px-4 mt-8">
        <div className="max-w-[1600px] mx-auto xl:grid xl:grid-cols-[1fr_minmax(0,48rem)_1fr] xl:gap-8 2xl:gap-14 items-start">
          {/* Desktop Left Rail TOC Skeleton */}
          <aside className="hidden xl:block justify-self-end w-48 xl:w-52 2xl:w-60">
            <div className="space-y-3 border-l-2 border-gray-200 dark:border-gray-800 pl-3">
              <div className="h-4 w-28 bg-orange-500/20 rounded-md mb-4" />
              <div className="h-3 w-40 bg-gray-200 dark:bg-gray-800 rounded-md" />
              <div className="h-2.5 w-32 bg-gray-200/70 dark:bg-gray-800/70 rounded-md ml-3" />
              <div className="h-2.5 w-36 bg-gray-200/70 dark:bg-gray-800/70 rounded-md ml-3" />
              <div className="h-3 w-44 bg-gray-200 dark:bg-gray-800 rounded-md pt-1" />
              <div className="h-2.5 w-32 bg-gray-200/70 dark:bg-gray-800/70 rounded-md ml-3" />
              <div className="h-2.5 w-28 bg-gray-200/70 dark:bg-gray-800/70 rounded-md ml-3" />
              <div className="h-3 w-36 bg-gray-200 dark:bg-gray-800 rounded-md pt-1" />
            </div>
          </aside>

          {/* Main Reading Column Skeleton */}
          <main className="w-full max-w-3xl mx-auto min-w-0 space-y-8">
            {/* Paragraph Block 1 */}
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded-md" />
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded-md" />
              <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-800 rounded-md" />
              <div className="h-4 w-4/6 bg-gray-200 dark:bg-gray-800 rounded-md" />
            </div>

            {/* Subheading Skeleton */}
            <div className="pt-4">
              <div className="h-7 w-2/3 bg-gray-200 dark:bg-gray-800 rounded-lg" />
            </div>

            {/* Paragraph Block 2 */}
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded-md" />
              <div className="h-4 w-11/12 bg-gray-200 dark:bg-gray-800 rounded-md" />
              <div className="h-4 w-4/5 bg-gray-200 dark:bg-gray-800 rounded-md" />
            </div>

            {/* Code Block Skeleton */}
            <div className="p-6 rounded-2xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-2.5">
              <div className="h-3.5 w-1/3 bg-gray-200 dark:bg-gray-800 rounded-md" />
              <div className="h-3.5 w-2/3 bg-gray-200 dark:bg-gray-800 rounded-md" />
              <div className="h-3.5 w-1/2 bg-gray-200 dark:bg-gray-800 rounded-md" />
              <div className="h-3.5 w-3/5 bg-gray-200 dark:bg-gray-800 rounded-md" />
            </div>
          </main>

          {/* Right Column Balancer Spacer */}
          <div className="hidden xl:block" aria-hidden="true" />
        </div>
      </div>
    </article>
  )
}
