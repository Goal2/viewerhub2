// src/app/page.tsx
"use client";

import Link from "next/link";
import useSWR from "swr";
import { useMemo } from "react";
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

// -----------------------
// Visuels
// -----------------------
function GlowField() {
  // 3 halos qui se déplacent lentement
  const glows = [
    { x: "-10%", y: "-20%", size: 380, from: "#7c3aed35", to: "#22d3ee25" },
    { x: "70%", y: "-10%", size: 420, from: "#22d3ee30", to: "#a855f725" },
    { x: "40%", y: "60%", size: 520, from: "#9146ff25", to: "#22d3ee20" },
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
            background:
              `radial-gradient(circle at 30% 30%, ${g.from}, ${g.to})`,
          }}
          animate={{
            x: ["-2%", "2%", "-2%"],
            y: ["-2%", "3%", "-2%"],
            scale: [1, 1.06, 1],
          }}
          transition={{ duration: 18 + i * 2, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
      <div className="text-xs uppercase tracking-wider text-white/60">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {!!subtitle && <div className="mt-1 text-sm text-white/60">{subtitle}</div>}
    </div>
  );
}

function LiveBadge({
  live,
  viewers,
}: {
  live: boolean;
  viewers?: number;
}) {
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

// -----------------------
// Données mock pour la démo
// -----------------------
const mockTrend = Array.from({ length: 14 }).map((_, i) => {
  const base = 40 + Math.sin(i / 2) * 25 + (Math.random() * 16 - 8);
  return { d: i + 1, v: Math.max(5, Math.round(base)) };
});

// -----------------------
// Page
// -----------------------
export default function HomePage() {
  // statut live theaubeurre
  const { data: stream } = useSWR(
    "/api/twitch/stream?user_login=theaubeurre",
    fetcher,
    { refreshInterval: 60_000 }
  );

  const isLive = !!stream?.live;
  const viewers = stream?.viewer_count as number | undefined;

  // petit lissage visuel du graph
  const chartData = useMemo(() => mockTrend, []);

  return (
    <main className="relative mx-auto max-w-7xl px-5 py-10">
      <GlowField />

      {/* HERO */}
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Bienvenue sur <span className="bg-gradient-to-r from-[#a78bfa] via-[#9146ff] to-[#22d3ee] bg-clip-text text-transparent">ViewerHub</span>
            </h1>
            <p className="mt-2 max-w-2xl text-white/70">
              Connecte ton compte Twitch et découvre tes <strong>classements</strong>,
              ton <strong>activité de chat</strong>, tes heures devant le stream, tes <strong>tips/subs</strong>…
              le tout dans une interface inspirée de Twitch.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href="/api/auth/signin"
                className="inline-flex items-center gap-2 rounded-xl bg-[#9146ff] px-4 py-2 font-medium hover:bg-[#7c3aed] transition"
              >
                🚀 Se connecter avec Twitch
              </Link>
              <Link
                href="/classements"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 hover:bg-white/10 transition"
              >
                Explorer les classements
              </Link>
              <LiveBadge live={isLive} viewers={viewers} />
            </div>
          </div>

          {/* vignette live si en direct */}
          <div className="w-full md:w-[360px]">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-sm font-medium text-white/80">theaubeurre</div>
                <LiveBadge live={isLive} viewers={viewers} />
              </div>
              <div className="aspect-video overflow-hidden rounded-xl bg-black/60">
                {/* On évite l'embed (souci cookies sur Firefox) -> miniature si live, sinon fond */}
                {isLive && stream?.thumbnail_url ? (
                  // image de la miniature live
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
                  href="https://player.twitch.tv/?channel=theaubeurre"
                  target="_blank"
                  rel="noreferrer"
                >
                  Ouvrir le lecteur
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Aperçu “ce que tu auras en te connectant” */}
      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="mb-4 text-sm font-semibold text-white/80">
              Aperçu de tes stats (exemple)
            </div>
            <div className="grid grid-cols-2 gap-4">
              <StatCard title="Messages / 14j" value={nf.format(12457)} />
              <StatCard title="Moyenne / jour" value={nf.format(889)} />
              <StatCard title="Heures vues" value="42 h" />
              <StatCard title="Rang (mock)" value="#12" />
              <StatCard title="Tips & Sub" value="36 tips • 8 mois" />
              <StatCard title="Channel suivi" value="@theaubeurre" subtitle="(exemple)" />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-semibold text-white/80">
              Ta tendance récente (exemple)
            </div>
            <div className="text-xs text-white/50">Activité du chat</div>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
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
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="transparent"
                  fill="url(#grad)"
                />
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke="#a78bfa"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-xs text-white/60">
            En te connectant, cette courbe sera basée sur tes vraies données.
          </p>
        </div>
      </section>

      {/* Callout classements */}
      <section className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/10 bg-white/5 px-5 py-4">
          <div className="text-sm text-white/70">
            Découvre le top chatters, les tips et les mois de sub en quasi temps réel.
          </div>
          <Link
            href="/classements"
            className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/15 transition"
          >
            ➜ Aller aux classements
          </Link>
        </div>
      </section>
    </main>
  );
}
