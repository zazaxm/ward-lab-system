import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function WardDirectory() {
  const [wards, setWards] = useState([])
  const [selectedWard, setSelectedWard] = useState('')
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchWards()
  }, [])

  useEffect(() => {
    if (selectedWard) {
      fetchRooms()
    }
  }, [selectedWard])

  const fetchWards = async () => {
    try {
      const response = await api.get('/wards')
      setWards(response.data)
      if (response.data.length > 0 && !selectedWard) {
        setSelectedWard(response.data[0].id.toString())
      }
    } catch (error) {
      toast.error('Failed to load wards')
    }
  }

  const fetchRooms = async () => {
    try {
      const response = await api.get('/rooms', { params: { ward_id: selectedWard } })
      setRooms(response.data)
    } catch (error) {
      toast.error('Failed to load rooms')
    }
  }

  const handleRoomChange = (index, field, value) => {
    const updatedRooms = [...rooms]
    updatedRooms[index] = { ...updatedRooms[index], [field]: value }
    setRooms(updatedRooms)
  }

  const addRoom = () => {
    setRooms([...rooms, {
      ward_id: parseInt(selectedWard),
      room_number: '',
      patient_name: '',
      patient_id: '',
      primary_nurse_name: '',
      primary_nurse_extension: '',
      backup_nurse_name: '',
      backup_nurse_extension: '',
      charge_nurse_name: '',
      notes: '',
      shift_type: 'day'
    }])
  }

  const removeRoom = (index) => {
    setRooms(rooms.filter((_, i) => i !== index))
  }

  const validateExtension = (ext) => {
    return ext && ext.length >= 4
  }

  const handleSubmit = async () => {
    // Validate all required fields
    for (const room of rooms) {
      if (!room.room_number || !room.primary_nurse_name || !room.primary_nurse_extension) {
        toast.error('Please fill all required fields')
        return
      }
      if (!validateExtension(room.primary_nurse_extension)) {
        toast.error(`Extension number for room ${room.room_number} is invalid (must be at least 4 digits)`)
        return
      }
    }

    setLoading(true)
    try {
      await api.post('/rooms/bulk', { rooms })
      toast.success('Ward data updated successfully')
      fetchRooms()
    } catch (error) {
      toast.error('Failed to update data')
    } finally {
      setLoading(false)
    }
  }

  const autoFillRooms = () => {
    const roomNumbers = Array.from({ length: 20 }, (_, i) => (i + 1).toString())
    const newRooms = roomNumbers.map(num => ({
      ward_id: parseInt(selectedWard),
      room_number: num,
      patient_name: '',
      patient_id: '',
      primary_nurse_name: '',
      primary_nurse_extension: '',
      backup_nurse_name: '',
      backup_nurse_extension: '',
      charge_nurse_name: '',
      notes: '',
      shift_type: 'day'
    }))
    setRooms(newRooms)
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ward Directory</h1>
            <p className="text-gray-600 mt-2">Update room and nurse information</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={autoFillRooms}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Auto Fill
            </button>
            <button
              onClick={addRoom}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Add Room
            </button>
          </div>
        </div>

        {/* Ward Selection */}
        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Ward
          </label>
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            {wards.map(ward => (
              <option key={ward.id} value={ward.id}>{ward.name}</option>
            ))}
          </select>
        </div>

        {/* Rooms Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Primary Nurse</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Extension</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Backup Nurse</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Backup Ext.</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Charge Nurse</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rooms.map((room, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={room.room_number}
                        onChange={(e) => handleRoomChange(index, 'room_number', e.target.value)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                        placeholder="Room #"
                        required
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={room.patient_id || ''}
                        onChange={(e) => handleRoomChange(index, 'patient_id', e.target.value)}
                        className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                        placeholder="Patient ID"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={room.patient_name || ''}
                        onChange={(e) => handleRoomChange(index, 'patient_name', e.target.value)}
                        className="w-32 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                        placeholder="Patient Name"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={room.primary_nurse_name}
                        onChange={(e) => handleRoomChange(index, 'primary_nurse_name', e.target.value)}
                        className="w-32 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                        placeholder="Nurse Name"
                        required
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={room.primary_nurse_extension}
                        onChange={(e) => handleRoomChange(index, 'primary_nurse_extension', e.target.value)}
                        className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                        placeholder="Extension"
                        required
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={room.backup_nurse_name || ''}
                        onChange={(e) => handleRoomChange(index, 'backup_nurse_name', e.target.value)}
                        className="w-32 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                        placeholder="Backup Nurse"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={room.backup_nurse_extension || ''}
                        onChange={(e) => handleRoomChange(index, 'backup_nurse_extension', e.target.value)}
                        className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                        placeholder="Backup Ext."
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={room.charge_nurse_name || ''}
                        onChange={(e) => handleRoomChange(index, 'charge_nurse_name', e.target.value)}
                        className="w-32 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                        placeholder="Charge Nurse"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={room.notes || ''}
                        onChange={(e) => handleRoomChange(index, 'notes', e.target.value)}
                        className="w-32 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                        placeholder="Notes"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => removeRoom(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {rooms.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No rooms. Click "Add Room" to start</p>
          </div>
        )}

        {rooms.length > 0 && (
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 font-medium"
            >
              {loading ? 'Saving...' : 'Save All Data'}
            </button>
          </div>
        )}
      </div>
    </Layout>
  )
}
