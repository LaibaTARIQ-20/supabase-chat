type Size = 'sm' | 'md' | 'lg'

type Props = {
    username: string
    size?: Size
    showStatus?: boolean
    isOnline?: boolean
}

const sizes: Record<Size, { box: string; text: string }> = {
    sm: { box: 'w-7 h-7', text: 'text-xs' },
    md: { box: 'w-9 h-9', text: 'text-sm' },
    lg: { box: 'w-11 h-11', text: 'text-base' },
}

// Generate a consistent color based on username
function getColor(username: string): string {
    const colors = [
        '#7c6af7', '#f97316', '#06b6d4',
        '#ec4899', '#22c55e', '#eab308',
        '#a855f7', '#3b82f6',
    ]
    let hash = 0
    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash)
    }
    return colors[Math.abs(hash) % colors.length]
}

function getInitials(username: string): string {
    return username.slice(0, 2).toUpperCase()
}

export default function Avatar({ username, size = 'md', showStatus = false, isOnline = false }: Props) {
    const { box, text } = sizes[size]
    const color = getColor(username)

    return (
        <div className="relative inline-flex flex-shrink-0">
            <div
                className={`${box} rounded-full flex items-center justify-center font-semibold ${text} select-none`}
                style={{ backgroundColor: color + '28', color }}
            >
                {getInitials(username)}
            </div>
            {showStatus && (
                <span
                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[var(--bg-surface)] ${isOnline ? 'bg-[var(--online)]' : 'bg-[var(--text-muted)]'
                        }`}
                />
            )}
        </div>
    )
}