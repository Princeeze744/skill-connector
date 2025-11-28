'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Briefcase, MapPin, Star, ArrowRight, Zap, Shield, Globe, LogOut, User, Menu } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setIsLoggedIn(true)
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setUser(null)
    setMobileMenuOpen(false)
    router.push('/')
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
            <div className="hidden md:flex items-center gap-8">
              <Link href="/browse" className="text-gray-700 hover:text-purple-600 transition">Find Talent</Link>
              <Link href="/become-pro" className="text-gray-700 hover:text-purple-600 transition">Become a Pro</Link>
              <Link href="/how-it-works" className="text-gray-700 hover:text-purple-600 transition">How it Works</Link>
            </div>
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard" className="hidden md:flex items-center gap-2 text-gray-700 hover:text-purple-600 transition font-medium">
                    <User size={18} />
                    <span>{user?.full_name || 'Dashboard'}</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="hidden md:flex items-center gap-2 text-gray-700 hover:text-red-600 transition font-medium"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
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
                  <Link href="/signup" className="hidden md:block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition transform hover:scale-105">
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
                <Link href="/browse" className="block text-gray-700 hover:text-purple-600 transition py-2 font-medium">
                  Find Talent
                </Link>
                <Link href="/become-pro" className="block text-gray-700 hover:text-purple-600 transition py-2 font-medium">
                  Become a Pro
                </Link>
                <Link href="/how-it-works" className="block text-gray-700 hover:text-purple-600 transition py-2 font-medium">
                  How it Works
                </Link>
                {isLoggedIn ? (
                  <>
                    <Link href="/dashboard" className="block text-gray-700 hover:text-purple-600 transition py-2 font-medium border-t">
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

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Connect with Skilled
              <br />
              <span className="gradient-text">Professionals Nearby</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Find plumbers, electricians, tutors, designers, and more in your local area. 
              Zero fees. Real skills. Verified professionals.
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-3 flex flex-col md:flex-row gap-3"
            >
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                <Search className="text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="What service do you need?"
                  className="flex-1 bg-transparent outline-none text-gray-700"
                />
              </div>
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                <MapPin className="text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Your location"
                  className="flex-1 bg-transparent outline-none text-gray-700"
                />
              </div>
              <Link href="/browse" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition transform hover:-translate-y-0.5 font-semibold">
                Search
              </Link>
            </motion.div>

            {/* Popular Categories */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex flex-wrap justify-center gap-3"
            >
              {['🔧 Plumbing', '⚡ Electrical', '🎨 Design', '💻 Web Dev', '📚 Tutoring', '🪚 Carpentry'].map((cat) => (
                <button
                  key={cat}
                  className="px-5 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 text-sm font-medium"
                >
                  {cat}
                </button>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: '👥', number: '10,000+', label: 'Active Professionals' },
              { icon: '⭐', number: '50,000+', label: 'Jobs Completed' },
              { icon: '🌍', number: '100+', label: 'Cities Covered' },
              { icon: '💯', number: '4.9/5', label: 'Average Rating' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            How It <span className="gradient-text">Works</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <Search className="w-12 h-12" />,
                title: 'Search & Discover',
                description: 'Browse skilled professionals in your area. Filter by skill, experience, and ratings.'
              },
              {
                icon: <Briefcase className="w-12 h-12" />,
                title: 'Connect Directly',
                description: 'Chat with professionals, view portfolios, and negotiate rates directly. No middleman fees.'
              },
              {
                icon: <Star className="w-12 h-12" />,
                title: 'Get It Done',
                description: 'Hire with confidence. Rate your experience and help others find great talent.'
              }
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-white mb-6">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Why Choose Skill Connector?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-10 h-10" />,
                title: 'Zero Fees',
                description: 'Connect directly with professionals. No platform fees. No hidden charges.'
              },
              {
                icon: <Shield className="w-10 h-10" />,
                title: 'Verified Profiles',
                description: 'Every professional is verified. See real portfolios and authentic reviews.'
              },
              {
                icon: <Globe className="w-10 h-10" />,
                title: 'Local Focus',
                description: 'Find skilled workers in your neighborhood. Support local talent.'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-white/90">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 mb-10">
              Join thousands of professionals and clients connecting every day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full hover:shadow-lg transition transform hover:-translate-y-0.5 font-semibold text-lg flex items-center justify-center gap-2">
                Join as Professional
                <ArrowRight size={20} />
              </Link>
              <Link href="/browse" className="bg-white border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-full hover:shadow-lg transition transform hover:-translate-y-0.5 font-semibold text-lg">
                Find Talent
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="text-3xl">🌍</div>
            <span className="text-2xl font-bold">Skill Connector</span>
          </div>
          <p className="text-gray-400 mb-6">
            Connecting skilled professionals with opportunities worldwide.
          </p>
          <div className="flex justify-center gap-8 text-sm">
            <Link href="/about" className="hover:text-purple-400 transition">About</Link>
            <Link href="/privacy" className="hover:text-purple-400 transition">Privacy</Link>
            <Link href="/terms" className="hover:text-purple-400 transition">Terms</Link>
            <Link href="/contact" className="hover:text-purple-400 transition">Contact</Link>
          </div>
          <div className="mt-8 text-gray-500 text-sm">
            © 2025 Global Skill Connector. Built with Next.js 15.
          </div>
        </div>
      </footer>

    </div>
  )
}