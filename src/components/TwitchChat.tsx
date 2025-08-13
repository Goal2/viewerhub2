"use client";

import React from "react";

type Props = {
  channel: string;
  height: number;            // px
  title?: string;
  lockScroll?: boolean;      // bloque la molette (par défaut: true)
  className?: string;
};

export default function TwitchChat({
  channel,
  height,
  title = "Chat",
  lockScroll = true,
  className = "",
}: Props) {
  const parent =
    (typeof window !== "undefined" && window.location.hostname) ||
    process.env.NEXT_PUBLIC_TWITCH_PARENT ||
    "localhost";

  const src = `https://www.twitch.tv/embed/${encodeURIComponent(
    channel
  )}/chat?parent=${encodeURIComponent(parent)}&darkpopout`;

  return (
    <section
      className={`rounded-2xl border border-white/10 bg-[#0e0e10] overflow-hidden ${className}`}
      style={{ height }}
      aria-label={title}
    >
      <div className="h-10 px-4 flex items-center border-b border-white/10 text-sm text-white/80">
        {title}
      </div>

      <div className="relative h-[calc(100%-2.5rem)]">
        {/* overlay pour absorber la molette */}
        {lockScroll && (
          <div
            className="absolute inset-0 z-10"
            onWheelCapture={(e) => e.preventDefault()}
            onTouchMove={(e) => e.preventDefault()}
            style={{ background: "transparent" }}
          />
        )}
        <iframe
          className="w-full h-full block"
          src={src}
          title="Twitch chat"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}
