"use client";
import Link from "next/link";
import React from "react";

const mock = {
  pseudo: "nightowl",
  screenTimeH: 37,     // heures de visionnage cette semaine
  messages: 1294,      // messages envoyés
  subMonths: 7,        // mois de sub
  lastTip: 12,         // € dernier tip
  streakDays: 9,       // jours d'affilée présents
};

export default function Home() {
  return (
    <div className="relative grid h-screen grid-rows-[auto,1fr]">
      {/* halos chill */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-10 h-[40rem] w-[40rem] rounded-full bg-gradient-to-tr from-fuchsia-600/25 via-purple-500/20 to-cyan-400/20 blur-3xl animate-floatA" />
        <div className="absolute -right-40 bottom-10 h-[42rem] w-[42rem] rounded-full bg-gradient-to-tr from-cyan-400/20 via-teal-400/20 to-fuchsia-500/20 blur-3xl animate-floatB" />
        <div className="absolute left-[40%] top-[45%] h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-violet-500/14 via-fuchsia-500/12 to-cyan-400/14 blur-3xl animate-floatC" />
      </div>

      <header className="relative z-10 px-6 py-4">
        <div className="text-right text-sm text-white/70">style Twitch • chill</div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl space-y-6 px-6">
        {/* hero */}
        <div className="card shadow-glow p-6">
          <h1 className="text-3xl font-bold">Bienvenue sur ViewerHub</h1>
          <p className="mt-2 text-white/80">
            Voici un aperçu de ce que tu verras en te connectant : ton temps d’écran, tes messages,
            ton sub, et plus encore — le tout dans une interface inspirée de Twitch.
          </p>

          <Link
            href="/classements"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#8b5cf6] px-4 py-2 text-sm font-medium shadow-glow hover:opacity-95"
          >
            ⚡ Voir les classements
          </Link>
        </div>

        {/* stats fictives */}
        <section className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4 card p-5">
            <div className="text-sm text-white/60">Viewer fictif</div>
            <div className="mt-1 text-xl font-semibold">@{mock.pseudo}</div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <div className="text-3xl font-bold">{mock.screenTimeH}h</div>
                <div className="text-sm text-white/60">Temps d’écran (7j)</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{mock.messages}</div>
                <div className="text-sm text-white/60">Messages envoyés</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{mock.subMonths}</div>
                <div className="text-sm text-white/60">Mois de sub</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{mock.lastTip}€</div>
                <div className="text-sm text-white/60">Dernier tip</div>
              </div>
            </div>
          </div>

          {/* mini “ligne de progression” / streak */}
          <div className="col-span-12 lg:col-span-8 card p-5">
            <div className="mb-2 flex items-baseline justify-between">
              <div className="font-semibold">Série de présence</div>
              <div className="text-sm text-white/60">{mock.streakDays} jours d’affilée</div>
            </div>

            <div className="h-2 rounded bg-white/10">
              <div
                className="h-full rounded bg-gradient-to-r from-[#9146ff] via-[#7c4dff] to-[#22d3ee]"
                style={{ width: `${Math.min(100, (mock.streakDays / 14) * 100)}%` }}
              />
            </div>

            <p className="mt-3 text-sm text-white/70">
              Connecte-toi pour voir tes vraies stats, ta progression, et tes badges.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
