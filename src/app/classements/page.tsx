// src/app/classements/page.tsx
"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  Tooltip,
} from "recharts";

const fetcher = (u: string) => fetch(u).then((r) => r.json());
const nf = new Intl.NumberFormat("fr-FR");

// ---------- Fond Halos ----------
function GlowField() {
  const glows = [
    { x: "-12%", y: "-18%", size: 420, from: "#7c3aed35", to: "#22d3ee22" },
    { x: "68%", y: "-8%", size: 520, from: "#22d3ee30", to: "#a855f722" },
    { x: "40%", y: "62%", size: 620, from: "#9146ff22", to: "#22d3ee18" },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {glows.map((g, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            left: g.x,
            top: g.y,
            width: g.size,
            height: g.size,
            background: `radial-gradient(circle at 30% 30%, ${g.from}, ${g.to})`,
          }}
          animate={{
            x: ["-2%", "2%", "-1%"],
            y: ["-2%", "3%", "-2%"],
            scale: [1, 1.06, 1],
          }}
          transition={{ duration: 20 + i * 2, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ---------- UI ----------
function StatCard({
  title,
  value,
  subtitle,
}: { title: string; value: string; subtitle?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
      <div className="text-xs uppercase tracking-wider text-white/60">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {!!subtitle && <div className="mt-1 text-sm text-white/60">{subtitle}</div>}
    </div>
  );
}

function LiveBadge({ live, viewers }: { live: boolean; viewers?: number }) {
  if (!live) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
        <span className="h-2 w-2 rounded-full bg-white/40" />
        Hors ligne
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-rose-600/80 px-3 py-1 text-xs font-medium">
      <span className="h-2 w-2 rounded-full bg-white" />
      EN DIRECT {typeof viewers === "number" ? `• ${nf.format(viewers)} spect.` : ""}
    </span>
  );
}

function SegmentedTabs({
  value,
  onChange,
}: {
  value: "chat" | "tips" | "subs";
  onChange: (v: "chat" | "tips" | "subs") => void;
}) {
  const tabs: { v: "chat" | "tips" | "subs"; label: string }[] = [
    { v: "chat", label: "Top chatters" },
    { v: "tips", label: "Top dons (tips)" },
    { v: "subs", label: "Top subs (mois)" },
  ];
  return (
    <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1">
      {tabs.map((t) => {
        const active = value === t.v;
        return (
          <button
            key={t.v}
            onClick={() => onChange(t.v)}
            className={`px-4 py-2 text-sm rounded-full transition 
              ${active ? "bg-white/20 shadow-inset font-medium" : "hover:bg-white/10 text-white/80"}`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

// ---------- Données mock ----------
type Item = { name: string; value: number };
type Lb = { topChatters: Item[]; topDonors: Item[]; topSubs: Item[] };

const MOCK: Lb = {
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

const MOCK_TREND = Array.from({ length: 14 }).map((_, i) => {
  const base = 40 + Math.sin(i / 2) * 25 + (Math.random() * 16 - 8);
  return { d: i + 1, v: Math.max(5, Math.round(base)) };
});

function Medal({ n }: { n: number }) {
  return (
    <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-xs">
      {n === 1 ? "🥇" : n === 2 ? "🥈" : n === 3 ? "🥉" : n}
    </span>
  );
}

function Row({ i, max }: { i: Item; max: number }) {
  const pct = Math.max(3, Math.round((i.value / max) * 100));
  return (
    <div className="rounded-xl border border-white/10 bg-white/[.04] p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center">
          <Medal n={0} />
          <span className="font-medium">{i.name}</span>
        </div>
        <div className="text-sm text-white/70">{nf.format(i.value)}</div>
      </div>
      <div className="h-2 overflow-hidden rounded bg-white/10">
        <div
          className="h-full rounded bg-gradient-to-r from-[#9146ff] via-[#7c4dff] to-[#22d3ee]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ---------- Page ----------
export default function ClassementsPage() {
  const [tab, setTab] = useState<"chat" | "tips" | "subs">("chat");

  // live status
  const { data: stream } = useSWR(
    "/api/twitch/stream?user_login=theaubeurre",
    fetcher,
    { refreshInterval: 60_000 }
  );
  const isLive = !!stream?.live;
  const viewers = stream?.viewer_count as number | undefined;

  // leaderboard
  const { data } = useSWR<Lb>("/api/leaderboards?mock=1", fetcher, {
    refreshInterval: 20_000,
  });
  const lb = data ?? MOCK;

  const list =
    tab === "chat" ? lb.topChatters : tab === "tips" ? lb.topDonors : lb.topSubs;
  const max = Math.max(1, ...list.map((x) => x.value));

  const total14 = useMemo(
    () => nf.format((lb.topChatters[0]?.value ?? 0) + 12609), // juste pour la carte démo
    [lb]
  );
  const avgDay = useMemo(
    () => nf.format(Math.round(((lb.topChatters[0]?.value ?? 0) + 12609) / 14)),
    [lb]
  );

  return (
    <main className="relative mx-auto max-w-7xl px-5 py-8">
      <GlowField />

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Classements</h1>
          <p className="text-white/70">
            Live + chat visibles, classements en temps quasi réel, style Twitch — avec mini-lecteur pour ne rien louper.
          </p>
        </div>
        <SegmentedTabs value={tab} onChange={setTab} />
      </div>

      {/* Stat cards */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard title="Total 14 jours" value={`${total14} msgs`} />
        <StatCard title="Moyenne / jour" value={`${avgDay} msgs`} />
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-xs uppercase tracking-wider text-white/60">Stream theaubeurre</div>
            <LiveBadge live={isLive} viewers={viewers} />
          </div>
          <div className="aspect-video overflow-hidden rounded-xl bg-black/60">
            {isLive && stream?.thumbnail_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={stream.thumbnail_url}
                alt="miniature live"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-white/40 text-sm">
                Hors ligne pour le moment
              </div>
            )}
          </div>
          <div className="mt-3 flex gap-2">
            <a
              className="inline-flex flex-1 items-center justify-center rounded-lg bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition"
              href="https://www.twitch.tv/theaubeurre"
              target="_blank"
              rel="noreferrer"
            >
              Ouvrir la chaîne
            </a>
            <a
              className="inline-flex flex-1 items-center justify-center rounded-lg bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition"
              href="https://www.twitch.tv/popout/theaubeurre/chat?popout="
              target="_blank"
              rel="noreferrer"
            >
              Ouvrir le chat
            </a>
          </div>
        </div>
      </div>

      {/* Corps */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Liste */}
        <section className="lg:col-span-2 space-y-3 rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-lg font-semibold">
              {tab === "chat" ? "Top chatters" : tab === "tips" ? "Top dons (tips)" : "Top subs (mois)"}
            </div>
            <input
              placeholder="Rechercher…"
              className="rounded-xl bg-black/30 border border-white/15 px-3 py-2 text-sm outline-none focus:border-white/30"
              onChange={(e) => {
                const s = e.currentTarget.value.toLowerCase();
                const parent = document.getElementById("lb-list");
                if (!parent) return;
                for (const child of Array.from(parent.children)) {
                  const name = (child as HTMLElement).dataset.name ?? "";
                  (child as HTMLElement).style.display = name.includes(s) ? "" : "none";
                }
              }}
            />
          </div>

          <div id="lb-list" className="grid gap-3">
            {list.map((i, idx) => (
              <div key={i.name} data-name={i.name.toLowerCase()}>
                <div className="mb-1 flex items-center gap-2 text-sm text-white/70">
                  <Medal n={idx + 1} />
                  <span className="font-medium text-white/90">{i.name}</span>
                  <span className="ml-auto">{nf.format(i.value)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded bg-white/10">
                  <div
                    className="h-full rounded bg-gradient-to-r from-[#9146ff] via-[#7c4dff] to-[#22d3ee]"
                    style={{ width: `${Math.max(4, Math.round((i.value / max) * 100))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Graphique */}
        <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-semibold text-white/80">Tendance 14 jours</div>
            <div className="text-xs text-white/50">Activité du chat (mock)</div>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_TREND} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradClassements" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{
                    background: "rgba(0,0,0,.7)",
                    border: "1px solid rgba(255,255,255,.1)",
                    borderRadius: 12,
                    color: "white",
                    fontSize: 12,
                  }}
                  labelFormatter={(l) => `Jour ${l}`}
                  formatter={(v) => [`${nf.format(v as number)} msgs`, "Volume"]}
                />
                <Area type="monotone" dataKey="v" stroke="transparent" fill="url(#gradClassements)" />
                <Line type="monotone" dataKey="v" stroke="#a78bfa" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </main>
  );
}
