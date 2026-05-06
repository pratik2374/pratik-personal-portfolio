import { useSettingsContext } from '../../context/SettingsContext'

export default function Footer() {
  const settings = useSettingsContext()

  return (
    <footer className="border-t border-white/5 py-10 mt-20">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-gray-mid text-sm">
          © {new Date().getFullYear()} {settings?.name ?? 'Pratik Gond'}. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          {settings?.github && (
            <a href={settings.github} target="_blank" rel="noreferrer" className="text-gray-mid hover:text-white text-sm transition-colors">
              GitHub
            </a>
          )}
          {settings?.linkedin && (
            <a href={settings.linkedin} target="_blank" rel="noreferrer" className="text-gray-mid hover:text-white text-sm transition-colors">
              LinkedIn
            </a>
          )}
          {settings?.email && (
            <a href={`mailto:${settings.email}`} className="text-gray-mid hover:text-white text-sm transition-colors">
              Email
            </a>
          )}
        </div>
      </div>
    </footer>
  )
}
