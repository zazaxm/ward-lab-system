import { useState } from 'react'
import Layout from '../components/Layout'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function CriticalCall() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState('all')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query')
      return
    }

    setLoading(true)
    try {
      const response = await api.get('/critical-call/search', {
        params: {
          q: searchQuery,
          type: searchType
        }
      })
      setResults(response.data)
      if (response.data.length === 0) {
        toast.info('No results found')
      }
    } catch (error) {
      toast.error('Search failed')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Critical Call Helper</h1>
          <p className="text-gray-600 mt-2">Quick search for nurse contact information</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search by ward, room, patient ID, or nurse name..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="md:w-48">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Results</option>
                <option value="ward">Ward</option>
                <option value="room">Room</option>
                <option value="patient">Patient</option>
                <option value="nurse">Nurse</option>
              </select>
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 font-medium"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Results ({results.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ward</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Primary Nurse</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Extension</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Backup Nurse</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Backup Ext.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Charge Nurse</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((result) => (
                    <tr key={result.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {result.ward_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.room_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.patient_id || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.primary_nurse_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={`tel:${result.primary_nurse_extension}`}
                          className="text-primary-600 hover:text-primary-800 font-medium text-sm"
                        >
                          {result.primary_nurse_extension}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.backup_nurse_name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {result.backup_nurse_extension ? (
                          <a
                            href={`tel:${result.backup_nurse_extension}`}
                            className="text-primary-600 hover:text-primary-800 font-medium text-sm"
                          >
                            {result.backup_nurse_extension}
                          </a>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.charge_nurse_name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.updated_at ? new Date(result.updated_at).toLocaleString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {results.length === 0 && !loading && searchQuery && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No results found</p>
          </div>
        )}
      </div>
    </Layout>
  )
}
