import Sidebar from './Sidebar'

export default function CmsLayout({ children }) {
  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}
