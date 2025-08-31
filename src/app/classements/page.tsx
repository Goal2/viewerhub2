// src/app/classements/page.tsx
"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import MiniTrend from "@/components/MiniTrend";
import StreamInlinePill from "@/components/StreamInlinePill";

type Item = { name: string; value: number };
type Lb = { topChatters: Item[]; topDonors: Item[]; topSubs: Item[] };

const fetcher = (u: string) => fetch(u).then((r) => r.json());
const nf = new Intl.NumberFormat("fr-FR");

function medal(n: number) {
  return n === 1 ? "🥇" : n === 2 ? "🥈" : n === 3 ? "🥉" : n;
}

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
    <div className="rounded-xl border border-white/10 bg-black/30 backdrop-blur-sm">
      <div className="flex items-center gap-4 border-b border-white/10 px-4 py-3">
        <h3 className="text-base font-semibold">{title}</h3>
        <div className="ml-auto w-64">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher..."
            className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-white/20"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="px-4 py-6 text-sm text-white/70">
          Aucune donnée pour le moment.
        </div>
      ) : (
        <ul className="divide-y divide-white/10">
          {filtered.map((i, idx) => {
            const pct = Math.max(2, Math.round((i.value / max) * 100));
            return (
              <li
                key={i.name}
                className="px-4 py-3 transition hover:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 text-center text-lg">{medal(idx + 1)}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="truncate font-medium">{i.name}</div>
                      <div className="text-sm text-white/70">
                        {nf.format(i.value)} {unit}
                      </div>
                    </div>
                    <div className="mt-2 h-2 rounded bg-white/10">
                      <div
                        className="h-2 rounded bg-gradient-to-r from-[#9146ff] via-[#7c4dff] to-[#22d3ee]"
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

/** Données mock pour fallback si API vide */
const MOCK_LB: Lb = {
  topChatters: [
    { name: "poneytv", value: 12931 },
    { name: "alice__", value: 11002 },
    { name: "bobinator", value: 9988 },
  ],
  topDonors: [
    { name: "superfan", value: 180 },
    { name: "natsu", value: 120 },
    { name: "sora", value: 95 },
  ],
  topSubs: [
    { name: "neo", value: 36 },
    { name: "jin", value: 20 },
    { name: "ayan", value: 14 },
  ],
};

const MOCK_ME = {
  daily: Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const date = d.toISOString().slice(0, 10);
    return { date, messages: Math.floor(30 + Math.random() * 120) };
  }),
};

export default function ClassementsPage() {
  // On garde ton rafraîchissement léger et les endpoints mock existants
  const { data } = useSWR<Lb>("/api/leaderboards?mock=1", fetcher, {
    refreshInterval: 20_000,
  });
  const { data: me } = useSWR("/api/stats/me?mock=1", fetcher, {
    refreshInterval: 20_000,
  });

  const lb = data ?? MOCK_LB;
  const my = me ?? MOCK_ME;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      {/* ====== HEADER (titre + tabs à gauche, stream en haut à droite) ====== */}
      <header className="relative mb-6">
        <div className="grid grid-cols-12 items-start gap-4">
          {/* Col gauche : titre, sous-titre, tabs */}
          <div className="col-span-12 md:col-span-8">
            <h1 className="text-3xl md:text-4xl font-bold">Classements</h1>
            <p className="mt-1 text-slate-300">
              Live + chat visibles, classements en temps quasi réel, style Twitch — avec
              mini-lecteur flottant pour ne rien louper.
            </p>

            {/* Tes onglets — tu peux styliser/activer selon l’onglet courant */}
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <button className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-200 hover:bg-white/10">
                Top chatters
              </button>
              <button className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-200 hover:bg-white/10">
                Top dons (tips)
              </button>
              <button className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-200 hover:bg-white/10">
                Top subs (mois)
              </button>
            </div>
          </div>

          {/* Col droite : statut stream en haut */}
          <div className="col-span-12 md:col-span-4 md:mt-0 mt-4">
            <StreamInlinePill channel="theaubeurre" />
          </div>
        </div>
      </header>

      {/* ====== CONTENU ====== */}
      <div className="grid grid-cols-12 gap-6">
        {/* Liste à gauche */}
        <div className="col-span-12 md:col-span-7">
          <LeaderboardTable
            title="Top chatters"
            unit="msgs"
            items={lb.topChatters}
          />
        </div>

        {/* Graphique à droite (on ne touche pas) */}
        <div className="col-span-12 md:col-span-5">
          <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-300 backdrop-blur-sm">
            <div className="mb-2 flex items-center justify-between">
              <div className="font-semibold">Tendance 14 jours</div>
              <div className="text-xs text-white/60">Activité du chat (mock)</div>
            </div>
            {my?.daily ? (
              <MiniTrend data={my.daily} height={220} />
            ) : (
              <div className="py-16 text-center text-white/60">Chargement…</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
