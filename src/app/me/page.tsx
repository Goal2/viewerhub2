"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import useSWR from "swr";
import Link from "next/link";

// composants purement visuels (ne touchent pas au window pendant le SSR)
import StatCard from "@/components/StatCard";
import MessageTrend from "@/components/MessageTrend";

// IMPORTANT : charger ces composants uniquement côté client
const TwitchPlayer = dynamic(() => import("@/components/TwitchPlayer"), {
  ssr: false,
});
const TwitchChat = dynamic(() => import("@/components/LiveMessages"), {
  ssr: false,
});

const fetcher = (u: string) => fetch(u).then((r) => r.json());

function formatMinutes(min: number) {
  if (!min || min <= 0) return "0 min";
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h ${m}min` : `${m} min`;
}

function StatLine({
  label,
  value,
  unit = "",
  href,
}: {
  label: string;
  value: string | number;
  unit?: string;
  href: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
      <div className="text-base text-white/75">{label}</div>
      <div className="flex items-center gap-4">
        <div className="text-2xl font-semibold tabular-nums">
          {value}
          {unit ? ` ${unit}` : ""}
        </div>
        <Link
          href={href}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm border border-white/15 hover:bg-white/20"
        >
          Classement
        </Link>
      </div>
    </div>
  );
}

export default function MePage() {
  // flag "monté" => on ne rend les widgets dynamiques qu’après l’hydratation
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // données mockées/temps réel
  const { data } = useSWR("/api/stats/me?mock=1", fetcher, {
    refreshInterval: 20000,
  });

  // valeurs sûres (stables même côté serveur)
  const messages30d = data?.messages30d ?? 0;
  const subsMonths = data?.subsMonths ?? 0;
  const tipsEuro = data?.tipsEuro ?? 0;
  const watchTimeMin = data?.watchTimeMin ?? 0;
  const daily = Array.isArray(data?.daily) ? data!.daily : [];

  const rankText =
    typeof data?.rank === "number" && typeof data?.totalViewers === "number"
      ? `#${data.rank} / ${data.totalViewers}`
      : "—";

  const mostHour =
    typeof data?.mostActiveHour === "number"
      ? `${String(data.mostActiveHour).padStart(2, "0")}h`
      : "—";

  // hauteurs fixes (page sans scroll)
  const GRAPH_H = 360; // px
  const PLAYER_H = 360; // px
  const CHAT_H = 320; // px

  return (
    <main className="min-h-screen overflow-hidden flex flex-col gap-4" suppressHydrationWarning>
      {/* Header */}
      <div className="flex items-end justify-between px-6 pt-4">
        <h1 className="text-3xl font-bold">Mon tableau de bord</h1>
        <Link
          href="/leaderboards"
          className="rounded-xl bg-white/10 border border-white/15 px-5 py-2.5 hover:bg-white/20"
        >
          Voir les classements
        </Link>
      </div>

      <div className="grid xl:grid-cols-12 gap-6 px-6 pb-6 flex-1 overflow-hidden">
        {/* Colonne gauche */}
        <section className="xl:col-span-7 space-y-6 overflow-hidden">
          {/* Graph + 2 cartes */}
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Graph : on rend un faux squelette tant que !mounted pour éviter tout décalage */}
            <div className="lg:col-span-3">
              {!mounted ? (
                <div
                  style={{ height: GRAPH_H }}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] animate-pulse"
                />
              ) : (
                <MessageTrend data={daily} height={GRAPH_H} />
              )}
            </div>

            <div className="lg:col-span-2 space-y-4">
              <StatCard label="Rang global" value={rankText} />
              <StatCard label="Heure la + active" value={mostHour} />
            </div>
          </div>

          {/* 4 stats */}
          <div className="grid sm:grid-cols-2 gap-6">
            <StatLine
              label="Messages envoyés (30 jours)"
              value={messages30d}
              unit="msgs"
              href="/leaderboards?tab=chat"
            />
            <StatLine
              label="Mois de sub cumulés"
              value={subsMonths}
              unit="mois"
              href="/leaderboards?tab=subs"
            />
            <StatLine
              label="Dons (tips)"
              value={tipsEuro}
              unit="€"
              href="/leaderboards?tab=tips"
            />
            <StatLine
              label="Temps d’écran (cumulé)"
              value={formatMinutes(watchTimeMin)}
              href="/leaderboards"
            />
          </div>
        </section>

        {/* Colonne droite */}
        <aside className="xl:col-span-5 flex flex-col gap-4 overflow-hidden">
          {/* Player */}
          {!mounted ? (
            <div
              style={{ height: PLAYER_H }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] animate-pulse"
            />
          ) : (
            <TwitchPlayer channel="theaubeurre" height={PLAYER_H} title="theaubeurre" />
          )}

          {/* Chat (lecture seule custom) */}
          {!mounted ? (
            <div
              style={{ height: CHAT_H }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] animate-pulse"
            />
          ) : (
            <TwitchChat channel="theaubeurre" height={CHAT_H} title="Chat" />
          )}
        </aside>
      </div>
    </main>
  );
}
