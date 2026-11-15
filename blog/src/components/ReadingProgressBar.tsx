"use client"

import { useEffect, useState } from "react"

export function ReadingProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      if (windowHeight > 0) {
        const scrollPercent = (totalScroll / windowHeight) * 100
        setScrollProgress(Math.min(100, Math.max(0, scrollPercent)))
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 bg-transparent z-50 pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-full bg-linear-to-r from-orange-500 to-amber-400 transition-[width] duration-75 ease-out shadow-[0_0_8px_rgba(255,101,0,0.6)]"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  )
}
