import { Link, NavLink } from 'react-router-dom'
import { useSettingsContext } from '../../context/SettingsContext'

export default function Navbar() {
  const settings = useSettingsContext()

  return (
    <nav className="sticky top-0 z-50 bg-bg/80 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-poppins font-semibold text-lg tracking-tight text-white hover:text-accent-lime transition-colors">
          {settings?.name ?? 'Pratik Gond'}
        </Link>
        <div className="flex items-center gap-8">
          {[
            { to: '/blog', label: 'Blog' },
            { to: '/projects', label: 'Projects' },
            { to: '/tools', label: 'Tools' },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-sm transition-colors ${isActive ? 'text-accent-lime' : 'text-gray-mid hover:text-white'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
