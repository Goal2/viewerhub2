"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import LiveDock from "@/components/LiveDock";
import MiniTrend from "@/components/MiniTrend";

type Item = { name: string; value: number };
type Lb = { topChatters: Item[]; topDonors: Item[]; topSubs: Item[] };

const fetcher = (u: string) => fetch(u).then((r) => r.json());
const nf = new Intl.NumberFormat("fr-FR");

// --- Décor de fond (blobs + grille LED) ---------------------------
function LedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Blobs doux */}
      <div className="absolute inset-0 bg-blobs opacity-70" />
      {/* Grille LED */}
      <div className="absolute inset-0 led-grid" />
    </div>
  );
}

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
    <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden h-full flex flex-col">
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

      <ul className="divide-y divide-white/10 overflow-auto">
        {filtered.map((i, idx) => {
          const pct = Math.max(2, Math.round((i.value / max) * 100));
          return (
            <li key={i.name} className="px-5 py-3 hover:bg-white/[.04] transition">
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

// --- Données de secours (mock) ---------------------------
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

export default function LeaderboardsPage() {
  // force mock pour prod tant que l’API n’est pas branchée
  const { data } = useSWR<Lb>("/api/leaderboards?mock=1", fetcher, {
    refreshInterval: 20000,
  });
  const { data: me } = useSWR("/api/stats/me?mock=1", fetcher, {
    refreshInterval: 20000,
  });

  const lb = data ?? MOCK_LB;
  const my = me ?? MOCK_ME;

  const [tab, setTab] = useState<"chat" | "tips" | "subs">("chat");

  return (
    <div className="relative h-screen overflow-hidden">
      <LedBackground />

      {/* Barre du haut */}
      <div className="px-6 pt-6 flex items-center gap-3">
        <a
          href="/"
          className="px-3 py-1.5 rounded-xl border bg-white/5 border-white/10 hover:bg-white/10"
        >
          ← Retour
        </a>

        {/* Onglets / nav à gauche */}
        <div className="ml-2">
          <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-sm">
            Classements
          </span>
        </div>

        {/* Titre à droite, comme tu voulais */}
        <div className="ml-auto text-right">
          <h1 className="text-3xl font-extrabold">Classements</h1>
          <p className="text-white/70 text-sm">
            Messages, dons et mois de sub — en temps quasi réel.
          </p>
        </div>
      </div>

      {/* Boutons de tri (sous le header) */}
      <div className="px-6 mt-4 flex gap-3">
        <button
          onClick={() => setTab("chat")}
          className={`px-4 py-2 rounded-xl border ${
            tab === "chat"
              ? "bg-white/15 border-white/20"
              : "bg-white/5 border-white/10 hover:bg-white/10"
          }`}
        >
          Top chatters
        </button>
        <button
          onClick={() => setTab("tips")}
          className={`px-4 py-2 rounded-xl border ${
            tab === "tips"
              ? "bg-white/15 border-white/20"
              : "bg-white/5 border-white/10 hover:bg-white/10"
          }`}
        >
          Top dons (tips)
        </button>
        <button
          onClick={() => setTab("subs")}
          className={`px-4 py-2 rounded-xl border ${
            tab === "subs"
              ? "bg-white/15 border-white/20"
              : "bg-white/5 border-white/10 hover:bg-white/10"
          }`}
        >
          Top subs (mois)
        </button>
      </div>

      {/* Grille principale : 2 colonnes (gauche tableau, droite graph+live+chat) */}
      <div className="px-6 mt-4 grid grid-cols-[1.6fr,1fr] gap-6 h-[calc(100vh-160px)]">
        {/* Colonne gauche : tableau, hauteur calée à l’écran */}
        <div className="h-full">
          {tab === "chat" && (
            <LeaderboardTable
              title="Top chatters"
              unit="msgs"
              items={lb.topChatters}
            />
          )}
          {tab === "tips" && (
            <LeaderboardTable
              title="Top dons (tips)"
              unit="€"
              items={lb.topDonors}
            />
          )}
          {tab === "subs" && (
            <LeaderboardTable
              title="Top subs"
              unit="mois"
              items={lb.topSubs}
            />
          )}
        </div>

        {/* Colonne droite */}
        <div className="h-full grid grid-rows-[auto,1fr] gap-6">
          {/* 1) Mini-graph à gauche + Live à droite */}
          <div className="grid grid-cols-2 gap-6">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="font-semibold mb-2">Tendance 14 jours</div>
              <MiniTrend data={my.daily} height={180} />
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <LiveDock channel="theaubeurre" playerHeight={200} chatHeight={0} />
            </div>
          </div>

          {/* 2) Chat en dessous, toute la largeur de la colonne droite */}
          <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
            <div className="px-4 py-3 font-semibold border-b border-white/10">
              Chat
            </div>
            <div className="h-full">
              {/* on réutilise LiveDock uniquement pour la zone chat si tu veux un vrai chat twitch
                  Sinon garde ceci comme placeholder statique */}
              <div className="px-4 py-6 text-sm text-white/60">
                En attente de messages…
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
