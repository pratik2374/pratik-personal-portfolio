"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

const subscribeNoop = () => () => {}

type ViewTransitionDocument = Document & {
  startViewTransition: (cb: () => Promise<void>) => { ready: Promise<void>; finished: Promise<void> }
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  // false during SSR and hydration, true afterwards: the theme is only known on the client.
  const mounted = React.useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  )

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const isDark = resolvedTheme === "dark"
    const nextTheme = isDark ? "light" : "dark"

    // Check if View Transition API is supported
    if (
      typeof document !== "undefined" &&
      "startViewTransition" in document &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      )

      // Scopes the circular-reveal CSS to this transition so page navigations keep their crossfade.
      const root = document.documentElement
      root.classList.add("theme-transition")
      const transition = (document as ViewTransitionDocument).startViewTransition(async () => {
        setTheme(nextTheme)
        // Allow microtask tick for next-themes to apply the class to <html>
        await new Promise((resolve) => setTimeout(resolve, 1))
      })

      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 450,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        )
      })
      transition.finished.finally(() => root.classList.remove("theme-transition"))
    } else {
      setTheme(nextTheme)
    }
  }

  if (!mounted) {
    return <div className="w-11 h-11 rounded-lg bg-transparent" />
  }

  const isDark = resolvedTheme === "dark"

  return (
    <button
      onClick={toggleTheme}
      className="relative min-w-[44px] min-h-[44px] rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-gray-800/40 transition-colors flex items-center justify-center cursor-pointer active:scale-[0.92] duration-100 focus:outline-hidden"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center pointer-events-none">
        {/* Sun Icon for Light Mode */}
        <Sun
          className={`w-4 h-4 transition-all duration-300 transform absolute ${
            isDark
              ? "rotate-90 scale-0 opacity-0 text-orange-400"
              : "rotate-0 scale-100 opacity-100 text-orange-500"
          }`}
        />
        {/* Moon Icon for Dark Mode */}
        <Moon
          className={`w-4 h-4 transition-all duration-300 transform absolute ${
            isDark
              ? "rotate-0 scale-100 opacity-100 text-blue-400"
              : "-rotate-90 scale-0 opacity-0 text-gray-600"
          }`}
        />
      </div>
    </button>
  )
}
