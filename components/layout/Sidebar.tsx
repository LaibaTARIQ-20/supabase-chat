'use client'

import { useRouter } from 'next/navigation'
import { ROOMS } from '@/lib/types'

type Props = {
    activeRoom: string
}

export default function Sidebar({ activeRoom }: Props) {
    const router = useRouter()

    return (
        <aside
            className="w-52 flex-shrink-0 flex flex-col border-r"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
        >
            {/* Rooms label */}
            <div className="px-4 pt-5 pb-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                    Rooms
                </p>
            </div>

            {/* Room list */}
            <nav className="flex flex-col gap-0.5 px-2">
                {ROOMS.map(room => {
                    const isActive = activeRoom === room.id
                    return (
                        <button
                            key={room.id}
                            onClick={() => router.push(`/chat/${room.id}`)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-all duration-150 w-full"
                            style={{
                                background: isActive ? 'var(--accent-soft)' : 'transparent',
                                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                                fontWeight: isActive ? 500 : 400,
                            }}
                            onMouseEnter={e => {
                                if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'
                            }}
                            onMouseLeave={e => {
                                if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'
                            }}
                        >
                            <span className="text-base">#</span>
                            <span>{room.id}</span>
                        </button>
                    )
                })}
            </nav>
        </aside>
    )
}