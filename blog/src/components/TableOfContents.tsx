"use client"

import { useState, useEffect, useLayoutEffect, useRef, type RefObject } from "react"
import { ListCollapse, ChevronDown } from "lucide-react"

import type { TocHeading } from "@/lib/headings"

export type { TocHeading }

/**
 * Moves a single indicator bar to the active item with a transform, so the highlight
 * glides between headings instead of jumping.
 */
function useSlidingIndicator(
  listRef: RefObject<HTMLUListElement | null>,
  indicatorRef: RefObject<HTMLSpanElement | null>,
  activeId: string,
  enabled: boolean
) {
  useLayoutEffect(() => {
    if (!enabled) return
    const list = listRef.current
    const bar = indicatorRef.current
    if (!list || !bar) return

    const place = () => {
      const item = list.querySelector<HTMLElement>(`[data-toc-id="${CSS.escape(activeId)}"]`)
      if (!item) {
        bar.style.opacity = "0"
        return
      }
      bar.style.opacity = "1"
      bar.style.height = `${item.offsetHeight}px`
      bar.style.transform = `translateY(${item.offsetTop}px)`
    }
    place()
    const ro = new ResizeObserver(place)
    ro.observe(list)
    return () => ro.disconnect()
  }, [listRef, indicatorRef, activeId, enabled])
}

interface TableOfContentsProps {
  headings: TocHeading[]
  variant?: "desktop" | "mobile"
}

