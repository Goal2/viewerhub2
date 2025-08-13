"use client";
import { useEffect, useState } from "react";

export default function LazyTwitchChat({
  channel = "theaubeurre",
  height = 600,
  className = "",
}: { channel?: string; height?: number; className?: string }) {
  const [parent, setParent] = useState("localhost");
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") setParent(window.location.hostname);
  }, []);

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        className={`w-full rounded-xl border border-white/10 bg-white/5 h-[${height}px] grid place-content-center text-white/80 hover:bg-white/10 ${className}`}
        style={{ height }}
      >
        Charger le chat Twitch
      </button>
    );
  }

  const src = `https://www.twitch.tv/embed/${channel}/chat?parent=${parent}`;
  return (
    <div className={`rounded-xl overflow-hidden border border-white/10 ${className}`} style={{ height }}>
      <iframe src={src} className="w-full h-full" />
    </div>
  );
}
