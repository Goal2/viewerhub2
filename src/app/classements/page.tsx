"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/* ---------------------------- MOCK DATA ---------------------------- */
/* ------------------------------------------------------------------ */

type Item = { name: string; value: number };
type Lb = { topChatters: Item[]; topDonors: Item[]; topSubs: Item[] };

const MOCK_LB: Lb = {
  topChatters: [
    { name: "poneytv", value: 12931 },
    { name: "alice__", value: 11002 },
    { name: "bobinator", value: 9988 },
    { name: "xayku", value: 8731 },
    { name: "mika", value: 7019 },
  ],
  topDonors: [
    { name: "superfan", value: 180 },
    { name: "natsu", value: 120 },
    { name: "sora", value: 95 },
    { name: "sakura", value: 74 },
  ],
  topSubs: [
    { name: "neo", value: 36 },
    { name: "jin", value: 20 },
    { name: "ayan", value: 14 },
    { name: "eve", value: 12 },
  ],
};

const DAILY = Array.from({ length: 14 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (13 - i));
  return {
    date: d.toISOString().slice(0, 10),
    messages: Math.floor(520 + Math.sin(i * 0.8) * 320 + Math.random() * 160),
  };
});

/* ------------------------------------------------------------------ */
/* ----------------------------- HELPERS ----------------------------- */
/* ------------------------------------------------------------------ */

const nf = new Intl.NumberFormat("fr-FR");

/** Courbe souple type "cardinal spline" (lisse et sans animations agressives) */
function cardinalPath(values: number[], W: number, H: number, pad = 10, tension = 0.5) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = Math.max(1, max - min);
  const step = (W - pad * 2) / Math.max(1, values.length - 1);
  const pts = values.map((v, i) => {
    const t = (v - min) / span;
    return { x: pad + i * step, y: Math.round(H - pad - t * (H - pad * 2)) };
  });
  if (pts.length < 2) return "";

  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;

    const c1x = p1.x + ((p2.x - p0.x) / 6) * tension;
    const c1y = p1.y + ((p2.y - p0.y) / 6) * tension;
    const c2x = p2.x - ((p3.x - p1.x) / 6) * tension;
    const c2y = p2.y - ((p3.y - p1.y) / 6) * tension;

    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

function medal(n: number) {
  return n === 1 ? "🥇" : n === 2 ? "🥈" : n === 3 ? "🥉" : "🎖️";
}

const isFirefox =
  typeof navigator !== "undefined" && /firefox/i.test(navigator.userAgent ?? "");

/* ------------------------------------------------------------------ */
/* ----------------------------- UI PARTS ---------------------------- */
/* ------------------------------------------------------------------ */

