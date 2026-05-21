import { NextResponse } from "next/server";
import { createHash } from "crypto";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REF_RE = /^[A-Z0-9]{4,16}$/;

/**
 * Simple in-memory rate limiter — 5 requests per IP per minute.
 * Resets automatically when entries expire. Not distributed (single-process),
 * but sufficient for a landing-page waitlist endpoint on Vercel.
 */
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 5;
const ipHits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (ipHits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (hits.length >= RATE_LIMIT) return true;
  hits.push(now);
  ipHits.set(ip, hits);
  return false;
}

// Deterministic per-email so the same person always sees the same code/position
// across devices and reloads.
function refCodeForEmail(email: string): string {
  return createHash("sha256")
    .update(email.toLowerCase())
    .digest("hex")
    .slice(0, 8)
    .toUpperCase();
}

function positionForEmail(email: string): number {
  const hash = createHash("sha256").update(email.toLowerCase()).digest();
  const num = hash.readUInt32BE(0);
  // 232..550 inclusive = 319 distinct values
  return 232 + (num % 319);
}

export async function POST(req: Request) {
  // --- rate limit ---
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
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
  // 4-16 uppercase-alphanumeric shape is dropped — we never trust the client.
  const rawRef = body.ref?.trim().toUpperCase();
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
