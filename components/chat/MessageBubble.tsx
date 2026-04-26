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
            className="msg-enter group flex items-start gap-3 px-4 py-1 hover:bg-white/[0.02] rounded-lg transition-colors"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
        >
            {/* Avatar — only show for first message in a group */}
            <div className="w-9 flex-shrink-0 mt-0.5">
                {showAvatar ? (
                    <Avatar username={message.username} size="md" />
                ) : (
                    <span
                        className="text-[10px] w-9 text-right block leading-none opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: 'var(--text-muted)' }}
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
                            className="text-sm font-semibold"
                            style={{ color: isOwn ? 'var(--accent)' : 'var(--text-primary)' }}
                        >
                            {message.username}
                        </span>
                        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                            {formatTime(message.created_at)}
                        </span>
                    </div>
                )}
                <p
                    className="text-sm leading-relaxed break-words"
                    style={{ color: 'var(--text-primary)' }}
                >
                    {message.content}
                </p>
            </div>

            {/* Delete button — only own messages, only on hover */}
            {canDelete && hovering && (
                <button
                    onClick={handleDelete}
                    className="flex-shrink-0 text-xs px-2 py-1 rounded transition-colors"
                    style={{ color: 'var(--danger)', background: 'var(--bg-elevated)' }}
                    title="Delete message"
                >
                    ✕
                </button>
            )}
        </div>
    )
}