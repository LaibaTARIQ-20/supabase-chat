'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Sidebar from '@/components/layout/Sidebar'
import Navbar from '@/components/layout/Navbar'
import MessageList from '@/components/chat/MessageList'
import MessageInput from '@/components/chat/MessageInput'
import OnlineUsers from '@/components/chat/OnlineUsers'

export default function RoomPage() {
  const router = useRouter()
  const params = useParams()
  const room = params.room as string

  const [userId, setUserId] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      const meta = session.user.user_metadata
      setUserId(session.user.id)
      setUsername(meta?.username || session.user.email?.split('@')[0] || 'User')
      setLoading(false)
    })
  }, [router])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-base">
      <div className="flex gap-1.5">
        <span className="typing-dot w-2 h-2 rounded-full bg-content-muted block" />
        <span className="typing-dot w-2 h-2 rounded-full bg-content-muted block" />
        <span className="typing-dot w-2 h-2 rounded-full bg-content-muted block" />
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-base">
      {/* Sidebar */}
      <Sidebar activeRoom={room} />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar username={username} room={room} />

        <div className="flex-1 flex overflow-hidden">
          {/* Messages */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <MessageList room={room} currentUserId={userId} />
            <MessageInput room={room} userId={userId} username={username} />
          </div>

          {/* Online users panel */}
          <OnlineUsers room={room} currentUser={{ id: userId, username }} />
        </div>
      </div>
    </div>
  )
}