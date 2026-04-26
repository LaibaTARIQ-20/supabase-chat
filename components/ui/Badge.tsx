'use client'

type Variant = 'online' | 'offline' | 'count'

type Props = {
  variant?: Variant
  count?: number
  label?: string
}

export default function Badge({ variant = 'online', count, label }: Props) {
  if (variant === 'count' && count !== undefined) {
    return (
      <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-white text-[10px] font-semibold">
        {count > 99 ? '99+' : count}
      </span>
    )
  }

  const isOnline = variant === 'online'
  return (
    <span className="inline-flex items-center gap-1.5 text-xs">
      <span
        className={`w-2 h-2 rounded-full flex-shrink-0 ${
          isOnline ? 'bg-online' : 'bg-content-muted'
        }`}
      />
      {label && (
        <span className={isOnline ? 'text-online' : 'text-content-muted'}>
          {label}
        </span>
      )}
    </span>
  )
}