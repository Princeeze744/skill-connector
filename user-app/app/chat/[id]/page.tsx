'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Send } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  message: string
  created_at: string
  is_read: boolean
}

interface ConversationData {
  partner_id: string
  partner_name: string
  messages: Message[]
}

interface LoadingButtonProps {
  type: 'submit' | 'button'
  loading: boolean
  disabled: boolean
  className?: string
  children: React.ReactNode
}

const LoadingButton = ({ type, loading, disabled, className = '', children }: LoadingButtonProps) => (
  <button
    type={type}
    disabled={disabled || loading}
    className={`px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${className}`}
  >
    {loading ? (
      <>
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        <span className="hidden sm:inline">Sending...</span>
      </>
    ) : (
      children
    )}
  </button>
)

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const [conversation, setConversation] = useState<ConversationData | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const user = JSON.parse(userData)
      setCurrentUserId(user.id)
    }
    loadConversation()
  }, [params.id])

  useEffect(() => {
    scrollToBottom()
  }, [conversation?.messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadConversation = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch(`http://localhost:8000/messages/conversation/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setConversation(data)
      }
    } catch (error) {
      console.error('Error loading conversation:', error)
      toast.error('Failed to load conversation')
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim() || sending) return

    try {
      setSending(true)
      const token = localStorage.getItem('token')

      const response = await fetch('http://localhost:8000/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiver_id: params.id,
          message: newMessage.trim()
        })
      })

      if (response.ok) {
        setNewMessage('')
        await loadConversation()
        toast.success('Message sent! 📨')
      } else {
        toast.error('Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Connection error. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading conversation...</p>
        </div>
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Conversation not found</p>
          <Link href="/inbox" className="text-purple-600 hover:text-purple-700 mt-4 inline-block">
            Back to Inbox
          </Link>
        </div>
      </div>
    )
  }

  const messagesByDate: { [key: string]: Message[] } = {}
  conversation.messages.forEach(msg => {
    const dateKey = formatDate(msg.created_at)
    if (!messagesByDate[dateKey]) {
      messagesByDate[dateKey] = []
    }
    messagesByDate[dateKey].push(msg)
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex flex-col">
      <nav className="glass border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/inbox')}
                className="text-gray-700 hover:text-purple-600 transition"
              >
                <ArrowLeft size={24} />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {conversation.partner_name.charAt(0)}
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">{conversation.partner_name}</h2>
                  <p className="text-sm text-gray-500">Professional</p>
                </div>
              </div>
            </div>
            <Link 
              href={`/profile/${conversation.partner_id}`}
              className="text-purple-600 hover:text-purple-700 font-medium text-sm"
            >
              View Profile
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {Object.entries(messagesByDate).map(([date, messages]) => (
            <div key={date} className="mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="px-4 py-1 bg-gray-200 rounded-full text-sm text-gray-600 font-medium">
                  {date}
                </div>
              </div>

              {messages.map((msg, index) => {
                const isOwnMessage = msg.sender_id === currentUserId
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex mb-4 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          isOwnMessage
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                        }`}
                      >
                        <p className="break-words">{msg.message}</p>
                      </div>
                      <p className={`text-xs text-gray-500 mt-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                        {formatTime(msg.created_at)}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="glass border-t sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={sendMessage} className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-purple-600 transition"
              disabled={sending}
            />
            <LoadingButton
              type="submit"
              loading={sending}
              disabled={!newMessage.trim()}
              className="flex-shrink-0"
            >
              <Send size={20} />
              <span className="hidden sm:inline">Send</span>
            </LoadingButton>
          </form>
        </div>
      </div>
    </div>
  )
}