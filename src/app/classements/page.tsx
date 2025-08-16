"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import useSWR from "swr";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

/* ------------------------------------------------------------------ */
/* Types & utils                                                       */
/* ------------------------------------------------------------------ */

type Item = { name: string; value: number };
type Lb = { topChatters: Item[]; topDonors: Item[]; topSubs: Item[] };

const fetcher = (u: string) => fetch(u).then((r) => r.json());
const nf = new Intl.NumberFormat("fr-FR");

const PARENT =
  process.env.NEXT_PUBLIC_TWITCH_PARENT?.trim() ||
  (typeof window !== "undefined" ? window.location.hostname : "localhost");

const IS_FIREFOX =
  typeof navigator !== "undefined" &&
  /firefox/i.test(navigator.userAgent || "");

/* ------------------------------------------------------------------ */
/* Décor halo                                                          */
/* ------------------------------------------------------------------ */

function HaloBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="scene-halo absolute -left-40 -top-40 h-[42rem] w-[42rem] rounded-full bg-gradient-to-br from-[#7c3aed] via-[#9146ff] to-[#22d3ee] opacity-[.55]" />
      <div className="scene-halo scene-halo--2 absolute -right-40 top-1/3 h-[40rem] w-[40rem] rounded-full bg-gradient-to-tr from-[#06b6d4] via-[#22d3ee] to-[#7c3aed] opacity-[.42]" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* UI helpers                                                          */
/* ------------------------------------------------------------------ */

function CountUp({ value, duration = 900 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let start = 0;
    const from = 0;
    const to = value;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      const eased = 1 - Math.pow(1 - p, 4);
      const n = Math.round(from + (to - from) * eased);
      el.textContent = nf.format(n);
      if (p < 1) requestAnimationFrame(step);
    };
    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [value, duration]);
  return <span ref={ref} />;
}

