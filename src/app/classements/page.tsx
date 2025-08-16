"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

/* ---------- MOCK (à brancher à ton API ensuite) ---------- */
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
/* -------------------------------------------------------- */

const nf = new Intl.NumberFormat("fr-FR");
const parent = process.env.NEXT_PUBLIC_TWITCH_PARENT || "viewerhub2.vercel.app";

/* Cardinal smooth path */
function cardinalPath(values: number[], W: number, H: number, pad = 10, tension = 0.6) {
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

/* Médailles plus lisibles */
function Medal({ rank }: { rank: number }) {
  const color =
    rank === 1 ? "bg-gradient-to-br from-yellow-400 to-amber-500" :
    rank === 2 ? "bg-gradient-to-br from-slate-200 to-slate-400" :
    rank === 3 ? "bg-gradient-to-br from-amber-700 to-orange-600" :
                 "bg-gradient-to-br from-violet-500 to-purple-600";
  return <span className={`inline-block w-6 h-6 rounded-full ${color} ring-2 ring-white/30`} />;
}

/* Tableau plus clean */
function LeaderboardTable({ title, unit, items }:{ title:string; unit:string; items:Item[] }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return !s ? items : items.filter(i => i.name.toLowerCase().includes(s));
  }, [q, items]);
  const max = Math.max(1, ...items.map(i => i.value));

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 flex items-center gap-3 border-b border-white/10">
        <div className="text-lg font-semibold">{title}</div>
        <div className="ml-auto w-60">
          <input
            value={q}
            onChange={(e)=>setQ(e.target.value)}
            placeholder="Rechercher…"
            className="w-full rounded-xl bg-black/30 border border-white/15 px-3 py-2 text-sm outline-none focus:border-white/30"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-6 text-white/70 text-sm">Aucune donnée pour le moment.</div>
      ) : (
        <ul className="divide-y divide-white/8">
          {filtered.map((i, idx) => {
            const pct = Math.max(3, Math.round((i.value / max) * 100));
            return (
              <li key={i.name} className="px-5 py-3 hover:bg-white/[.04] transition">
                <div className="flex items-center gap-3">
                  <Medal rank={idx + 1} />
                  <div className="min-w-0 grow">
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="truncate font-medium">{i.name}</div>
                      <div className="text-white/70 text-sm">{nf.format(i.value)} {unit}</div>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-white/[.08] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#7c4dff] via-[#9146ff] to-[#22d3ee]"
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

/* Onglets segmentés avec indicateur gradient */
function SegmentedTabs({
  value, onChange,
}: { value:"chat"|"tips"|"subs"; onChange:(v:"chat"|"tips"|"subs")=>void }) {
  const tabs: Array<{k:"chat"|"tips"|"subs"; label:string}> = [
    { k:"chat", label:"Top chatters" },
    { k:"tips", label:"Top dons (tips)" },
    { k:"subs", label:"Top subs (mois)" },
  ];
  const index = tabs.findIndex(t => t.k === value);
  return (
    <div className="relative w-full max-w-[540px] rounded-xl border border-white/10 bg-white/5 p-1">
      <div
        className="absolute inset-y-1 w-1/3 rounded-lg bg-gradient-to-r from-[#9146ff] to-[#22d3ee] opacity-25 transition-transform"
        style={{ transform: `translateX(${index * 100}%)` }}
      />
      <div className="relative grid grid-cols-3 gap-1">
        {tabs.map(t => {
          const active = t.k === value;
          return (
            <button
              key={t.k}
              onClick={()=>onChange(t.k)}
              className={`px-3 py-1.5 rounded-lg transition text-sm ${active ? "text-white" : "text-white/70 hover:text-white"}`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* Iframes (player en haut, chat dessous — thème sombre) */
function TwitchEmbedCard({ kind, channel, height }: { kind:"player"|"chat"; channel:string; height:number }) {
  const isFirefox = typeof navigator !== "undefined" && /firefox/i.test(navigator.userAgent || "");
  const src =
    kind === "player"
      ? `https://player.twitch.tv/?channel=${channel}&parent=${parent}&muted=false&autoplay=true&collection=&video=&time=`
      : `https://www.twitch.tv/embed/${channel}/chat?parent=${parent}&theme=dark`;

  if (!isFirefox) {
    return (
      <div className="card p-0 overflow-hidden">
        <iframe
          title={kind === "player" ? "twitch-player" : "twitch-chat"}
          src={src}
          height={height}
          className="w-full bg-black"
          allow={kind === "player" ? "autoplay; fullscreen; picture-in-picture" : undefined}
        />
      </div>
    );
  }

  // Fallback sombre pour Firefox (cookies tiers)
  return (
    <div className="card p-6 text-center">
      <div className="text-lg font-semibold mb-2">
        {kind === "player" ? "Lecteur indisponible en iframe" : "Chat indisponible en iframe"}
      </div>
      <p className="text-white/70">
        Firefox bloque parfois l’intégration. Ouvre-le dans un nouvel onglet (ou autorise les cookies tiers pour Twitch).
      </p>
      <a href={src} target="_blank" rel="noreferrer" className="btn-primary mt-4">
        {kind === "player" ? "Ouvrir le lecteur" : "Ouvrir le chat"}
      </a>
    </div>
  );
}

export default function ClassementsPage() {
  const [tab, setTab] = useState<"chat" | "tips" | "subs">("chat");
  const lb = MOCK_LB;

  // Graphe plus souple
  const W = 760, H = 180;
  const path = useMemo(() => cardinalPath(DAILY.map(d => d.messages), W, H, 12, 0.65), []);

  return (
    <div className="relative">
      {/* Header + tabs */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">Classements</h1>
          <p className="text-white/70 -mt-1">
            Messages, tips et mois de sub — en temps quasi réel (style Twitch).
          </p>
        </div>
        <SegmentedTabs value={tab} onChange={setTab} />
      </div>

      {/* KPI rapides */}
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div className="card p-4">
          <div className="text-xs text-white/60">TOTAL 14 JOURS</div>
          <div className="text-2xl font-bold">{nf.format(12640)} msgs</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-white/60">MOYENNE / JOUR</div>
          <div className="text-2xl font-bold">{nf.format(903)} msgs</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-white/60">MOCK RANG PERSO</div>
          <div className="text-2xl font-extrabold">
            <span className="text-[#a78bfa]">#12</span> <span className="text-white/60">/ 3 214</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Colonne gauche : tableau + graphe */}
        <div className="lg:col-span-2 space-y-6">
          {tab === "chat" && <LeaderboardTable title="Top chatters" unit="msgs" items={lb.topChatters} />}
          {tab === "tips" && <LeaderboardTable title="Top dons (tips)" unit="€" items={lb.topDonors} />}
          {tab === "subs" && <LeaderboardTable title="Top subs" unit="mois" items={lb.topSubs} />}

          <div className="card p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="font-semibold">Tendance 14 jours</div>
              <div className="text-xs text-white/60">Activité du chat (mock)</div>
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} className="h-48 w-full">
              <defs>
                <linearGradient id="lineGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
                <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgba(167,139,250,.30)" />
                  <stop offset="100%" stopColor="rgba(34,211,238,.06)" />
                </linearGradient>
              </defs>

              {[0,1,2,3].map(i=>(
                <line key={i} x1="12" x2={W-12} y1={12 + i*((H-24)/3)} y2={12 + i*((H-24)/3)}
                  stroke="rgba(255,255,255,.06)" strokeWidth="1" />
              ))}

              {path && (
                <path d={`${path} L ${W-12} ${H-12} L 12 ${H-12} Z`} fill="url(#areaGrad)" opacity=".55" />
              )}
              <path d={path} stroke="#a78bfa" strokeWidth="9" opacity=".12" fill="none" />
              <path d={path} stroke="url(#lineGrad)" strokeWidth="3" fill="none" />

              {DAILY.map((d, i, arr) => {
                const max = Math.max(...arr.map(x=>x.messages));
                const min = Math.min(...arr.map(x=>x.messages));
                const span = Math.max(1, max-min);
                const step = (W-24)/Math.max(1, arr.length-1);
                const x = 12 + i * step;
                const t = (d.messages-min)/span;
                const y = Math.round(H-12 - t*(H-24));
                return <circle key={i} cx={x} cy={y} r="3" fill="#c4b5fd" className="animate-glowPulse"/>;
              })}
            </svg>
          </div>
        </div>

        {/* Colonne droite : LIVE (en haut, + grand) puis CHAT (thème sombre) */}
        <div className="space-y-6">
          <TwitchEmbedCard kind="player" channel="theaubeurre" height={360} />
          <TwitchEmbedCard kind="chat" channel="theaubeurre" height={300} />
        </div>
      </div>

      {/* Retour discret */}
      <div className="mt-6">
        <Link href="/" className="btn">← Retour</Link>
      </div>
    </div>
  );
}
