"use client";
import Link from "next/link";
import Reveal from "./Reveal";

export default function Hero(){
  return (
    <section className="mt-6 card">
      <Reveal>
        <h1 className="h1">Stats interactives <span className="text-[var(--brand)]">· theaubeurre</span></h1>
      </Reveal>
      <Reveal delay={.08}>
        <p className="mt-2 sub">Watchtime, messages, dons & subs — interface simple et lisible, style Twitch.</p>
      </Reveal>
      <Reveal delay={.16}>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/api/auth/signin/twitch" className="btn btn-brand">Se connecter avec Twitch</Link>
          <Link href="/leaderboards" className="btn">Voir les classements</Link>
        </div>
      </Reveal>
    </section>
  );
}
