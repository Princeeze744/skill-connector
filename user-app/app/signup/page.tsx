'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, Phone, MapPin, ArrowRight, ArrowLeft, Check } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
    bio: '',
    latitude: null as number | null,
    longitude: null as number | null
  })

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateFormData('latitude', position.coords.latitude)
          updateFormData('longitude', position.coords.longitude)
          toast.success('📍 Location detected!')
        },
        (error) => {
          console.error('Error getting location:', error)
          toast.error('Could not get your location. Please try again.')
        }
      )
    }
  }

  const validateStep = () => {
    if (step === 1) {
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all fields')
        return false
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters')
        return false
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return false
      }
    }
    if (step === 2) {
      if (!formData.full_name) {
        setError('Please enter your full name')
        return false
      }
    }
    setError('')
    return true
  }

  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1)
    } else {
      if (error) {
        toast.error(error)
      }
    }
  }

  const prevStep = () => {
    setError('')
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    if (!validateStep()) {
      if (error) {
        toast.error(error)
      }
      return
    }
    
    setLoading(true)
    setError('')
    const loadingToast = toast.loading('Creating your account...')

    try {
      const response = await fetch('http://localhost:8000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name,
          phone: formData.phone || null,
          bio: formData.bio || null,
          latitude: formData.latitude,
          longitude: formData.longitude
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Store token and user data
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        toast.success('Account created successfully! 🎉', { id: loadingToast })
        
        // Redirect to dashboard
        setTimeout(() => {
          router.push('/dashboard')
        }, 500)
      } else {
        const errorMessage = data.detail || 'Failed to create account'
        toast.error(errorMessage, { id: loadingToast })
        setError(errorMessage)
      }
    } catch (err) {
      toast.error('Connection error. Please try again.', { id: loadingToast })
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { number: 1, title: 'Account', icon: <Lock size={20} /> },
    { number: 2, title: 'Profile', icon: <User size={20} /> },
    { number: 3, title: 'Location', icon: <MapPin size={20} /> }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-20 -left-20 w-72 h-72 bg-purple-200 rounded-full opacity-20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-200 rounded-full opacity-20 blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-2xl"
      >
        
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="text-4xl">🌍</div>
          <span className="text-2xl font-bold gradient-text">Skill Connector</span>
        </Link>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    step >= s.number 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    {step > s.number ? <Check size={20} /> : s.icon}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${
                    step >= s.number ? 'text-purple-600' : 'text-gray-400'
                  }`}>
                    {s.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-20 h-1 mx-2 transition-all ${
                    step > s.number ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Signup Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          
          <AnimatePresence mode="wait">
            {/* Step 1: Account Details */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
                <p className="text-gray-600 mb-8">Join thousands of skilled professionals</p>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                    {error}
                  </div>
                )}

                <div className="space-y-6">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition outline-none"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => updateFormData('password', e.target.value)}
                        placeholder="Minimum 8 characters"
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition outline-none"
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition outline-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={nextStep}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    Continue
                    <ArrowRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Profile Details */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Tell Us About You</h1>
                <p className="text-gray-600 mb-8">Help others know who you are</p>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                    {error}
                  </div>
                )}

                <div className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => updateFormData('full_name', e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition outline-none"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateFormData('phone', e.target.value)}
                        placeholder="+1 234 567 8900"
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition outline-none"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bio (Optional)
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => updateFormData('bio', e.target.value)}
                      placeholder="Tell us about yourself, your skills, and experience..."
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition outline-none resize-none"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={prevStep}
                      className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2"
                    >
                      <ArrowLeft size={20} />
                      Back
                    </button>
                    <button
                      onClick={nextStep}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    >
                      Continue
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Location */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Set Your Location</h1>
                <p className="text-gray-600 mb-8">Help others find you in their area</p>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                    {error}
                  </div>
                )}

                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl text-center">
                    <MapPin className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                    <h3 className="font-bold text-lg mb-2">📍 Location Detection</h3>
                    <p className="text-gray-600 mb-4">
                      {formData.latitude && formData.longitude
                        ? `✅ Location set: ${formData.latitude.toFixed(4)}, ${formData.longitude.toFixed(4)}`
                        : 'Click below to automatically detect your location'}
                    </p>
                    <button
                      onClick={handleGetLocation}
                      className="bg-white border-2 border-blue-500 text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition"
                    >
                      📍 Get My Location
                    </button>
                  </div>

                  <p className="text-sm text-gray-500 text-center">
                    You can skip this step and set your location later
                  </p>

                  <div className="flex gap-4">
                    <button
                      onClick={prevStep}
                      className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2"
                    >
                      <ArrowLeft size={20} />
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Complete Registration
                          <Check size={20} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sign In Link */}
          <p className="text-center mt-8 text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-purple-600 hover:text-purple-700 transition">
              Sign in
            </Link>
          </p>
        </div>

        {/* Terms */}
        <p className="text-center mt-6 text-sm text-gray-500">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-gray-700">Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" className="underline hover:text-gray-700">Privacy Policy</Link>
        </p>

      </motion.div>
    </div>
  )
}