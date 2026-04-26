'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/chat')
    })
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else router.push('/chat')
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-base">
      <div className="w-full max-w-md bg-surface border border-border-subtle rounded-2xl p-8 shadow-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-xl font-bold text-white mx-auto mb-4">
            C
          </div>
          <h1 className="text-xl font-semibold text-content-primary">Welcome back</h1>
          <p className="text-sm text-content-secondary mt-1">Sign in to your account to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="login-email"
            label="Email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
          />

          <Input
            id="login-password"
            label="Password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            error={error ?? undefined}
          />

          <Button
            id="login-submit"
            type="submit"
            loading={loading}
            fullWidth
            className="mt-2"
          >
            Sign in
          </Button>
        </form>

        {/* Switch to register */}
        <p className="text-center text-sm text-content-muted mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-accent font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  )
}
