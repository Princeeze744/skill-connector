'use client'

import { motion } from 'framer-motion'
import { Zap, DollarSign, Users, Star, TrendingUp, Shield, Clock, Globe, CheckCircle, ArrowRight, Briefcase } from 'lucide-react'
import Link from 'next/link'

export default function BecomeProPage() {
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
              <Link href="/become-pro" className="text-purple-600 font-semibold">Become a Pro</Link>
              <Link href="/how-it-works" className="text-gray-700 hover:text-purple-600 transition">How it Works</Link>
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
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-6">
                🚀 Join 10,000+ Professionals
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Grow Your Business.<br />Keep 100% of Earnings.
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Connect with clients who need your skills. No platform fees. No commissions. No hidden charges. Just you and your clients.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup" className="bg-white text-purple-600 px-8 py-4 rounded-full hover:shadow-lg transition font-semibold text-lg text-center inline-flex items-center justify-center gap-2">
                  Start for Free
                  <ArrowRight size={20} />
                </Link>
                <Link href="/how-it-works" className="border-2 border-white text-white px-8 py-4 rounded-full hover:bg-white/10 transition font-semibold text-lg text-center">
                  Learn How it Works
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:block"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <div className="space-y-4">
                  {[
                    { icon: <DollarSign />, text: '0% Platform Fees Forever' },
                    { icon: <Users />, text: 'Direct Client Communication' },
                    { icon: <Star />, text: 'Build Your Reputation' },
                    { icon: <TrendingUp />, text: 'Unlimited Earning Potential' }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-xl"
                    >
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-purple-600">
                        {item.icon}
                      </div>
                      <span className="font-semibold text-lg">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
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
              Why Professionals Choose <span className="gradient-text">Skill Connector</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to grow your freelance business, all in one place
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <DollarSign className="w-10 h-10" />,
                title: 'Zero Platform Fees',
                description: 'Keep 100% of what you earn. No commissions, no hidden charges. Other platforms take 10-20%, we take nothing.',
                highlight: 'Save thousands per year'
              },
              {
                icon: <Users className="w-10 h-10" />,
                title: 'Direct Client Access',
                description: 'Chat directly with clients. Build relationships, negotiate your rates, and work on your terms.',
                highlight: 'No middleman interference'
              },
              {
                icon: <Shield className="w-10 h-10" />,
                title: 'Verified Profile Badge',
                description: 'Stand out with our verification system. Show clients you\'re a trusted professional.',
                highlight: 'Build instant credibility'
              },
              {
                icon: <Star className="w-10 h-10" />,
                title: 'Reviews & Ratings',
                description: 'Build your reputation with authentic client reviews. Great work gets rewarded with 5-star ratings.',
                highlight: 'Showcase your excellence'
              },
              {
                icon: <Clock className="w-10 h-10" />,
                title: 'Set Your Own Schedule',
                description: 'Work when you want, where you want. Set your availability and take control of your time.',
                highlight: 'Complete flexibility'
              },
              {
                icon: <Globe className="w-10 h-10" />,
                title: 'Local & Global Reach',
                description: 'Connect with clients in your area or expand globally. Your skills, your choice.',
                highlight: 'Unlimited opportunities'
              }
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center text-white mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{benefit.description}</p>
                <div className="flex items-center gap-2 text-purple-600 font-semibold text-sm">
                  <CheckCircle size={18} />
                  <span>{benefit.highlight}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Get Started */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Get Started in <span className="gradient-text">3 Simple Steps</span>
            </h2>
            <p className="text-xl text-gray-600">
              Join in minutes and start connecting with clients today
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Create Your Profile',
                description: 'Sign up for free in 2 minutes. Add your professional details, bio, and contact information.',
                time: '2 minutes'
              },
              {
                step: '02',
                title: 'Add Your Skills',
                description: 'Showcase your expertise. List your skills, set your rates, and add years of experience.',
                time: '5 minutes'
              },
              {
                step: '03',
                title: 'Start Getting Clients',
                description: 'Get discovered by clients searching for your skills. Respond to messages and grow your business.',
                time: 'Immediate'
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg h-full border-2 border-purple-200">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-xl">
                    {step.step}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 mt-4">{step.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{step.description}</p>
                  <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                    ⏱️ {step.time}
                  </div>
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
            <Link href="/signup" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-10 py-4 rounded-full hover:shadow-lg transition font-semibold text-lg">
              Create Your Free Account
              <ArrowRight size={20} />
            </Link>
            <p className="text-gray-500 text-sm mt-4">
              No credit card required • Free forever • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Join Thousands of Successful Professionals
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: '👥', number: '10,000+', label: 'Active Professionals' },
              { icon: '💼', number: '50,000+', label: 'Jobs Completed' },
              { icon: '💰', number: '$5M+', label: 'Total Earnings' },
              { icon: '⭐', number: '4.9/5', label: 'Average Rating' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
              >
                <div className="text-5xl mb-3">{stat.icon}</div>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-white/90">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Unlike other platforms, we believe in keeping it simple
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-12 text-white text-center shadow-2xl"
          >
            <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-6">
              🎉 Launch Special - Forever Free
            </div>
            <div className="text-7xl font-bold mb-4">$0</div>
            <div className="text-2xl mb-8">Forever. No hidden fees.</div>
            
            <div className="space-y-4 text-left max-w-md mx-auto mb-8">
              {[
                'Unlimited skill listings',
                'Direct client messaging',
                'Profile verification badge',
                'Keep 100% of your earnings',
                'No commission on jobs',
                'No monthly fees',
                'Priority support',
                'Portfolio showcase'
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle size={24} className="flex-shrink-0" />
                  <span className="text-lg">{feature}</span>
                </div>
              ))}
            </div>

            <Link href="/signup" className="inline-block bg-white text-purple-600 px-10 py-4 rounded-full hover:shadow-lg transition font-semibold text-lg">
              Get Started Free
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              { title: 'Other Platforms', fee: '10-20%', description: 'Take commission on every job' },
              { title: 'Monthly Subscriptions', fee: '$20-50/mo', description: 'Charge recurring fees' },
              { title: 'Skill Connector', fee: '$0', description: 'Completely free forever' }
            ].map((comparison, index) => (
              <motion.div
                key={comparison.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-6 rounded-2xl text-center ${
                  index === 2 
                    ? 'bg-gradient-to-br from-purple-100 to-blue-100 border-2 border-purple-600' 
                    : 'bg-gray-100'
                }`}
              >
                <div className="text-sm text-gray-600 mb-2">{comparison.title}</div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{comparison.fee}</div>
                <div className="text-sm text-gray-600">{comparison.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Briefcase size={64} className="mx-auto text-purple-600 mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ready to Grow Your Business?
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Join thousands of professionals who've already made the switch. Start getting clients in minutes.
            </p>
            <Link href="/signup" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-10 py-4 rounded-full hover:shadow-lg transition font-semibold text-lg">
              Create Free Account Now
              <ArrowRight size={20} />
            </Link>
            <div className="flex items-center justify-center gap-8 mt-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-500" size={18} />
                <span>Free forever</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-500" size={18} />
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-500" size={18} />
                <span>2 minute setup</span>
              </div>
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