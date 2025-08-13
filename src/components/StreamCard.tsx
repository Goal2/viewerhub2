"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function StreamCard({
  title, user, game, viewers, thumb
}: {
  title:string; user:string; game:string; viewers:string; thumb:string;
}) {
  return (
    <motion.article
      whileHover={{ y:-4 }}
      className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 group shadow-[0_10px_30px_rgba(0,0,0,.35)]"
    >
      <div className="relative aspect-video overflow-hidden">
        {/* image de preview (fake) */}
        <Image src={thumb} alt="" fill className="object-cover" />
        {/* overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition" />
        {/* badge viewers */}
        <div className="absolute bottom-2 left-2 text-xs bg-black/70 px-2 py-1 rounded-md">{viewers} viewers</div>
      </div>
      <div className="p-3">
        <div className="font-semibold line-clamp-1">{title}</div>
        <div className="text-sm text-white/70 line-clamp-1">{user} • {game}</div>
      </div>
    </motion.article>
  );
}
