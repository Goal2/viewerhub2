"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

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
const isFirefox = () => typeof navigator !== "undefined" && /firefox/i.test(navigator.userAgent);

function smoothPath(values: number[], W: number, H: number, pad = 10) {
  // lissage simple (Catmull-Rom approx vers cubic-bezier-like)
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

/* ---------- Iframe with Firefox fallback ---------- */
function SafeIframe({
  src,
  className,
  fallbackHref,
  label,
  height,
}: {
  src: string;
  className?: string;
  fallbackHref: string;
  label: string;
  height: number | string;
}) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const timer = setTimeout(() => {
      // si onload jamais déclenché (Firefox/ETP strict) => fallback
      setFailed(true);
    }, 1600);
    const onLoad = () => clearTimeout(timer);
    ref.current.addEventListener("load", onLoad);
    return () => clearTimeout(timer);
  }, [src]);

  if (failed || isFirefox()) {
    return (
      <div className="flex h-[--h] w-full flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 p-6 text-center"
           style={{ ["--h" as any]: typeof height === "number" ? `${height}px` : height }}>
        <div className="text-lg font-semibold mb-2">{label} indisponible en iframe</div>
        <p className="text-sm text-white/70">
          Firefox bloque parfois l’intégration. Ouvre-le dans un nouvel onglet
          (ou autorise les cookies tiers pour Twitch).
        </p>
        <a
          className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#8b5cf6] px-4 py-2 text-sm font-medium shadow-glow hover:opacity-95"
          href={fallbackHref}
          target="_blank"
          rel="noreferrer"
        >
          Ouvrir {label}
        </a>
      </div>
    );
  }

  return (
    <iframe
      ref={ref}
      src={src}
      className={className}
      height={height}
      width="100%"
      allow="autoplay; picture-in-picture; fullscreen"
      allowFullScreen
      title={label}
    />
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
  const W = 560, H = 160;
  const path = smoothPath(DAILY.map((d) => d.messages), W, H);

  return (
    <div className="relative grid h-screen grid-rows-[auto,1fr]">
      {/* halos (plus de mouvement) */}
      <div className="pointer-events-none absolute inset-0 mix-blend-soft-light">
        <div className="absolute -left-40 top-10 h-[40rem] w-[40rem] rounded-full bg-gradient-to-tr from-fuchsia-600/30 via-purple-500/20 to-cyan-400/20 blur-3xl animate-floatA" />
        <div className="absolute -right-40 bottom-10 h-[42rem] w-[42rem] rounded-full bg-gradient-to-tr from-cyan-400/25 via-teal-400/20 to-fuchsia-500/20 blur-3xl animate-floatB" />
        <div className="absolute left-[40%] top-[45%] h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-violet-500/18 via-fuchsia-500/14 to-cyan-400/16 blur-3xl animate-floatC" />
      </div>

      {/* HEADER */}
      <header className="relative z-10 flex items-center gap-3 px-6 py-4">
        <button onClick={() => history.back()} className="btn">← Retour</button>

        {/* Onglets stylés */}
        <nav className="ml-1 flex items-center gap-1 rounded-2xl border border-white/10 bg-white/5 p-1">
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
              {k === "chat" && "Top chatters"}
              {k === "tips" && "Top dons (tips)"}
              {k === "subs" && "Top subs (mois)"}
            </button>
          ))}
        </nav>

        <div className="ml-auto text-[15px] text-white/70">style Twitch • chill</div>
      </header>

      {/* CONTENU */}
      <main className="relative z-10 grid grid-cols-12 gap-6 px-6 pb-6">
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
              {/* glow sous la ligne */}
              <div className="pointer-events-none absolute inset-0 blur-2xl opacity-50">
                <svg viewBox={`0 0 ${W} ${H}`} className="h-40 w-full">
                  <path d={path} stroke="#a78bfa" strokeWidth="8" fill="none" opacity=".15" />
                </svg>
              </div>

              <svg viewBox={`0 0 ${W} ${H}`} className="h-40 w-full">
                {/* grille */}
                {[0, 1, 2, 3].map((g) => (
                  <line
                    key={g}
                    x1="10" x2={W - 10}
                    y1={10 + g * ((H - 20) / 3)}
                    y2={10 + g * ((H - 20) / 3)}
                    stroke="rgba(255,255,255,.08)" strokeWidth="1"
                  />
                ))}

                {/* ligne animée */}
                <defs>
                  <linearGradient id="lineGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
                <path
                  d={path}
                  stroke="url(#lineGrad)"
                  strokeWidth="3"
                  fill="none"
                  className="path-animate"
                  style={{ strokeDasharray: 1000 }}
                />

                {/* petits points */}
                {DAILY.map((d, i) => {
                  const v = d.messages;
                  const max = Math.max(...DAILY.map((x) => x.messages));
                  const min = Math.min(...DAILY.map((x) => x.messages));
                  const span = Math.max(1, max - min);
                  const step = (W - 20) / Math.max(1, DAILY.length - 1);
                  const x = 10 + i * step;
                  const t = (v - min) / span;
                  const y = Math.round(H - 10 - t * (H - 20));
                  return <circle key={i} cx={x} cy={y} r="3" className="dot" fill="#a78bfa" />;
                })}
              </svg>
            </div>
          </div>
        </section>

        {/* Droite : CHAT (petit en haut) + PLAYER (grand en bas) avec fallback Firefox */}
        <aside className="col-span-5 flex min-h-0 flex-col">
          {/* CHAT */}
          <div className="card p-2">
            <SafeIframe
              label="Chat"
              className="w-full rounded-xl"
              height={220}
              src={`https://www.twitch.tv/embed/${channel}/chat?parent=${parent}`}
              fallbackHref={`https://www.twitch.tv/popout/${channel}/chat?popout=`}
            />
          </div>

          {/* PLAYER */}
          <div className="card mt-6 p-2">
            <SafeIframe
              label="Lecteur"
              className="w-full rounded-xl"
              height={360}
              src={`https://player.twitch.tv/?channel=${channel}&parent=${parent}&muted=true&autoplay=true`}
              fallbackHref={`https://www.twitch.tv/${channel}`}
            />
          </div>
        </aside>
      </main>
    </div>
  );
}
