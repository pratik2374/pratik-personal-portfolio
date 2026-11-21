"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

interface HScrollProps {
  children: ReactNode
  className?: string
  /** Accessible name for the scroll region (it becomes keyboard-focusable when it overflows). */
  label: string
}

/**
 * Horizontal scroll container that only scrolls itself (never the page) and shows
 * a soft edge fade on whichever side has more content, as a "swipe for more" hint.
 */
export function HScroll({ children, className = "", label }: HScrollProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ left: false, right: false })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let frame = 0
    const measure = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const max = el.scrollWidth - el.clientWidth
        const next = { left: el.scrollLeft > 2, right: max - el.scrollLeft > 2 }
        setEdges((prev) => (prev.left === next.left && prev.right === next.right ? prev : next))
      })
    }
    measure()
    el.addEventListener("scroll", measure, { passive: true })
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    if (el.firstElementChild) ro.observe(el.firstElementChild)
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener("scroll", measure)
      ro.disconnect()
    }
  }, [])

  const overflowing = edges.left || edges.right

  return (
    <div className="relative">
      <div
        ref={ref}
        className={`overflow-x-auto overscroll-x-contain [scrollbar-width:thin] ${className}`}
        tabIndex={overflowing ? 0 : undefined}
        role={overflowing ? "region" : undefined}
        aria-label={overflowing ? label : undefined}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/10 dark:from-black/50 to-transparent transition-opacity duration-200 ${
          edges.left ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/10 dark:from-black/50 to-transparent transition-opacity duration-200 ${
          edges.right ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  )
}
