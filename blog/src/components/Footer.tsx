import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0a0a0a] mt-24">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Pratik Gond</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-xs">
              Software Engineer specializing in AI, RAG, and high-performance modern web applications.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href="/privacy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-orange-500 transition-colors">Terms of Service</Link></li>
              <li><Link href="/about" className="hover:text-orange-500 transition-colors">About</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Connect</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="https://github.com/pratikgond" target="_blank" rel="noreferrer" className="hover:text-orange-500 transition-colors">GitHub</a></li>
              <li><a href="https://linkedin.com/in/pratikgond" target="_blank" rel="noreferrer" className="hover:text-orange-500 transition-colors">LinkedIn</a></li>
              <li><a href="https://pratikgond.tech" className="hover:text-orange-500 transition-colors">Portfolio</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 text-sm text-center text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Pratik Gond. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
