"use client";

import { useMemo } from "react";

type Props = {
  channel: string;
  height?: number | string;  // ex: 360 ou "360px"
  title?: string;
  className?: string;
  muted?: boolean;           // <-- on ajoute la prop muted
  volume?: number;           // 0..1 si tu veux forcer un volume
};

export default function TwitchPlayer({
  channel,
  height = 360,
  title,
  className,
  muted = false,
  volume,
}: Props) {
  const parent =
    typeof window !== "undefined" ? window.location.hostname : "localhost";

  const src = useMemo(() => {
    const qs = new URLSearchParams();
    qs.set("channel", channel);
    qs.set("parent", parent);
    qs.set("muted", muted ? "true" : "false");    // <-- on passe muted à l’iframe
    if (typeof volume === "number" && !muted) {
      // twitch accepte volume 0..1
      qs.set("volume", String(Math.min(1, Math.max(0, volume))));
    }
    return `https://player.twitch.tv/?${qs.toString()}`;
  }, [channel, parent, muted, volume]);

  return (
    <div className={className} style={{ height }}>
      <iframe
        className="h-full w-full rounded-2xl border border-white/10"
        src={src}
        title={title ?? `Twitch • ${channel}`}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
