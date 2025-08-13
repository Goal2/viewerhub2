// src/components/TopNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopNav() {
  const pathname = usePathname();
  const item = (href: string, label: string) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition
          ${active ? "bg-[#1b1d23] text-white" : "text-white/80 hover:text-white hover:bg-white/5"}`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0e0f12]/80 backdrop-blur supports-[backdrop-filter]:bg-[#0e0f12]/60 border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-2 flex items-center gap-3">
        {/* mini logo façon Twitch */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="inline-grid place-items-center w-8 h-8 rounded-md bg-[#9146ff] text-white font-black group-hover:scale-105 transition">
            T
          </span>
          <span className="sr-only">Accueil</span>
        </Link>

        {/* nav */}
        <nav className="ml-2 flex items-center gap-1">
          {item("/", "Accueil")}
          {item("/classements", "Classements")}
        </nav>

        {/* spacer */}
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden md:block relative">
            <input
              placeholder="Rechercher"
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-white/25"
            />
          </div>
          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10" />
        </div>
      </div>
    </header>
  );
}
