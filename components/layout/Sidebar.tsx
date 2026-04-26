'use client'

import { useRouter } from 'next/navigation'
import { ROOMS } from '@/lib/types'

type Props = {
  activeRoom: string
}

export default function Sidebar({ activeRoom }: Props) {
  const router = useRouter()

  return (
    <aside className="w-52 shrink-0 flex flex-col bg-surface border-r border-border-subtle overflow-hidden">
      {/* Brand */}
      <div className="p-4 border-b border-border-subtle flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center font-bold text-xs text-white shrink-0">
          C
        </div>
        <span className="font-semibold text-sm text-content-primary">
          Chat
        </span>
      </div>

      {/* Rooms label */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-content-muted">
          Rooms
        </p>
      </div>

      {/* Room list */}
      <nav className="flex flex-col gap-0.5 px-2 flex-1">
        {ROOMS.map(room => {
          const isActive = activeRoom === room.id
          return (
            <button
              key={room.id}
              onClick={() => router.push(`/chat/${room.id}`)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-all duration-150 w-full
                ${isActive ? 'bg-accent-soft text-accent font-medium' : 'bg-transparent text-content-secondary font-normal hover:bg-hover'}
              `}
            >
              <span className="text-base opacity-70">#</span>
              <span>{room.id}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}