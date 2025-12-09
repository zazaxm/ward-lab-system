import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function AddOnRequest() {
  const [wards, setWards] = useState([])
  const [rooms, setRooms] = useState([])
  const [formData, setFormData] = useState({
    ward_id: '',
    room_id: '',
    room_number: '',
    patient_id: '',
    requested_test: '',
    reason: '',
    is_urgent: false,
    has_previous_sample: false,
    previous_sample_id: '',
    additional_comment: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchWards()
  }, [])

  useEffect(() => {
    if (formData.ward_id) {
      fetchRooms()
    }
  }, [formData.ward_id])

  const fetchWards = async () => {
    try {
      const response = await api.get('/wards')
      setWards(response.data)
    } catch (error) {
      toast.error('Failed to load wards')
    }
  }

  const fetchRooms = async () => {
    try {
      const response = await api.get('/rooms', { params: { ward_id: formData.ward_id } })
      setRooms(response.data)
    } catch (error) {
      toast.error('Failed to load rooms')
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleRoomSelect = (roomId) => {
    const room = rooms.find(r => r.id === roomId)
    if (room) {
      setFormData(prev => ({
        ...prev,
        room_id: room.id,
        room_number: room.room_number,
        patient_id: room.patient_id || ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.reason.trim()) {
      toast.error('Reason is required')
      return
    }

    setLoading(true)
    try {
      await api.post('/addon-requests', formData)
      toast.success('Request submitted successfully')
      setFormData({
        ward_id: '',
        room_id: '',
        room_number: '',
        patient_id: '',
        requested_test: '',
        reason: '',
        is_urgent: false,
        has_previous_sample: false,
        previous_sample_id: '',
        additional_comment: ''
      })
    } catch (error) {
      toast.error('Failed to submit request')
    } finally {
      setLoading(false)
    }
  }

  const commonTests = [
    'CBC',
    'Potassium',
    'Sodium',
    'Creatinine',
    'Lactate',
    'Culture',
    'Blood Gas',
    'Troponin',
    'BNP',
    'D-Dimer'
  ]

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Add-On Test Request</h1>
          <p className="text-gray-600 mt-2">Submit a request for additional test</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Ward Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ward <span className="text-red-500">*</span>
            </label>
            <select
              name="ward_id"
              value={formData.ward_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select Ward</option>
              {wards.map(ward => (
                <option key={ward.id} value={ward.id}>{ward.name}</option>
              ))}
            </select>
          </div>

          {/* Room Selection */}
          {formData.ward_id && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.room_id}
                onChange={(e) => handleRoomSelect(parseInt(e.target.value))}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Room</option>
                {rooms.map(room => (
                  <option key={room.id} value={room.id}>
                    {room.room_number} {room.patient_name ? `- ${room.patient_name}` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Room Number (Manual) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="room_number"
              value={formData.room_number}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Patient ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="patient_id"
              value={formData.patient_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Requested Test */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requested Test <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {commonTests.map(test => (
                <button
                  key={test}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, requested_test: test }))}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    formData.requested_test === test
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {test}
                </button>
              ))}
            </div>
            <input
              type="text"
              name="requested_test"
              value={formData.requested_test}
              onChange={handleChange}
              required
              placeholder="Or type the requested test"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Please state the reason for requesting this add-on test..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Urgency */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_urgent"
              checked={formData.is_urgent}
              onChange={handleChange}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              Urgent Request
            </label>
          </div>

          {/* Previous Sample */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="has_previous_sample"
              checked={formData.has_previous_sample}
              onChange={handleChange}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              Has Previous Sample
            </label>
          </div>

          {formData.has_previous_sample && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Previous Sample ID
              </label>
              <input
                type="text"
                name="previous_sample_id"
                value={formData.previous_sample_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          )}

          {/* Additional Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Comment
            </label>
            <textarea
              name="additional_comment"
              value={formData.additional_comment}
              onChange={handleChange}
              rows={2}
              placeholder="Any additional information..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setFormData({
                ward_id: '',
                room_id: '',
                room_number: '',
                patient_id: '',
                requested_test: '',
                reason: '',
                is_urgent: false,
                has_previous_sample: false,
                previous_sample_id: '',
                additional_comment: ''
              })}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 font-medium"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
