# ViewerHub

Stats viewers (watchtime, messages, tips, subs) for Twitch channel **theaubeurre**.
Built with Next.js App Router, Tailwind, NextAuth, Upstash, StreamElements API.

## Quick start
1. `npm install`
2. Copy `.env.example` to `.env.local` and fill values.
3. `npm run dev` → http://localhost:3000

## Pages
- `/` — hero + sign-in
- `/me` — personal stats
- `/leaderboards` — top chatters, tips, subs
- `/admin/connect` — streamer signs in with extra scope and saves token

## Notes
- Keep your secrets safe; never commit `.env.local`.
- StreamElements exposes Top 100 chatters only.
