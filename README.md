# Supabase Realtime Chat 🚀

A modern, full-stack real-time chat application built with **Next.js**, **Tailwind CSS v4**, and **Supabase**. This project demonstrates how to build scalable real-time features including instant messaging, online presence tracking, and secure user authentication.

## ✨ Features

- **Secure Authentication:** User sign-up and login securely handled by Supabase Auth.
- **Real-time Messaging:** Chat messages appear instantly across all connected clients using Supabase Realtime (Postgres Changes).
- **Live Presence Tracking:** See who is currently online in the chat room in real-time, utilizing Supabase Presence.
- **Multiple Chat Rooms:** Support for distinct channels (e.g., General, Random, Help).
- **Modern UI/UX:** A sleek, dark-themed user interface styled completely with Tailwind CSS v4.
- **Responsive Design:** Optimized for both desktop and mobile viewing.

---

## 🛠️ Technology Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication:** Supabase Auth
- **Realtime sync:** Supabase Realtime (Channels & Presence)
- **Font:** DM Sans (via `next/font/google`)

---

## 📂 Project Structure

```text
supabase-chat/
├── app/
│   ├── chat/              # Main chat interface and room routing
│   │   ├── [room]/        # Dynamic route for specific chat rooms
│   │   └── page.tsx       # Room selection lobby
│   ├── login/             # User sign-in page
│   ├── register/          # User sign-up page
│   ├── globals.css        # Global CSS, Tailwind v4 theme variables
│   └── layout.tsx         # Root layout configuring fonts and body styles
├── components/
│   ├── auth/              # Authentication-related components
│   ├── chat/              # Chat-specific components (Message bubbles, inputs, online users)
│   ├── layout/            # Layout components (Sidebar, Navbar)
│   └── ui/                # Reusable UI primitives (Buttons, Inputs, Avatars, Badges)
├── lib/
│   ├── supabase.ts        # Supabase client initialization
│   └── types.ts           # TypeScript type definitions (Messages, Rooms, Presence)
└── .env.local             # Environment variables (Supabase URL & Anon Key)
```

---

## 🔄 Core Workflows

### 1. Authentication Flow
1. Users navigate to `/register` to create an account. The app calls `supabase.auth.signUp()`.
2. Upon successful registration, or by navigating to `/login`, users authenticate via `supabase.auth.signInWithPassword()`.
3. Once authenticated, a Supabase session is established, and users are redirected to the `/chat` lobby.
4. The application strictly protects routes; unauthenticated users trying to access `/chat` are automatically redirected to `/login`.

### 2. Real-time Messaging Flow
1. When a user enters a room (e.g., `/chat/general`), the `MessageList` component fetches the last 50 historical messages from the Supabase `messages` table.
2. A Supabase Realtime channel (`room-[room_name]`) is opened.
3. When a user sends a message via `MessageInput`, it performs a standard PostgreSQL `INSERT` into the `messages` table.
4. The Realtime subscription listens for `INSERT` and `DELETE` events on the `messages` table and instantly updates the UI for all connected clients without requiring a page refresh.

### 3. Online Presence Flow
1. When a user enters a room, the `OnlineUsers` component connects to a Supabase Presence channel (`presence-[room_name]`).
2. The user's status is tracked using `channel.track()`, broadcasting their `user_id`, `username`, and `online_at` timestamp.
3. The component listens for the `sync` event to maintain an accurate, up-to-date list of all currently connected users in that specific room.
4. When a user closes the tab or navigates away, Supabase automatically untracks them, removing them from the online list.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- A [Supabase](https://supabase.com/) account and project

### 1. Database Setup
Run the following SQL commands in your Supabase SQL Editor to create the necessary tables and enable Realtime:

```sql
-- Create messages table
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  content text not null,
  room text not null,
  user_id uuid references auth.users not null,
  username text not null
);

-- Enable Row Level Security (RLS)
alter table public.messages enable row level security;

-- Create policies
create policy "Anyone can view messages"
  on messages for select
  using ( true );

create policy "Authenticated users can insert messages"
  on messages for insert
  to authenticated
  with check ( auth.uid() = user_id );

create policy "Users can delete their own messages"
  on messages for delete
  to authenticated
  using ( auth.uid() = user_id );

-- Enable Realtime for the messages table
alter publication supabase_realtime add table messages;
```

### 2. Environment Setup
Clone the repository and create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Installation & Execution
Install the dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application in action.
