// src/app/api/twitch/stream/route.ts
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type HelixStream = {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  game_id: string;
  title: string;
  viewer_count: number;
  started_at: string;
  thumbnail_url: string;
};

let tokenCache: { token: string; expiresAt: number } | null = null;

async function getAppToken() {
  const now = Date.now();
  if (tokenCache && tokenCache.expiresAt > now + 60_000) return tokenCache.token;

  const url = new URL("https://id.twitch.tv/oauth2/token");
  url.searchParams.set("client_id", process.env.TWITCH_CLIENT_ID!);
  url.searchParams.set("client_secret", process.env.TWITCH_CLIENT_SECRET!);
  url.searchParams.set("grant_type", "client_credentials");

  const r = await fetch(url.toString(), { method: "POST" });
  if (!r.ok) throw new Error("Token error: " + (await r.text()));
  const j = await r.json();

  tokenCache = {
    token: j.access_token,
    expiresAt: Date.now() + (j.expires_in ?? 3600) * 1000,
  };
  return tokenCache.token;
}

async function getGameName(game_id: string, token: string, clientId: string) {
  if (!game_id) return undefined;
  const r = await fetch(`https://api.twitch.tv/helix/games?id=${game_id}`, {
    headers: { "Client-Id": clientId, Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!r.ok) return undefined;
  const j = await r.json();
  return j.data?.[0]?.name as string | undefined;
}

export async function GET(req: NextRequest) {
  try {
    const p = new URL(req.url).searchParams;
    const user_login = (p.get("user_login") || process.env.TWITCH_CHANNEL || "").toLowerCase();
    if (!user_login) return NextResponse.json({ error: "missing user_login" }, { status: 400 });

    const clientId = process.env.TWITCH_CLIENT_ID!;
    const token = await getAppToken();

    const r = await fetch(
      `https://api.twitch.tv/helix/streams?user_login=${encodeURIComponent(user_login)}`,
      { headers: { "Client-Id": clientId, Authorization: `Bearer ${token}` }, cache: "no-store" }
    );
    if (!r.ok) throw new Error("Helix /streams error: " + (await r.text()));

    const j = await r.json();
    const stream: HelixStream | undefined = j.data?.[0];

    if (!stream) {
      const res = NextResponse.json({ live: false, user_login }, { status: 200 });
      res.headers.set("Cache-Control", "s-maxage=15, stale-while-revalidate=45");
      return res;
    }

    const game_name = await getGameName(stream.game_id, token, clientId);
    const thumb = stream.thumbnail_url?.replace("{width}", "640")?.replace("{height}", "360");

    const res = NextResponse.json(
      {
        live: true,
        user_login,
        title: stream.title,
        viewer_count: stream.viewer_count,
        started_at: stream.started_at,
        game_name,
        thumbnail_url: thumb,
      },
      { status: 200 }
    );
    res.headers.set("Cache-Control", "s-maxage=15, stale-while-revalidate=45");
    return res;
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e?.message ?? "error" }, { status: 500 });
  }
}
