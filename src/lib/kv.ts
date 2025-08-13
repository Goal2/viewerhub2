// src/lib/kv.ts
// Supporte @vercel/kv OU @upstash/redis via variables d'env.
// Ne plante pas au build si rien n'est configuré.

let kv: any = null;

function getEnv(name: string) {
  return process.env[name] && String(process.env[name]);
}

const url =
  getEnv("KV_REST_API_URL") || getEnv("UPSTASH_REDIS_REST_URL");
const token =
  getEnv("KV_REST_API_TOKEN") || getEnv("UPSTASH_REDIS_REST_TOKEN");

if (url && token) {
  try {
    // Si tu utilises @vercel/kv
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Redis } = require("@upstash/redis"); // marche aussi avec Upstash direct
    kv = new Redis({ url, token });
  } catch {
    // rien : on laissera kv = null => route renverra KV_DISABLED
  }
}

export { kv };
