'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Message } from '@/lib/types'
import MessageBubble from './MessageBubble'

type Props = {
    room: string
    currentUserId: string
}

export default function MessageList({ room, currentUserId }: Props) {
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(true)
    const bottomRef = useRef<HTMLDivElement>(null)

    // Scroll to bottom whenever messages change
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    useEffect(() => {
        // Initial load — last 50 messages
        const fetchMessages = async () => {
            const { data } = await supabase
                .from('messages')
                .select('*')
                .eq('room', room)
                .order('created_at', { ascending: true })
                .limit(50)

            if (data) setMessages(data)
            setLoading(false)
        }

        fetchMessages()

        // Realtime subscription — new messages appear instantly
        const channel = supabase
            .channel(`room-${room}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `room=eq.${room}`,
                },
                (payload) => {
                    setMessages(prev => [...prev, payload.new as Message])
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'messages',
                },
                (payload) => {
                    setMessages(prev => prev.filter(m => m.id !== payload.old.id))
                }
            )
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [room])

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="flex gap-1.5">
                    <span className="typing-dot w-2 h-2 rounded-full" style={{ background: 'var(--text-muted)' }} />
                    <span className="typing-dot w-2 h-2 rounded-full" style={{ background: 'var(--text-muted)' }} />
                    <span className="typing-dot w-2 h-2 rounded-full" style={{ background: 'var(--text-muted)' }} />
                </div>
            </div>
        )
    }

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 pb-10">
                <div className="text-4xl">💬</div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    No messages yet
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Be the first to say something in #{room}
                </p>
            </div>
        )
    }

    return (
        <div className="flex-1 overflow-y-auto py-4 space-y-0.5">
            {messages.map((msg, index) => {
                // Show avatar only when the author changes (group messages)
                const prevMsg = messages[index - 1]
                const showAvatar =
                    !prevMsg ||
                    prevMsg.user_id !== msg.user_id ||
                    new Date(msg.created_at).getTime() - new Date(prevMsg.created_at).getTime() > 5 * 60 * 1000

                return (
                    <MessageBubble
                        key={msg.id}
                        message={msg}
                        isOwn={msg.user_id === currentUserId}
                        showAvatar={showAvatar}
                    />
                )
            })}
            <div ref={bottomRef} />
        </div>
    )
}