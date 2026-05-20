import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const pubId = process.env.BEEHIIV_PUBLICATION_ID;
  if (!apiKey || !pubId) {
    return NextResponse.json({ error: "server_misconfigured" }, { status: 500 });
  }

  let body: { email?: string; lang?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

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
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return NextResponse.json({ error: "beehiiv_error", status: res.status, detail: text.slice(0, 400) }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
