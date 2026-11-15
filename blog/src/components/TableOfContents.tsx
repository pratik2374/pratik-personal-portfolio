"use client"

import { useState, useEffect } from "react"
import { ListCollapse, ChevronRight } from "lucide-react"

export interface TocHeading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  headings: TocHeading[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("")

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

  return (
    <nav className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#141414]/50 backdrop-blur-xs mb-10 text-sm">
      <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white mb-3">
        <ListCollapse className="w-4 h-4 text-orange-500" />
        <span>Table of Contents</span>
      </div>
      <ul className="space-y-0.5 border-l border-gray-200 dark:border-gray-800 pl-3">
        {headings.map((h) => {
          const isActive = activeId === h.id
          return (
            <li
              key={h.id}
              className={`${
                h.level === 3 ? "ml-3 text-xs" : "text-sm"
              }`}
            >
              <a
                href={`#${h.id}`}
                className={`flex items-center min-h-[38px] sm:min-h-[36px] py-1.5 transition-colors duration-150 active:scale-[0.98] hover:text-orange-500 ${
                  isActive
                    ? "font-medium text-orange-500 dark:text-orange-400"
                    : "text-gray-600 dark:text-gray-400"
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
