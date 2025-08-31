"use client";

import useSWR from "swr";
import { useMemo, useState } from "react";

type Item = { name: string; value: number };
type Lb = { topChatters: Item[]; topDonors: Item[]; topSubs: Item[] };

const fetcher = (u: string) => fetch(u).then((r) => r.json());
const nf = new Intl.NumberFormat("fr-FR");

/* ---------- mini chart (identique visuel base) ---------- */
const TREND = [13, 7, 12, 4, 10, 8, 11, 6, 9];

function TrendCard() {
  const pad = 20,
    width = 520,
    height = 260;
  const w = width - pad * 2;
  const h = height - pad * 2;

  const pts = useMemo(() => {
    const max = Math.max(...TREND, 1);
    const step = w / Math.max(TREND.length - 1, 1);
    return TREND.map((v, i) => ({
      x: pad + i * step,
      y: pad + h - (v / max) * h,
    }));
  }, [w, h]);

  const d = useMemo(() => {
    if (pts.length < 2) return "";
    const out: string[] = [];
    pts.forEach((p, i) => {
      if (!i) out.push(`M ${p.x},${p.y}`);
      else {
        const p0 = pts[i - 1];
        const cx1 = p0.x + (p.x - p0.x) / 2;
        const cy1 = p0.y;
        const cx2 = p0.x + (p.x - p0.x) / 2;
        const cy2 = p.y;
        out.push(`C ${cx1},${cy1} ${cx2},${cy2} ${p.x},${p.y}`);
      }
    });
    return out.join(" ");
  }, [pts]);

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="mb-2 flex items-end justify-between">
        <div className="text-sm font-medium">Tendance 14 jours</div>
        <div className="text-xs text-white/50">Activité du chat (mock)</div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[240px]">
        <defs>
          <linearGradient id="gLine" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
          <linearGradient id="gFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.03" />
          </linearGradient>
          <linearGradient id="gGrid" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <g opacity={0.25}>
          {[0, 1, 2, 3].map((i) => (
            <line
              key={`h${i}`}
              x1={pad}
              x2={width - pad}
              y1={pad + ((height - pad * 2) / 4) * i}
              y2={pad + ((height - pad * 2) / 4) * i}
              stroke="url(#gGrid)"
            />
          ))}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line
              key={`v${i}`}
              y1={pad}
              y2={height - pad}
              x1={pad + ((width - pad * 2) / 5) * i}
              x2={pad + ((width - pad * 2) / 5) * i}
              stroke="url(#gGrid)"
            />
          ))}
        </g>
        <path
          d={`${d} L ${width - pad},${height - pad} L ${pad},${height - pad} Z`}
          fill="url(#gFill)"
        />
        <path d={d} fill="none" stroke="url(#gLine)" strokeWidth={3} />
      </svg>
    </div>
  );
}

/* ---------- live card compacte ---------- */
function LiveCardCompact() {
  const { data } = useSWR<{ online: boolean; title?: string; game?: string }>(
    "/api/twitch/stream?channel=theaubeurre",
    fetcher,
    { refreshInterval: 30000 }
  );
  const parent =
    process.env.NEXT_PUBLIC_TWITCH_PARENT || "viewerhub2.vercel.app";
  const online = data?.online;

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="text-sm font-medium">Stream @theaubeurre</div>
        <div className="text-[11px] flex items-center gap-2 text-white/70">
          <span
            className={`inline-block h-2.5 w-2.5 rounded-full ${
              online ? "bg-emerald-400" : "bg-slate-400"
            }`}
          />
          {online ? "En ligne" : "Hors ligne"}
        </div>
      </div>
      <div className="p-3">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-900">
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://player.twitch.tv/?channel=theaubeurre&parent=${parent}&muted=true&autoplay=true`}
            allow="autoplay; picture-in-picture; encrypted-media"
            allowFullScreen
          />
        </div>
        {data?.title && (
          <div className="mt-2 line-clamp-1 text-xs text-white/70">
            {data.title}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- listes compactes ---------- */
function CompactList({
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
    return s ? items.filter((i) => i.name.toLowerCase().includes(s)) : items;
  }, [q, items]);
  const max = Math.max(1, ...items.map((i) => i.value));

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30">
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10">
        <div className="text-sm font-medium">{title}</div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher…"
          className="w-48 rounded-lg bg-black/30 px-3 py-1.5 text-sm outline-none border border-white/10 focus:border-white/30"
        />
      </div>
      <ul className="p-2">
        {filtered.map((i, idx) => {
          const pct = Math.max(2, Math.round((i.value / max) * 100));
          return (
            <li
              key={i.name}
              className="rounded-md px-3 py-2 hover:bg-white/[.04] transition"
            >
              <div className="flex items-center justify-between text-sm">
                <div className="truncate">
                  <span className="mr-2 text-white/60">#{idx + 1}</span>
                  {i.name}
                </div>
                <div className="text-white/60">
                  {nf.format(i.value)} {unit}
                </div>
              </div>
              <div className="mt-1.5 h-1.5 rounded bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded bg-gradient-to-r from-[#8b5cf6] to-[#22d3ee]"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          );
        })}
        {filtered.length === 0 && (
          <li className="px-3 py-2 text-sm text-white/60">Aucun résultat.</li>
        )}
      </ul>
    </div>
  );
}

/* ---------- données mock fallback ---------- */
const MOCK_LB: Lb = {
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

/* ---------- page ---------- */
export default function ClassementsPage() {
  const { data } = useSWR<Lb>("/api/leaderboards?mock=1", fetcher, {
    refreshInterval: 20000,
  });
  const lb = data ?? MOCK_LB;

  const total14 = lb.topChatters.reduce((a, b) => a + b.value, 0);
  const avg = Math.round(total14 / 14);

  return (
    <main className="mx-auto max-w-7xl px-5 sm:px-6 md:px-8 py-8 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Classements</h1>

      {/* bandeau KPI + live compact */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <div className="lg:col-span-4 rounded-2xl border border-white/10 bg-black/30 p-5">
          <div className="text-xs tracking-widest text-white/60">
            TOTAL 14 JOURS
          </div>
          <div className="mt-2 text-3xl font-semibold">{nf.format(total14)} msgs</div>
        </div>
        <div className="lg:col-span-4 rounded-2xl border border-white/10 bg-black/30 p-5">
          <div className="text-xs tracking-widest text-white/60">
            MOYENNE / JOUR
          </div>
          <div className="mt-2 text-3xl font-semibold">{nf.format(avg)} msgs</div>
        </div>
        <div className="lg:col-span-4">
          <LiveCardCompact />
        </div>
      </div>

      {/* grilles : listes + tendance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <CompactList title="Top chatters" unit="msgs" items={lb.topChatters} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CompactList title="Top dons (tips)" unit="€" items={lb.topDonors} />
            <CompactList title="Top subs (mois)" unit="mois" items={lb.topSubs} />
          </div>
        </div>

        <div className="lg:col-span-5">
          <TrendCard />
        </div>
      </div>
    </main>
  );
}
