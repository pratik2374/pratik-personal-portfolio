import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function TopBar({ title }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="h-14 border-b border-white/5 flex items-center justify-between px-6">
      <h1 className="font-poppins font-semibold text-white text-sm">{title}</h1>
      <button
        onClick={handleLogout}
        className="text-gray-mid text-sm hover:text-white transition-colors"
      >
        Sign out
      </button>
    </div>
  )
}
