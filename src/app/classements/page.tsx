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

const parent =
  process.env.NEXT_PUBLIC_TWITCH_PARENT?.trim() ||
  (typeof window !== "undefined" ? window.location.hostname : "localhost");

/* ------------------------------------------------------------------ */
/* Décor halo                                                          */
/* ------------------------------------------------------------------ */

function HaloBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="scene-halo absolute -left-40 -top-40 h-[38rem] w-[38rem] rounded-full bg-gradient-to-br from-[#7c3aed] via-[#9146ff] to-[#22d3ee] opacity-[.55]" />
      <div className="scene-halo scene-halo--2 absolute -right-40 top-1/3 h-[36rem] w-[36rem] rounded-full bg-gradient-to-tr from-[#06b6d4] via-[#22d3ee] to-[#7c3aed] opacity-[.40]" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Petits composants UI                                                */
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
    <div className="w-9 text-center text-lg">
      {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank}
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  // avatar léger (DiceBear)
  const url = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(
    name
  )}&backgroundType=gradientLinear&size=64`;
  return (
    <img
      src={url}
      alt={name}
      className="h-7 w-7 rounded-full ring-2 ring-white/15 bg-white/5"
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
    <div className="card">
      <div className="p-5">
        <div className="text-[11px] uppercase tracking-widest text-white/60">
          {label}
        </div>
        <div className="mt-1.5 text-2xl font-bold">
          <CountUp value={value} /> {suffix}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Leaderboard                                                         */
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
    <div className="card overflow-hidden">
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
        <div className="p-6 text-sm text-white/70">
          Aucune donnée pour le moment.
        </div>
      ) : (
        <ul className="divide-y divide-white/10">
          {filtered.map((i, idx) => {
            const pct = Math.max(2, Math.round((i.value / max) * 100));
            return (
              <li key={i.name} className="px-4 py-3 hover:bg-white/[.04]">
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
                    <div className="mt-2 h-2 rounded bg-white/10">
                      <div
                        className="h-full rounded bg-gradient-to-r from-[#9146ff] via-[#7c4dff] to-[#22d3ee]"
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

/* ------------------------------------------------------------------ */
/* Graph                                                                */
/* ------------------------------------------------------------------ */

function MiniAreaChart({
  data,
  height = 220,
}: {
  data: { date: string; messages: number }[];
  height?: number;
}) {
  return (
    <div className="card overflow-hidden">
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
                  <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.85} />
                  <stop offset="70%" stopColor="#22d3ee" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                hide
                tick={{ fill: "rgba(255,255,255,.5)" }}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: "rgba(0,0,0,.7)",
                  border: "1px solid rgba(255,255,255,.12)",
                  borderRadius: 10,
                  backdropFilter: "blur(6px)",
                }}
                formatter={(v) => [nf.format(v as number), "msgs"]}
                labelFormatter={(l) => `Jour : ${l}`}
              />
              <Area
                type="monotone"
                dataKey="messages"
                stroke="#bdb4ff"
                strokeWidth={2.5}
                dot={{ r: 3, strokeWidth: 0 }}
                fill="url(#gradLine)"
                animationDuration={900}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Twitch player & chat avec fallback Firefox                          */
/* ------------------------------------------------------------------ */

function TwitchEmbedCard({
  kind,
  channel,
  height,
}: {
  kind: "player" | "chat";
  channel: string;
  height: number;
}) {
  const isFirefox =
    typeof navigator !== "undefined" &&
    /firefox/i.test(navigator.userAgent || "");
  const src =
    kind === "player"
      ? `https://player.twitch.tv/?channel=${channel}&parent=${parent}&muted=false&autoplay=true`
      : `https://www.twitch.tv/embed/${channel}/chat?parent=${parent}&theme=dark`;

  if (!isFirefox) {
    return (
      <div className="card p-0 overflow-hidden">
        <iframe
          title={kind === "player" ? "twitch-player" : "twitch-chat"}
          src={src}
          height={height}
          className="w-full bg-black"
          allow={
            kind === "player" ? "autoplay; fullscreen; picture-in-picture" : undefined
          }
        />
      </div>
    );
  }

  // Fallback Firefox : vignette live + boutons
  const thumb = `https://static-cdn.jtvnw.net/previews-ttv/live_user_${channel}-960x540.jpg?${Date.now()}`;
  return (
    <div className="card overflow-hidden p-0">
      <div className="relative bg-black">
        <img
          src={thumb}
          alt="Aperçu du live"
          className="w-full object-cover"
          style={{ height }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3">
          <div className="rounded-md bg-red-500/90 px-2 py-1 text-xs font-semibold">
            LIVE / Aperçu
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => location.reload()}
              className="btn-secondary"
            >
              Actualiser
            </button>
            <a href={src} target="_blank" rel="noreferrer" className="btn-primary">
              {kind === "player" ? "Ouvrir le lecteur" : "Ouvrir le chat"}
            </a>
          </div>
        </div>
      </div>
      <div className="p-3 text-xs text-white/70">
        Firefox bloque parfois l’intégration. Ouvre l’onglet ci-dessus (ou
        autorise les cookies tiers pour Twitch).
      </div>
    </div>
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

      <div className="mb-6 space-y-2">
        <h1 className="text-3xl font-bold">Classements</h1>
        <p className="text-white/70 text-sm">
          Messages, dons et mois de sub — en temps quasi réel (style Twitch).
        </p>

        <div className="flex gap-2 pt-1">
          <button
            onClick={() => setTab("chat")}
            className={`pill ${tab === "chat" ? "pill--active" : ""}`}
          >
            Top chatters
          </button>
          <button
            onClick={() => setTab("tips")}
            className={`pill ${tab === "tips" ? "pill--active" : ""}`}
          >
            Top dons (tips)
          </button>
          <button
            onClick={() => setTab("subs")}
            className={`pill ${tab === "subs" ? "pill--active" : ""}`}
          >
            Top subs (mois)
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard label="TOTAL 14 JOURS" value={12640} suffix="msgs" />
        <KpiCard label="MOYENNE / JOUR" value={903} suffix="msgs" />
        <div className="card">
          <div className="p-5">
            <div className="text-[11px] uppercase tracking-widest text-white/60">
              MOCK RANG PERSO
            </div>
            <div className="mt-1.5 text-2xl font-bold">
              #12 <span className="text-white/60 text-base">/ 3 214</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Bloc gauche : leaderboard + graph */}
        <div className="lg:col-span-2 space-y-6">
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

          <MiniAreaChart data={my.daily} height={240} />
        </div>

        {/* Colonne droite : Player (grand) + Chat (plus petit) */}
        <div className="space-y-6">
          <TwitchEmbedCard kind="player" channel="theaubeurre" height={320} />
          <TwitchEmbedCard kind="chat" channel="theaubeurre" height={280} />
        </div>
      </div>
    </div>
  );
}
