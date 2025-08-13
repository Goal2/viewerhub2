"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Msg = { user: string; text: string; ts: number };

function toCssHeight(h?: number | string) {
  if (h === undefined) return undefined;
  return typeof h === "number" ? `${h}px` : h;
}

// Couleur pseudo stable
function nickColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  const hue = hash % 360;
  return `hsl(${hue} 80% 70%)`;
}

export default function LiveMessages({
  channel,
  height = "46vh",
  title = "Chat",
  lockScroll = true,
  max = 120,
}: {
  channel: string;
  height?: number | string;
  title?: string;
  lockScroll?: boolean;
  max?: number;
}) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Handler molette bloquée (lecture seule)
  const onWheel = useMemo(
    () =>
      lockScroll
        ? (e: React.WheelEvent) => {
            e.preventDefault();
          }
        : undefined,
    [lockScroll]
  );

  // Connexion TMI côté client uniquement
  useEffect(() => {
    let client: any;
    let mounted = true;

    (async () => {
      if (typeof window === "undefined") return;

      // import dynamique pour éviter les soucis SSR
      const mod = await import("tmi.js");
      // @ts-ignore – tmi.js exporte Client en CJS
      const Client = (mod as any).Client || (mod as any).default?.Client || (mod as any);

      client = new Client({
        connection: { secure: true, reconnect: true },
        channels: [channel],
        // Lecture seule : pas d'auth requise
      });

      client.on("message", (_ch: string, tags: any, message: string, self: boolean) => {
        if (!mounted || self) return;
        const user = tags["display-name"] || tags["username"] || "user";
        setMsgs((prev) => {
          const next = [...prev, { user, text: message, ts: Date.now() }];
          if (next.length > max) next.splice(0, next.length - max);
          return next;
        });
      });

      try {
        await client.connect();
      } catch {
        // ignore soft errors
      }
    })();

    return () => {
      mounted = false;
      if (client) {
        try {
          client.disconnect();
        } catch {}
      }
    };
  }, [channel, max]);

  // Auto-scroll vers le bas (même si overflow hidden, ça garde la dernière fournée)
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [msgs]);

  return (
    <div
      className="relative rounded-2xl border border-white/10 bg-[#0e0e10]/95 overflow-hidden flex flex-col card-grad"
      style={{ height: toCssHeight(height) }}
    >
      {/* Header */}
      <div className="block-head"> {title} </div>

      {/* Liste des messages */}
      <div
        ref={listRef}
        onWheel={onWheel}
        className="flex-1 overflow-hidden px-4 py-3 space-y-2"
        // petit fade haut/bas pour le rendu
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
        }}
      >
        {msgs.map((m) => (
          <div key={m.ts} className="chat-row">
            <span className="chat-name" style={{ color: nickColor(m.user) }}>
              {m.user}
            </span>
            <span className="chat-text">: {m.text}</span>
          </div>
        ))}

        {msgs.length === 0 && (
          <div className="text-white/50 text-sm">En attente de messages…</div>
        )}
      </div>
    </div>
  );
}
