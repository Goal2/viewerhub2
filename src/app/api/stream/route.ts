import { mockStream, delay } from "@/lib/mock";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const isDemo = process.env.DEMO === "1" || url.searchParams.get("mock") === "1";
  if (isDemo) {
    await delay(300);
    return Response.json(mockStream);
  }
  // À brancher plus tard sur l'API Twitch Helix (Get Streams, Get Chatters...)
  return Response.json({ error: "Live data non configurée" }, { status: 501 });
}
