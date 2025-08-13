"use client";
import { Gift, MessageSquare, Coins } from "lucide-react";

export type EventItem = {
  type: "message" | "tip" | "sub";
  user: string;
  text?: string;
  amount?: number;   // pour tips
  months?: number;   // pour subs
  ts: string;        // ISO
};

export default function ActivityFeed({ items }:{ items: EventItem[] }) {
  if (!items || items.length === 0)
    return <div className="card p-4 text-white/60">Aucune activité récente.</div>;

  const icon = (t:EventItem["type"]) =>
    t === "message" ? <MessageSquare className="h-4 w-4" /> :
    t === "tip"     ? <Coins className="h-4 w-4" /> :
                      <Gift className="h-4 w-4" />;

  const label = (e:EventItem) =>
    e.type === "message" ? `${e.user} : ${e.text ?? ""}` :
    e.type === "tip"     ? `${e.user} a tip ${e.amount?.toFixed(2)}€` :
                           `${e.user} s'est abonné (${e.months ?? 1} mois)`;

  return (
    <div className="card p-4">
      <div className="font-semibold mb-2">Activité récente</div>
      <ul className="space-y-2">
        {items.map((e,i)=>(
          <li key={i} className="flex items-center gap-2 text-sm">
            <span className="text-[#9146ff]">{icon(e.type)}</span>
            <span className="truncate">{label(e)}</span>
            <span className="ml-auto text-white/40 text-xs">{new Date(e.ts).toLocaleTimeString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
