'use client'

import { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'ghost' | 'danger'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant
    loading?: boolean
    fullWidth?: boolean
}

const styles: Record<Variant, string> = {
    primary: 'bg-[var(--accent)] hover:bg-[#6b5ce7] text-white',
    ghost: 'bg-transparent hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)]',
    danger: 'bg-transparent hover:bg-red-500/10 text-[var(--danger)] border border-[var(--border)]',
}

export default function Button({
    variant = 'primary',
    loading = false,
    fullWidth = false,
    children,
    disabled,
    className = '',
    ...props
}: Props) {
    return (
        <button
            disabled={disabled || loading}
            className={`
        inline-flex items-center justify-center gap-2
        px-4 py-2 rounded-lg text-sm font-medium
        transition-all duration-150 cursor-pointer
        disabled:opacity-40 disabled:cursor-not-allowed
        ${styles[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
            {...props}
        >
            {loading ? (
                <span className="flex gap-1">
                    <span className="typing-dot w-1.5 h-1.5 rounded-full bg-current" />
                    <span className="typing-dot w-1.5 h-1.5 rounded-full bg-current" />
                    <span className="typing-dot w-1.5 h-1.5 rounded-full bg-current" />
                </span>
            ) : children}
        </button>
    )
}