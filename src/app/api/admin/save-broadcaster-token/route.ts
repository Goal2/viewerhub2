// src/app/api/admin/save-broadcaster-token/route.ts
import type { NextRequest } from "next/server";

export const runtime = "nodejs"; // évite l'exécution edge si besoin

export async function POST(req: NextRequest) {
  // Import paresseux pour éviter une erreur au build si KV n'est pas configuré
  const { kv } = await import("@/lib/kv").catch(() => ({ kv: null as any }));

  // Si KV n'est pas configuré en prod, on ne casse pas le build
  if (!kv) {
    return Response.json({ ok: false, reason: "KV_DISABLED" }, { status: 200 });
  }

  try {
    // ---- Mets ici TON code existant si tu fais une auth/session, etc. ----
    // ex :
    // const session = await auth();
    // if (!session) return Response.json({ ok: false }, { status: 401 });

    // Exemple minimal : on récupère ce que tu veux stocker
    const body = await req.json().catch(() => ({} as any));
    const broadcasterId = body?.broadcasterId ?? "unknown";
    // Sauvegarde (adapte la clé/valeur à ton besoin)
    await kv.set(`broadcaster:${broadcasterId}`, body);

    return Response.json({ ok: true });
  } catch (err) {
    console.error("save-broadcaster-token error:", err);
    return Response.json({ ok: false, error: "SAVE_FAILED" }, { status: 500 });
  }
}
