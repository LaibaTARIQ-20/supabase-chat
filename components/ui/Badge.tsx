type Variant = 'online' | 'offline' | 'count'

type Props = {
    variant?: Variant
    count?: number
    label?: string
}

export default function Badge({ variant = 'online', count, label }: Props) {
    if (variant === 'count' && count !== undefined) {
        return (
            <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--accent)] text-white text-[10px] font-semibold">
                {count > 99 ? '99+' : count}
            </span>
        )
    }

    return (
        <span className="inline-flex items-center gap-1.5 text-xs">
            <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${variant === 'online' ? 'bg-[var(--online)]' : 'bg-[var(--text-muted)]'
                    }`}
            />
            {label && (
                <span className={variant === 'online' ? 'text-[var(--online)]' : 'text-[var(--text-muted)]'}>
                    {label}
                </span>
            )}
        </span>
    )
}