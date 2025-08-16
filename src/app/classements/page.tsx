"use client";

import { useMemo, useState } from "react";

type Item = { name: string; value: number };

const nf = new Intl.NumberFormat("fr-FR");

// ---- MOCKS (tu pourras brancher plus tard sur ton API) ----
const MOCK_LB: Item[] = [
  { name: "poneytv", value: 12931 },
  { name: "alice__", value: 11002 },
  { name: "bobinator", value: 9988 },
];

const MOCK_DAILY = Array.from({ length: 14 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (13 - i));
  return { date: d.toISOString().slice(0, 10), messages: Math.floor(600 + Math.random() * 700) };
});

// ---- PETITS HELPERS ----
const medal = (n: number) => (n === 1 ? "🥇" : n === 2 ? "🥈" : n === 3 ? "🥉" : "•");

// construit un path SVG simple (ligne cassée) depuis les points
function buildLinePath(values: number[], w: number, h: number, pad = 8) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = Math.max(1, max - min);
  const step = (w - pad * 2) / Math.max(1, values.length - 1);

  const yOf = (v: number) => {
    const t = (v - min) / span; // 0..1
    return Math.round(h - pad - t * (h - pad * 2)); // inversé (haut = grand)
  };

  return values
    .map((v, i) => `${i === 0 ? "M" : "L"} ${Math.round(pad + i * step)} ${yOf(v)}`)
    .join(" ");
}

export default function Page() {
  // config twitch
  const channel = "theaubeurre";
  const parent =
    process.env.NEXT_PUBLIC_TWITCH_PARENT ||
    (typeof window !== "undefined" ? window.location.hostname : "localhost");

  // recherche dans le tableau
  const [q, setQ] = useState("");
  const items = useMemo(() => {
    const s = q.trim().toLowerCase();
    return !s ? MOCK_LB : MOCK_LB.filter((i) => i.name.toLowerCase().includes(s));
  }, [q]);

  const max = Math.max(1, ...MOCK_LB.map((i) => i.value));

  // courbe (SVG)
  const W = 560;
  const H = 140;
  const path = buildLinePath(
    MOCK_DAILY.map((d) => d.messages),
    W,
    H
  );

  return (
    <div className="relative h-screen overflow-hidden bg-black text-white">
      {/* Halos animés (très chill) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-10 h-[40rem] w-[40rem] rounded-full bg-gradient-to-tr from-fuchsia-600/25 via-purple-500/20 to-cyan-400/20 blur-3xl halo-float" />
        <div className="absolute -right-32 bottom-10 h-[42rem] w-[42rem] rounded-full bg-gradient-to-tr from-cyan-400/20 via-teal-400/20 to-fuchsia-500/20 blur-3xl halo-float-slow" />
      </div>

      {/* Grille page : header + contenu. Pas de scroll */}
      <div className="relative z-10 grid h-full grid-rows-[auto,1fr]">
        {/* HEADER */}
        <header className="flex items-center gap-4 px-6 py-4">
          <button
            onClick={() => (typeof window !== "undefined" ? window.history.back() : null)}
            className="rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10"
          >
            ← Retour
          </button>

          <nav className="ml-1 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
            <span className="rounded-xl bg-white/15 px-3 py-1.5 text-sm font-medium">
              Classements
            </span>
          </nav>

          <h1 className="ml-auto text-xl font-semibold tracking-wide">Style Twitch</h1>
        </header>

        {/* CONTENU (sans scroll) */}
        <main className="grid grid-cols-12 gap-6 px-6 pb-6">
          {/* COLONNE GAUCHE : tableau + graph */}
          <section className="col-span-7 flex flex-col">
            {/* Tableau */}
            <div className="rounded-2xl border border-white/10 bg-white/5">
              <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                <h2 className="text-lg font-semibold">Top chatters</h2>
                <div className="ml-auto">
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Rechercher…"
                    className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-white/30"
                  />
                </div>
              </div>

              {items.length === 0 ? (
                <div className="p-6 text-sm text-white/70">Aucune donnée.</div>
              ) : (
                <ul className="divide-y divide-white/10">
                  {items.map((i, idx) => {
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
              )}
            </div>

            {/* Courbe sous le tableau */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="font-semibold">Tendance 14 jours</div>
                <div className="text-xs text-white/60">Activité du chat (14 j)</div>
              </div>

              <svg viewBox={`0 0 ${W} ${H}`} className="h-32 w-full">
                {/* fond léger */}
                <defs>
                  <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.15" />
                  </linearGradient>
                </defs>

                <path d={path} stroke="url(#grad)" strokeWidth="3" fill="none" />
                {MOCK_DAILY.map((d, i) => {
                  const values = MOCK_DAILY.map((x) => x.messages);
                  const max = Math.max(...values);
                  const min = Math.min(...values);
                  const span = Math.max(1, max - min);
                  const pad = 8;
                  const step = (W - pad * 2) / Math.max(1, values.length - 1);

                  const x = Math.round(pad + i * step);
                  const t = (d.messages - min) / span;
                  const y = Math.round(H - pad - t * (H - pad * 2));
                  return <circle key={i} cx={x} cy={y} r="3" className="fill-[#a78bfa]" />;
                })}
              </svg>
            </div>
          </section>

          {/* COLONNE DROITE : Live + Chat */}
          <aside className="col-span-5 flex min-h-0 flex-col">
            {/* Player */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-2">
              <iframe
                title="twitch-player"
                className="h-[260px] w-full rounded-xl"
                src={`https://player.twitch.tv/?channel=${channel}&parent=${parent}&muted=true&autoplay=true`}
                allowFullScreen
              />
            </div>

            {/* Chat */}
            <div className="mt-6 flex-1 rounded-2xl border border-white/10 bg-white/5 p-2">
              <iframe
                title="twitch-chat"
                className="h-full w-full rounded-xl"
                src={`https://www.twitch.tv/embed/${channel}/chat?parent=${parent}`}
              />
            </div>
          </aside>
        </main>
      </div>

      {/* styles des halos (doux) */}
      <style jsx>{`
        @keyframes floatA {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(20px, -12px, 0) scale(1.05);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        @keyframes floatB {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(-18px, 10px, 0) scale(1.07);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        .halo-float {
          animation: floatA 28s ease-in-out infinite;
        }
        .halo-float-slow {
          animation: floatB 36s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
