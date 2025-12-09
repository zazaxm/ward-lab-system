import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Layout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getRoleLabel = (role) => {
    const roles = {
      admin: 'Administrator',
      charge_nurse: 'Charge Nurse',
      lab_staff: 'Lab Staff',
      quality: 'Quality'
    }
    return roles[role] || role
  }

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['admin', 'charge_nurse', 'lab_staff', 'quality'] },
    { path: '/ward-directory', label: 'Ward Directory', icon: '🏥', roles: ['admin', 'charge_nurse'] },
    { path: '/addon-request', label: 'Add-On Request', icon: '➕', roles: ['admin', 'charge_nurse'] },
    { path: '/critical-call', label: 'Critical Call', icon: '📞', roles: ['admin', 'lab_staff'] },
    { path: '/lab-dashboard', label: 'Lab Dashboard', icon: '🔬', roles: ['admin', 'lab_staff'] },
    { path: '/analytics', label: 'Analytics & Reports', icon: '📈', roles: ['admin', 'quality'] },
  ]

  const filteredNavItems = navItems.filter(item => 
    !item.roles || item.roles.includes(user?.role)
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">Ward & Lab Management System</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.name} ({getRoleLabel(user?.role)})
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {filteredNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  isActive(item.path)
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
