import Layout from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalRooms: 0,
    pendingRequests: 0,
    todayRequests: 0,
    completedToday: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [roomsRes, requestsRes] = await Promise.all([
        api.get('/rooms'),
        api.get('/addon-requests')
      ])
      
      const today = new Date().toISOString().split('T')[0]
      const todayRequests = requestsRes.data.filter(r => 
        r.created_at.startsWith(today)
      )
      const completedToday = requestsRes.data.filter(r => 
        r.status === 'completed' && r.completed_at?.startsWith(today)
      )

      setStats({
        totalRooms: roomsRes.data.length,
        pendingRequests: requestsRes.data.filter(r => r.status === 'pending').length,
        todayRequests: todayRequests.length,
        completedToday: completedToday.length
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const quickActions = [
    {
      title: 'Update Ward Data',
      description: 'Add or update room and nurse information',
      link: '/ward-directory',
      icon: '🏥',
      roles: ['admin', 'charge_nurse']
    },
    {
      title: 'Request Add-On Test',
      description: 'Submit a request for additional test',
      link: '/addon-request',
      icon: '➕',
      roles: ['admin', 'charge_nurse']
    },
    {
      title: 'Critical Call',
      description: 'Quick search for nurse contact information',
      link: '/critical-call',
      icon: '📞',
      roles: ['admin', 'lab_staff']
    },
    {
      title: 'Lab Dashboard',
      description: 'Manage add-on test requests',
      link: '/lab-dashboard',
      icon: '🔬',
      roles: ['admin', 'lab_staff']
    },
    {
      title: 'Analytics & Reports',
      description: 'View data analysis and reports',
      link: '/analytics',
      icon: '📈',
      roles: ['admin', 'quality']
    },
  ]

  const filteredActions = quickActions.filter(action => 
    !action.roles || action.roles.includes(user?.role)
  )

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}</h1>
          <p className="text-gray-600 mt-2">Main Dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Rooms</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalRooms}</p>
              </div>
              <div className="text-4xl">🏥</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pendingRequests}</p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Requests</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.todayRequests}</p>
              </div>
              <div className="text-4xl">📋</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.completedToday}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start">
                  <span className="text-4xl mr-4">{action.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
