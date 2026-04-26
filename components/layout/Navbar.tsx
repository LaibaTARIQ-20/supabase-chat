'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'

type Props = {
    username: string
    room?: string
}

export default function Navbar({ username, room }: Props) {
    const router = useRouter()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    return (
        <header
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border)',
            }}
        >
            {/* Left — brand + room */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: 'var(--accent)' }}
                    >
                        C
                    </div>
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Chat
                    </span>
                </div>
                {room && (
                    <>
                        <span style={{ color: 'var(--text-muted)' }}>/</span>
                        <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
                            #{room}
                        </span>
                    </>
                )}
            </div>

            {/* Right — user + sign out */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <Avatar username={username} size="sm" showStatus isOnline />
                    <span className="text-sm hidden sm:block" style={{ color: 'var(--text-secondary)' }}>
                        {username}
                    </span>
                </div>
                <Button variant="ghost" onClick={handleSignOut} className="text-xs px-3 py-1.5">
                    Sign out
                </Button>
            </div>
        </header>
    )
}