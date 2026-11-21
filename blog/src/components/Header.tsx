"use client"

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ArrowUpRight, Search } from "lucide-react"
import { ThemeToggle } from "./ThemeToggle"
import { CommandPalette, loadSearchIndex } from "./CommandPalette"
import { ScrollReveal } from "./ScrollReveal"

const NAV = [
  { href: "/", label: "Articles" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

const subscribeNoop = () => () => {}
const getIsMac = () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)

function isTypingTarget(el: EventTarget | null) {
  if (!(el instanceof HTMLElement)) return false
  return el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)
}

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [menuPath, setMenuPath] = useState(pathname)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const lastTrigger = useRef<HTMLElement | null>(null)
  // Null during SSR/hydration so the shortcut hint never mismatches.
  const isMac = useSyncExternalStore(subscribeNoop, getIsMac, () => null)

  // Close the mobile menu whenever the route changes (state derived during render).
  if (menuPath !== pathname) {
    setMenuPath(pathname)
    setMobileMenuOpen(false)
  }

  const openPalette = useCallback(() => {
    lastTrigger.current = document.activeElement as HTMLElement | null
    setMobileMenuOpen(false)
    setPaletteOpen(true)
  }, [])

  const closePalette = useCallback(() => {
    setPaletteOpen(false)
    // Return focus to whatever opened the palette.
    requestAnimationFrame(() => lastTrigger.current?.focus?.())
  }, [])

  // ⌘K / Ctrl+K anywhere, "/" when not typing; Escape closes the mobile menu.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        if (paletteOpen) closePalette()
        else openPalette()
      } else if (e.key === "/" && !paletteOpen && !isTypingTarget(e.target)) {
        e.preventDefault()
        openPalette()
      } else if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [paletteOpen, mobileMenuOpen, openPalette, closePalette])

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href))

  return (
    <header
      className="sticky top-0 z-40 w-full border-b border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-[#111112]/80 backdrop-blur-md transition-colors"
      style={{ viewTransitionName: "site-header" }}
    >
      <ScrollReveal />
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 max-w-5xl">
        <Link
          href="/"
          className="font-bold text-xl tracking-tight text-gray-900 dark:text-white flex items-center min-h-[44px] pr-2 active:scale-[0.98] transition-transform duration-150 shrink-0"
        >
          Pratik<span className="text-orange-500">.blog</span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main" className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-400">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`px-3 py-2 rounded-lg transition-colors min-h-[44px] flex items-center active:scale-[0.97] duration-150 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-gray-800/40 ${
                isActive(item.href) ? "text-gray-900 dark:text-white" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://pratikgond.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-lg hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-gray-800/40 transition-colors min-h-[44px] flex items-center gap-1 active:scale-[0.97] duration-150"
          >
            <span>Portfolio</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
          </a>

          <button
            type="button"
            onClick={openPalette}
            onPointerEnter={() => loadSearchIndex().catch(() => {})}
            onFocus={() => loadSearchIndex().catch(() => {})}
            className="ml-2 h-11 pl-3 pr-2 flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-700 transition-colors active:scale-[0.98] duration-150 cursor-pointer"
            aria-label="Search (press slash or Control K)"
            aria-keyshortcuts="Control+K Meta+K /"
          >
            <Search className="w-4 h-4" aria-hidden="true" />
            <span className="text-sm font-normal">Search</span>
            <kbd className="ml-2 min-w-[2.75rem] text-center text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-gray-700" aria-hidden="true">
              {isMac === null ? " " : isMac ? "⌘ K" : "Ctrl K"}
            </kbd>
          </button>

          <div className="pl-2 ml-1 border-l border-gray-200 dark:border-gray-800 flex items-center">
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-0.5">
          <button
            type="button"
            onClick={openPalette}
            className="min-w-[44px] min-h-[44px] rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white active:scale-[0.95] transition-transform duration-150"
            aria-label="Search"
          >
            <Search className="w-5 h-5" aria-hidden="true" />
          </button>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-[0.95] transition-transform duration-150"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="relative w-5 h-5" aria-hidden="true">
              <Menu
                className={`absolute inset-0 w-5 h-5 transition-[opacity,transform] duration-200 ${
                  mobileMenuOpen ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"
                }`}
              />
              <X
                className={`absolute inset-0 w-5 h-5 transition-[opacity,transform] duration-200 ${
                  mobileMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile drawer: grid-rows trick animates height without measuring */}
      <div
        id="mobile-menu"
        className={`md:hidden grid transition-[grid-template-rows,opacity] duration-250 ease-out motion-reduce:transition-none ${
          mobileMenuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"
        }`}
        inert={!mobileMenuOpen}
      >
        <nav aria-label="Mobile" className="overflow-hidden">
          <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111112] px-4 py-3 space-y-1">
            {NAV.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={isActive(item.href) ? "page" : undefined}
                style={{ transitionDelay: mobileMenuOpen ? `${40 + i * 35}ms` : "0ms" }}
                className={`flex items-center min-h-[48px] px-3 rounded-lg text-[15px] font-medium transition-[opacity,transform,color] duration-200 motion-reduce:transition-none active:bg-gray-100 dark:active:bg-gray-800 ${
                  mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
                } ${isActive(item.href) ? "text-orange-500" : "text-gray-700 dark:text-gray-300 hover:text-orange-500"}`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://pratikgond.tech"
              target="_blank"
              rel="noopener noreferrer"
              style={{ transitionDelay: mobileMenuOpen ? `${40 + NAV.length * 35}ms` : "0ms" }}
              className={`flex items-center justify-between min-h-[48px] px-3 rounded-lg text-[15px] font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 active:bg-gray-100 dark:active:bg-gray-800 transition-[opacity,transform,color] duration-200 motion-reduce:transition-none ${
                mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
              }`}
            >
              <span>Portfolio</span>
              <ArrowUpRight className="w-4 h-4 text-gray-400" aria-hidden="true" />
            </a>
          </div>
        </nav>
      </div>

      <CommandPalette open={paletteOpen} onClose={closePalette} />
    </header>
  )
}
