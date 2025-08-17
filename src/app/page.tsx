// src/app/page.tsx
"use client";

import Link from "next/link";
import useSWR from "swr";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, Tooltip } from "recharts";

type StreamInfo = { live: boolean; title?: string; viewer_count?: number };

const fetcher = (u: string) => fetch(u).then(r => r.json());

const MOCK_TREND = Array.from({ length: 12 }).map((_, i) => ({
  i,
  value: 30 + Math.round(20 * Math.sin(i / 2)) + Math.round(Math.random() * 10),
}));

export default function HomePage() {
  const { data } = useSWR<StreamInfo>("/api/twitch/stream?channel=theaubeurre", fetcher, {
    refreshInterval: 20000,
  });

  const isLive = Boolean(data?.live);

  return (
    <main className="relative z-10 mx-auto w-full max-w-[1200px] px-6 py-10">
      {/* HERO */}
      <section className="grid gap-6 md:grid-cols-[1.4fr_.9fr]">
        <div className="glass card-border p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            Bienvenue sur <span className="text-gradient">ViewerHub</span>
          </h1>
          <p className="mt-2 text-white/75">
            Connecte ton compte Twitch et découvre tes <b>classements</b>, ton{" "}
            <b>activité de chat</b>, tes heures devant le stream, tes <b>tips/subs</b>…
            le tout dans une interface inspirée de Twitch.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/api/auth/signin" className="btn btn-primary">
              <span>🚀</span> Se connecter avec Twitch
            </Link>
            <Link href="/classements" className="btn">
              Explorer les classements
            </Link>
          </div>
        </div>

        {/* Carte statut stream (SANS boutons) */}
        <div className="glass card-border p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="font-semibold">theaubeurre</div>
            {isLive ? (
              <span className="chip-live"><span className="block h-2 w-2 rounded-full bg-white" /> En ligne</span>
            ) : (
              <span className="chip-off"><span className="block h-2 w-2 rounded-full bg-white/60" /> Hors ligne</span>
            )}
          </div>

          <div className="twitch-embed-dark grid place-items-center h-[180px] text-white/70 text-sm">
            {isLive ? "Mini-lecteur dispo si le flux est autorisé dans l’iFrame."
                     : "Hors ligne pour le moment"}
          </div>
          {/* pas de boutons ici */}
        </div>
      </section>

      {/* STATS EXEMPLE */}
      <section className="mt-8 grid gap-6 md:grid-cols-[1.05fr_1fr]">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="glass card-border p-5">
            <div className="text-xs tracking-wide text-white/60">MESSAGES / 14J</div>
            <div className="mt-1 text-3xl font-extrabold">12 457</div>
          </div>
          <div className="glass card-border p-5">
            <div className="text-xs tracking-wide text-white/60">MOYENNE / JOUR</div>
            <div className="mt-1 text-3xl font-extrabold">889</div>
          </div>
          <div className="glass card-border p-5">
            <div className="text-xs tracking-wide text-white/60">HEURES VUES</div>
            <div className="mt-1 text-3xl font-extrabold">42 h</div>
          </div>
          <div className="glass card-border p-5">
            <div className="text-xs tracking-wide text-white/60">RANG (mock)</div>
            <div className="mt-1 text-3xl font-extrabold">#12</div>
          </div>
        </div>

        <div className="glass card-border p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="font-semibold">Ta tendance récente (exemple)</div>
            <div className="text-xs text-white/50">Activité du chat</div>
          </div>
          <div className="h-[200px]">
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
          <p className="mt-2 text-xs text-white/60">
            En te connectant, cette courbe sera basée sur tes vraies données.
          </p>
        </div>
      </section>
    </main>
  );
}
