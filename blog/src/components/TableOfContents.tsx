"use client"

import { useState, useEffect, useRef } from "react"
import { ListCollapse, ChevronDown } from "lucide-react"

export interface TocHeading {
  id: string
  text: string
  level: number
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
  const itemRefs = useRef<Record<string, HTMLElement | null>>({})
  const isClickScrollingRef = useRef(false)

  // 1. High-precision Scrollspy: tracks active heading during main content scrolling
  useEffect(() => {
    if (headings.length === 0) return

    // If URL has a direct anchor hash on mount, initialize to that
    if (typeof window !== "undefined" && window.location.hash) {
      const hashId = window.location.hash.replace(/^#/, "")
      if (headings.some((h) => h.id === hashId)) {
        setActiveId(hashId)
      }
    }

    let rafId: number | null = null

    const handleScroll = () => {
      if (rafId !== null) return

      rafId = requestAnimationFrame(() => {
        rafId = null
        if (isClickScrollingRef.current) return

        const scrollY = window.scrollY
        const windowHeight = window.innerHeight
        const docHeight = document.documentElement.scrollHeight

        // Bottom of document edge case: activate the last heading
        if (scrollY + windowHeight >= docHeight - 100) {
          const lastHeading = headings[headings.length - 1]
          if (lastHeading) {
            setActiveId(lastHeading.id)
            return
          }
        }

        // Trigger threshold: 120px below top of viewport (clears sticky header)
        const triggerY = 120
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

        {isOpen && (
          <div className="px-4 pb-4 pt-2 border-t border-gray-200 dark:border-gray-800 animate-in fade-in duration-200">
            <ul className="space-y-1 border-l border-gray-200 dark:border-gray-800 pl-3 max-h-80 overflow-y-auto">
              {headings.map((h) => {
                const isActive = activeId === h.id
                return (
                  <li
                    key={h.id}
                    className={h.level === 3 ? "ml-3 text-xs" : "text-sm"}
                  >
                    <a
                      href={`#${h.id}`}
                      onClick={(e) => handleMobileClick(e, h.id)}
                      className={`block py-1.5 transition-colors duration-150 active:scale-[0.98] ${
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
        )}
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
      <ul className="space-y-1.5 border-l border-gray-200 dark:border-gray-800 pl-3">
        {headings.map((h) => {
          const isActive = activeId === h.id
          return (
            <li
              key={h.id}
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
                className={`block py-1 leading-snug transition-colors duration-150 ${
                  isActive
                    ? `font-medium text-orange-500 dark:text-orange-400 ${
                        h.level === 3
                          ? "before:absolute before:-left-[25px] before:top-0 before:bottom-0 before:w-[2px] before:bg-orange-500 before:rounded-full"
                          : "before:absolute before:-left-[13px] before:top-0 before:bottom-0 before:w-[2px] before:bg-orange-500 before:rounded-full"
                      }`
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
