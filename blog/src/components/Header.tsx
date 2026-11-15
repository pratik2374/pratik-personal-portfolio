"use client"

import { useState } from "react"
import Link from "next/link"
import { ThemeToggle } from "./ThemeToggle"
import { Menu, X, ArrowUpRight } from "lucide-react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-[#111112]/80 backdrop-blur-md transition-colors">
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between max-w-5xl">
        {/* Brand Logo - clean editorial wordmark with 44px min touch area */}
        <Link
          href="/"
          className="font-bold text-xl tracking-tight text-gray-900 dark:text-white flex items-center min-h-[44px] pr-2 active:scale-[0.98] transition-transform duration-150"
        >
          Pratik<span className="text-orange-500">.blog</span>
        </Link>

        {/* Desktop Nav - 44px hit targets */}
        <nav className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
          <Link
            href="/"
            className="px-3 py-2 rounded-lg hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-gray-800/40 transition-colors min-h-[44px] flex items-center active:scale-[0.97] duration-150"
          >
            Articles
          </Link>
          <Link
            href="/about"
            className="px-3 py-2 rounded-lg hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-gray-800/40 transition-colors min-h-[44px] flex items-center active:scale-[0.97] duration-150"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="px-3 py-2 rounded-lg hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-gray-800/40 transition-colors min-h-[44px] flex items-center active:scale-[0.97] duration-150"
          >
            Contact
          </Link>
          <a
            href="https://pratikgond.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-lg hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-gray-800/40 transition-colors min-h-[44px] flex items-center gap-1 active:scale-[0.97] duration-150"
          >
            <span>Portfolio</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
          </a>
          <div className="pl-3 ml-1 border-l border-gray-200 dark:border-gray-800 flex items-center">
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile menu trigger with 44px touch area */}
        <div className="flex md:hidden items-center gap-1">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-[0.95] transition-transform duration-150 focus:outline-hidden"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111112] px-4 py-3 space-y-1">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center min-h-[44px] px-3 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 active:bg-gray-100 dark:active:bg-gray-800 transition-colors"
          >
            Articles
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center min-h-[44px] px-3 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 active:bg-gray-100 dark:active:bg-gray-800 transition-colors"
          >
            About
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center min-h-[44px] px-3 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 active:bg-gray-100 dark:active:bg-gray-800 transition-colors"
          >
            Contact
          </Link>
          <a
            href="https://pratikgond.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between min-h-[44px] px-3 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 active:bg-gray-100 dark:active:bg-gray-800 transition-colors"
          >
            <span>Portfolio</span>
            <ArrowUpRight className="w-4 h-4 text-gray-400" />
          </a>
        </div>
      )}
    </header>
  )
}
