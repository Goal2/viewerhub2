// src/app/classements/page.tsx
"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import LiveDock from "@/components/LiveDock";
import MiniTrend from "@/components/MiniTrend";

type Item = { name: string; value: number };
type Lb = { topChatters: Item[]; topDonors: Item[]; topSubs: Item[] };

const fetcher = (u: string) => fetch(u).then((r) => r.json());
const nf = new Intl.NumberFormat("fr-FR");

function Card({ title, children, className = "" }: any) {
  return (
    <div className={`rounded-2xl bg-white/5 border border-white/10 ${className}`}>
      <div className="px-5 py-4 border-b border-white/10 font-semibold">{title}</div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function Leaderboard({
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
  const medal = (n: number) => (n === 1 ? "🥇" : n === 2 ? "🥈" : n === 3 ? "🥉" : n);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher…"
          className="ml-auto rounded-xl bg-black/30 border border-white/15 px-3 py-2 text-sm outline-none focus:border-white/30"
        />
      </div>
      <ul className="divide-y divide-white/10">
        {filtered.map((i, idx) => {
          const pct = Math.max(2, Math.round((i.value / max) * 100));
          return (
            <li key={i.name} className="py-3">
              <div className="flex items-center gap-3">
                <div className="w-7 text-center font-semibold">{medal(idx + 1)}</div>
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
    </div>
  );
}

// --- mocks de secours ------------------------------------------------
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
    return { date, messages: Math.floor(20 + Math.random() * 120) };
  }),
};

// --------------------------------------------------------------------
export default function ClassementsPage() {
  // branchement futur : /api/leaderboards
  const { data } = useSWR<Lb>("/api/leaderboards?mock=1", fetcher, {
    refreshInterval: 20000,
  });
  const { data: me } = useSWR("/api/stats/me?mock=1", fetcher, {
    refreshInterval: 20000,
  });

  const lb = data ?? MOCK_LB;
  const my = me ?? MOCK_ME;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold">Classements</h1>
        <p className="text-white/70">
          Tous les tableaux sont ici (chatters, tips, subs). Pas ailleurs.
        </p>
      </div>

      {/* grille principale */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne 1 : Top chatters */}
        <Card title="Top chatters" className="lg:col-span-2">
          <Leaderboard title="Top chatters" unit="msgs" items={lb.topChatters} />
        </Card>

        {/* Colonne 2 : graph + live */}
        <div className="flex flex-col gap-6">
          <Card title="Tendance 14 jours">
            <MiniTrend data={my.daily} height={180} />
          </Card>
          <Card title="Live">
            <LiveDock channel="theaubeurre" playerHeight={220} chatHeight={0} />
          </Card>
        </div>

        {/* Ligne suivante : Tips + Subs */}
        <Card title="Top dons (tips)" className="lg:col-span-1">
          <Leaderboard title="Top dons (tips)" unit="€" items={lb.topDonors} />
        </Card>
        <Card title="Top subs (mois)" className="lg:col-span-2">
          <Leaderboard title="Top subs (mois)" unit="mois" items={lb.topSubs} />
        </Card>
      </div>
    </section>
  );
}
