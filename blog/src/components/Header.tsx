"use client"

import { useState } from "react"
import Link from "next/link"
import { ThemeToggle } from "./ThemeToggle"
import { Menu, X, ArrowUpRight } from "lucide-react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-[#111]/80 backdrop-blur-md transition-colors">
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between max-w-5xl">
        {/* Brand Logo */}
        <Link href="/" className="font-bold text-xl tracking-tight text-gray-900 dark:text-white hover:opacity-90 transition-opacity">
          Pratik<span className="text-orange-500">.blog</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-600 dark:text-gray-400">
          <Link href="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">
            Articles
          </Link>
          <Link href="/about" className="hover:text-gray-900 dark:hover:text-white transition-colors">
            About
          </Link>
          <Link href="/contact" className="hover:text-gray-900 dark:hover:text-white transition-colors">
            Contact
          </Link>
          <a
            href="https://pratikgond.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <span>Portfolio</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
          </a>
          <div className="pl-2 border-l border-gray-200 dark:border-gray-800">
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-hidden"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111] px-4 py-4 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500"
          >
            Articles
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500"
          >
            About
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500"
          >
            Contact
          </Link>
          <a
            href="https://pratikgond.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between py-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500"
          >
            <span>Portfolio</span>
            <ArrowUpRight className="w-4 h-4 text-gray-400" />
          </a>
        </div>
      )}
    </header>
  )
}
