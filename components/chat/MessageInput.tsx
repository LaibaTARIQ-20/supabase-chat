'use client'

import { useState, useRef, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

type Props = {
    room: string
    userId: string
    username: string
}

export default function MessageInput({ room, userId, username }: Props) {
    const [content, setContent] = useState('')
    const [sending, setSending] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        inputRef.current?.focus()
    }, [room])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        const text = content.trim()
        if (!text || sending) return

        setSending(true)
        setContent('')

        await supabase.from('messages').insert({
            content: text,
            room,
            user_id: userId,
            username,
        })

        setSending(false)
        inputRef.current?.focus()
    }

    return (
        <div className="px-4 pb-4 pt-2">
            <form
                onSubmit={handleSend}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border"
                style={{
                    background: 'var(--bg-elevated)',
                    borderColor: 'var(--border)',
                }}
            >
                <input
                    ref={inputRef}
                    type="text"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder={`Message #${room}`}
                    className="flex-1 bg-transparent text-sm outline-none"
                    style={{
                        color: 'var(--text-primary)',
                    }}
                    maxLength={1000}
                />

                {/* Character count warning */}
                {content.length > 800 && (
                    <span className="text-xs flex-shrink-0" style={{ color: content.length > 950 ? 'var(--danger)' : 'var(--text-muted)' }}>
                        {1000 - content.length}
                    </span>
                )}

                {/* Send button */}
                <button
                    type="submit"
                    disabled={!content.trim() || sending}
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 disabled:opacity-30"
                    style={{
                        background: content.trim() ? 'var(--accent)' : 'var(--bg-hover)',
                    }}
                    title="Send message"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z" />
                    </svg>
                </button>
            </form>

            <p className="text-[10px] mt-1.5 px-1" style={{ color: 'var(--text-muted)' }}>
                Press Enter to send · Hover a message to delete
            </p>
        </div>
    )
}