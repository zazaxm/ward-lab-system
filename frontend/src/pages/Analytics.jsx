import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import api from '../services/api'
import toast from 'react-hot-toast'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function Analytics() {
  const [stats, setStats] = useState(null)
  const [trends, setTrends] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  useEffect(() => {
    fetchStats()
    fetchTrends()
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const params = {}
      if (dateRange.start) params.start_date = dateRange.start
      if (dateRange.end) params.end_date = dateRange.end
      
      const response = await api.get('/analytics/addon-stats', { params })
      setStats(response.data)
    } catch (error) {
      toast.error('Failed to load statistics')
    } finally {
      setLoading(false)
    }
  }

  const fetchTrends = async () => {
    try {
      const response = await api.get('/analytics/addon-trends', {
        params: { days: 30 }
      })
      setTrends(response.data)
    } catch (error) {
      toast.error('Failed to load trends')
    }
  }

  useEffect(() => {
    if (dateRange.start || dateRange.end) {
      fetchStats()
    }
  }, [dateRange])

  const wardChartData = stats ? Object.entries(stats.ward_stats).map(([ward, count]) => ({
    name: ward,
    count
  })) : []

  const testChartData = stats ? Object.entries(stats.test_stats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([test, count]) => ({
      name: test,
      count
    })) : []

  const reasonChartData = stats ? Object.entries(stats.reason_stats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([reason, count]) => ({
      name: reason.length > 30 ? reason.substring(0, 30) + '...' : reason,
      count
    })) : []

  const trendChartData = trends ? Object.entries(trends.daily_stats)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count
    })) : []

  const shiftData = stats ? [
    { name: 'Day Shift', count: stats.shift_stats.day },
    { name: 'Night Shift', count: stats.shift_stats.night }
  ] : []

  const userData = stats ? Object.entries(stats.user_stats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([user, count]) => ({
      name: user,
      count
    })) : []

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
            <p className="text-gray-600 mt-2">Add-on test request analysis and insights</p>
          </div>
          <div className="flex space-x-3">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Start Date"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="End Date"
            />
            <button
              onClick={fetchStats}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Apply Filter
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading statistics...</p>
          </div>
        )}

        {stats && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total_requests}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm font-medium text-gray-600">Preventable</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.preventable_count}</p>
                <p className="text-sm text-gray-500 mt-1">{stats.preventable_percentage}% of total</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.status_breakdown.approved}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{stats.status_breakdown.rejected}</p>
              </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Ward Statistics */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Add-Ons by Ward</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={wardChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#0ea5e9" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Top Tests */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Top Requested Tests</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={testChartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Shift Comparison */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Day vs Night Shift</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={shiftData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {shiftData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Top Reasons */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Top Request Reasons</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reasonChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Trends Chart */}
            {trends && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Daily Trends (Last 30 Days)</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#0ea5e9" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Top Requesters */}
            {userData.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Top Requesters</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requests</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {userData.map((user, index) => (
                        <tr key={user.name}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            #{index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.count}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Insights */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Key Insights</h2>
              <div className="space-y-3">
                {stats.ward_stats && Object.entries(stats.ward_stats).length > 0 && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Top Ward:</strong> {Object.entries(stats.ward_stats).sort((a, b) => b[1] - a[1])[0][0]} has {Object.entries(stats.ward_stats).sort((a, b) => b[1] - a[1])[0][1]} add-on requests
                    </p>
                  </div>
                )}
                {stats.test_stats && Object.entries(stats.test_stats).length > 0 && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Most Requested Test:</strong> {Object.entries(stats.test_stats).sort((a, b) => b[1] - a[1])[0][0]} ({Object.entries(stats.test_stats).sort((a, b) => b[1] - a[1])[0][1]} requests)
                    </p>
                  </div>
                )}
                {stats.shift_stats && (
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Shift Comparison:</strong> Night shift has {stats.shift_stats.night} requests vs Day shift with {stats.shift_stats.day} requests
                      {stats.shift_stats.night > stats.shift_stats.day && stats.shift_stats.day > 0 && (
                        <span> ({((stats.shift_stats.night / stats.shift_stats.day) * 100).toFixed(0)}% more)</span>
                      )}
                    </p>
                  </div>
                )}
                {stats.preventable_percentage > 0 && (
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm text-orange-800">
                      <strong>Prevention Opportunity:</strong> {stats.preventable_percentage}% of requests could have been prevented with proper initial sample collection
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}

