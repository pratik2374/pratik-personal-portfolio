"use client"

import { useState, useEffect } from "react"
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
  const [activeId, setActiveId] = useState<string>("")
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "0px 0px -75% 0px" }
    )

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (!headings || headings.length === 0) return null

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
                      onClick={() => setIsOpen(false)}
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

  // 2. Desktop Sticky Left Rail Variant (Compact, Quiet, Editorial)
  return (
    <nav className="w-full text-xs" aria-label="Table of Contents">
      <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white mb-3 text-xs uppercase tracking-wider">
        <ListCollapse className="w-3.5 h-3.5 text-orange-500 shrink-0" />
        <span>On this page</span>
      </div>
      <ul className="space-y-1 border-l border-gray-200 dark:border-gray-800 pl-3">
        {headings.map((h) => {
          const isActive = activeId === h.id
          return (
            <li
              key={h.id}
              className={h.level === 3 ? "ml-2.5 text-[11px]" : "text-xs"}
            >
              <a
                href={`#${h.id}`}
                className={`block py-1 leading-snug transition-colors duration-150 active:scale-[0.98] ${
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
