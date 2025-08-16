"use client";

import React, { useMemo, useRef, useState } from "react";

/* ===== MOCKS ===== */
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
/* ================= */

const nf = new Intl.NumberFormat("fr-FR");

const medal = (n: number) => (n === 1 ? "🥇" : n === 2 ? "🥈" : n === 3 ? "🥉" : "•");
const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

function smoothPath(values: number[], W: number, H: number, pad = 10) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = Math.max(1, max - min);
  const step = (W - pad * 2) / Math.max(1, values.length - 1);
  const points = values.map((v, i) => {
    const t = (v - min) / span;
    const x = pad + i * step;
    const y = Math.round(H - pad - t * (H - pad * 2));
    return { x, y };
  });

  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const cx = (p0.x + p1.x) / 2;
    d += ` Q ${p0.x} ${p0.y}, ${cx} ${ (p0.y + p1.y) / 2 }`;
    d += ` T ${p1.x} ${p1.y}`;
  }
  return d;
}

/* Iframe amélioré : on ne cache plus l’iframe sur Firefox.
   On met une petite barre d’aide dessous pour ouvrir dans Twitch si ça ne s’affiche pas. */
function TwitchEmbed({
  type,
  channel,
  parent,
  height,
}: {
  type: "chat" | "player";
  channel: string;
  parent: string;
  height: number;
}) {
  const src =
    type === "chat"
      ? `https://www.twitch.tv/embed/${channel}/chat?parent=${parent}`
      : `https://player.twitch.tv/?channel=${channel}&parent=${parent}&muted=true&autoplay=true`;

  const link =
    type === "chat"
      ? `https://www.twitch.tv/popout/${channel}/chat?popout=`
      : `https://www.twitch.tv/${channel}`;

  return (
    <div className="w-full">
      <iframe
        src={src}
        height={height}
        width="100%"
        className="w-full rounded-xl"
        allow="autoplay; picture-in-picture; fullscreen"
        allowFullScreen
        title={type === "chat" ? "Chat Twitch" : "Lecteur Twitch"}
      />
      <div className="mt-2 flex items-center justify-between rounded-xl border border-white/10 bg-white/[.04] p-2 text-xs text-white/70">
        <span>Si rien ne s’affiche (Firefox / cookies tiers), ouvre-le dans un onglet :</span>
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="ml-2 rounded-lg bg-[#8b5cf6] px-3 py-1 font-medium text-white shadow-glow hover:opacity-95"
        >
          {type === "chat" ? "Ouvrir le chat" : "Ouvrir le lecteur"}
        </a>
      </div>
    </div>
  );
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
    return !s ? TOP_CHATTERS : TOP_CHATTERS.filter((i) => i.name.toLowerCase().includes(s));
  }, [q]);

  const max = Math.max(1, ...TOP_CHATTERS.map((i) => i.value));
  const W = 580, H = 180;
  const path = smoothPath(DAILY.map((d) => d.messages), W, H);

  const total14 = sum(DAILY.map((d) => d.messages));
  const avg = Math.round(total14 / DAILY.length);

  return (
    <div className="relative grid min-h-screen grid-rows-[auto,1fr]">
      {/* halos plus amples */}
      <div className="pointer-events-none absolute inset-0 mix-blend-soft-light">
        <div className="absolute -left-48 top-10 h-[48rem] w-[48rem] rounded-full bg-gradient-to-tr from-fuchsia-600/30 via-purple-500/20 to-cyan-400/20 blur-3xl animate-floatA" />
        <div className="absolute -right-52 bottom-12 h-[50rem] w-[50rem] rounded-full bg-gradient-to-tr from-cyan-400/25 via-teal-400/20 to-fuchsia-500/20 blur-3xl animate-floatB" />
        <div className="absolute left-[42%] top-[45%] h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-violet-500/18 via-fuchsia-500/14 to-cyan-400/16 blur-3xl animate-floatC" />
        <div className="absolute left-1/2 bottom-[8%] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-fuchsia-500/14 via-indigo-500/10 to-cyan-400/12 blur-3xl animate-floatD" />
      </div>
      {/* LEDs chill */}
      <div className="led-field" />

      {/* HEADER */}
      <header className="relative z-10 px-6 pt-6 pb-3">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#9146ff] via-[#7c4dff] to-[#22d3ee]">
              Classements
            </h1>
            <p className="text-white/70">
              Messages, tips et mois de sub — en temps quasi réel (style Twitch).
            </p>
          </div>
          {/* onglets pill stylés */}
          <nav className="ml-auto flex items-center gap-1 rounded-2xl border border-white/10 bg-white/5 p-1">
            {(["chat", "tips", "subs"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`px-4 py-1.5 rounded-xl text-sm font-medium transition ${
                  tab === k
                    ? "bg-gradient-to-r from-[#9146ff] to-[#22d3ee] text-white shadow-glow"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                {k === "chat" ? "Top chatters" : k === "tips" ? "Top dons (tips)" : "Top subs (mois)"}
              </button>
            ))}
          </nav>
        </div>

        {/* KPI cards */}
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="card p-4 shadow-glow">
            <div className="text-xs uppercase tracking-wider text-white/60">Total 14 jours</div>
            <div className="mt-1 text-2xl font-bold">{nf.format(total14)} msgs</div>
          </div>
          <div className="card p-4">
            <div className="text-xs uppercase tracking-wider text-white/60">Moyenne / jour</div>
            <div className="mt-1 text-2xl font-bold">{nf.format(avg)} msgs</div>
          </div>
          <div className="card p-4">
            <div className="text-xs uppercase tracking-wider text-white/60">Mock rang perso</div>
            <div className="mt-1 text-2xl font-bold">#12 <span className="text-white/60 text-base">/ 3 214</span></div>
          </div>
        </div>
      </header>

      {/* CONTENU */}
      <main className="relative z-10 grid grid-cols-12 gap-6 px-6 pb-8">
        {/* Gauche : table + graph */}
        <section className="col-span-7 flex min-h-0 flex-col">
          {/* tableau */}
          <div className="card shadow-glow">
            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
              <div className="text-lg font-semibold">
                {tab === "chat" ? "Top chatters" : tab === "tips" ? "Top dons (tips)" : "Top subs (mois)"}
              </div>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher…"
                className="ml-auto rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-white/30"
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
                          <div className="text-sm text-white/70">
                            {nf.format(i.value)} {tab === "tips" ? "€" : tab === "subs" ? "mois" : "msgs"}
                          </div>
                        </div>
                        <div className="mt-2 h-2 rounded bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded bg-gradient-to-r from-[#9146ff] via-[#7c4dff] to-[#22d3ee] animate-glowPulse"
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

          {/* graph vivant */}
          <div className="card mt-6 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="font-semibold">Tendance 14 jours</div>
              <div className="text-xs text-white/60">Activité du chat (mock)</div>
            </div>

            <div className="relative">
              {/* grille qui dérive légèrement */}
              <div className="pointer-events-none absolute inset-0">
                <svg viewBox={`0 0 ${W} ${H}`} className="h-44 w-full">
                  {[0, 1, 2, 3].map((g) => (
                    <line
                      key={g}
                      x1="10" x2={W - 10}
                      y1={10 + g * ((H - 20) / 3)}
                      y2={10 + g * ((H - 20) / 3)}
                      stroke="rgba(255,255,255,.08)"
                      strokeWidth="1"
                      className="animate-gridDrift"
                    />
                  ))}
                </svg>
              </div>

              {/* courbe + aire + glow + dash loop */}
              <svg viewBox={`0 0 ${W} ${H}`} className="h-44 w-full">
                <defs>
                  <linearGradient id="lineGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                  <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgba(167,139,250,.35)" />
                    <stop offset="100%" stopColor="rgba(34,211,238,.05)" />
                  </linearGradient>
                </defs>

                {/* aire sous la courbe */}
                {path && (
                  <path
                    d={`${path} L ${W - 10} ${H - 10} L 10 ${H - 10} Z`}
                    fill="url(#areaGrad)"
                    opacity=".5"
                  />
                )}

                {/* ligne glow en dessous */}
                <path d={path} stroke="#a78bfa" strokeWidth="10" opacity=".12" fill="none" />

                {/* ligne animée (dash loop) */}
                <path
                  d={path}
                  stroke="url(#lineGrad)"
                  strokeWidth="3"
                  fill="none"
                  style={{ strokeDasharray: 2000 }}
                  className="animate-dashLoop"
                />

                {/* points lumineux */}
                {DAILY.map((d, i, arr) => {
                  const max = Math.max(...arr.map((x) => x.messages));
                  const min = Math.min(...arr.map((x) => x.messages));
                  const span = Math.max(1, max - min);
                  const step = (W - 20) / Math.max(1, arr.length - 1);
                  const x = 10 + i * step;
                  const t = (d.messages - min) / span;
                  const y = Math.round(H - 10 - t * (H - 20));
                  return <circle key={i} cx={x} cy={y} r="3" fill="#a78bfa" className="drop-shadow-[0_0_12px_rgba(167,139,250,.55)]" />;
                })}
              </svg>

              {/* lueur animée par-dessus (shimmer) */}
              <div className="pointer-events-none absolute inset-0 rounded-xl"
                   style={{
                     background:
                       "linear-gradient(90deg, transparent, rgba(255,255,255,.06), transparent)",
                   }}
                   aria-hidden
                   />
            </div>
          </div>
        </section>

        {/* Droite : CHAT (petit) + PLAYER (grand) */}
        <aside className="col-span-5 flex min-h-0 flex-col">
          {/* Chat en haut, plus petit */}
          <div className="card p-3">
            <TwitchEmbed type="chat" channel={channel} parent={parent} height={240} />
          </div>

          {/* Player plus grand, en bas */}
          <div className="card mt-6 p-3">
            <TwitchEmbed type="player" channel={channel} parent={parent} height={380} />
          </div>
        </aside>
      </main>
    </div>
  );
}
