'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { PresenceUser } from '@/lib/types'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'

type Props = {
  room: string
  currentUser: { id: string; username: string }
}

export default function OnlineUsers({ room, currentUser }: Props) {
  const [onlineUsers, setOnlineUsers] = useState<PresenceUser[]>([])

  useEffect(() => {
    const channel = supabase.channel(`presence-${room}`, {
      config: { presence: { key: currentUser.id } },
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<PresenceUser>()
        const users = Object.values(state)
          .flat()
          .filter((u, i, arr) =>
            arr.findIndex(x => x.user_id === u.user_id) === i
          )
        setOnlineUsers(users)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: currentUser.id,
            username: currentUser.username,
            online_at: new Date().toISOString(),
          })
        }
      })

    return () => { supabase.removeChannel(channel) }
  }, [room, currentUser.id, currentUser.username])

  return (
    <aside className="w-48 shrink-0 flex flex-col gap-4 bg-surface border-l border-border-subtle p-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-content-muted">
          Online
        </p>
        <Badge variant="count" count={onlineUsers.length} />
      </div>

      {/* User list */}
      <div className="flex flex-col gap-2.5">
        {onlineUsers.length === 0 ? (
          <p className="text-xs text-content-muted">No one else here</p>
        ) : (
          onlineUsers.map(user => (
            <div key={user.user_id} className="flex items-center gap-2">
              <Avatar username={user.username} size="sm" showStatus isOnline />
              <div className="flex flex-col min-w-0">
                <span
                  className={`text-xs font-medium truncate ${
                    user.user_id === currentUser.id ? 'text-accent' : 'text-content-primary'
                  }`}
                >
                  {user.username}
                  {user.user_id === currentUser.id && ' (you)'}
                </span>
                <Badge variant="online" label="online" />
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  )
}