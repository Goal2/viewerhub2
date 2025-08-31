// src/app/api/twitch/stream/route.ts
import { NextResponse } from "next/server";

export const revalidate = 30; // 30 s

type TokenCache = {
  token?: string;
  exp?: number;
};
const cache: TokenCache = {};

async function getAppToken() {
  const now = Math.floor(Date.now() / 1000);
  if (cache.token && cache.exp && cache.exp - now > 60) return cache.token;

  const body = new URLSearchParams({
    client_id: process.env.TWITCH_CLIENT_ID || "",
    client_secret: process.env.TWITCH_CLIENT_SECRET || "",
    grant_type: "client_credentials",
  });

  const res = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    body,
    // pas de cache
  });
  if (!res.ok) throw new Error("TWITCH TOKEN FAILED");
  const json = await res.json();
  cache.token = json.access_token;
  cache.exp = now + (json.expires_in || 3600);
  return cache.token!;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const user_login = searchParams.get("user_login") || "theaubeurre";

    const token = await getAppToken();
    const helix = await fetch(
      `https://api.twitch.tv/helix/streams?user_login=${encodeURIComponent(user_login)}`,
      {
        headers: {
          "Client-Id": process.env.TWITCH_CLIENT_ID || "",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!helix.ok) {
      return NextResponse.json({ live: false }, { status: helix.status });
    }

    const data = await helix.json();
    const item = data?.data?.[0];

    if (item) {
      return NextResponse.json({
        live: true,
        title: item.title,
        viewer_count: item.viewer_count,
        started_at: item.started_at,
      });
    }
    return NextResponse.json({ live: false });
  } catch (e) {
    return NextResponse.json({ live: false }, { status: 200 });
  }
}
