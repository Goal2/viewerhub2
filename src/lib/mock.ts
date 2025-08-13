// src/lib/mock.ts

// petit helper pour simuler un délai réseau
export const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// --- DEMO: classements ---
export const mockLeaderboards = {
  topChatters: [
    { name: "poneytv", value: 12931 },
    { name: "alice__", value: 11002 },
    { name: "bobinator", value: 9988 },
  ],
  topDonors: [
    { name: "kind_whale", value: 420.5 },
    { name: "alice__", value: 180 },
  ],
  topSubs: [
    { name: "poneytv", value: 28 },
    { name: "luna", value: 21 },
  ],
};

// --- DEMO: infos stream ---
export const mockStream = {
  isLive: true,
  title: "Chill & chat • setup • musique",
  game: "Just Chatting",
  viewerCount: 324,
  chatters: 128,
  startedAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
  uptime: "00:42:00",
  lastEvents: [
    { type: "sub", user: "alice__", months: 3, ts: new Date(Date.now() - 1000 * 60 * 2).toISOString() },
    { type: "tip", user: "kind_whale", amount: 25, ts: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    { type: "message", user: "poneytv", text: "let's go !", ts: new Date(Date.now() - 1000 * 60 * 7).toISOString() },
  ],
};

// --- DEMO: stats perso pour l'accueil ---
export const mockChatStats = {
  rank: 12,
  totalViewers: 384,
  percentile: 96.9,
  messagesTotal: 321,
  messages30d: 210,
  avgPerDay: 7,
  streakDays: 5,
  mostActiveHour: 21,
  daily: [
    { date: "2025-07-27", messages: 3 },
    { date: "2025-07-28", messages: 5 },
    { date: "2025-07-29", messages: 2 },
    { date: "2025-07-30", messages: 9 },
    { date: "2025-07-31", messages: 4 },
    { date: "2025-08-01", messages: 6 },
    { date: "2025-08-02", messages: 11 },
    { date: "2025-08-03", messages: 7 },
    { date: "2025-08-04", messages: 0 },
    { date: "2025-08-05", messages: 12 },
    { date: "2025-08-06", messages: 8 },
    { date: "2025-08-07", messages: 10 },
    { date: "2025-08-08", messages: 14 },
    { date: "2025-08-09", messages: 19 },
  ],
  topEmotes: [
    { code: "Kappa", count: 12 },
    { code: "PogChamp", count: 9 },
    { code: "LUL", count: 8 },
  ],
};

// --- DEMO: "me" (points/messages/etc.) ---
export const mockMe = {
  points: 12345,
  watchtime: 678,   // minutes
  messages: 321,
  isSub: true,
  cumulativeMonths: 6,
};