function Medal({ rank }: { rank: number }) {
  return (
    <div className="w-10 text-center text-lg">
      {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank}
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const url = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(
    name
  )}&backgroundType=gradientLinear&size=64`;
  return (
    <img
      src={url}
      alt={name}
      className="h-8 w-8 rounded-full ring-2 ring-white/15 bg-white/5"
      loading="lazy"
    />
  );
}

function KpiCard({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div className="card glass">
      <div className="p-5">
        <div className="text-[11px] uppercase tracking-widest text-white/60">
          {label}
        </div>
        <div className="mt-1.5 text-2xl font-bold">
          <CountUp value={value} /> {suffix}
        </div>
      </div>
      <div className="accent" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Leaderboard (look Twitch-like)                                      */
/* ------------------------------------------------------------------ */

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
    <div className="card glass overflow-hidden">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        <div className="text-lg font-semibold">{title}</div>
        <div className="ml-auto">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher…"
            className="input"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-6 text-sm text-white/70">Aucune donnée pour le moment.</div>
      ) : (
        <ul className="divide-y divide-white/8">
          {filtered.map((i, idx) => {
            const pct = Math.max(2, Math.round((i.value / max) * 100));
            return (
              <li key={i.name} className="px-4 py-3 hover:bg-white/[.035] transition">
                <div className="flex items-center gap-3">
                  <Medal rank={idx + 1} />
                  <Avatar name={i.name} />
                  <div className="min-w-0 grow">
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="truncate font-medium">{i.name}</div>
                      <div className="text-sm text-white/70">
                        {nf.format(i.value)} {unit}
                      </div>
                    </div>
                    <div className="mt-2 h-2 rounded bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded bg-gradient-to-r from-[#8b5cf6] via-[#7c4dff] to-[#22d3ee]"
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
      <div className="accent" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Graph (souple + dégradé + glow)                                     */
/* ------------------------------------------------------------------ */

function MiniAreaChart({
  data,
  height = 220,
}: {
  data: { date: string; messages: number }[];
  height?: number;
}) {
  return (
    <div className="card glass overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="text-[13px] font-semibold">Tendance 14 jours</div>
        <div className="text-[11px] text-white/60">Activité du chat (mock)</div>
      </div>
      <div className="h-[1px] w-full bg-white/10" />
      <div className="px-1 pb-3 pt-2">
        <div style={{ width: "100%", height }}>
          <ResponsiveContainer>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="gradLine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.9} />
                  <stop offset="60%" stopColor="#22d3ee" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.06} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" hide />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: "rgba(17,17,22,.72)",
                  border: "1px solid rgba(255,255,255,.12)",
                  borderRadius: 12,
                  backdropFilter: "blur(8px)",
                  color: "#fff",
                }}
                formatter={(v) => [nf.format(v as number), "msgs"]}
                labelFormatter={(l) => `Jour : ${l}`}
              />
              <Area
                type="monotone"
                dataKey="messages"
                stroke="#c7b8ff"
                strokeWidth={2.6}
                dot={{ r: 3, strokeWidth: 0 }}
                fill="url(#gradLine)"
                animationDuration={900}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="accent" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Player + Chat visibles en même temps + mini-dock flottant           */
/* ------------------------------------------------------------------ */

function TwitchEmbed({
  kind,
  channel,
  height,
  dark = true,
}: {
  kind: "player" | "chat";
  channel: string;
  height: number;
  dark?: boolean;
}) {
  const src =
    kind === "player"
      ? `https://player.twitch.tv/?channel=${channel}&parent=${PARENT}&muted=false&autoplay=true`
      : `https://www.twitch.tv/embed/${channel}/chat?parent=${PARENT}&theme=${dark ? "dark" : "light"}`;

  if (!IS_FIREFOX) {
    return (
      <iframe
        title={kind}
        src={src}
        height={height}
        className={`w-full ${kind === "player" ? "bg-black" : "bg-[#0b0b10]"}`}
        allow={kind === "player" ? "autoplay; fullscreen; picture-in-picture" : undefined}
      />
    );
  }

  // Fallback Firefox (blocage cookies tiers) : aperçu + bouton
  const thumb = `https://static-cdn.jtvnw.net/previews-ttv/live_user_${channel}-960x540.jpg?${Date.now()}`;
  const label = kind === "player" ? "Ouvrir le lecteur" : "Ouvrir le chat";
  const href = src;

  return (
    <div className="relative bg-black overflow-hidden rounded-xl border border-white/10">
      {kind === "player" && (
        <img src={thumb} className="w-full object-cover" style={{ height }} alt="Aperçu live" />
      )}
      {kind === "chat" && (
        <div className="flex h-[280px] w-full items-center justify-center bg-[#0b0b10]">
          <div className="text-sm text-white/70">Chat indisponible en iframe (Firefox)</div>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      <div className="absolute bottom-3 left-3">
        <span className="rounded bg-red-500/90 px-2 py-0.5 text-xs font-semibold">LIVE</span>
      </div>
      <div className="absolute bottom-3 right-3">
        <a href={href} target="_blank" rel="noreferrer" className="btn-primary">
          {label}
        </a>
      </div>
    </div>
  );
}

function LiveDock({ channel }: { channel: string }) {
  const playerRef = useRef<HTMLDivElement>(null);
  const [showMini, setShowMini] = useState(false);

  useEffect(() => {
    const el = playerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const v = entries[0].isIntersecting;
        setShowMini(!v);
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* Bloc visible dans la mise en page (player + chat côte à côte) */}
      <div className="card glass p-3">
        <div className="relative rounded-xl bg-gradient-to-b from-white/5 to-white/[.03]">
          <div className="dock grid-cols-[1fr_330px] lg:grid" ref={playerRef}>
            <div className="rounded-xl overflow-hidden">
              <TwitchEmbed kind="player" channel={channel} height={360} />
            </div>
            <div className="rounded-xl overflow-hidden border border-white/8 bg-[#0b0b10]">
              <TwitchEmbed kind="chat" channel={channel} height={360} />
            </div>
          </div>
        </div>
      </div>

      {/* Mini picture-in-picture flottant */}
      {showMini && (
        <div className="mini-dock">
          <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl">
            <TwitchEmbed kind="player" channel={channel} height={220} />
          </div>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Données mock                                                        */
/* ------------------------------------------------------------------ */

const MOCK_LB: Lb = {
  topChatters: [
    { name: "poneytv", value: 12931 },
    { name: "alice__", value: 11002 },
    { name: "bobinator", value: 9988 },
    { name: "natsu", value: 7344 },
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
    return { date, messages: Math.floor(40 + Math.random() * 160) };
  }),
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ClassementsPage() {
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
    <div className="relative">
      <HaloBackground />

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Classements</h1>
        <p className="text-white/70 text-sm">
          Live + chat visibles, classements en temps quasi réel, style Twitch — et un mini-lecteur
          flottant pour ne rien louper 🔥
        </p>

        <div className="mt-3 flex gap-2">
          <button onClick={() => setTab("chat")} className={`pill ${tab === "chat" ? "pill--active" : ""}`}>Top chatters</button>
          <button onClick={() => setTab("tips")} className={`pill ${tab === "tips" ? "pill--active" : ""}`}>Top dons (tips)</button>
          <button onClick={() => setTab("subs")} className={`pill ${tab === "subs" ? "pill--active" : ""}`}>Top subs (mois)</button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard label="TOTAL 14 JOURS" value={12640} suffix="msgs" />
        <KpiCard label="MOYENNE / JOUR" value={903} suffix="msgs" />
        <div className="card glass">
          <div className="p-5">
            <div className="text-[11px] uppercase tracking-widest text-white/60">MOCK RANG PERSO</div>
            <div className="mt-1.5 text-2xl font-bold">#12 <span className="text-white/60 text-base">/ 3 214</span></div>
          </div>
          <div className="accent" />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Bloc gauche : leaderboard + graph */}
        <div className="lg:col-span-2 space-y-6">
          {tab === "chat" && <LeaderboardTable title="Top chatters" unit="msgs" items={lb.topChatters} />}
          {tab === "tips" && <LeaderboardTable title="Top dons (tips)" unit="€" items={lb.topDonors} />}
          {tab === "subs" && <LeaderboardTable title="Top subs" unit="mois" items={lb.topSubs} />}

          <MiniAreaChart data={my.daily} height={240} />
        </div>

        {/* Colonne droite : Live + Chat côte à côte */}
        <div className="space-y-6">
          <LiveDock channel="theaubeurre" />
        </div>
      </div>
    </div>
  );
}
