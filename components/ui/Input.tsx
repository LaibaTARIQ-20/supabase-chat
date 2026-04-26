'use client'

import { InputHTMLAttributes, forwardRef } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-content-secondary uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-3 py-2.5 rounded-lg text-sm
            bg-elevated border border-border-subtle
            text-content-primary placeholder-content-muted
            focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent
            transition-all duration-150
            ${error ? 'border-danger focus:ring-danger focus:border-danger' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <span className="text-xs text-danger">{error}</span>}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input