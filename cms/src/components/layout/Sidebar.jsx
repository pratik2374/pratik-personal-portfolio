import { NavLink } from 'react-router-dom'

const collections = [
  { path: '/blog', label: 'Blog', count: null },
  { path: '/projects', label: 'Projects', count: null },
  { path: '/tools', label: 'Tools', count: null },
  { path: '/experience', label: 'Experience', count: null },
]

export default function Sidebar() {
  return (
    <aside className="w-56 bg-sidebar border-r border-white/5 flex flex-col">
      <div className="p-5 border-b border-white/5">
        <p className="font-poppins font-semibold text-white text-sm">CMS</p>
        <p className="text-gray-dark text-xs mt-0.5">Portfolio Admin</p>
      </div>
      <nav className="flex-1 p-3">
        <p className="text-xs text-gray-dark uppercase tracking-widest px-3 py-2">Collections</p>
        {collections.map(({ path, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-sm mb-0.5 transition-colors ${
                isActive ? 'bg-white/10 text-white' : 'text-gray-mid hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
            {label}
          </NavLink>
        ))}
        <div className="mt-4 border-t border-white/5 pt-4">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive ? 'bg-white/10 text-white' : 'text-gray-mid hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
            Settings
          </NavLink>
        </div>
      </nav>
    </aside>
  )
}
