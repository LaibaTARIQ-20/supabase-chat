import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Chat — Supabase Realtime',
  description: 'Realtime group chat built with Supabase',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
        {children}
      </body>
    </html>
  )
}