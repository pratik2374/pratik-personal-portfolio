import Link from "next/link"
import { ThemeToggle } from "./ThemeToggle"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#111]/80 backdrop-blur">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-5xl">
        <Link href="/" className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
          Pratik<span className="text-orange-500">.blog</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
          <a href="https://pratikgond.tech" className="hover:text-orange-500 transition-colors">Portfolio</a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
