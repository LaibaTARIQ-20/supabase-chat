export type Message = {
    id: string
    user_id: string
    room: string
    content: string
    username: string
    created_at: string
}

export type PresenceUser = {
    user_id: string
    username: string
    online_at: string
}

export type Room = {
    id: string
    label: string
    description: string
}

export const ROOMS: Room[] = [
    { id: 'general', label: '# general', description: 'General conversation' },
    { id: 'random', label: '# random', description: 'Anything goes' },
    { id: 'tech', label: '# tech', description: 'Tech talk' },
]