// src/app/api/leaderboards/route.ts
import { NextResponse } from "next/server";
import { mockLeaderboards, delay } from "@/lib/mock";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const useMock = url.searchParams.has("mock") || process.env.DEMO === "1";

  if (useMock) {
    await delay(250);
    return NextResponse.json(mockLeaderboards);
  }

  return new NextResponse("Unauthorized", { status: 401 });
}
