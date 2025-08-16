"use client";

import useSWR from "swr";
import { useMemo } from "react";

const nf = new Intl.NumberFormat("fr-FR");

const fetcher = (u: string) => fetch(u).then(r => r.json());

export default function LiveBadge({
  login = process.env.NEXT_PUBLIC_TWITCH_LOGIN || "theaubeurre",
  className = "",
}: {
  login?: string;
  className?: string;
}) {
  const { data } = useSWR<{ live: boolean; viewer_count?: number; game_name?: string; title?: string }>(
    `/api/twitch/stream?user_login=${encodeURIComponent(login)}`,
    fetcher,
    { refreshInterval: 30_000 }
  );

  const label = useMemo(() => {
    if (!data) return "…";
    if (data.live) {
      const viewers = data.viewer_count ? `• ${nf.format(data.viewer_count)}` : "";
      return `EN DIRECT ${viewers}`;
    }
    return "Hors ligne";
  }, [data]);

  const live = !!data?.live;

  return (
    <span
      className={
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border " +
        (live
          ? "bg-red-500/20 text-red-200 border-red-400/40 shadow-[0_0_16px_rgba(239,68,68,.25)]"
          : "bg-white/5 text-white/70 border-white/15") +
        " " +
        className
      }
      title={data?.title || ""}
    >
      <span
        className={
          "h-2 w-2 rounded-full " +
          (live ? "bg-red-400 animate-pulse" : "bg-white/30")
        }
      />
      {label}
      {live && data?.game_name ? (
        <span className="ml-1 text-white/60">({data.game_name})</span>
      ) : null}
    </span>
  );
}
