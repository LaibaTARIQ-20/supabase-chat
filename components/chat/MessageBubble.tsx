'use client'

import { format, isToday, isYesterday } from 'date-fns'
import { Message } from '@/lib/types'
import Avatar from '@/components/ui/Avatar'
import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'

type Props = {
  message: Message
  isOwn: boolean
  showAvatar: boolean
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  if (isToday(date)) return format(date, 'HH:mm')
  if (isYesterday(date)) return `Yesterday ${format(date, 'HH:mm')}`
  return format(date, 'MMM d, HH:mm')
}

export default function MessageBubble({ message, isOwn, showAvatar }: Props) {
  const [canDelete, setCanDelete] = useState(false)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.id === message.user_id) setCanDelete(true)
    })
  }, [message.user_id])

  const handleDelete = async () => {
    await supabase.from('messages').delete().eq('id', message.id)
  }

  return (
    <div
      className={`msg-enter group flex items-start gap-3 px-4 py-1 rounded-lg transition-colors ${
        hovering ? 'bg-white/5' : 'bg-transparent'
      }`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Avatar col */}
      <div className="w-9 shrink-0 mt-0.5">
        {showAvatar ? (
          <Avatar username={message.username} size="md" />
        ) : (
          <span
            className={`block w-9 text-right text-[10px] text-content-muted leading-none transition-opacity duration-150 ${
              hovering ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {format(new Date(message.created_at), 'HH:mm')}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {showAvatar && (
          <div className="flex items-baseline gap-2 mb-0.5">
            <span
              className={`text-sm font-semibold ${
                isOwn ? 'text-accent' : 'text-content-primary'
              }`}
            >
              {message.username}
            </span>
            <span className="text-[10px] text-content-muted">
              {formatTime(message.created_at)}
            </span>
          </div>
        )}
        <p className="text-sm leading-relaxed text-content-primary break-words">
          {message.content}
        </p>
      </div>

      {/* Delete button */}
      {canDelete && hovering && (
        <button
          onClick={handleDelete}
          title="Delete message"
          className="shrink-0 text-xs px-2 py-1 rounded border-none cursor-pointer text-danger bg-elevated hover:bg-hover transition-colors duration-150"
        >
          ✕
        </button>
      )}
    </div>
  )
}