function LeaderboardTable({
  title,
  unit,
  items,
}: {
  title: string;
  unit: string;
  items: Item[];
}) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return !s ? items : items.filter((i) => i.name.toLowerCase().includes(s));
  }, [q, items]);

  const max = Math.max(1, ...items.map((i) => i.value));

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 flex items-center gap-3 border-b border-white/10">
        <div className="text-lg font-semibold">{title}</div>
        <div className="ml-auto">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher…"
            className="rounded-xl bg-black/30 border border-white/15 px-3 py-2 text-sm outline-none focus:border-white/30"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-6 text-white/70 text-sm">Aucune donnée pour le moment.</div>
      ) : (
        <ul className="divide-y divide-white/10">
          {filtered.map((i, idx) => {
            const pct = Math.max(2, Math.round((i.value / max) * 100));
            return (
              <li key={i.name} className="px-5 py-3 hover:bg-white/[.04] transition">
                <div className="flex items-center gap-3">
                  <div className="w-8 text-center">{medal(idx + 1)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="truncate font-medium">{i.name}</div>
                      <div className="text-white/70 text-sm">
                        {nf.format(i.value)} {unit}
                      </div>
                    </div>
                    <div className="mt-2 h-2 rounded bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#9146ff] via-[#7c4dff] to-[#22d3ee]"
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
  );
}

function TwitchEmbedCard({
  kind,
  channel,
  height,
}: {
  kind: "player" | "chat";
  channel: string;
  height: number;
}) {
  // liens de secours ouverts dans un nouvel onglet (utile sur Firefox)
  const url =
    kind === "player"
      ? `https://player.twitch.tv/?channel=${channel}&parent=${process.env.NEXT_PUBLIC_TWITCH_PARENT || "localhost"}&muted=false&autoplay=true`
      : `https://www.twitch.tv/embed/${channel}/chat?parent=${process.env.NEXT_PUBLIC_TWITCH_PARENT || "localhost"}&darkpopout`;

  const openText = kind === "player" ? "Ouvrir Lecteur" : "Ouvrir Chat";
  const title =
    kind === "player" ? "Lecteur indisponible en iframe" : "Chat indisponible en iframe";
  const explain =
    "Firefox bloque parfois l’intégration. Ouvre-le dans un nouvel onglet (ou autorise les cookies tiers pour Twitch).";

  return (
    <div className="card p-0 overflow-hidden">
      {!isFirefox ? (
        kind === "player" ? (
          <iframe
            title="twitch-player"
            src={url}
            height={height}
            className="w-full"
            allow="autoplay; fullscreen; picture-in-picture"
          />
        ) : (
          <iframe
            title="twitch-chat"
            src={url}
            height={height}
            className="w-full"
          />
        )
      ) : (
        <div className="p-8 text-center">
          <div className="text-lg font-semibold mb-2">{title}</div>
          <p className="text-white/70 max-w-xl mx-auto">{explain}</p>
          <a href={url} target="_blank" rel="noreferrer" className="btn-primary mt-4">
            {openText}
          </a>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ---------------------------- MAIN PAGE --------------------------- */
/* ------------------------------------------------------------------ */

export default function ClassementsPage() {
  const [tab, setTab] = useState<"chat" | "tips" | "subs">("chat");
  const lb = MOCK_LB;

  const W = 700;
  const H = 160;
  const path = useMemo(
    () => cardinalPath(DAILY.map((d) => d.messages), W, H, 10, 0.55),
    []
  );

  return (
    <div className="relative">
      {/* Back + header */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <Link href="/" className="btn">
          ← Retour
        </Link>
        <h1 className="text-2xl font-bold">Classements</h1>
        <div className="w-[92px]" />
      </div>

      {/* Tabs */}
      <div className="card mb-5 px-2 py-2 inline-flex gap-2">
        {[
          ["chat", "Top chatters"],
          ["tips", "Top dons (tips)"],
          ["subs", "Top subs (mois)"],
        ].map(([k, label]) => {
          const active = tab === (k as any);
          return (
            <button
              key={k}
              onClick={() => setTab(k as any)}
              className={`px-3 py-1.5 rounded-xl border transition ${
                active
                  ? "bg-white/15 border-white/20"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Colonne gauche : tableau de classement */}
        <div className="lg:col-span-2">
          {tab === "chat" && (
            <LeaderboardTable title="Top chatters" unit="msgs" items={lb.topChatters} />
          )}
          {tab === "tips" && (
            <LeaderboardTable title="Top dons (tips)" unit="€" items={lb.topDonors} />
          )}
          {tab === "subs" && (
            <LeaderboardTable title="Top subs" unit="mois" items={lb.topSubs} />
          )}

          {/* Graphe doux */}
          <div className="card mt-6 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="font-semibold">Tendance 14 jours</div>
              <div className="text-xs text-white/60">Activité du chat (mock)</div>
            </div>

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

              {/* grille légère */}
              {[0, 1, 2, 3].map((i) => (
                <line
                  key={i}
                  x1="10"
                  x2={W - 10}
                  y1={10 + i * ((H - 20) / 3)}
                  y2={10 + i * ((H - 20) / 3)}
                  stroke="rgba(255,255,255,.08)"
                  strokeWidth="1"
                />
              ))}

              {/* aire */}
              {path && (
                <path
                  d={`${path} L ${W - 10} ${H - 10} L 10 ${H - 10} Z`}
                  fill="url(#areaGrad)"
                  opacity=".5"
                />
              )}

              {/* lueur discrète */}
              <path d={path} stroke="#a78bfa" strokeWidth="10" opacity=".12" fill="none" />
              {/* ligne */}
              <path d={path} stroke="url(#lineGrad)" strokeWidth="3" fill="none" />

              {/* points doux */}
              {DAILY.map((d, i, arr) => {
                const max = Math.max(...arr.map((x) => x.messages));
                const min = Math.min(...arr.map((x) => x.messages));
                const span = Math.max(1, max - min);
                const step = (W - 20) / Math.max(1, arr.length - 1);
                const x = 10 + i * step;
                const t = (d.messages - min) / span;
                const y = Math.round(H - 10 - t * (H - 20));
                return (
                  <circle key={i} cx={x} cy={y} r="3" fill="#c4b5fd" className="animate-glowPulse" />
                );
              })}
            </svg>
          </div>
        </div>

        {/* Colonne droite : Live (grand) + Chat (plus petit) */}
        <div className="space-y-6">
          <TwitchEmbedCard kind="player" channel="theaubeurre" height={320} />
          <TwitchEmbedCard kind="chat" channel="theaubeurre" height={280} />
        </div>
      </div>
    </div>
  );
}
