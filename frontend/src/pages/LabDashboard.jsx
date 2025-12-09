import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function LabDashboard() {
  const [requests, setRequests] = useState([])
  const [filter, setFilter] = useState('pending')
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [approvalAction, setApprovalAction] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchRequests()
  }, [filter])

  const fetchRequests = async () => {
    try {
      const response = await api.get('/addon-requests', {
        params: { status: filter === 'all' ? '' : filter }
      })
      setRequests(response.data)
    } catch (error) {
      toast.error('Failed to load requests')
    }
  }

  const handleApprove = async () => {
    if (!approvalAction) {
      toast.error('Please select an action')
      return
    }

    setLoading(true)
    try {
      await api.post(`/addon-requests/${selectedRequest.id}/approve`, {
        action: approvalAction
      })
      toast.success('Request approved')
      setShowApproveModal(false)
      setSelectedRequest(null)
      setApprovalAction('')
      fetchRequests()
    } catch (error) {
      toast.error('Failed to approve request')
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    if (!rejectionReason) {
      toast.error('Please provide a rejection reason')
      return
    }

    setLoading(true)
    try {
      await api.post(`/addon-requests/${selectedRequest.id}/reject`, {
        reason: rejectionReason
      })
      toast.success('Request rejected')
      setShowRejectModal(false)
      setSelectedRequest(null)
      setRejectionReason('')
      fetchRequests()
    } catch (error) {
      toast.error('Failed to reject request')
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async (requestId) => {
    setLoading(true)
    try {
      await api.post(`/addon-requests/${requestId}/complete`)
      toast.success('Request marked as completed')
      fetchRequests()
    } catch (error) {
      toast.error('Failed to complete request')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-green-100 text-green-800'
    }
    return badges[status] || 'bg-gray-100 text-gray-800'
  }

  const rejectionReasons = [
    'Old sample',
    'Insufficient quantity',
    'Repeated request without reason',
    'Test not allowed as add-on'
  ]

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lab Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage add-on test requests</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex space-x-2">
            {['all', 'pending', 'approved', 'rejected', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium capitalize ${
                  filter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Requests List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ward</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Urgent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requested By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.ward_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.room_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.patient_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.requested_test}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.is_urgent ? (
                        <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded">
                          Urgent
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${getStatusBadge(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.requester_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="text-primary-600 hover:text-primary-800 mr-3"
                      >
                        View
                      </button>
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedRequest(request)
                              setShowApproveModal(true)
                            }}
                            className="text-green-600 hover:text-green-800 mr-3"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRequest(request)
                              setShowRejectModal(true)
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {request.status === 'approved' && (
                        <button
                          onClick={() => handleComplete(request.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {requests.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No requests found</p>
          </div>
        )}

        {/* Request Detail Modal */}
        {selectedRequest && !showApproveModal && !showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Request Details</h2>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Ward</label>
                    <p className="text-gray-900">{selectedRequest.ward_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Room</label>
                    <p className="text-gray-900">{selectedRequest.room_number}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Patient ID</label>
                    <p className="text-gray-900">{selectedRequest.patient_id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Requested Test</label>
                    <p className="text-gray-900">{selectedRequest.requested_test}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Reason</label>
                    <p className="text-gray-900">{selectedRequest.reason}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Urgent</label>
                    <p className="text-gray-900">{selectedRequest.is_urgent ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Has Previous Sample</label>
                    <p className="text-gray-900">{selectedRequest.has_previous_sample ? 'Yes' : 'No'}</p>
                    {selectedRequest.previous_sample_id && (
                      <p className="text-gray-600 text-sm">Sample ID: {selectedRequest.previous_sample_id}</p>
                    )}
                  </div>
                  {selectedRequest.additional_comment && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Additional Comment</label>
                      <p className="text-gray-900">{selectedRequest.additional_comment}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-700">Requested By</label>
                    <p className="text-gray-900">{selectedRequest.requester_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Created At</label>
                    <p className="text-gray-900">{new Date(selectedRequest.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Approve Modal */}
        {showApproveModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Approve Request</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Action <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={approvalAction}
                      onChange={(e) => setApprovalAction(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select Action</option>
                      <option value="add_to_same_sample">Add to Same Sample</option>
                      <option value="need_new_sample">Need New Sample</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowApproveModal(false)
                      setApprovalAction('')
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? 'Approving...' : 'Approve'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Reject Request</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rejection Reason <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 mb-2"
                    >
                      <option value="">Select Reason</option>
                      {rejectionReasons.map((reason) => (
                        <option key={reason} value={reason}>{reason}</option>
                      ))}
                    </select>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Or type custom reason..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowRejectModal(false)
                      setRejectionReason('')
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {loading ? 'Rejecting...' : 'Reject'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

