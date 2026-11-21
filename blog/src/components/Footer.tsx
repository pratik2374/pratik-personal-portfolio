import Link from "next/link"
import { getProfile } from "@/lib/profile"

export async function Footer() {
  const profile = await getProfile()
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0c0c0c] mt-24 text-gray-500 dark:text-gray-400 text-sm">
      <div className="container mx-auto px-4 sm:px-6 py-14 max-w-5xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
          <div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white mb-3">{profile.name}</h3>
            <p className="text-xs sm:text-sm leading-relaxed max-w-xs text-gray-500 dark:text-gray-400">
              Software Engineer writing about AI, systems architecture, and modern full-stack development.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-xs text-gray-900 dark:text-white uppercase tracking-wider mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link href="/" className="inline-flex items-center min-h-[44px] -my-2.5 hover:text-orange-500 transition-colors">Articles</Link></li>
              <li><Link href="/about" className="inline-flex items-center min-h-[44px] -my-2.5 hover:text-orange-500 transition-colors">About</Link></li>
              <li><Link href="/contact" className="inline-flex items-center min-h-[44px] -my-2.5 hover:text-orange-500 transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="inline-flex items-center min-h-[44px] -my-2.5 hover:text-orange-500 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="inline-flex items-center min-h-[44px] -my-2.5 hover:text-orange-500 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-xs text-gray-900 dark:text-white uppercase tracking-wider mb-3">
              Connect
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href={profile.github} target="_blank" rel="noreferrer" className="inline-flex items-center min-h-[44px] -my-2.5 hover:text-orange-500 transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center min-h-[44px] -my-2.5 hover:text-orange-500 transition-colors">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={profile.url} target="_blank" rel="noreferrer" className="inline-flex items-center min-h-[44px] -my-2.5 hover:text-orange-500 transition-colors">
                  Portfolio ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="inline-flex items-center min-h-[44px] -my-3 px-1 hover:text-gray-700 dark:hover:text-gray-300">Privacy</Link>
            <span>·</span>
            <Link href="/terms" className="inline-flex items-center min-h-[44px] -my-3 px-1 hover:text-gray-700 dark:hover:text-gray-300">Terms</Link>
            <span>·</span>
            <Link href="/cookies" className="inline-flex items-center min-h-[44px] -my-3 px-1 hover:text-gray-700 dark:hover:text-gray-300">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
