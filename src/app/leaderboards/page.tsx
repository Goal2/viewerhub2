// src/app/leaderboards/page.tsx
"use client";

import useSWR from "swr";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import LiveDock from "@/components/LiveDock";
import MiniTrend from "@/components/MiniTrend";

type Item = { name: string; value: number };
type Lb = { topChatters: Item[]; topDonors: Item[]; topSubs: Item[] };

const fetcher = (u: string) => fetch(u).then((r) => r.json());
const nf = new Intl.NumberFormat("fr-FR");

/** Bouton Retour intégré */
function BackButton({ href = "/" }: { href?: string }) {
  const router = useRouter();
  return (
    <button
      onClick={() => (href ? router.push(href) : router.back())}
      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
      aria-label="Retour"
    >
      <ArrowLeft className="h-4 w-4" />
      <span>Retour</span>
    </button>
  );
}

function SideDecor() {
  return (
    <>
      <div className="pointer-events-none fixed inset-y-0 left-0 w-[22vw] bg-gradient-to-r from-[#7c3aed20] via-transparent to-transparent blur-2xl" />
      <div className="pointer-events-none fixed inset-y-0 right-0 w-[22vw] bg-gradient-to-l from-[#06b6d420] via-transparent to-transparent blur-2xl" />
    </>
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
    <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
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
        <div className="p-6 text-white/70 text-sm">
          Aucune donnée pour le moment.
        </div>
      ) : (
        <ul className="divide-y divide-white/10">
          {filtered.map((i, idx) => {
            const pct = Math.max(2, Math.round((i.value / max) * 100));
            return (
              <li key={i.name} className="px-5 py-3 hover:bg-white/[.04] transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 text-center font-semibold">
                    {medal(idx + 1)}
                  </div>
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

const MOCK_LB: Lb = {
  topChatters: [
    { name: "alpha", value: 1243 },
    { name: "beta", value: 996 },
    { name: "gamma", value: 842 },
    { name: "delta", value: 701 },
    { name: "epona", value: 560 },
    { name: "mika", value: 420 },
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
  // IMPORTANT: on force le mock ici
  const { data, isLoading } = useSWR<Lb>(
    "/api/leaderboards?mock=1",
    fetcher,
    { refreshInterval: 20000 }
  );
  const { data: me } = useSWR("/api/stats/me?mock=1", fetcher, {
    refreshInterval: 20000,
  });

  const lb = data ?? MOCK_LB; // fallback si API vide
  const my = me ?? MOCK_ME;

  const [tab, setTab] = useState<"chat" | "tips" | "subs">("chat");

  return (
    <div className="relative">
      <SideDecor />

      {/* Header container */}
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="flex items-center justify-between gap-3 py-6">
          <BackButton href="/" />
          <div className="text-right">
            <h1 className="text-3xl font-bold tracking-tight">Classements</h1>
            <p className="text-white/70 text-sm">
              Messages, dons et mois de sub — en temps quasi réel.
            </p>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-3 gap-2 max-w-md ml-auto">
          <button
            onClick={() => setTab("chat")}
            className={`px-3 py-1.5 rounded-xl border ${
              tab === "chat"
                ? "bg-white/15 border-white/20"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            Top chatters
          </button>
          <button
            onClick={() => setTab("tips")}
            className={`px-3 py-1.5 rounded-xl border ${
              tab === "tips"
                ? "bg-white/15 border-white/20"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            Top dons (tips)
          </button>
          <button
            onClick={() => setTab("subs")}
            className={`px-3 py-1.5 rounded-xl border ${
              tab === "subs"
                ? "bg-white/15 border-white/20"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            Top subs (mois)
          </button>
        </div>
      </div>

      {/* Contenu principal container */}
      <div className="mx-auto w-full max-w-6xl px-4 pb-12">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* bloc principal tableau */}
          <div className="lg:col-span-2">
            {isLoading && !data ? (
              <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-white/70">
                Chargement…
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>

          {/* colonne droite : live + chat + mini-graph + cartes */}
          <div className="space-y-6">
            <LiveDock channel="theaubeurre" playerHeight={220} chatHeight={320} />
            {my?.daily && <MiniTrend data={my.daily} height={160} />}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="font-semibold mb-1">Astuce</div>
              <p className="text-sm text-white/70">
                Connecte-toi pour voir ton rang exact et tes stats personnelles.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton retour flottant sur mobile */}
      <div className="md:hidden fixed bottom-5 left-5 z-40">
        <BackButton href="/" />
      </div>
    </div>
  );
}
