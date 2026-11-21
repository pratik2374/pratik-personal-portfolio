import { useSettings } from '../../hooks/useSettings'

export default function Footer() {
  const settings = useSettings()
  return (
    <footer className="border-t border-white/5 py-8 sm:py-10 mt-16 sm:mt-20 mb-8 sm:mb-0">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <p className="text-gray-mid text-xs sm:text-sm">
          © {new Date().getFullYear()} {settings.name}. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          {settings.github && (
            <a href={settings.github} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-1 text-gray-mid hover:text-white text-xs sm:text-sm transition-colors">
              GitHub
            </a>
          )}
          {settings.linkedin && (
            <a href={settings.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-1 text-gray-mid hover:text-white text-xs sm:text-sm transition-colors">
              LinkedIn
            </a>
          )}
          {settings.email && (
            <a href={`mailto:${settings.email}`} className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-1 text-gray-mid hover:text-white text-xs sm:text-sm transition-colors">
              Email
            </a>
          )}
        </div>
      </div>
    </footer>
  )
}
