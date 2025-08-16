"use client";
import React, { useMemo, useState } from "react";

/** ---------------- MOCKS ---------------- **/
type Item = { name: string; value: number };
const TOP_CHATTERS: Item[] = [
  { name: "poneytv", value: 12931 },
  { name: "alice__", value: 11002 },
  { name: "bobinator", value: 9988 },
];
const DAILY = Array.from({ length: 14 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (13 - i));
  return { date: d.toISOString().slice(0, 10), messages: Math.floor(600 + Math.random() * 700) };
});
/** ------------------------------------- **/

const nf = new Intl.NumberFormat("fr-FR");
const medal = (n: number) => (n === 1 ? "🥇" : n === 2 ? "🥈" : n === 3 ? "🥉" : "•");

function buildLinePath(values: number[], W: number, H: number, pad = 8) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = Math.max(1, max - min);
  const step = (W - pad * 2) / Math.max(1, values.length - 1);
  const yOf = (v: number) => {
    const t = (v - min) / span;
    return Math.round(H - pad - t * (H - pad * 2));
  };
  return values.map((v, i) => `${i === 0 ? "M" : "L"} ${Math.round(pad + i * step)} ${yOf(v)}`).join(" ");
}

export default function Page() {
  const channel = "theaubeurre";
  const parent =
    process.env.NEXT_PUBLIC_TWITCH_PARENT ||
    (typeof window !== "undefined" ? window.location.hostname : "localhost");

  const [tab, setTab] = useState<"chat" | "tips" | "subs">("chat");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    const base = TOP_CHATTERS;
    return !s ? base : base.filter((i) => i.name.toLowerCase().includes(s));
  }, [q]);

  const max = Math.max(1, ...TOP_CHATTERS.map((i) => i.value));
  const W = 560, H = 140;
  const path = buildLinePath(DAILY.map((d) => d.messages), W, H);

  return (
    <div className="relative grid h-screen grid-rows-[auto,1fr]">
      {/* halos chill animés */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-10 h-[40rem] w-[40rem] rounded-full bg-gradient-to-tr from-fuchsia-600/25 via-purple-500/20 to-cyan-400/20 blur-3xl animate-floatA" />
        <div className="absolute -right-40 bottom-10 h-[42rem] w-[42rem] rounded-full bg-gradient-to-tr from-cyan-400/20 via-teal-400/20 to-fuchsia-500/20 blur-3xl animate-floatB" />
      </div>

      {/* HEADER */}
      <header className="relative z-10 flex items-center gap-3 px-6 py-4">
        <button onClick={() => history.back()} className="btn">← Retour</button>

        <nav className="ml-1 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
          <button className="rounded-xl bg-white/15 px-3 py-1.5 text-sm font-medium">Classements</button>
        </nav>

        <div className="ml-auto text-[15px] text-white/70">style Twitch • chill</div>
      </header>

      {/* CONTENU */}
      <main className="relative z-10 grid grid-cols-12 gap-6 px-6 pb-6">
        {/* Colonne gauche : tableau + graph */}
        <section className="col-span-7 flex flex-col">
          <div className="card shadow-glow">
            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
              <div className="text-lg font-semibold">Top chatters</div>

              <div className="ml-auto flex gap-2">
                <button
                  onClick={() => setTab("chat")}
                  className={`btn ${tab === "chat" ? "bg-white/15" : ""}`}
                >
                  Top chatters
                </button>
                <button
                  onClick={() => setTab("tips")}
                  className={`btn ${tab === "tips" ? "bg-white/15" : ""}`}
                >
                  Top dons (tips)
                </button>
                <button
                  onClick={() => setTab("subs")}
                  className={`btn ${tab === "subs" ? "bg-white/15" : ""}`}
                >
                  Top subs (mois)
                </button>
              </div>

              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher…"
                className="ml-3 rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-white/30"
              />
            </div>

            <ul className="divide-y divide-white/10">
              {filtered.map((i, idx) => {
                const pct = Math.max(2, Math.round((i.value / max) * 100));
                return (
                  <li key={i.name} className="px-5 py-3 hover:bg-white/[.04] transition">
                    <div className="flex items-center gap-3">
                      <div className="w-10 text-center text-xl">{medal(idx + 1)}</div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-3">
                          <div className="truncate font-medium">{i.name}</div>
                          <div className="text-sm text-white/70">{nf.format(i.value)} msgs</div>
                        </div>
                        <div className="mt-2 h-2 rounded bg-white/10">
                          <div
                            className="h-full rounded bg-gradient-to-r from-[#9146ff] via-[#7c4dff] to-[#22d3ee]"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Graph */}
          <div className="card mt-6 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="font-semibold">Tendance 14 jours</div>
              <div className="text-xs text-white/60">Activité du chat (mock)</div>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="h-32 w-full">
              <defs>
                <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.20" />
                </linearGradient>
              </defs>
              <path d={path} stroke="url(#g)" strokeWidth="3" fill="none" />
              {DAILY.map((d, i) => {
                const vals = DAILY.map((x) => x.messages);
                const max = Math.max(...vals);
                const min = Math.min(...vals);
                const span = Math.max(1, max - min);
                const pad = 8;
                const step = (W - pad * 2) / Math.max(1, vals.length - 1);
                const x = Math.round(pad + i * step);
                const t = (d.messages - min) / span;
                const y = Math.round(H - pad - t * (H - pad * 2));
                return <circle key={i} cx={x} cy={y} r="3" className="fill-[#a78bfa]" />;
              })}
            </svg>
          </div>
        </section>

        {/* Colonne droite : player + chat */}
        <aside className="col-span-5 flex min-h-0 flex-col">
          <div className="card p-2">
            <iframe
              title="twitch-player"
              className="h-[260px] w-full rounded-xl"
              src={`https://player.twitch.tv/?channel=${channel}&parent=${parent}&muted=true&autoplay=true`}
              allowFullScreen
            />
          </div>
          <div className="card mt-6 flex-1 p-2">
            <iframe
              title="twitch-chat"
              className="h-full w-full rounded-xl"
              src={`https://www.twitch.tv/embed/${channel}/chat?parent=${parent}`}
            />
          </div>
        </aside>
      </main>
    </div>
  );
}
