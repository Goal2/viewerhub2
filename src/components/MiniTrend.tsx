"use client";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

export default function MiniTrend({
  data,
  height = 160,
  title = "Activité du chat (14 j)",
}: {
  data: Array<{ date: string; messages: number }>;
  height?: number;
  title?: string;
}) {
  const formatted = (data ?? []).map(d => ({ ...d, d: d.date.slice(5) })); // MM-DD

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
      <div className="font-semibold mb-2">{title}</div>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formatted} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,.08)" />
            <XAxis dataKey="d" stroke="rgba(255,255,255,.5)" tickLine={false} fontSize={12} />
            <YAxis stroke="rgba(255,255,255,.5)" tickLine={false} fontSize={12} allowDecimals={false} />
            <Tooltip contentStyle={{ background: "#1b1b21", border: "1px solid rgba(255,255,255,.12)" }} />
            <Line type="monotone" dataKey="messages" stroke="#9146ff" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
