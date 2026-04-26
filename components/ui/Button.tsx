'use client'

import { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'ghost' | 'danger'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  loading?: boolean
  fullWidth?: boolean
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-hover border-transparent',
  ghost: 'bg-transparent text-content-secondary border-border-subtle hover:bg-hover hover:text-content-primary',
  danger: 'bg-transparent text-danger border-border-subtle hover:bg-danger/10',
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
        px-4 py-2 rounded-lg text-sm font-medium border
        transition-all duration-150 cursor-pointer
        disabled:opacity-45 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <span className="flex gap-1 items-center">
          <span className="typing-dot w-1.5 h-1.5 rounded-full bg-current" />
          <span className="typing-dot w-1.5 h-1.5 rounded-full bg-current" />
          <span className="typing-dot w-1.5 h-1.5 rounded-full bg-current" />
        </span>
      ) : children}
    </button>
  )
}