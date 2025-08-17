// src/app/page.tsx
"use client";

import Link from "next/link";
import useSWR from "swr";
import { useMemo } from "react";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

// ----- Données mock pour la courbe -----
const MOCK_DAILY = Array.from({ length: 12 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (11 - i));
  return { date: d.toISOString().slice(0, 10), value: 20 + Math.round(Math.random() * 100) };
});

// ----- Statut inline du stream (sans carte/iframe) -----
function StreamInlineStatus({ channel = "theaubeurre" }: { channel?: string }) {
  const { data } = useSWR<{ online: boolean }>(
    `/api/twitch/stream?login=${encodeURIComponent(channel)}`,
    fetcher,
    { refreshInterval: 60_000, revalidateOnFocus: false }
  );
  const online = !!data?.online;

  return (
    <div className="flex items-center justify-end gap-4">
      <div className="text-sm text-slate-200 font-medium">{channel}</div>
      <div className="inline-flex items-center gap-2 text-sm text-slate-300">
        <span
          className={`inline-block h-2.5 w-2.5 rounded-full ${
            online ? "bg-red-500" : "bg-slate-400"
          }`}
        />
        {online ? "En direct" : "Hors ligne"}
      </div>
    </div>
  );
}

// ----- Courbe simple (SVG) avec grille discrète -----
function MiniTrend({ data = MOCK_DAILY }: { data?: { date: string; value: number }[] }) {
  const points = useMemo(() => {
    const w = 560;
    const h = 200;
    const pad = 12;
    const xs = data.map((_, i) => pad + (i * (w - 2 * pad)) / (data.length - 1));
    const max = Math.max(...data.map((d) => d.value));
    const min = Math.min(...data.map((d) => d.value));
    const ys = data.map((d) => {
      const t = (d.value - min) / Math.max(1, max - min);
      return h - pad - t * (h - 2 * pad);
    });
    return xs.map((x, i) => `${x},${ys[i]}`).join(" ");
  }, [data]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 md:p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="font-medium">Ta tendance récente (exemple)</div>
        <div className="text-xs text-slate-400">Activité du chat</div>
      </div>

      <div className="chart relative">
        <div className="chart__grid" />
        <svg className="chart__line" viewBox="0 0 560 200" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke="url(#g1)"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={points}
          />
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#a78bfa" />
              <stop offset="1" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <p className="mt-2 text-xs text-slate-400">
        En te connectant, cette courbe sera basée sur tes vraies données.
      </p>
    </div>
  );
}

// ----- Une petite tuile chiffre (style minimal, sans gros cadres) -----
function MiniNumber({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-1 text-3xl md:text-4xl font-semibold">{value}</div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="container-page py-10 md:py-14 space-y-10">
      {/* Ligne titre + statut du stream à droite */}
      <section className="grid grid-cols-12 gap-6 items-start">
        <div className="col-span-12 lg:col-span-7">
          <h1 className="text-4xl md:text-5xl font-extrabold">
            Bienvenue sur <span className="text-[#a78bfa]">ViewerHub</span>
          </h1>
          <p className="mt-3 text-slate-300 max-w-2xl">
            Connecte ton compte Twitch et découvre tes <strong>classements</strong>, ton{" "}
            <strong>activité de chat</strong>, tes heures devant le stream, tes{" "}
            <strong>tips/subs</strong>… le tout dans une interface inspirée de Twitch.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/api/auth/signin" className="btn btn-primary">
              🚀 Se connecter avec Twitch
            </Link>
            <Link href="/classements" className="btn">
              Explorer les classements
            </Link>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5">
          <StreamInlineStatus channel="theaubeurre" />
          <div className="mt-8 text-center text-slate-300">Hors ligne pour le moment</div>
        </div>
      </section>

      {/* Stats minimalistes + Courbe à droite */}
      <section className="grid grid-cols-12 gap-10">
        <div className="col-span-12 lg:col-span-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <MiniNumber label="Messages / 14j" value="12 457" />
          <MiniNumber label="Moyenne / jour" value="889" />
          <MiniNumber label="Heures vues" value="42 h" />
          <MiniNumber label="Rang (mock)" value="#12" />
        </div>

        <div className="col-span-12 lg:col-span-6">
          <MiniTrend />
        </div>
      </section>
    </main>
  );
}
