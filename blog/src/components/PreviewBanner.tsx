"use client"

import { usePathname } from "next/navigation"
import { useSyncExternalStore } from "react"

const subscribeNoop = () => () => {}

/**
 * Shown only in draft mode when the site is opened directly (not inside the
 * studio's Presentation iframe, which has its own controls).
 */
export function PreviewBanner() {
  const pathname = usePathname()
  const inStudioFrame = useSyncExternalStore(
    subscribeNoop,
    () => window.self !== window.top,
    () => true
  )
  if (inStudioFrame) return null

  return (
    <div
      role="status"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[90] flex items-center gap-3 rounded-full border border-orange-500/30 bg-gray-900/95 text-white text-xs font-medium pl-4 pr-1.5 py-1.5 shadow-lg backdrop-blur"
    >
      <span className="inline-flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-orange-500 motion-safe:animate-pulse" aria-hidden="true" />
        Preview: showing unpublished drafts
      </span>
      <a
        href={`/api/draft-mode/disable?redirect=${encodeURIComponent(pathname || "/")}`}
        className="rounded-full bg-white/10 hover:bg-white/20 px-3 py-1.5 transition-colors"
      >
        Exit preview
      </a>
    </div>
  )
}
