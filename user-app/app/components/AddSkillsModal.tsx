'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Briefcase, DollarSign, Calendar, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface AddSkillsModalProps {
  isOpen: boolean
  onClose: () => void
  onSkillAdded: () => void
}

export default function AddSkillsModal({ isOpen, onClose, onSkillAdded }: AddSkillsModalProps) {
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])
  const [formData, setFormData] = useState({
    category_id: '',
    skill_name: '',
    description: '',
    experience_years: '',
    hourly_rate: '',
    currency: 'USD',
    is_available: true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      loadCategories()
    }
  }, [isOpen])

  const loadCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/skills/categories')
      const data = await response.json()
      setCategories(data)
    } catch (err) {
      console.error('Error loading categories:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        setError('No authentication token found. Please login again.')
        setLoading(false)
        setTimeout(() => {
          router.push('/login')
        }, 2000)
        return
      }

      const payload = {
        category_id: formData.category_id,
        skill_name: formData.skill_name.trim(),
        description: formData.description.trim(),
        experience_years: parseInt(formData.experience_years) || 0,
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
        currency: 'USD',
        is_available: formData.is_available
      }

      console.log('Sending payload:', JSON.stringify(payload, null, 2))

      const response = await fetch('http://localhost:8000/skills/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()
      console.log('Response:', data)

      if (response.status === 401) {
        setError('🔒 Your session has expired. Redirecting to login...')
        setTimeout(() => {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          router.push('/login')
        }, 2000)
        return
      }

      if (response.ok) {
        onSkillAdded()
        onClose()
        setFormData({
          category_id: '',
          skill_name: '',
          description: '',
          experience_years: '',
          hourly_rate: '',
          currency: 'USD',
          is_available: true
        })
      } else {
        if (typeof data.detail === 'string') {
          setError(data.detail)
        } else if (Array.isArray(data.detail)) {
          const errors = data.detail.map((err: any) => `${err.loc.join('.')}: ${err.msg}`).join(', ')
          setError(errors)
        } else {
          setError('Failed to add skill')
        }
      }
    } catch (err: any) {
      console.error('Error:', err)
      setError('Connection error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b px-8 py-6 flex items-center justify-between rounded-t-3xl">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Add Your Skill</h2>
                  <p className="text-gray-600 text-sm">Showcase your expertise</p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition outline-none"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Skill Name *
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        value={formData.skill_name}
                        onChange={(e) => setFormData({ ...formData, skill_name: e.target.value })}
                        required
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition outline-none"
                        placeholder="e.g., Residential Plumbing, Logo Design"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition outline-none resize-none"
                      placeholder="Describe your skill and experience..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Experience (Years) *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="number"
                          value={formData.experience_years}
                          onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                          required
                          min="0"
                          placeholder="0"
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Hourly Rate (Optional)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="number"
                          value={formData.hourly_rate}
                          onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                          min="0"
                          step="0.01"
                          placeholder="50.00"
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-purple-50 p-4 rounded-xl">
                    <input
                      type="checkbox"
                      id="is_available"
                      checked={formData.is_available}
                      onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="is_available" className="text-sm font-medium text-gray-700 cursor-pointer">
                      ✅ I'm currently available for this skill
                    </label>
                  </div>
                </div>

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
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus size={20} />
                        Add Skill
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