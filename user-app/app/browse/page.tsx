'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, Filter, Star, DollarSign, Clock, X, User, LogOut, MessageCircle, Menu } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface SkeletonCardProps {}

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl p-6 shadow-lg">
    <div className="flex items-start gap-4 mb-4">
      <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0 animate-pulse"></div>
      <div className="flex-1 min-w-0">
        <div className="h-6 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
      </div>
    </div>
    <div className="h-4 bg-gray-200 rounded w-full mb-4 animate-pulse"></div>
    <div className="h-4 bg-gray-200 rounded w-4/5 mb-4 animate-pulse"></div>
    <div className="flex flex-wrap gap-2 mb-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
      ))}
    </div>
    <div className="flex items-center justify-between pt-4 border-t mb-4">
      <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
      <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
    </div>
    <div className="grid grid-cols-2 gap-2">
      <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
      <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
    </div>
  </div>
)

interface Professional {
  id: string
  full_name: string
  email: string
  bio: string
  phone: string
  latitude: number | null
  longitude: number | null
  profile_picture: string | null
  created_at: string
}

interface Skill {
  id: string
  user_id: string
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

export default function BrowsePage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [allSkills, setAllSkills] = useState<Skill[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [locationQuery, setLocationQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    // Check login status
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setIsLoggedIn(true)
      setUser(JSON.parse(userData))
    }
    
    loadData()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setUser(null)
    setMobileMenuOpen(false)
    router.push('/')
  }

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load categories
      const categoriesRes = await fetch('http://localhost:8000/skills/categories')
      if (categoriesRes.ok) {
        const cats = await categoriesRes.json()
        setCategories(cats)
      }