export function TableOfContents({ headings, variant = "desktop" }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(() => headings[0]?.id || "")
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const containerRef = useRef<HTMLElement | null>(null)
  const listRef = useRef<HTMLUListElement | null>(null)
  const indicatorRef = useRef<HTMLSpanElement | null>(null)
  const itemRefs = useRef<Record<string, HTMLElement | null>>({})
  const isClickScrollingRef = useRef(false)

  // 1. High-precision Scrollspy: tracks active heading during main content scrolling
  useEffect(() => {
    if (headings.length === 0) return

    // Follow the URL hash: on load (deep link) and when an in-page anchor is followed.
    const syncFromHash = () => {
      const hashId = decodeURIComponent(window.location.hash.replace(/^#/, ""))
      if (hashId && headings.some((h) => h.id === hashId)) setActiveId(hashId)
    }
    const hashRaf = requestAnimationFrame(syncFromHash)
    window.addEventListener("hashchange", syncFromHash)

    let rafId: number | null = null

    const handleScroll = () => {
      if (rafId !== null) return

      rafId = requestAnimationFrame(() => {
        rafId = null
        if (isClickScrollingRef.current) return

        const scrollY = window.scrollY
        const windowHeight = window.innerHeight
        const docHeight = document.documentElement.scrollHeight

        // Near top of document: activate first heading
        if (scrollY < 250) {
          setActiveId(headings[0]?.id || "")
          return
        }

        // Bottom of document edge case: activate the last heading
        if (scrollY + windowHeight >= docHeight - 100) {
          const lastHeading = headings[headings.length - 1]
          if (lastHeading) {
            setActiveId(lastHeading.id)
            return
          }
        }

        // Natural reading focus trigger threshold (~260px from top).
        // This activates the heading as soon as it enters the comfortable upper reading zone,
        // ensuring the title is clearly in scope while reading rather than waiting until it leaves the screen.
        const triggerY = Math.min(Math.max(windowHeight * 0.32, 200), 280)
        let currentId = headings[0]?.id || ""

        for (let i = 0; i < headings.length; i++) {
          const el = document.getElementById(headings[i].id)
          if (!el) continue
          const rect = el.getBoundingClientRect()
          if (rect.top <= triggerY) {
            currentId = headings[i].id
          } else {
            break
          }
        }

        setActiveId(currentId)
      })
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("hashchange", syncFromHash)
      cancelAnimationFrame(hashRaf)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [headings])

  // 2. Synchronized Table of Contents Auto-Scrolling:
  // When activeId changes as the user scrolls the main content, smoothly scroll the TOC container
  // so the active section stays centered and comfortably visible in the TOC rail.
  useEffect(() => {
    if (!activeId || variant !== "desktop" || isHovered) return

    const container = containerRef.current
    const activeEl = itemRefs.current[activeId]

    if (container && activeEl) {
      const relativeTop = activeEl.offsetTop
      const activeHeight = activeEl.offsetHeight
      const containerHeight = container.clientHeight

      // Center the active element in the TOC container viewport
      const targetScroll = relativeTop - containerHeight / 2 + activeHeight / 2

      container.scrollTo({
        top: Math.max(0, targetScroll),
        behavior: "smooth",
      })
    }
  }, [activeId, variant, isHovered])

  useSlidingIndicator(listRef, indicatorRef, activeId, variant === "desktop" || isOpen)

  if (!headings || headings.length === 0) return null

  // Desktop click handler with smooth window scroll and TOC container centering
  const handleHeadingClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      isClickScrollingRef.current = true
      setActiveId(id)

      const yOffset = -96 // 64px sticky header + 32px breathing room
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })

      // Immediately center active item in TOC container
      const container = containerRef.current
      const activeEl = itemRefs.current[id]
      if (container && activeEl) {
        const targetScroll = activeEl.offsetTop - container.clientHeight / 2 + activeEl.offsetHeight / 2
        container.scrollTo({ top: Math.max(0, targetScroll), behavior: "smooth" })
      }

      window.history.pushState(null, "", `#${id}`)

      setTimeout(() => {
        isClickScrollingRef.current = false
      }, 800)
    }
  }

  // Mobile click handler
  const handleMobileClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    setIsOpen(false)
    const el = document.getElementById(id)
    if (el) {
      const yOffset = -96
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
      setActiveId(id)
      window.history.pushState(null, "", `#${id}`)
    }
  }

  // 1. Mobile Collapsible Expander Variant
  if (variant === "mobile") {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-[#141414] overflow-hidden transition-colors">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-controls="toc-mobile-list"
          className="w-full min-h-[44px] px-4 py-2.5 flex items-center justify-between text-left text-sm font-medium text-gray-900 dark:text-white active:scale-[0.99] transition-transform cursor-pointer"
          aria-expanded={isOpen}
        >
          <span className="flex items-center gap-2">
            <ListCollapse className="w-4 h-4 text-orange-500 shrink-0" />
            <span>Table of Contents</span>
            <span className="text-xs text-gray-400 font-normal">
              ({headings.length} sections)
            </span>
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* grid-rows 0fr -> 1fr animates the height open/closed without measuring */}
        <div
          id="toc-mobile-list"
          className={`grid transition-[grid-template-rows] duration-250 ease-out motion-reduce:transition-none ${
            isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
          inert={!isOpen}
        >
          <div className="overflow-hidden">
            <div className="px-4 pb-4 pt-2 border-t border-gray-200 dark:border-gray-800">
              <ul ref={listRef} className="relative border-l border-gray-200 dark:border-gray-800 pl-3 max-h-80 overflow-y-auto overscroll-contain">
                <span
                  ref={indicatorRef}
                  aria-hidden="true"
                  className="absolute -left-px top-0 w-[2px] rounded-full bg-orange-500 opacity-0 transition-[transform,height,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                />
                {headings.map((h) => {
                  const isActive = activeId === h.id
                  return (
                    <li key={h.id} data-toc-id={h.id} className={h.level === 3 ? "ml-3 text-[13px]" : "text-sm"}>
                      <a
                        href={`#${h.id}`}
                        onClick={(e) => handleMobileClick(e, h.id)}
                        aria-current={isActive ? "location" : undefined}
                        className={`flex items-center min-h-[40px] py-1.5 leading-snug transition-colors duration-150 ${
                          isActive
                            ? "font-medium text-orange-500 dark:text-orange-400"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                      >
                        {h.text}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 2. Desktop Sticky Left Rail Variant with Synchronized Scrolling
  return (
    <nav
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full text-xs max-h-[calc(100vh-8rem)] overflow-y-auto pr-3 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      aria-label="Table of Contents"
    >
      <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-3.5 text-sm tracking-tight sticky top-0 bg-white/95 dark:bg-[#0c0c0d]/95 backdrop-blur-sm py-1 z-10">
        <ListCollapse className="w-4 h-4 text-orange-500 shrink-0" />
        <span>Table of Contents</span>
      </div>
      <ul ref={listRef} className="relative space-y-1.5 border-l border-gray-200 dark:border-gray-800 pl-3">
        <span
                  ref={indicatorRef}
                  aria-hidden="true"
                  className="absolute -left-px top-0 w-[2px] rounded-full bg-orange-500 opacity-0 transition-[transform,height,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                />
        {headings.map((h) => {
          const isActive = activeId === h.id
          return (
            <li
              key={h.id}
              data-toc-id={h.id}
              ref={(el) => {
                itemRefs.current[h.id] = el
              }}
              className={`relative ${
                h.level === 3 ? "ml-3 text-[11px]" : "text-xs"
              }`}
            >
              <a
                href={`#${h.id}`}
                onClick={(e) => handleHeadingClick(e, h.id)}
                aria-current={isActive ? "location" : undefined}
                className={`block py-1 leading-snug transition-colors duration-200 ${
                  isActive
                    ? "font-medium text-orange-500 dark:text-orange-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {h.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
