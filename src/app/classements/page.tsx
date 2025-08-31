// src/app/classements/page.tsx
"use client";

import useSWR from "swr";
import { useMemo, useState } from "react";
import MiniTrend from "@/components/MiniTrend";

// --------- helpers ----------
const fetcher = (u: string) => fetch(u).then((r) => r.json());
const nf = new Intl.NumberFormat("fr-FR");
const medal = (n: number) => (n === 1 ? "🥇" : n === 2 ? "🥈" : n === 3 ? "🥉" : "◦");

type Item = { name: string; value: number };
type Lb = { topChatters: Item[]; topDonors: Item[]; topSubs: Item[] };

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
    return { date, messages: Math.floor(40 + Math.random() * 120) };
  }),
};

// ---------- UI blocks ----------
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={
        "rounded-2xl border border-white/10 bg-white/[.03] backdrop-blur-sm " +
        "shadow-[0_0_0_1px_rgba(255,255,255,.02)_inset,0_40px_120px_-40px_rgba(0,0,0,.4)] " +
        className
      }
    >
      {children}
    </div>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <Card className="p-5">
      <div className="text-[10px] uppercase tracking-[.14em] text-white/55">{label}</div>
      <div className="mt-2 text-3xl font-semibold">{value}</div>
    </Card>
  );
}

// — Stream status + mini viewer (fenêtre) —
function StreamCard({ channel = "theaubeurre" }: { channel?: string }) {
  const { data } = useSWR<{ live: boolean; title?: string; viewer_count?: number }>(
    `/api/twitch/stream?user_login=${channel}`,
    fetcher,
    { refreshInterval: 30000 }
  );

  const parent =
    process.env.NEXT_PUBLIC_TWITCH_PARENT ||
    (typeof window !== "undefined" ? window.location.hostname : "localhost");

  const embedUrl = `https://player.twitch.tv/?channel=${channel}&parent=${parent}&muted=true&autoplay=true`;

  const pill = (
    <span
      className={
        "inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs " +
        (data?.live
          ? "bg-green-500/15 text-green-300"
          : "bg-white/10 text-white/70")
      }
    >
      <span className={"h-2 w-2 rounded-full " + (data?.live ? "bg-green-400" : "bg-white/40")} />
      {data?.live ? "En ligne" : "Hors ligne"}
    </span>
  );

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="font-medium">Stream <span className="text-white/70">@{channel}</span></div>
        {pill}
      </div>

      {/* Fenêtre : iframe si possible, sinon note + bouton d’ouverture */}
      <div className="overflow-hidden rounded-xl border border-white/10 bg-black/50">
        <iframe
          key={embedUrl}
          src={embedUrl}
          height={220}
          className="h-[220px] w-full"
          allowFullScreen
        />
      </div>

      {!data?.live && (
        <div className="mt-3 text-xs text-white/60">
          Hors ligne pour le moment.
        </div>
      )}
    </Card>
  );
}

// — Top list (sobre)
function TopList({
  title,
  items,
  unit,
  withSearch,
}: {
  title: string;
  items: Item[];
  unit: string;
  withSearch?: boolean;
}) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return !s ? items : items.filter((i) => i.name.toLowerCase().includes(s));
  }, [q, items]);

  const max = Math.max(1, ...items.map((i) => i.value));

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center gap-3">
        <div className="text-sm font-semibold">{title}</div>
        {withSearch && (
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher…"
            className="ml-auto rounded-xl bg-black/30 px-3 py-1.5 text-sm outline-none ring-1 ring-white/10 focus:ring-white/20"
          />
        )}
      </div>

      <ul className="space-y-2">
        {filtered.map((i, idx) => {
          const pct = Math.max(3, Math.round((i.value / max) * 100));
          return (
            <li
              key={i.name}
              className="rounded-xl border border-white/5 bg-white/[.02] p-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 text-center">{medal(idx + 1)}</div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="truncate">{i.name}</div>
                    <div className="text-xs text-white/60">
                      {nf.format(i.value)} {unit}
                    </div>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#9146ff] via-[#7c4dff] to-[#22d3ee]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

// --------- page ----------
export default function ClassementsPage() {
  // données leaderboard (toujours fallback sur MOCK_)
  const { data } = useSWR<Lb>("/api/leaderboards?mock=1", fetcher, { refreshInterval: 20000 });
  const lb = data ?? MOCK_LB;

  const { data: me } = useSWR("/api/stats/me?mock=1", fetcher, { refreshInterval: 20000 });
  const my = me ?? { daily: MOCK_ME.daily };

  const total14 = nf.format(lb.topChatters.reduce((a, b) => a + b.value, 0));
  const avgPerDay = nf.format(Math.round(lb.topChatters.reduce((a, b) => a + b.value, 0) / 14));

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Classements</h1>
        <p className="text-white/70">
          Live + chat visibles, classements en temps quasi réel, style Twitch — avec mini-lecteur pour ne rien louper.
        </p>
      </header>

      {/* ligne métriques + stream */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <MetricCard label="TOTAL 14 JOURS" value={`${total14} msgs`} />
        <MetricCard label="MOYENNE / JOUR" value={`${avgPerDay} msgs`} />
        <StreamCard channel="theaubeurre" />
      </div>

      {/* ligne contenu : top + courbe (garde TA courbe intacte) */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          <TopList title="Top chatters" items={lb.topChatters} unit="msgs" withSearch />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <TopList title="Top dons (tips)" items={lb.topDonors} unit="€" />
            <TopList title="Top subs (mois)" items={lb.topSubs} unit="mois" />
          </div>
        </div>

        <Card className="p-4">
          <div className="mb-2 text-sm font-semibold">
            Tendance 14 jours
            <span className="ml-2 text-xs font-normal text-white/50">Activité du chat (mock)</span>
          </div>
          {my?.daily && <MiniTrend data={my.daily} height={240} />}
        </Card>
      </div>
    </div>
  );
}
