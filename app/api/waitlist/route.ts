import { NextResponse } from "next/server";
import { createHash } from "crypto";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Lowercase to match how Beehiiv stores utm_content — keeps lookups
// case-insensitive in practice across the whole pipeline.
const REF_RE = /^[a-z0-9]{4,16}$/;

const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 5;

// Lazy KV client. We import dynamically so that builds without `@vercel/kv`
// installed (e.g. a fresh clone before `npm install`) still produce a working
// dev server via the in-memory fallback below.
type KvClient = {
  incr: (key: string) => Promise<number>;
  pexpire: (key: string, ms: number) => Promise<unknown>;
};
let kvPromise: Promise<KvClient | null> | null = null;

async function getKv(): Promise<KvClient | null> {
  if (!process.env.KV_URL && !process.env.KV_REST_API_URL) return null;
  if (!kvPromise) {
    kvPromise = import("@vercel/kv")
      .then((mod) => mod.kv as unknown as KvClient)
      .catch((err) => {
        console.warn("[waitlist] @vercel/kv import failed, falling back to in-memory rate limit:", err);
        return null;
      });
  }
  return kvPromise;
}

// In-process fallback (single-worker only — will not coordinate across
// Vercel function instances). A warning is logged at first use so the
// degraded mode is obvious in logs.
const ipHits = new Map<string, number[]>();
let warnedAboutFallback = false;

function isRateLimitedInMemory(ip: string): boolean {
  if (!warnedAboutFallback) {
    warnedAboutFallback = true;
    console.warn(
      "[waitlist] KV_URL/KV_REST_API_URL not set — using in-memory rate limiter. " +
        "This does not coordinate across serverless invocations and will be bypassed under any real load. " +
        "Provision Upstash KV via Vercel marketplace and redeploy."
    );
  }
  const now = Date.now();
  const hits = (ipHits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (hits.length >= RATE_LIMIT) return true;
  hits.push(now);
  ipHits.set(ip, hits);
  return false;
}

async function isRateLimited(ip: string): Promise<boolean> {
  const kv = await getKv();
  if (!kv) return isRateLimitedInMemory(ip);
  // Bucket window: floor(now / window) groups requests into discrete buckets.
  // INCR + PEXPIRE atomically counts hits in the current window. We accept
  // up to 2×RATE_LIMIT bursts at window boundaries — fine for a waitlist.
  const bucket = Math.floor(Date.now() / RATE_WINDOW_MS);
  const key = `waitlist:rl:${ip}:${bucket}`;
  try {
    const count = await kv.incr(key);
    if (count === 1) {
      // First hit in this bucket — set TTL so the key doesn't outlive the window.
      await kv.pexpire(key, RATE_WINDOW_MS).catch(() => undefined);
    }
    return count > RATE_LIMIT;
  } catch (err) {
    console.warn("[waitlist] KV rate-limit check failed, falling back to in-memory:", err);
    return isRateLimitedInMemory(ip);
  }
}

// Deterministic per-email so the same person always sees the same code/position
// across devices and reloads.
function refCodeForEmail(email: string): string {
  return createHash("sha256")
    .update(email.toLowerCase())
    .digest("hex")
    .slice(0, 8);
}

function positionForEmail(email: string): number {
  const hash = createHash("sha256").update(email.toLowerCase()).digest();
  const num = hash.readUInt32BE(0);
  // 232..550 inclusive = 319 distinct values
  return 232 + (num % 319);
}

// Resolve the client IP from a trusted source. `x-forwarded-for` is
// user-controllable on hosts that don't strip it at the edge, which would
// let an attacker fake their IP and bypass per-IP rate limiting. Prefer
// Vercel/runtime's `request.ip`, then `x-real-ip` (set by the platform's
// load balancer), then fall back to a sentinel. Never use `x-forwarded-for`
// because it can be spoofed by the requester.
function clientIp(req: Request): string {
  // `request.ip` is populated by the Vercel Edge/Node runtimes — not part of
  // the standard `Request` type, so cast through unknown.
  const requestIp = (req as unknown as { ip?: string }).ip;
  const realIp = req.headers.get("x-real-ip");
  return requestIp ?? realIp ?? "unknown";
}

export async function POST(req: Request) {
  // --- rate limit ---
  const ip = clientIp(req);
  if (await isRateLimited(ip)) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  const apiKey = process.env.BEEHIIV_API_KEY;
  const pubId = process.env.BEEHIIV_PUBLICATION_ID;
  if (!apiKey || !pubId) {
    return NextResponse.json({ error: "server_misconfigured" }, { status: 500 });
  }

  let body: { email?: string; lang?: string; ref?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  // Sanitize the referring code coming from the URL. Anything not matching the
  // 4-16 alphanumeric shape is dropped — we never trust the client.
  const rawRef = body.ref?.trim().toLowerCase();
  const referredBy = rawRef && REF_RE.test(rawRef) ? rawRef : null;

  const refCode = refCodeForEmail(email);
  const position = positionForEmail(email);

  const res = await fetch(`https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      email,
      reactivate_existing: true,
      send_welcome_email: true,
      utm_source: "margot-landing",
      utm_medium: "waitlist",
      utm_campaign: body.lang === "fr" ? "fr_waitlist" : "en_waitlist",
      // utm_content carries the referrer's code. Visible per-subscriber in
      // Beehiiv → Subscribers → Acquisition. Filter by it to count referrals.
      ...(referredBy ? { utm_content: referredBy } : {}),
    }),
  });

  if (!res.ok) {
    // Log detail server-side only — never expose Beehiiv error body to the client
    const text = await res.text().catch(() => "");
    console.error(`[waitlist] Beehiiv ${res.status}: ${text.slice(0, 400)}`);
    return NextResponse.json({ error: "upstream_error" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, refCode, position });
}
