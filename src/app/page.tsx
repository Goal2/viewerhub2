// src/app/page.tsx
"use client";

import useSWR from "swr";
import Link from "next/link";
import { useMemo } from "react";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

// --- Mini graph mock (exemple) ---
const MOCK_DAILY = Array.from({ length: 12 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (11 - i));
  return { date: d.toISOString().slice(0, 10), value: 20 + Math.round(Math.random() * 100) };
});

// --- Carte Stream (toujours visible) ---
function StreamCard({ channel = "theaubeurre" }: { channel?: string }) {
  const { data } = useSWR<{ online: boolean; title?: string }>(
    `/api/twitch/stream?login=${encodeURIComponent(channel)}`,
    fetcher,
    { refreshInterval: 60_000, revalidateOnFocus: false }
  );

  const online = !!data?.online;
  const title = data?.title ?? "Hors ligne pour le moment";

  return (
    <section className="card p-0 overflow-hidden">
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="font-medium">{channel}</div>
        <div className="badge">
          <span
            className={`inline-block w-2.5 h-2.5 rounded-full ${
              online ? "bg-red-500" : "bg-slate-400"
            }`}
          />
          {online ? "En direct" : "Hors ligne"}
        </div>
      </header>

      {/* Zone lecteur / fallback : toujours visible */}
      <div className="p-3">
        <div className="twitch-embed h-[240px] md:h-[260px] rounded-lg bg-black/50">
          {online ? (
            <iframe
              title={`Twitch player - ${channel}`}
              className="w-full h-full rounded-lg"
              frameBorder="0"
              allow="autoplay; picture-in-picture"
              // Pense à garder NEXT_PUBLIC_TWITCH_PARENT à jour (vercel + localhost)
              src={`https://player.twitch.tv/?channel=${channel}&parent=${process.env.NEXT_PUBLIC_TWITCH_PARENT}`}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-slate-300">
              {title}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// --- Carte Stat compacte ---
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

// --- Mini courbe (SVG) ---
function MiniTrend({ data = MOCK_DAILY }: { data?: { date: string; value: number }[] }) {
  const points = useMemo(() => {
    const w = 560;
    const h = 200;
    const padding = 12;
    const xs = data.map((_, i) => padding + (i * (w - 2 * padding)) / (data.length - 1));
    const max = Math.max(...data.map((d) => d.value));
    const min = Math.min(...data.map((d) => d.value));
    const ys = data.map((d) => {
      const t = (d.value - min) / Math.max(1, max - min);
      return h - padding - t * (h - 2 * padding);
    });
    return xs.map((x, i) => `${x},${ys[i]}`).join(" ");
  }, [data]);

  return (
    <div className="card p-0 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="font-medium">Ta tendance récente (exemple)</div>
        <div className="text-xs text-slate-400">Activité du chat</div>
      </div>
      <div className="relative p-3">
        <div className="chart">
          <div className="chart__grid" />
          <svg className="chart__line" viewBox="0 0 560 200" preserveAspectRatio="none">
            {/* Trait */}
            <polyline
              fill="none"
              stroke="url(#g1)"
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
              points={points}
            />
            {/* Glow */}
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#9146ff" />
                <stop offset="1" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          En te connectant, cette courbe sera basée sur tes vraies données.
        </p>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="container-page py-12 space-y-10">
      {/* Bandeau de bienvenue + stream à droite */}
      <section className="grid grid-cols-12 gap-6">
        {/* Bloc gauche */}
        <div className="col-span-12 lg:col-span-7">
          <div className="space-y-5">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold">
                Bienvenue sur <span className="text-[#a78bfa]">ViewerHub</span>
              </h1>
              <p className="text-slate-300 max-w-2xl">
                Connecte ton compte Twitch et découvre tes <strong>classements</strong>, ton{" "}
                <strong>activité de chat</strong>, tes heures devant le stream, tes{" "}
                <strong>tips/subs</strong>… le tout dans une interface inspirée de Twitch.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/api/auth/signin" className="btn btn-primary">
                  🚀 Se connecter avec Twitch
                </Link>
                <Link href="/classements" className="btn">
                  Explorer les classements
                </Link>
              </div>
            </div>

            {/* Stats rapides */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Stat label="Messages / 14j" value="12 457" />
              <Stat label="Moyenne / jour" value="889" />
              <Stat label="Heures vues" value="42 h" />
              <Stat label="Rang (mock)" value="#12" />
            </div>
          </div>
        </div>

        {/* Bloc droite : le “carré du stream” toujours visible */}
        <div className="col-span-12 lg:col-span-5">
          <StreamCard channel="theaubeurre" />
        </div>
      </section>

      {/* Tendance */}
      <MiniTrend />
    </main>
  );
}
