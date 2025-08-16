"use client";

import useSWR from "swr";
import Link from "next/link";
import { useMemo, useState } from "react";
import LiveDock from "@/components/LiveDock";
import MiniTrend from "@/components/MiniTrend";

type Item = { name: string; value: number };
type Lb = { topChatters: Item[]; topDonors: Item[]; topSubs: Item[] };

const fetcher = (u: string) => fetch(u).then((r) => r.json());
const nf = new Intl.NumberFormat("fr-FR");

function Avatar({ name }: { name: string }) {
  const url = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(name)}`;
  return <img src={url} alt={name} className="size-8 shrink-0 rounded-full ring-1 ring-white/10" />;
}

function Medal({ i }: { i: number }) {
  return <span className="mr-1">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "•"}</span>;
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
    return s ? items.filter((i) => i.name.toLowerCase().includes(s)) : items;
  }, [q, items]);
  const max = Math.max(1, ...items.map((i) => i.value));

  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md overflow-hidden">
      <div className="px-4 sm:px-5 py-4 flex items-center gap-3 border-b border-white/10">
        <div className="text-base sm:text-lg font-semibold">{title}</div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher…"
          className="ml-auto w-[180px] sm:w-[220px] rounded-xl bg-black/30 border border-white/15 px-3 py-2 text-sm outline-none focus:border-white/30"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="p-6 text-white/70 text-sm">Aucune donnée.</div>
      ) : (
        <ul className="divide-y divide-white/10">
          {filtered.map((i, idx) => {
            const pct = Math.max(3, Math.round((i.value / max) * 100));
            return (
              <li key={i.name + idx} className="px-4 sm:px-5 py-3 hover:bg-white/5 transition">
                <div className="flex items-center gap-3">
                  <Medal i={idx} />
                  <Avatar name={i.name} />
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

const TABS: { id: "chat" | "tips" | "subs"; label: string; unit: string }[] = [
  { id: "chat", label: "Top chatters", unit: "msgs" },
  { id: "tips", label: "Top dons (tips)", unit: "€" },
  { id: "subs", label: "Top subs (mois)", unit: "mois" },
];

export default function ClassementsPage() {
  const { data } = useSWR<Lb>("/api/leaderboards?mock=1", fetcher, { refreshInterval: 20000 });
  const { data: me } = useSWR("/api/stats/me?mock=1", fetcher, { refreshInterval: 20000 });

  const lb: Lb =
    data ?? ({
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
    } as Lb);

  const daily = me?.daily;

  const [tab, setTab] = useState<"chat" | "tips" | "subs">("chat");
  const active = tab === "chat" ? lb.topChatters : tab === "tips" ? lb.topDonors : lb.topSubs;
  const unit = TABS.find((t) => t.id === tab)!.unit;

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-twitch text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-halos" />

      <header className="flex items-center gap-3 px-4 sm:px-6 py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-3 py-1.5 text-sm hover:bg-white/5"
        >
          ← Retour
        </Link>
        <h1 className="ml-2 text-2xl sm:text-3xl font-bold">Classements</h1>
        <p className="ml-auto text-sm text-white/70 hidden sm:block">
          Messages, dons & mois de sub — en temps quasi réel.
        </p>
      </header>

      <main className="px-4 sm:px-6 pb-6">
        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100dvh-96px)]">
          <section className="lg:col-span-2 flex flex-col gap-6 h-full">
            <div className="rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="font-semibold">Tendance 14 jours</div>
                <div className="text-xs text-white/60">(activité du chat)</div>
              </div>
              <div className="h-[160px] sm:h-[190px]">
                {daily ? (
                  <MiniTrend data={daily} height={160} />
                ) : (
                  <div className="grid place-items-center h-full text-white/60 text-sm">
                    Chargement…
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={[
                    "rounded-xl border px-3 py-2 text-sm",
                    tab === t.id
                      ? "bg-white/15 border-white/25"
                      : "bg-white/5 border-white/10 hover:bg-white/10",
                  ].join(" ")}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-auto rounded-2xl">
                <LeaderboardTable
                  title={TABS.find((t) => t.id === tab)!.label}
                  unit={unit}
                  items={active}
                />
              </div>
            </div>
          </section>

          <aside className="h-full overflow-hidden">
            <div className="rounded-2xl h-full bg-white/[0.04] border border-white/10 backdrop-blur-md p-3 sm:p-4">
              <LiveDock channel="theaubeurre" playerHeight={240} chatHeight={360} />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
