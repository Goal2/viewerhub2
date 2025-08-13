"use client";

import Link from "next/link";
import { Home, BarChart3, Users, User2 } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function Sidebar({ open, onClose }: Props) {
  const followed = [
    { name: "theaubeurre", game: "Just Chatting", live: true },
    { name: "poneytv", game: "Fortnite", live: true },
    { name: "luna", game: "Minecraft", live: false },
  ];

  return (
    <>
      {/* overlay mobile */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-black/40 lg:hidden transition ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed z-40 lg:static h-full w-72 lg:w-[260px] bg-black/30 backdrop-blur
                    border-r border-white/10 px-3 py-4 transition-transform ${
                      open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                    }`}
      >
        <nav className="space-y-1">
          <Link href="/" onClick={onClose} className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-white/10">
            <Home className="h-5 w-5" /> Tableau de bord
          </Link>
          <Link href="/stream" onClick={onClose} className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-white/10">
            <Users className="h-5 w-5" /> Infos stream
          </Link>
          <Link href="/leaderboards" onClick={onClose} className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-white/10">
            <BarChart3 className="h-5 w-5" /> Classements
          </Link>
          <Link href="/me" onClick={onClose} className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-white/10">
            <User2 className="h-5 w-5" /> Mon espace
          </Link>
        </nav>

        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="px-2 text-sm text-white/60 mb-2">Chaînes suivies</div>
          <div className="space-y-1">
            {followed.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-white/5"
              >
                <div>
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-white/60">{c.game}</div>
                </div>
                <span className={`h-2 w-2 rounded-full ${c.live ? "bg-red-500" : "bg-white/30"}`} />
              </motion.div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
