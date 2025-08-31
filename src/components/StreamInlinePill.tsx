// src/components/StreamInlinePill.tsx
"use client";

import useSWR from "swr";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

/**
 * Petit badge de statut "En direct / Hors ligne" pour un channel Twitch.
 * - Compatible Firefox (pas d'iframe)
 * - Rafraîchi toutes les 60s
 */
export default function StreamInlinePill({
  channel = "theaubeurre",
}: {
  channel?: string;
}) {
  const { data } = useSWR<{ online: boolean }>(
    `/api/twitch/stream?login=${encodeURIComponent(channel)}`,
    fetcher,
    { refreshInterval: 60_000, revalidateOnFocus: false }
  );

  const online = !!data?.online;

  return (
    <div className="flex items-center justify-end gap-3">
      <span className="text-sm font-semibold tracking-wide text-slate-200 uppercase">
        Stream {channel}
      </span>

      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-200 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            online ? "bg-red-500 animate-pulse" : "bg-slate-400"
          }`}
        />
        {online ? "En direct" : "Hors ligne"}
      </span>
    </div>
  );
}
