// src/components/StreamInlinePill.tsx
"use client";

import useSWR from "swr";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

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

      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-slate-200">
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
