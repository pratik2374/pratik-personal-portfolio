/** Skeleton for an article card, matching ArticleCard / category cards (16:9 thumbnail, meta, title, summary). */
export function ArticleCardSkeleton({ boxed = false }: { boxed?: boolean }) {
  return (
    <div
      className={`flex flex-col ${
        boxed ? "rounded-2xl border border-gray-200/80 dark:border-gray-800/80 overflow-hidden bg-white dark:bg-[#151515]" : ""
      }`}
    >
      <div className={`aspect-video w-full bg-gray-200 dark:bg-gray-800/80 ${boxed ? "" : "rounded-xl mb-4"}`} />
      <div className={`space-y-3 ${boxed ? "p-6" : ""}`}>
        <div className="h-3 w-32 bg-gray-200 dark:bg-gray-800 rounded-md" />
        <div className="space-y-2">
          <div className="h-5 w-full bg-gray-200 dark:bg-gray-800 rounded-md" />
          <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-800 rounded-md" />
        </div>
        <div className="space-y-1.5">
          <div className="h-3.5 w-full bg-gray-200/70 dark:bg-gray-800/70 rounded-md" />
          <div className="h-3.5 w-5/6 bg-gray-200/70 dark:bg-gray-800/70 rounded-md" />
        </div>
      </div>
    </div>
  )
}
