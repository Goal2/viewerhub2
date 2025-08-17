// src/app/page.tsx
"use client";

import Link from "next/link";
import useSWR from "swr";
import { useMemo } from "react";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

// --- Données mock pour la courbe d’exemple ---
const MOCK_DAILY = Array.from({ length: 12 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (11 - i));
  return { date: d.toISOString().slice(0, 10), value: 20 + Math.round(Math.random() * 100) };
});

// --- Tuile “mini stream” avec boutons ---
function StreamMiniTile({ channel = "theaubeurre" }: { channel?: string }) {
  const { data } = useSWR<{ online: boolean; title?: string }>(
    `/api/twitch/stream?login=${encodeURIComponent(channel)}`,
    fetcher,
    { refreshInterval: 60_000, revalidateOnFocus: false }
  );

  const online = !!data?.online;
  const title = data?.title ?? "Hors ligne pour le moment";
  const parent = process.env.NEXT_PUBLIC_TWITCH_PARENT ?? "localhost";

  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="font-medium">{channel}</div>
        <div className="badge">
          <span
            className={`inline-block w-2.5 h-2.5 rounded-full ${
              online ? "bg-red-500" : "bg-slate-400"
            }`}
          />
          {online ? "En direct" : "Hors ligne"}
        </div>
      </div>

      <div className="p-3">
        <div className="twitch-embed h-[220px] md:h-[260px] rounded-lg bg-black/50">
          {online ? (
            <iframe
              className="w-full h-full rounded-lg"
              title={`Twitch player - ${channel}`}
              frameBorder="0"
              allow="autoplay; picture-in-picture"
              src={`https://player.twitch.tv/?channel=${channel}&parent=${parent}`}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-slate-300">
              {title}
            </div>
          )}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <a
            href={`https://twitch.tv/${channel}`}
            target="_blank"
            rel="noreferrer"
            className="btn w-full justify-center"
          >
            Ouvrir la chaîne
          </a>
          <a
            href={`https://player.twitch.tv/?channel=${channel}&parent=${parent}`}
            target="_blank"
            rel="noreferrer"
            className="btn w-full justify-center"
          >
            Ouvrir le lecteur
          </a>
        </div>
      </div>
    </div>
  );
}

// --- Carte stat compacte ---
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}

// --- Courbe simple (SVG) ---
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
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="font-medium">Ta tendance récente (exemple)</div>
        <div className="text-xs text-slate-400">Activité du chat</div>
      </div>
      <div className="relative p-4">
        <div className="chart">
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
      {/* GRAND BANDEAU D’ACCUEIL + tuile stream à droite */}
      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Colonne gauche : titre + CTA */}
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

          {/* Colonne droite : mini stream avec boutons */}
          <div className="col-span-12 lg:col-span-5">
            <StreamMiniTile channel="theaubeurre" />
          </div>
        </div>
      </section>

      {/* Stats + Courbe */}
      <section className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Stat label="Messages / 14j" value="12 457" />
            <Stat label="Moyenne / jour" value="889" />
            <Stat label="Heures vues" value="42 h" />
            <Stat label="Rang (mock)" value="#12" />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5">
          <MiniTrend />
        </div>
      </section>
    </main>
  );
}
