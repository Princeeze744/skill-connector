'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Home, Search, Briefcase, HelpCircle, MessageCircle, LayoutDashboard, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface MobileMenuProps {
  isLoggedIn?: boolean
  userName?: string
}

export default function MobileMenu({ isLoggedIn = false, userName }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    toast.success('Logged out successfully! 👋')
    setIsOpen(false)
    router.push('/')
  }

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 text-gray-700 hover:text-purple-600 transition"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Panel */}
          <div className="fixed top-16 right-0 bottom-0 w-80 bg-white z-50 shadow-2xl md:hidden overflow-y-auto">
            <div className="p-6">
              
              {/* User Info (if logged in) */}
              {isLoggedIn && userName && (
                <div className="mb-6 pb-6 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {userName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{userName}</p>
                      <p className="text-sm text-gray-500">Professional</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <nav className="space-y-2">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition"
                >
                  <Home size={20} />
                  <span className="font-medium">Home</span>
                </Link>

                <Link
                  href="/browse"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition"
                >
                  <Search size={20} />
                  <span className="font-medium">Browse Professionals</span>
                </Link>

                {isLoggedIn && (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition"
                    >
                      <LayoutDashboard size={20} />
                      <span className="font-medium">Dashboard</span>
                    </Link>

                    <Link
                      href="/inbox"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition"
                    >
                      <MessageCircle size={20} />
                      <span className="font-medium">Messages</span>
                    </Link>
                  </>
                )}

                <Link
                  href="/become-pro"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition"
                >
                  <Briefcase size={20} />
                  <span className="font-medium">Become a Pro</span>
                </Link>

                <Link
                  href="/how-it-works"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition"
                >
                  <HelpCircle size={20} />
                  <span className="font-medium">How it Works</span>
                </Link>
              </nav>

              {/* Auth Buttons */}
              <div className="mt-6 pt-6 border-t space-y-3">
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition w-full"
                  >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                  </button>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="block w-full px-6 py-3 text-center border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsOpen(false)}
                      className="block w-full px-6 py-3 text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}