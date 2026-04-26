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
  const [focused, setFocused] = useState(false)
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

  const hasContent = content.trim().length > 0

  return (
    <div className="px-5 py-3.5 shrink-0">
      <form
        onSubmit={handleSend}
        className={`
          flex items-center gap-3 bg-elevated rounded-xl px-3 py-2
          border transition-all duration-150
          ${focused ? 'border-accent shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-accent)_18%,transparent)]' : 'border-border-subtle'}
        `}
      >
        <input
          ref={inputRef}
          type="text"
          value={content}
          onChange={e => setContent(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={`Message #${room}`}
          maxLength={1000}
          className="flex-1 bg-transparent border-none outline-none text-content-primary text-sm font-sans"
        />

        {/* Char count warning */}
        {content.length > 800 && (
          <span className={`text-[11px] shrink-0 ${content.length > 950 ? 'text-danger' : 'text-content-muted'}`}>
            {1000 - content.length}
          </span>
        )}

        {/* Send button */}
        <button
          type="submit"
          disabled={!hasContent || sending}
          title="Send message"
          className={`
            shrink-0 w-8 h-8 rounded-lg border-none flex items-center justify-center
            transition-all duration-150
            ${hasContent && !sending ? 'bg-accent cursor-pointer opacity-100' : 'bg-hover cursor-not-allowed opacity-40'}
          `}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z" />
          </svg>
        </button>
      </form>

      <p className="text-[10px] mt-1.5 pl-1 text-content-muted">
        Press Enter to send · Hover a message to delete
      </p>
    </div>
  )
}