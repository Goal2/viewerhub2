// src/app/api/stats/me/route.ts
import { NextResponse } from "next/server";

// mocks ultra simples (tu peux remplacer par tes vrais mocks depuis "@/lib/mock")
const mockChatStats = {
  rank: 42,
  totalViewers: 1234,
  percentile: 73, // 0..100
  messages30d: 356,
  avgPerDay: 12,
  mostActiveHour: 21,
  daily: Array.from({ length: 14 }).map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (13 - i));
    return { date: d.toISOString().slice(0, 10), messages: Math.floor(20 + Math.random() * 120) };
  }),
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const useMock = url.searchParams.has("mock") || process.env.DEMO === "1";
  if (useMock) {
    await new Promise((r) => setTimeout(r, 150));
    return NextResponse.json(mockChatStats);
  }
  return new NextResponse("Unauthorized", { status: 401 });
}
