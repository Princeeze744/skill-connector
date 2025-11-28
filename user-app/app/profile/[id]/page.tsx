'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Star, DollarSign, Clock, Mail, Phone, Calendar, Award, Briefcase, MessageCircle } from 'lucide-react'
import Link from 'next/link'

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

const SkeletonProfile = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
  >
    <div className="flex flex-col md:flex-row gap-8 items-start">
      <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-200 rounded-full flex-shrink-0 shadow-xl animate-pulse"></div>
      <div className="flex-1 w-full">
        <div className="h-12 bg-gray-200 rounded w-72 mb-4 animate-pulse"></div>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-full mb-3 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-4/5 mb-6 animate-pulse"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-100 rounded-xl p-4">
              <div className="h-4 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="h-12 bg-gray-200 rounded-lg w-40 animate-pulse"></div>
          <div className="h-12 bg-gray-200 rounded-lg w-40 animate-pulse"></div>
        </div>
      </div>
    </div>
  </motion.div>
)

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [professional, setProfessional] = useState<Professional | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      loadProfile()
    }
  }, [params.id])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const userRes = await fetch(`http://localhost:8000/users/${params.id}`)
      if (userRes.ok) {
        const user = await userRes.json()
        setProfessional(user)
      }

      const skillsRes = await fetch(`http://localhost:8000/skills/user/${params.id}`)
      if (skillsRes.ok) {
        const skillsData = await skillsRes.json()
        setSkills(skillsData)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <nav className="fixed top-0 w-full z-50 glass border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button className="flex items-center gap-2 text-gray-700">
                <ArrowLeft size={20} />
                <span>Back</span>
              </button>
              <Link href="/" className="flex items-center gap-2">
                <div className="text-3xl">🌍</div>
                <span className="text-xl font-bold gradient-text">Skill Connector</span>
              </Link>
              <div className="w-20"></div>
            </div>
          </div>
        </nav>
        <section className="pt-24 pb-12 px-4 bg-gradient-to-br from-purple-600 to-blue-600">
          <div className="max-w-7xl mx-auto">
            <SkeletonProfile />
          </div>
        </section>
      </div>
    )
  }

  if (!professional) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional not found</h2>
          <p className="text-gray-600 mb-6">This profile doesn't exist or has been removed.</p>
          <Link href="/browse" className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
            Back to Browse
          </Link>
        </div>
      </div>
    )
  }

  const avgRate = skills.length > 0 ? skills.reduce((sum, s) => sum + s.hourly_rate, 0) / skills.length : 0
  const totalExperience = skills.length > 0 ? Math.max(...skills.map(s => s.experience_years)) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <nav className="fixed top-0 w-full z-50 glass border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition font-medium">
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="text-3xl">🌍</div>
              <span className="text-xl font-bold gradient-text">Skill Connector</span>
            </Link>
            <Link href="/browse" className="text-gray-700 hover:text-purple-600 transition font-medium">Browse More</Link>
          </div>
        </div>
      </nav>

      <section className="pt-24 pb-12 px-4 bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-5xl md:text-6xl font-bold flex-shrink-0 shadow-xl">
                {professional.full_name.charAt(0)}
              </div>
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">{professional.full_name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1 text-yellow-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={20} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-lg font-bold text-gray-900">5.0</span>
                  <span className="text-gray-600">(24 reviews)</span>
                </div>
                {professional.bio && (
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">{professional.bio}</p>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-purple-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-purple-600 mb-1">
                      <DollarSign size={20} />
                      <span className="font-semibold">Rate</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">${avgRate.toFixed(0)}/hr</div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                      <Clock size={20} />
                      <span className="font-semibold">Experience</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{totalExperience}+ yrs</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-green-600 mb-1">
                      <Briefcase size={20} />
                      <span className="font-semibold">Skills</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{skills.length}</div>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-orange-600 mb-1">
                      <Award size={20} />
                      <span className="font-semibold">Jobs</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">48+</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Link href={`/chat/${params.id}`} className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition">
                    <MessageCircle size={20} />
                    Send Message
                  </Link>
                  <button className="flex items-center gap-2 bg-white border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition">
                    <Calendar size={20} />
                    Book Consultation
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Skills & Expertise</h2>
                <div className="space-y-4">
                  {skills.map((skill, index) => (
                    <motion.div key={skill.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="border-2 border-purple-200 rounded-xl p-6 hover:border-purple-400 transition">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{skill.skill_name}</h3>
                          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">{skill.category_name}</span>
                        </div>
                        <div className={`px-4 py-2 rounded-full font-bold text-sm ${skill.is_available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {skill.is_available ? 'Available' : 'Busy'}
                        </div>
                      </div>
                      {skill.description && <p className="text-gray-700 mb-4">{skill.description}</p>}
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <DollarSign size={16} />
                          <span className="font-semibold">{skill.currency} {skill.hourly_rate}/hour</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>{skill.experience_years} years experience</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Client Reviews</h2>
                <div className="space-y-4">
                  {[1, 2, 3].map((review) => (
                    <div key={review} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold">J</div>
                        <div>
                          <div className="font-bold text-gray-900">John Doe</div>
                          <div className="flex items-center gap-1 text-yellow-500">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} size={14} fill="currentColor" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">Excellent work! Very professional and delivered on time. Highly recommended!</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="space-y-6">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl shadow-lg p-8 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="text-purple-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Email</div>
                      <a href={`mailto:${professional.email}`} className="text-gray-900 font-medium hover:text-purple-600">{professional.email}</a>
                    </div>
                  </div>
                  {professional.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="text-purple-600 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Phone</div>
                        <a href={`tel:${professional.phone}`} className="text-gray-900 font-medium hover:text-purple-600">{professional.phone}</a>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <MapPin className="text-purple-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Location</div>
                      <div className="text-gray-900 font-medium">
                        {professional.latitude && professional.longitude ? 'Location available' : 'Location not set'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="text-purple-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Member Since</div>
                      <div className="text-gray-900 font-medium">
                        {new Date(professional.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t">
                  <Link href={`/chat/${params.id}`} className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition mb-3 text-center">
                    Send Message
                  </Link>
                  <button className="w-full bg-white border-2 border-purple-600 text-purple-600 py-3 rounded-lg font-semibold hover:bg-purple-50 transition">
                    Save Profile
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}