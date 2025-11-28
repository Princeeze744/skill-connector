'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Locate, Save } from 'lucide-react'

interface SetLocationModalProps {
  isOpen: boolean
  onClose: () => void
  currentLocation: { latitude: number | null; longitude: number | null }
  onLocationSet: (lat: number, lng: number) => void
}

export default function SetLocationModal({ isOpen, onClose, currentLocation, onLocationSet }: SetLocationModalProps) {
  const [latitude, setLatitude] = useState<string>(currentLocation.latitude?.toString() || '')
  const [longitude, setLongitude] = useState<string>(currentLocation.longitude?.toString() || '')
  const [loading, setLoading] = useState(false)
  const [detecting, setDetecting] = useState(false)
  const [error, setError] = useState('')

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      setDetecting(true)
      setError('')
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString())
          setLongitude(position.coords.longitude.toString())
          setDetecting(false)
        },
        (error) => {
          setError('Could not detect location. Please check your browser permissions.')
          setDetecting(false)
        }
      )
    } else {
      setError('Geolocation is not supported by your browser.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!latitude || !longitude) {
      setError('Please enter both latitude and longitude')
      return
    }

    const lat = parseFloat(latitude)
    const lng = parseFloat(longitude)

    if (isNaN(lat) || isNaN(lng)) {
      setError('Please enter valid numbers')
      return
    }

    if (lat < -90 || lat > 90) {
      setError('Latitude must be between -90 and 90')
      return
    }

    if (lng < -180 || lng > 180) {
      setError('Longitude must be between -180 and 180')
      return
    }

    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8000/profile/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          latitude: lat,
          longitude: lng
        })
      })

      if (response.ok) {
        onLocationSet(lat, lng)
        onClose()
      } else {
        const data = await response.json()
        setError(data.detail || 'Failed to update location')
      }
    } catch (err) {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg"
            >
              {/* Header */}
              <div className="border-b px-8 py-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Set Your Location</h2>
                  <p className="text-gray-600 text-sm">Help others find you in their area</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
                    {error}
                  </div>
                )}

                {/* Auto-detect */}
                <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="text-blue-600" size={24} />
                      <div>
                        <h3 className="font-semibold text-gray-900">Auto-Detect</h3>
                        <p className="text-sm text-gray-600">Use your current location</p>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={detecting}
                    className="w-full bg-white border-2 border-blue-500 text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {detecting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        Detecting...
                      </>
                    ) : (
                      <>
                        <Locate size={20} />
                        Detect My Location
                      </>
                    )}
                  </button>
                </div>

                {/* Manual entry */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      placeholder="e.g., 6.5244"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      placeholder="e.g., 3.3792"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition outline-none"
                    />
                  </div>

                  {latitude && longitude && (
                    <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
                      <p className="text-sm text-green-700">
                        ✅ Location: {parseFloat(latitude).toFixed(4)}, {parseFloat(longitude).toFixed(4)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        Save Location
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}