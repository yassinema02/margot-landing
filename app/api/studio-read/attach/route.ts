import { NextResponse } from "next/server";
import { clientIp, isRateLimited } from "../../../../lib/rateLimit";
import { attachStudioReadEmail } from "../../../../lib/studioRead/persist";
import { isArchetypeId } from "../../../../lib/studioRead/types";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Soft email capture for Studio Read. Two best-effort side effects, neither of
// which should block the user: (1) attach the email to the carry-over token so
// the Margot app can recover the result on signup; (2) add the lead to Beehiiv
// (same publication as the waitlist), tagged so Studio Read leads are filterable
// and the winning archetype is carried in utm_content.
export async function POST(req: Request) {
  const ip = clientIp(req);
  if (await isRateLimited("studio-read-attach", ip, { limit: 8 })) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": "60" } });
  }

  let body: { token?: unknown; email?: unknown; lang?: unknown; archetype?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const token = typeof body.token === "string" ? body.token : "";
  if (!UUID_RE.test(token)) return NextResponse.json({ error: "invalid_token" }, { status: 400 });

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "invalid_email" }, { status: 400 });

  // 1) Carry-over (best-effort).
  await attachStudioReadEmail(token, email);

  // 2) Beehiiv lead (best-effort — never fail the user's flow on a marketing hop).
  const apiKey = process.env.BEEHIIV_API_KEY;
  const pubId = process.env.BEEHIIV_PUBLICATION_ID;
  if (apiKey && pubId) {
    const archetype = typeof body.archetype === "string" && isArchetypeId(body.archetype) ? body.archetype : undefined;
    try {
      const res = await fetch(`https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          email,
          reactivate_existing: true,
          send_welcome_email: false,
          utm_source: "margot-landing",
          utm_medium: "studio_read",
          utm_campaign: body.lang === "fr" ? "fr_studio_read" : "en_studio_read",
          ...(archetype ? { utm_content: archetype } : {}),
        }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error(`[studio-read/attach] Beehiiv ${res.status}: ${text.slice(0, 400)}`);
      }
    } catch (err) {
      console.error("[studio-read/attach] Beehiiv request failed:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
