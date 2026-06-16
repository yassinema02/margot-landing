// Shared IP rate-limiter (KV-backed with in-memory fallback), generalized from
// the waitlist route so multiple endpoints can reuse it.

type KvClient = {
  incr: (key: string) => Promise<number>;
  pexpire: (key: string, ms: number) => Promise<unknown>;
};

let kvPromise: Promise<KvClient | null> | null = null;
export async function getKv(): Promise<KvClient | null> {
  if (!process.env.KV_URL && !process.env.KV_REST_API_URL) return null;
  if (!kvPromise) {
    kvPromise = import("@vercel/kv")
      .then((m) => m.kv as unknown as KvClient)
      .catch(() => null);
  }
  return kvPromise;
}

const mem = new Map<string, number[]>();

/** Trusted client IP — never `x-forwarded-for` (spoofable). */
export function clientIp(req: Request): string {
  const ip = (req as unknown as { ip?: string }).ip;
  return ip ?? req.headers.get("x-real-ip") ?? "unknown";
}

export async function isRateLimited(
  prefix: string,
  ip: string,
  opts: { windowMs?: number; limit?: number } = {},
): Promise<boolean> {
  const windowMs = opts.windowMs ?? 60_000;
  const limit = opts.limit ?? 10;
  const kv = await getKv();
  if (!kv) {
    const now = Date.now();
    const k = `${prefix}:${ip}`;
    const hits = (mem.get(k) ?? []).filter((t) => now - t < windowMs);
    if (hits.length >= limit) return true;
    hits.push(now);
    mem.set(k, hits);
    return false;
  }
  const bucket = Math.floor(Date.now() / windowMs);
  const key = `${prefix}:rl:${ip}:${bucket}`;
  try {
    const count = await kv.incr(key);
    if (count === 1) await kv.pexpire(key, windowMs).catch(() => undefined);
    return count > limit;
  } catch {
    return false;
  }
}
