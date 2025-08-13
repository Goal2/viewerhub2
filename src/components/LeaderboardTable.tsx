"use client";
import { useMemo, useState } from "react";

type Item = { name: string; value: number };
const nf = new Intl.NumberFormat("fr-FR");

function medal(n: number) {
  return n === 1 ? "🥇" : n === 2 ? "🥈" : n === 3 ? "🥉" : n;
}

export default function LeaderboardTable({
  title,
  unit,            // "msgs", "€", "mois"
  items,
  placeholder = "Rechercher un viewer...",
}: {
  title: string;
  unit: string;
  items: Item[];
  placeholder?: string;
}) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return !s ? items : items.filter((i) => i.name.toLowerCase().includes(s));
  }, [q, items]);

  const max = Math.max(1, ...items.map((i) => i.value));

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
      <div className="px-5 py-4 flex flex-wrap items-center gap-3 border-b border-white/10">
        <div className="text-lg font-semibold">{title}</div>
        <div className="ml-auto relative">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={placeholder}
            className="rounded-xl bg-black/30 border border-white/15 px-3 py-2 text-sm outline-none focus:border-white/30"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-6 text-white/70 text-sm">
          Aucune donnée pour le moment. Essaie plus tard ou désactive le filtre.
        </div>
      ) : (
        <ul className="divide-y divide-white/10">
          {filtered.map((i, idx) => {
            const pct = Math.max(2, Math.round((i.value / max) * 100));
            return (
              <li key={i.name} className="px-5 py-3 hover:bg-white/[.04] transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 text-center font-semibold">{medal(idx + 1)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="truncate font-medium">{i.name}</div>
                      <div className="text-white/70 text-sm">{nf.format(i.value)} {unit}</div>
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
