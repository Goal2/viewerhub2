"use client";
import TwitchPlayer from "@/components/TwitchPlayer";
import LazyTwitchChat from "@/components/LazyTwitchChat";
import LiveMessages from "@/components/LiveMessages";

const CHAT_MODE = (process.env.NEXT_PUBLIC_CHAT_MODE as "lite" | "official") ?? "lite";

export default function LiveDock({
  channel = "theaubeurre",
  playerHeight = 220,
  chatHeight = 320,
  className = "",
}: {
  channel?: string;
  playerHeight?: number;
  chatHeight?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      <div style={{ minHeight: playerHeight }}>
        <TwitchPlayer channel={channel} muted />
      </div>
      {CHAT_MODE === "official" ? (
        <LazyTwitchChat channel={channel} height={chatHeight} />
      ) : (
        <LiveMessages channel={channel} height={chatHeight} />
      )}
    </div>
  );
}
