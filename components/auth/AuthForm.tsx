'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function AuthForm() {
    const router = useRouter()
    const [mode, setMode] = useState<'signin' | 'signup'>('signin')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setMessage(null)
        setLoading(true)

        if (mode === 'signup') {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { username: username || email.split('@')[0] } },
            })
            if (error) setError(error.message)
            else setMessage('Check your email for a confirmation link!')
        } else {
            const { error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) setError(error.message)
            else router.push('/chat')
        }

        setLoading(false)
    }

    return (
        <div
            className="w-full max-w-sm rounded-2xl border p-8"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
        >
            {/* Logo */}
            <div className="text-center mb-8">
                <div
                    className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold"
                    style={{ background: 'var(--accent)' }}
                >
                    C
                </div>
                <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {mode === 'signin' ? 'Welcome back' : 'Join the chat'}
                </h1>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {mode === 'signin' ? 'Sign in to continue' : 'Create your account'}
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                {mode === 'signup' && (
                    <Input
                        label="Username"
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="How others will see you"
                    />
                )}
                <Input
                    label="Email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                />
                <Input
                    label="Password"
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    error={error ?? undefined}
                />

                {message && (
                    <p className="text-xs p-3 rounded-lg" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                        {message}
                    </p>
                )}

                <Button type="submit" loading={loading} fullWidth className="mt-2">
                    {mode === 'signin' ? 'Sign in' : 'Create account'}
                </Button>
            </form>

            {/* Toggle */}
            <p className="text-center text-sm mt-5" style={{ color: 'var(--text-muted)' }}>
                {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
                <button
                    onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); setMessage(null) }}
                    className="font-medium hover:underline"
                    style={{ color: 'var(--accent)' }}
                >
                    {mode === 'signin' ? 'Sign up' : 'Sign in'}
                </button>
            </p>
        </div>
    )
}