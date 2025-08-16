"use client";

import {
  LineChart,
  ResponsiveContainer,
  Line,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
} from "recharts";

export default function MiniTrend({
  data,
  height = 180,
}: {
  data: { date: string; messages: number }[];
  height?: number;
}) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
      <div className="text-sm mb-2 text-white/70">Tendance 14 jours</div>
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 6, right: 12, bottom: 0, left: -18 }}>
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,.06)" />
            <XAxis
              hide
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis hide domain={["auto", "auto"]} />
            <Tooltip
              cursor={{ stroke: "rgba(255,255,255,.15)", strokeWidth: 1 }}
              contentStyle={{
                background: "rgba(10,10,15,.9)",
                border: "1px solid rgba(255,255,255,.12)",
                borderRadius: 10,
                color: "white",
              }}
              labelStyle={{ color: "rgba(255,255,255,.6)" }}
              formatter={(v: any) => [v, "msgs"]}
            />
            <Area
              type="monotone"
              dataKey="messages"
              stroke="none"
              fill="url(#g1)"
              animationDuration={700}
            />
            <Line
              type="monotone"
              dataKey="messages"
              stroke="#a78bfa"
              strokeWidth={2.2}
              dot={{ r: 2, strokeWidth: 0, fill: "#c4b5fd" }}
              activeDot={{ r: 4 }}
              animationDuration={700}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
