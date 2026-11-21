/**
 * Skeleton placeholders that mirror the real card/page layouts, so content
 * swaps in without the page jumping. Shimmer is disabled for reduced motion
 * (see .skeleton in styles/index.css).
 */

export function Skeleton({ className = '' }) {
  return <div aria-hidden="true" className={`skeleton rounded-md ${className}`} />
}

function Busy({ label, className = '', children }) {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  )
}

export function ProjectListSkeleton({ count = 3 }) {
  return (
    <Busy label="Loading projects" className="flex flex-col gap-2">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-center gap-3.5 sm:gap-6 p-3 sm:p-4 rounded-2xl">
          <Skeleton className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 shrink-0 rounded-xl" />
          <div className="flex-1 min-w-0 pr-6 sm:pr-8">
            <Skeleton className="h-6 sm:h-7 w-2/3 mb-2" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      ))}
    </Busy>
  )
}

export function ExperienceListSkeleton({ count = 3 }) {
  return (
    <Busy label="Loading experience" className="flex flex-col gap-2">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="p-5 sm:p-6 rounded-2xl">
          <Skeleton className="h-6 sm:h-7 w-1/3 mb-2.5" />
          <Skeleton className="h-4 w-1/4 mb-3" />
          <Skeleton className="h-4 w-4/5 mb-2" />
          <Skeleton className="h-3 w-1/5 mt-4" />
        </div>
      ))}
    </Busy>
  )
}

export function ToolGridSkeleton({ count = 6 }) {
  return (
    <Busy label="Loading tools" className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="p-4 sm:p-6 bg-white/5 rounded-2xl flex flex-col">
          <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 rounded-xl" />
          <Skeleton className="h-5 w-2/3 mb-2" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      ))}
    </Busy>
  )
}

export function BlogListSkeleton({ count = 2 }) {
  return (
    <Busy label="Loading articles" className="flex flex-col">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="border-b border-white/5 pb-8 mb-8 last:border-0">
          <Skeleton className="h-7 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3 mb-6" />
          <div className="flex justify-between">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </Busy>
  )
}

export function PageHeadingSkeleton() {
  return (
    <div className="mb-8 sm:mb-12" aria-hidden="true">
      <Skeleton className="h-10 sm:h-14 md:h-[68px] w-1/2 mb-2" />
      <Skeleton className="h-10 sm:h-14 md:h-[68px] w-2/3 opacity-60" />
    </div>
  )
}

const LIST_SKELETONS = {
  projects: () => <ProjectListSkeleton count={4} />,
  experience: () => <ExperienceListSkeleton count={4} />,
  tools: () => <ToolGridSkeleton count={6} />,
}

/** Suspense fallback for list pages while their code chunk loads. */
export function ListPageSkeleton({ variant = 'projects' }) {
  const List = LIST_SKELETONS[variant] || LIST_SKELETONS.projects
  return (
    <div className="mb-16 sm:mb-24 pt-6 sm:pt-0">
      <PageHeadingSkeleton />
      <List />
    </div>
  )
}

/** Detail page (project / experience) skeleton: back link, hero, title, body. */
export function DetailSkeleton() {
  return (
    <Busy label="Loading details" className="mb-24 pt-12 sm:pt-0">
      <Skeleton className="h-4 w-32 mb-8" />
      <Skeleton className="w-full aspect-video rounded-2xl mb-8" />
      <Skeleton className="h-9 sm:h-12 w-3/4 mb-4" />
      <Skeleton className="h-5 w-1/3 mb-10" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </Busy>
  )
}
