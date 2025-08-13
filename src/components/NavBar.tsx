"use client";
import Link from "next/link";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 backdrop-blur bg-black/30">
      <div className="h-14 max-w-6xl mx-auto px-4 flex items-center gap-4">
        <Link href="/" className="font-semibold tracking-wide text-white">
          <span>Viewer</span><span className="text-[var(--brand)]">Hub</span>
        </Link>
        <nav className="ml-auto flex items-center gap-2">
          <Link href="/leaderboards" className="btn">Classements</Link>
          <Link href="/me" className="btn">Mon espace</Link>
          <Link href="/api/auth/signin/twitch" className="btn btn-brand">Se connecter</Link>
        </nav>
      </div>
    </header>
  );
}
