// src/app/classements/page.tsx
"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, Tooltip } from "recharts";

type Item = { name: string; value: number };
type Lb = { topChatters: Item[]; topDonors: Item[]; topSubs: Item[] };

const fetcher = (u: string) => fetch(u).then(r => r.json());
const nf = new Intl.NumberFormat("fr-FR");

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

const MOCK_TREND = Array.from({ length: 12 }).map((_, i) => ({
  i,
  value: 30 + Math.round(20 * Math.sin(i / 2)) + Math.round(Math.random() * 10),
}));

function RankRow({ i, item, max }: { i: number; item: Item; max: number }) {
  const width = Math.max(6, Math.round((item.value / max) * 100));
  const medals = ["🥇", "🥈", "🥉"];
  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[.03] p-3">
      <div className="flex items-center gap-3">
        <div className="w-8 shrink-0 text-center text-lg">{medals[i] ?? (i + 1)}</div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <div className="truncate font-semibold">{item.name}</div>
            <div className="text-sm text-white/70">{nf.format(item.value)}</div>
          </div>
          <div className="mt-2 h-2 rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#9146ff] via-[#7c4dff] to-[#22d3ee] shadow-[0_0_24px_rgba(145,70,255,.35)] transition-all group-hover:shadow-[0_0_32px_rgba(145,70,255,.6)]"
              style={{ width: `${width}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClassementsPage() {
  const { data } = useSWR<Lb>("/api/leaderboards?mock=1", fetcher, { refreshInterval: 20000 });
  const lb = data ?? MOCK_LB;

  const [tab, setTab] = useState<"chat" | "tips" | "subs">("chat");
  const items = tab === "chat" ? lb.topChatters : tab === "tips" ? lb.topDonors : lb.topSubs;
  const max = Math.max(...items.map(i => i.value), 1);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? items.filter(i => i.name.toLowerCase().includes(s)) : items;
  }, [q, items]);

  return (
    <main className="relative z-10 mx-auto w-full max-w-[1200px] px-6 py-10">
      {/* Titre */}
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold">Classements</h1>
        <p className="text-white/70">
          Live + chat visibles, classements en temps quasi réel, style Twitch — avec mini-lecteur
          flottant pour ne rien louper.
        </p>
      </header>

      {/* Onglets */}
      <div className="pill-tabs mb-6">
        <button className={`pill-tab ${tab === "chat" ? "is-active" : ""}`} onClick={() => setTab("chat")}>Top chatters</button>
        <button className={`pill-tab ${tab === "tips" ? "is-active" : ""}`} onClick={() => setTab("tips")}>Top dons (tips)</button>
        <button className={`pill-tab ${tab === "subs" ? "is-active" : ""}`} onClick={() => setTab("subs")}>Top subs (mois)</button>
      </div>

      <section className="grid gap-6 md:grid-cols-[1.25fr_.9fr]">
        {/* Colonne gauche */}
        <div className="glass card-border p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="text-lg font-semibold">Top {tab === "chat" ? "chatters" : tab === "tips" ? "donateurs" : "subs"}</div>
            <div className="ml-auto">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher…"
                className="rounded-xl bg-black/30 px-3 py-2 text-sm outline-none border border-white/15 focus:border-white/30"
              />
            </div>
          </div>

          <div className="grid gap-3">
            {filtered.map((it, i) => <RankRow key={it.name} i={i} item={it} max={max} />)}
          </div>
        </div>

        {/* Colonne droite : stream + graphe */}
        <div className="grid gap-6">
          {/* Stream card — SANS boutons */}
          <div className="glass card-border p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="font-semibold">STREAM THEAUBEURRE</div>
              <span className="chip-off"><span className="block h-2 w-2 rounded-full bg-white/60" /> Hors ligne</span>
            </div>
            <div className="twitch-embed-dark grid h-[180px] place-items-center text-sm text-white/70">
              Hors ligne pour le moment
            </div>
          </div>

          <div className="glass card-border p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="font-semibold">Tendance 14 jours</div>
              <div className="text-xs text-white/50">Activité du chat (mock)</div>
            </div>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_TREND}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip contentStyle={{ background: "rgba(20,22,28,.9)", border: "1px solid rgba(255,255,255,.1)" }}/>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#a78bfa"
                    strokeWidth={3}
                    dot={{ r: 2 }}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
