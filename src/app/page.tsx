// src/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
          Bienvenue sur ViewerHub
        </h1>
        <p className="text-white/70 max-w-2xl">
          Consulte les classements des chatters, des tips et des mois de sub — le
          tout dans une interface rappelant Twitch.
        </p>
        <div className="mt-6">
          <Link
            href="/classements"
            className="inline-flex items-center gap-2 bg-[#9146ff] hover:bg-[#7b3af4] transition text-white px-4 py-2 rounded-lg"
          >
            ⚡ Voir les classements
          </Link>
        </div>
      </div>
    </section>
  );
}
