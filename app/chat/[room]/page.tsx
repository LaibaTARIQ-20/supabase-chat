'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ROOMS } from '@/lib/types'
import Navbar from '@/components/layout/Navbar'

export default function ChatPage() {
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) { router.push('/'); return }
            const meta = session.user.user_metadata
            setUsername(meta?.username || session.user.email?.split('@')[0] || 'User')
            setLoading(false)
        })
    }, [router])

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
            <div className="flex gap-1.5">
                <span className="typing-dot w-2 h-2 rounded-full" style={{ background: 'var(--text-muted)' }} />
                <span className="typing-dot w-2 h-2 rounded-full" style={{ background: 'var(--text-muted)' }} />
                <span className="typing-dot w-2 h-2 rounded-full" style={{ background: 'var(--text-muted)' }} />
            </div>
        </div>
    )

    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-base)' }}>
            <Navbar username={username} />

            <main className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <h2 className="text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Pick a room
                    </h2>
                    <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
                        Choose a channel to start chatting
                    </p>

                    <div className="flex flex-col gap-3">
                        {ROOMS.map(room => (
                            <button
                                key={room.id}
                                onClick={() => router.push(`/chat/${room.id}`)}
                                className="flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-150 group"
                                style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'
                                        ; (e.currentTarget as HTMLElement).style.background = 'var(--accent-soft)'
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
                                        ; (e.currentTarget as HTMLElement).style.background = 'var(--bg-surface)'
                                }}
                            >
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold flex-shrink-0"
                                    style={{ background: 'var(--bg-elevated)', color: 'var(--accent)' }}
                                >
                                    #
                                </div>
                                <div>
                                    <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                                        {room.id}
                                    </p>
                                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                                        {room.description}
                                    </p>
                                </div>
                                <div className="ml-auto" style={{ color: 'var(--text-muted)' }}>→</div>
                            </button>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}