      // Load all users
      const usersRes = await fetch('http://localhost:8000/users/')
      if (usersRes.ok) {
        const users = await usersRes.json()
        setProfessionals(users)
        
        // Load skills for all users
        const skillsPromises = users.map((user: Professional) =>
          fetch(`http://localhost:8000/skills/user/${user.id}`).then(r => r.json()).catch(() => [])
        )
        const skillsArrays = await Promise.all(skillsPromises)
        const allSkillsFlat = skillsArrays.flat()
        setAllSkills(allSkillsFlat)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get skills for a specific user
  const getUserSkills = (userId: string) => {
    return allSkills.filter(skill => skill.user_id === userId)
  }

  // Filter professionals based on search criteria
  const filteredProfessionals = professionals.filter(prof => {
    const userSkills = getUserSkills(prof.id)
    
    // Search by name or skill (case-insensitive, trim whitespace)
    const searchLower = searchQuery.trim().toLowerCase()
    const matchesSearch = searchQuery === '' || 
      prof.full_name.toLowerCase().includes(searchLower) ||
      userSkills.some(skill => skill.skill_name.toLowerCase().includes(searchLower)) ||
      userSkills.some(skill => skill.description?.toLowerCase().includes(searchLower))
    
    // Filter by category
    const matchesCategory = selectedCategory === 'all' ||
      userSkills.some(skill => skill.category_name === selectedCategory)
    
    // Only show professionals with skills
    const hasSkills = userSkills.length > 0
    
    return matchesSearch && matchesCategory && hasSkills
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 glass border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center gap-2">
                <div className="text-3xl">🌍</div>
                <span className="text-xl font-bold gradient-text">Skill Connector</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero with skeleton */}
        <section className="pt-24 pb-12 px-4 bg-gradient-to-br from-purple-600 to-blue-600">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <div className="h-12 bg-white/20 rounded w-96 mx-auto mb-4 animate-pulse"></div>
              <div className="h-6 bg-white/20 rounded w-64 mx-auto animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Skeleton Cards */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8 animate-pulse"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-3xl">🌍</div>
              <span className="text-xl font-bold gradient-text">Skill Connector</span>
            </Link>
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard" className="hidden md:flex items-center gap-2 text-gray-700 hover:text-purple-600 transition font-medium">
                    <User size={18} />
                    <span className="hidden sm:inline">{user?.full_name || 'Dashboard'}</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="hidden md:flex items-center gap-2 text-gray-700 hover:text-red-600 transition font-medium"
                  >
                    <LogOut size={18} />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                  <button 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden text-gray-700 hover:text-purple-600 transition"
                  >
                    <Menu size={24} />
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="hidden md:block text-gray-700 hover:text-purple-600 transition font-medium">
                    Sign In
                  </Link>
                  <Link href="/signup" className="hidden md:block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition">
                    Get Started
                  </Link>
                  <button 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden text-gray-700 hover:text-purple-600 transition"
                  >
                    <Menu size={24} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden border-t bg-white/95 backdrop-blur"
            >
              <div className="px-4 py-4 space-y-3">
                {isLoggedIn ? (
                  <>
                    <Link href="/dashboard" className="block text-gray-700 hover:text-purple-600 transition py-2 font-medium">
                      Dashboard
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left text-red-600 hover:text-red-700 transition py-2 font-medium"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block text-gray-700 hover:text-purple-600 transition py-2 font-medium border-t">
                      Sign In
                    </Link>
                    <Link href="/signup" className="block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition text-center font-semibold">
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Search Section */}
      <section className="pt-24 pb-12 px-4 bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Find Skilled Professionals
            </h1>
            <p className="text-xl text-white/90">
              Browse {professionals.length} verified professional{professionals.length !== 1 ? 's' : ''} with {allSkills.length} skill{allSkills.length !== 1 ? 's' : ''}
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-4"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                <Search className="text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name or skill..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-gray-700"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                <MapPin className="text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Location (coming soon)"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-gray-700"
                  disabled
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition flex items-center gap-2 font-semibold whitespace-nowrap"
              >
                <Filter size={20} />
                Filters
              </button>
            </div>

            {/* Category Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 pt-4 border-t"
              >
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-full font-medium transition ${
                      selectedCategory === 'all'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`px-4 py-2 rounded-full font-medium transition ${
                        selectedCategory === cat.name
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Results Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredProfessionals.length} Professional{filteredProfessionals.length !== 1 ? 's' : ''} Found
            </h2>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
              >
                <X size={18} />
                Clear Filters
              </button>
            )}
          </div>

          {/* Professional Cards Grid */}
          {filteredProfessionals.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No professionals found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery 
                  ? `No results for "${searchQuery}". Try a different search term.`
                  : 'Try adjusting your search filters'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfessionals.map((prof, index) => {
                const userSkills = getUserSkills(prof.id)
                const avgRate = userSkills.length > 0
                  ? userSkills.reduce((sum, s) => sum + s.hourly_rate, 0) / userSkills.length
                  : 0

                return (
                  <motion.div
                    key={prof.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    {/* Profile Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                        {prof.full_name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-900 truncate">{prof.full_name}</h3>
                        <div className="flex items-center gap-1 text-yellow-500 mt-1">
                          <Star size={16} fill="currentColor" />
                          <span className="text-sm font-semibold text-gray-700">5.0</span>
                          <span className="text-sm text-gray-500">(12 reviews)</span>
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    {prof.bio && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{prof.bio}</p>
                    )}

                    {/* Skills */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {userSkills.slice(0, 3).map(skill => (
                          <span
                            key={skill.id}
                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold"
                          >
                            {skill.skill_name}
                          </span>
                        ))}
                        {userSkills.length > 3 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                            +{userSkills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-1 text-gray-600">
                        <DollarSign size={16} />
                        <span className="text-sm font-semibold">${avgRate.toFixed(0)}/hr</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock size={16} />
                        <span className="text-sm">{userSkills[0]?.experience_years || 0}+ years</span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        userSkills.some(s => s.is_available)
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {userSkills.some(s => s.is_available) ? 'Available' : 'Busy'}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <Link 
                        href={`/profile/${prof.id}`}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition text-center"
                      >
                        View Profile
                      </Link>
                      <Link
                        href={`/chat/${prof.id}`}
                        className="bg-white border-2 border-purple-600 text-purple-600 py-3 rounded-lg font-semibold hover:bg-purple-50 transition text-center flex items-center justify-center gap-2"
                      >
                        <MessageCircle size={18} />
                        Message
                      </Link>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>

    </div>
  )
}