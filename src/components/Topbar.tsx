"use client";
import Link from "next/link";

export default function Topbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 backdrop-blur bg-black/30">
      <div className="h-14 flex items-center gap-3 px-4 sm:px-6 lg:px-8">
        <div className="font-semibold tracking-wide">
          <span>Viewer</span><span className="text-[#9146ff]">Hub</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/leaderboards"
            className="rounded-xl bg-white/10 border border-white/15 px-3 py-1.5 hover:bg-white/20"
          >
            Voir mon classement
          </Link>
          <Link
            href="/api/auth/signin/twitch"
            className="rounded-xl bg-[#9146ff] px-3 py-1.5 hover:brightness-110"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </header>
  );
}
