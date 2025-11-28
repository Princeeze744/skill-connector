'use client'

import { motion } from 'framer-motion'
import { Search, UserPlus, MessageCircle, Handshake, Star, Shield, Zap, CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function HowItWorksPage() {
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
              <Link href="/how-it-works" className="text-purple-600 font-semibold">How it Works</Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-gray-700 hover:text-purple-600 transition font-medium">
                Sign In
              </Link>
              <Link href="/signup" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              How Skill Connector Works
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Connect with skilled professionals in minutes. No fees. No hassle. Just real talent.
            </p>
          </motion.div>
        </div>
      </section>

      {/* For Clients Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              For <span className="gradient-text">Clients</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find the perfect professional for your project in 4 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Search className="w-12 h-12" />,
                step: '01',
                title: 'Search & Browse',
                description: 'Use our powerful search to find professionals by skill, location, or category. Filter by experience, rates, and availability.'
              },
              {
                icon: <UserPlus className="w-12 h-12" />,
                step: '02',
                title: 'View Profiles',
                description: 'Explore detailed profiles with portfolios, skills, experience, rates, and verified client reviews.'
              },
              {
                icon: <MessageCircle className="w-12 h-12" />,
                step: '03',
                title: 'Connect Directly',
                description: 'Message professionals directly through our platform. Discuss your project, negotiate rates, and schedule consultations.'
              },
              {
                icon: <Handshake className="w-12 h-12" />,
                step: '04',
                title: 'Hire & Collaborate',
                description: 'Work together to complete your project. Leave reviews to help others find great talent.'
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition h-full border-2 border-purple-200 hover:border-purple-600">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-xl">
                    {step.step}
                  </div>
                  
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                    {step.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/browse" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full hover:shadow-lg transition font-semibold text-lg">
              Start Browsing Professionals
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* For Professionals Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              For Professionals
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Grow your business and connect with clients in 4 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <UserPlus className="w-12 h-12" />,
                step: '01',
                title: 'Create Profile',
                description: 'Sign up for free and create your professional profile. Add your bio, contact info, and professional details.'
              },
              {
                icon: <Star className="w-12 h-12" />,
                step: '02',
                title: 'Add Your Skills',
                description: 'Showcase your expertise by adding skills with descriptions, experience years, and hourly rates.'
              },
              {
                icon: <MessageCircle className="w-12 h-12" />,
                step: '03',
                title: 'Get Discovered',
                description: 'Clients find you through search. Respond to messages, discuss projects, and build relationships.'
              },
              {
                icon: <Zap className="w-12 h-12" />,
                step: '04',
                title: 'Grow Your Business',
                description: 'Keep 100% of your earnings. Build your reputation with reviews and grow your client base.'
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition h-full">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-white rounded-xl flex items-center justify-center text-purple-600 font-bold text-lg shadow-xl">
                    {step.step}
                  </div>
                  
                  <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                    {step.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-white/90 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/become-pro" className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-full hover:shadow-lg transition font-semibold text-lg">
              Join as Professional
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose <span className="gradient-text">Skill Connector</span>?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-10 h-10" />,
                title: 'Zero Platform Fees',
                description: 'Unlike other platforms that charge 10-20% commission, we charge nothing. Connect and work directly with professionals.',
                benefit: '100% of earnings go to professionals'
              },
              {
                icon: <Shield className="w-10 h-10" />,
                title: 'Verified Professionals',
                description: 'Every professional profile is verified. View real portfolios, authentic reviews, and verified credentials.',
                benefit: 'Hire with confidence'
              },
              {
                icon: <MessageCircle className="w-10 h-10" />,
                title: 'Direct Communication',
                description: 'Chat directly with professionals. No middleman, no delays. Negotiate rates and terms that work for both parties.',
                benefit: 'Complete transparency'
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center text-white mb-6">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{item.description}</p>
                <div className="flex items-center gap-2 text-purple-600 font-semibold">
                  <CheckCircle size={20} />
                  <span>{item.benefit}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Join thousands of professionals and clients connecting every day. Start your journey in 2 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/browse" className="bg-white border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-full hover:bg-purple-50 transition font-semibold text-lg">
                Browse Professionals
              </Link>
              <Link href="/signup" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full hover:shadow-lg transition font-semibold text-lg">
                Join as Professional
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
            © 2025 Skill Connector. Built with Next.js 16.
          </div>
        </div>
      </footer>

    </div>
  )
}