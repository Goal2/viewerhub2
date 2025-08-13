"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import React from "react";

type Point = { date: string; messages: number };

export default function MessageTrendClient({
  data,
  height = 280,
}: {
  data: Point[];
  height?: number | string; // accepte "38vh" ou 360
}) {
  const style: React.CSSProperties =
    typeof height === "number" ? { height: `${height}px` } : { height };

  return (
    <div
      className="rounded-2xl border border-white/10 bg-white/5 p-4"
      style={style}
    >
      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,.6)" }} />
            <YAxis tick={{ fill: "rgba(255,255,255,.6)" }} />
            <Tooltip
              contentStyle={{
                background: "#111118",
                border: "1px solid rgba(255,255,255,.15)",
                borderRadius: 12,
              }}
              labelStyle={{ color: "#fff" }}
            />
            <Line
              type="monotone"
              dataKey="messages"
              stroke="#a970ff"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
