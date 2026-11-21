"use client"

import { useEffect, useRef } from "react"

/**
 * Scroll progress bar. Writes a GPU-friendly transform straight to the DOM once
 * per animation frame, so scrolling never re-renders React or triggers layout.
 */
export function ReadingProgressBar() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame: number | null = null

    const update = () => {
      frame = null
      const el = document.documentElement
      const scrollable = el.scrollHeight - el.clientHeight
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, el.scrollTop / scrollable)) : 0
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`
    }

    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50 pointer-events-none" aria-hidden="true">
      <div ref={barRef} className="h-full w-full bg-orange-500 origin-left will-change-transform" style={{ transform: "scaleX(0)" }} />
    </div>
  )
}
