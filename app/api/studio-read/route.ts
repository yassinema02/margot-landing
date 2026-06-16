import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { clientIp, isRateLimited } from "../../../lib/rateLimit";
import { overDailyGeminiBudget } from "../../../lib/studioRead/budget";
import { classifyFit } from "../../../lib/studioRead/engine";
import { saveStudioReadAnon } from "../../../lib/studioRead/persist";
import type { Locale } from "../../../lib/studioRead/types";

// Node runtime: classifyFit + supabase-js need full Node, not edge.
export const runtime = "nodejs";

// Reject oversized payloads up front. ~8M base64 chars ≈ 6MB decoded image.
const MAX_B64_LEN = 8_000_000;

export async function POST(req: Request) {
  // 1) Per-IP rate limit (tighter than waitlist — each call costs a Gemini hit).
  const ip = clientIp(req);
  if (await isRateLimited("studio-read", ip, { limit: 8 })) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": "60" } });
  }

  // 2) Parse + validate input.
  let body: { imageBase64?: unknown; locale?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const img = typeof body.imageBase64 === "string" ? body.imageBase64 : "";
  if (!img) return NextResponse.json({ error: "missing_image" }, { status: 400 });
  if (img.length > MAX_B64_LEN) return NextResponse.json({ error: "too_large" }, { status: 413 });

  // 3) Global daily budget guard (graceful "busy", not an error).
  if (await overDailyGeminiBudget()) {
    return NextResponse.json({ error: "busy" }, { status: 503, headers: { "Retry-After": "3600" } });
  }

  const locale: Locale = body.locale === "fr" ? "fr" : "en";

  // 4) Classify. classifyFit never throws — safety blocks / upstream failures /
  //    malformed output all return a graceful `unreadable` result, surfaced as 200.
  const result = await classifyFit(img, locale);

  // 5) Persist the DERIVED result anonymously, keyed by token. Best-effort:
  //    the photo (`img`) is only in this scope and is never written anywhere.
  const token = randomUUID();
  await saveStudioReadAnon(token, result);

  return NextResponse.json({ token, result });
}
