'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Avatar from '@/components/ui/Avatar'

type Props = {
  username: string
  room?: string
}

export default function Navbar({ username, room }: Props) {
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="flex items-center justify-between px-5 h-14 bg-surface border-b border-border-subtle shrink-0">
      {/* Left — brand + room */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-white text-xs font-bold">
            C
          </div>
          <span className="text-sm font-semibold text-content-primary">
            Chat
          </span>
        </div>
        {room && (
          <>
            <span className="text-content-muted">/</span>
            <span className="text-sm font-medium text-accent">
              #{room}
            </span>
          </>
        )}
      </div>

      {/* Right — user + sign out */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Avatar username={username} size="sm" showStatus isOnline />
          <span className="text-sm text-content-secondary hidden sm:block">
            {username}
          </span>
        </div>
        <button
          onClick={handleSignOut}
          className="px-3 py-1.5 rounded-lg bg-transparent border border-border-subtle text-content-secondary text-xs font-medium hover:bg-hover hover:text-content-primary transition-all duration-150"
        >
          Sign out
        </button>
      </div>
    </header>
  )
}