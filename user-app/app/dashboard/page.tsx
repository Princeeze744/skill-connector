'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import LoadingButton from '../components/LoadingButton'
import { User, MapPin, Mail, Phone, Plus, Trash2, Edit, X, MessageCircle } from 'lucide-react'

interface UserData {
  id: string
  email: string
  full_name: string
  bio: string | null
  phone: string | null
  profile_picture: string | null
  latitude: number | null
  longitude: number | null
  created_at: string
}

interface Skill {
  id: string
  skill_name: string
  category_name: string
  description: string
  experience_years: number
  hourly_rate: number
  currency: string
  is_available: boolean
}

interface Category {
  id: string
  name: string
  description: string
  icon: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)
  const [skillLoading, setSkillLoading] = useState(false)
  
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showSkillsModal, setShowSkillsModal] = useState(false)

  const [profileForm, setProfileForm] = useState({
    full_name: '',
    bio: '',
    phone: ''
  })

  const [skillForm, setSkillForm] = useState({
    skill_name: '',
    category_name: '',
    description: '',
    experience_years: 1,
    hourly_rate: 0,
    currency: 'USD',
    is_available: true
  })

  useEffect(() => {
    checkAuth()
    loadCategories()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    loadProfile()
  }

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8000/profile/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data)
        setProfileForm({
          full_name: data.full_name || '',
          bio: data.bio || '',
          phone: data.phone || ''
        })
        loadSkills()
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSkills = async () => {
    try {
      const userData = localStorage.getItem('user')
      if (!userData) return

      const user = JSON.parse(userData)
      const response = await fetch(`http://localhost:8000/skills/user/${user.id}`)

      if (response.ok) {
        const data = await response.json()
        setSkills(data)
      }
    } catch (error) {
      console.error('Error loading skills:', error)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/skills/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const handleProfileUpdate = async () => {
    setProfileLoading(true)
    const loadingToast = toast.loading('Updating profile...')
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8000/profile/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileForm)
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data)
        localStorage.setItem('user', JSON.stringify(data))
        setShowProfileModal(false)
        toast.success('Profile updated successfully! ✅', { id: loadingToast })
        loadProfile()
      } else {
        toast.error('Failed to update profile', { id: loadingToast })
      }
    } catch (error) {
      toast.error('Connection error', { id: loadingToast })
    } finally {
      setProfileLoading(false)
    }
  }

  const handleAddSkill = async () => {
    if (!skillForm.skill_name || !skillForm.category_name || !skillForm.hourly_rate) {
      toast.error('Please fill in all required fields')
      return
    }

    setSkillLoading(true)
    const loadingToast = toast.loading('Adding skill...')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8000/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(skillForm)
      })

      if (response.ok) {
        setShowSkillsModal(false)
        setSkillForm({
          skill_name: '',
          category_name: '',
          description: '',
          experience_years: 1,
          hourly_rate: 0,
          currency: 'USD',
          is_available: true
        })
        toast.success('Skill added successfully! 🎉', { id: loadingToast })
        loadSkills()
      } else {
        toast.error('Failed to add skill', { id: loadingToast })
      }
    } catch (error) {
      toast.error('Connection error', { id: loadingToast })
    } finally {
      setSkillLoading(false)
    }
  }

  const handleDeleteSkill = async (skillId: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return

    const loadingToast = toast.loading('Deleting skill...')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8000/skills/${skillId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast.success('Skill deleted! 🗑️', { id: loadingToast })
        loadSkills()
      } else {
        toast.error('Failed to delete skill', { id: loadingToast })
      }
    } catch (error) {
      toast.error('Connection error', { id: loadingToast })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    toast.success('Logged out successfully! 👋')
    router.push('/')
  }

  const calculateProfileCompleteness = () => {
    if (!user) return 0
    let completed = 0
    const total = 5

    if (user.full_name) completed++
    if (user.bio) completed++
    if (user.phone) completed++
    if (skills.length > 0) completed++
    if (user.latitude && user.longitude) completed++

    return Math.round((completed / total) * 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const completeness = calculateProfileCompleteness()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      
      <nav className="fixed top-0 w-full z-50 glass border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-3xl">🌍</div>
              <span className="text-xl font-bold gradient-text">Skill Connector</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/browse" className="text-gray-700 hover:text-purple-600 transition">Browse</Link>
              <Link href="/inbox" className="text-gray-700 hover:text-purple-600 transition flex items-center gap-2">
                <MessageCircle size={18} />
                Inbox
              </Link>
              <Link href="/how-it-works" className="text-gray-700 hover:text-purple-600 transition">How it Works</Link>
            </div>
            <button onClick={handleLogout} className="text-gray-700 hover:text-red-600 transition font-medium">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, {user.full_name}! 👋</h1>
            <p className="text-gray-600">Manage your profile and showcase your skills</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Profile Completeness</h3>
                <p className="text-gray-600 text-sm">Complete your profile to attract more clients</p>
              </div>
              <div className="text-3xl font-bold text-purple-600">{completeness}%</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${completeness}%` }}
              ></div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <User size={28} className="text-purple-600" />
                    Your Profile
                  </h2>
                  <button onClick={() => setShowProfileModal(true)} className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium">
                    <Edit size={18} />
                    Edit
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">Full Name</label>
                    <p className="text-lg font-semibold text-gray-900">{user.full_name}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="text-lg text-gray-900 flex items-center gap-2">
                      <Mail size={18} className="text-purple-600" />
                      {user.email}
                    </p>
                  </div>

                  {user.phone && (
                    <div>
                      <label className="text-sm text-gray-500">Phone</label>
                      <p className="text-lg text-gray-900 flex items-center gap-2">
                        <Phone size={18} className="text-purple-600" />
                        {user.phone}
                      </p>
                    </div>
                  )}

                  {user.bio && (
                    <div>
                      <label className="text-sm text-gray-500">Bio</label>
                      <p className="text-gray-700 leading-relaxed">{user.bio}</p>
                    </div>
                  )}

                  {!user.bio && !user.phone && (
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <p className="text-purple-700 text-sm">
                        💡 Add your bio and phone number to make your profile more attractive to clients!
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Your Skills 🎯</h2>
                  <button onClick={() => setShowSkillsModal(true)} className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-medium">
                    <Plus size={18} />
                    Add Skill
                  </button>
                </div>

                {skills.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎨</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No skills yet</h3>
                    <p className="text-gray-600 mb-6">Showcase your expertise to potential clients by adding your skills</p>
                    <button onClick={() => setShowSkillsModal(true)} className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-semibold">
                      Add Your First Skill
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {skills.map((skill) => (
                      <div key={skill.id} className="border border-gray-200 rounded-xl p-6 hover:border-purple-600 transition">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{skill.skill_name}</h3>
                            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                              {skill.category_name}
                            </span>
                          </div>
                          <button onClick={() => handleDeleteSkill(skill.id)} className="text-red-600 hover:text-red-700 p-2">
                            <Trash2 size={20} />
                          </button>
                        </div>
                        
                        {skill.description && (
                          <p className="text-gray-600 mb-4">{skill.description}</p>
                        )}

                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-700">
                            <span className="font-semibold">Rate:</span>
                            ${skill.hourly_rate}/{skill.currency}
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <span className="font-semibold">Experience:</span>
                            {skill.experience_years} year{skill.experience_years !== 1 ? 's' : ''}
                          </div>
                          <div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              skill.is_available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {skill.is_available ? 'Available' : 'Unavailable'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Skills</span>
                    <span className="text-2xl font-bold text-purple-600">{skills.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Profile Views</span>
                    <span className="text-2xl font-bold text-purple-600">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Jobs Completed</span>
                    <span className="text-2xl font-bold text-purple-600">0</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-6 shadow-lg text-white">
                <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link href="/browse" className="block w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition px-4 py-3 rounded-lg font-medium">
                    🔍 Browse Professionals
                  </Link>
                  <Link href="/inbox" className="block w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition px-4 py-3 rounded-lg font-medium">
                    💬 Check Messages
                  </Link>
                  <button onClick={() => setShowProfileModal(true)} className="block w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition px-4 py-3 rounded-lg font-medium text-left">
                    ✏️ Edit Profile
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
              <button onClick={() => setShowProfileModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={profileForm.full_name}
                  onChange={(e) => setProfileForm({...profileForm, full_name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                  placeholder="+1234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none resize-none"
                  placeholder="Tell clients about yourself..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <LoadingButton onClick={handleProfileUpdate} loading={profileLoading} className="flex-1">
                  Save Changes
                </LoadingButton>
                <button onClick={() => setShowProfileModal(false)} className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSkillsModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Skill</h2>
              <button onClick={() => setShowSkillsModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skill Name *</label>
                <input
                  type="text"
                  value={skillForm.skill_name}
                  onChange={(e) => setSkillForm({...skillForm, skill_name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                  placeholder="e.g. Web Development"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  value={skillForm.category_name}
                  onChange={(e) => setSkillForm({...skillForm, category_name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.icon} {cat.name}</option>
                  ))}
                  <option value="Uncategorized">Uncategorized</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={skillForm.description}
                  onChange={(e) => setSkillForm({...skillForm, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none resize-none"
                  placeholder="Describe your expertise..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate ($) *</label>
                  <input
                    type="number"
                    value={skillForm.hourly_rate}
                    onChange={(e) => setSkillForm({...skillForm, hourly_rate: Number(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience (years)</label>
                  <input
                    type="number"
                    value={skillForm.experience_years}
                    onChange={(e) => setSkillForm({...skillForm, experience_years: Number(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_available"
                  checked={skillForm.is_available}
                  onChange={(e) => setSkillForm({...skillForm, is_available: e.target.checked})}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-purple-600"
                />
                <label htmlFor="is_available" className="text-sm font-medium text-gray-700">
                  Currently available for this service
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <LoadingButton onClick={handleAddSkill} loading={skillLoading} className="flex-1">
                  Add Skill
                </LoadingButton>
                <button onClick={() => setShowSkillsModal(false)} className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}