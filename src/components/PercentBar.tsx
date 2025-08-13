"use client";

export default function PercentBar({ pct = 0 }: { pct: number }) {
  const v = Math.max(0, Math.min(100, pct));
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-sm mb-2">Tu es dans le top</div>
      <div className="text-xl font-semibold mb-2">{v.toFixed(1)}%</div>
      <div className="h-2 rounded bg-white/10 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#9146ff] to-[#22d3ee]" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}
