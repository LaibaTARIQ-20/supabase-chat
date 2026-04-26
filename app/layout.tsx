import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Chat — Supabase Realtime',
  description: 'Realtime group chat built with Supabase',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`bg-base text-content-primary min-h-screen antialiased ${dmSans.variable}`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}