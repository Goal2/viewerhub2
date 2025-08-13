export async function helix(path: string, access_token: string) {
  const res = await fetch(`https://api.twitch.tv/helix${path}`, {
    headers: {
      "Client-Id": process.env.TWITCH_HELIX_CLIENT_ID!,
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Helix ${path} failed`);
  return res.json();
}
