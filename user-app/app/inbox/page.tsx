'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, ArrowLeft, Search, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Conversation {
  partner_id: string
  partner_name: string
  last_message: string
  last_message_time: string
  unread_count: number
  is_sender: boolean
}

const SkeletonListItem = () => (
  <div className="bg-white rounded-xl p-4 border border-gray-200">
    <div className="flex items-start gap-4">
      <div className="w-14 h-14 bg-gray-200 rounded-full flex-shrink-0 animate-pulse"></div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-3">
          <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse ml-2"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
      </div>
    </div>
  </div>
)

const SkeletonList = ({ count = 5 }: { count?: number }) => (
  <div className="space-y-3">
    {[...Array(count)].map((_, i) => (
      <SkeletonListItem key={i} />
    ))}
  </div>
)

export default function InboxPage() {
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('http://localhost:8000/messages/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setConversations(data)
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredConversations = conversations.filter(conv =>
    conv.partner_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
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
        <div className="pt-24 pb-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="h-10 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded-xl mb-6 animate-pulse"></div>
            <SkeletonList count={5} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition font-medium"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="text-3xl">🌍</div>
              <span className="text-xl font-bold gradient-text">Skill Connector</span>
            </Link>
            <Link href="/dashboard" className="text-gray-700 hover:text-purple-600 transition font-medium">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <MessageCircle size={32} className="text-purple-600" />
              <h1 className="text-4xl font-bold text-gray-900">Messages</h1>
            </div>
            <p className="text-gray-600">
              {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-purple-600 transition"
              />
            </div>
          </motion.div>

          {/* Conversations List */}
          {filteredConversations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center py-20"
            >
              <MessageCircle size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {searchQuery ? 'No conversations found' : 'No messages yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery 
                  ? 'Try a different search term'
                  : 'Start browsing professionals to send your first message'}
              </p>
              {!searchQuery && (
                <Link href="/browse" className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
                  Browse Professionals
                </Link>
              )}
            </motion.div>
          ) : (
            <div className="space-y-3">
              {filteredConversations.map((conv, index) => (
                <motion.div
                  key={conv.partner_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={`/chat/${conv.partner_id}`}
                    className="block bg-white rounded-xl p-4 hover:shadow-lg transition border border-gray-200 hover:border-purple-600"
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                        {conv.partner_name.charAt(0)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-bold text-gray-900 text-lg">
                            {conv.partner_name}
                          </h3>
                          <span className="text-sm text-gray-500 whitespace-nowrap ml-2">
                            {formatTime(conv.last_message_time)}
                          </span>
                        </div>
                        <p className={`text-sm truncate ${conv.unread_count > 0 && !conv.is_sender ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                          {conv.is_sender ? 'You: ' : ''}
                          {conv.last_message}
                        </p>
                      </div>

                      {/* Unread Badge */}
                      {conv.unread_count > 0 && !conv.is_sender && (
                        <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {conv.unread_count}
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}