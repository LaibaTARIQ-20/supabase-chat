'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ROOMS } from '@/lib/types'
import Navbar from '@/components/layout/Navbar'

export default function ChatIndexPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      const meta = session.user.user_metadata
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
    <div className="min-h-screen flex flex-col bg-base">
      <Navbar username={username} />

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold text-content-primary mb-2">
            Pick a room
          </h2>
          <p className="text-sm text-content-secondary mb-8">
            Choose a channel to start chatting
          </p>

          <div className="flex flex-col gap-3">
            {ROOMS.map(room => (
              <button
                key={room.id}
                onClick={() => router.push(`/chat/${room.id}`)}
                className="flex items-center gap-4 p-4 rounded-xl border border-border-subtle bg-surface text-left transition-all duration-150 w-full hover:border-accent hover:bg-accent-soft group"
              >
                <div className="w-10 h-10 rounded-lg bg-elevated flex items-center justify-center text-[1.1rem] font-bold text-accent shrink-0">
                  #
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[0.9rem] text-content-primary">
                    {room.id}
                  </p>
                  <p className="text-xs text-content-secondary mt-0.5">
                    {room.description}
                  </p>
                </div>
                <span className="text-content-muted text-[1.1rem] group-hover:text-accent transition-colors">
                  →
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}