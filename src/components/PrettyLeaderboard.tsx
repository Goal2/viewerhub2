"use client";

import { useMemo, useState } from "react";

type Item = { name: string; value: number; avatar?: string };

function nf(n: number) {
  try { return new Intl.NumberFormat("fr-FR").format(n); } catch { return String(n); }
}

function medal(rank: number) {
  return rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank;
}

function rankPill(rank: number) {
  if (rank === 1) return "bg-gradient-to-br from-amber-300 to-yellow-500 text-black";
  if (rank === 2) return "bg-gradient-to-br from-zinc-200 to-zinc-400 text-black";
  if (rank === 3) return "bg-gradient-to-br from-orange-600 to-amber-700 text-white";
  return "bg-white/10 text-white/70";
}

function hashHue(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h) % 360;
}

function Avatar({ name, src }: { name: string; src?: string }) {
  if (src) {
    return <img src={src} alt={name} className="h-8 w-8 rounded-full object-cover" />;
  }
  const hue = hashHue(name);
  const bg = `hsl(${hue} 80% 45%)`;
  return (
    <div
      className="h-8 w-8 rounded-full grid place-items-center text-white font-semibold shadow-sm"
      style={{ background: bg }}
      aria-hidden
    >
      {name.trim().charAt(0).toUpperCase()}
    </div>
  );
}

export default function PrettyLeaderboard({
  title,
  unit,
  items,
  accent = "#9146ff", // violet Twitch par défaut
  subtitle,
}: {
  title: string;
  unit: string;
  items: Item[];
  subtitle?: string;
  accent?: string;
}) {
  const [q, setQ] = useState("");
  const max = Math.max(1, ...items.map((i) => i.value));
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? items.filter((i) => i.name.toLowerCase().includes(s)) : items;
  }, [q, items]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0c0d12]/70 backdrop-blur-sm">
      {/* fine gradient border */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          border: "1px solid transparent",
          background:
            "linear-gradient(#ffffff10,#ffffff10) padding-box,linear-gradient(130deg,rgba(255,255,255,.15),rgba(145,70,255,.35)) border-box",
        }}
      />
      <div className="relative p-4">
        <div className="flex items-center gap-3">
          <div
            className="h-9 w-9 rounded-xl grid place-items-center text-white/90"
            style={{ background: `${accent}30` }}
          >
            {/* petite icône “éclair” */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
            </svg>
          </div>
          <div>
            <div className="font-semibold">{title}</div>
            {subtitle && <div className="text-xs text-white/60">{subtitle}</div>}
          </div>
          <div className="ml-auto">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher…"
              className="text-sm rounded-lg bg-white/5 border border-white/15 px-3 py-1.5 outline-none focus:border-white/30"
            />
          </div>
        </div>

        <ul className="mt-3 divide-y divide-white/10">
          {filtered.map((i, idx) => {
            const pct = Math.max(4, Math.round((i.value / max) * 100));
            return (
              <li
                key={i.name + idx}
                className="relative p-3 rounded-xl hover:bg-white/[.04] transition-colors"
              >
                {/* progress subtil en arrière-plan */}
                <div
                  className="absolute left-0 top-0 h-full rounded-xl opacity-20"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${accent}40, transparent 80%)`,
                  }}
                />
                <div className="relative flex items-center gap-3">
                  <div
                    className={`min-w-10 h-8 px-2 grid place-items-center rounded-full text-sm font-semibold ${rankPill(
                      idx + 1
                    )}`}
                    title={`Rang ${idx + 1}`}
                  >
                    {typeof medal(idx + 1) === "number" ? `#${idx + 1}` : medal(idx + 1)}
                  </div>
                  <Avatar name={i.name} />
                  <div className="flex-1 truncate font-medium">{i.name}</div>
                  <div className="text-white/80 font-semibold tabular-nums">
                    {nf(i.value)} {unit}
                  </div>
                </div>
              </li>
            );
          })}
          {filtered.length === 0 && (
            <li className="p-4 text-sm text-white/60">Aucune donnée.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
