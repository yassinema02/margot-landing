import { NextResponse, type NextRequest } from "next/server";

import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/launch";

// /download — smart store redirect for bios and ads.
//
// In-app browsers (Instagram, TikTok) regularly choke on raw store links:
// tap, blank page, no store, silent leak. A SERVER-side 302 needs no
// JavaScript, so it works everywhere: iPhone → App Store, Android → Play
// Store, desktop/unknown → landing home.
//
// Usage: https://www.margotwardrobe.com/download?c=ig_bio
// The `c` campaign tag flows into: a `download_redirect` PostHog event
// (server-side capture, so we count every tap independently of Meta),
// the Play Store install referrer, and the landing fallback UTMs.
//
// TODO(apple-campaigns): append ?pt=<provider-token>&ct=<campaign>&mt=8 to
// the App Store URL once the ASC provider token is wired in as an env var —
// that lights up per-campaign install numbers inside App Store Analytics.

export const dynamic = "force-dynamic";

/** Campaign tag: strictly [a-z0-9_-], max 64 chars — never trust the query. */
function sanitizeCampaign(raw: string | null): string {
  if (!raw) return "none";
  const clean = raw.toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 64);
  return clean || "none";
}

type Platform = "ios" | "android" | "other";

function detectPlatform(userAgent: string): Platform {
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "ios";
  if (/Android/i.test(userAgent)) return "android";
  return "other";
}

function destinationFor(platform: Platform, campaign: string, origin: string): string {
  switch (platform) {
    case "ios":
      return APP_STORE_URL;
    case "android": {
      // Play keeps the campaign readable app-side via the install referrer.
      const referrer = encodeURIComponent(`utm_source=margot_site&utm_campaign=${campaign}`);
      return `${PLAY_STORE_URL}&referrer=${referrer}`;
    }
    default: {
      // Desktop and unknown agents land on the home page; UTMs let the
      // client-side PostHog attribute the visit to the same campaign.
      const url = new URL("/", origin);
      url.searchParams.set("utm_source", "download_link");
      url.searchParams.set("utm_campaign", campaign);
      return url.toString();
    }
  }
}

/**
 * Server-side PostHog capture — the redirect must never depend on it, so
 * failures are swallowed and the timeout is short. Counted here because the
 * visitor never runs our JavaScript before leaving for the store.
 */
async function captureRedirect(platform: Platform, campaign: string): Promise<void> {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";
  if (!key) return;
  try {
    await fetch(`${host}/capture/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: key,
        event: "download_redirect",
        distinct_id: crypto.randomUUID(),
        properties: {
          platform,
          campaign,
          $process_person_profile: false,
        },
      }),
      signal: AbortSignal.timeout(800),
    });
  } catch {
    // Analytics must never break the redirect. Silent by design.
  }
}

export async function GET(request: NextRequest) {
  const campaign = sanitizeCampaign(request.nextUrl.searchParams.get("c"));
  const platform = detectPlatform(request.headers.get("user-agent") ?? "");
  const destination = destinationFor(platform, campaign, request.nextUrl.origin);

  await captureRedirect(platform, campaign);

  return NextResponse.redirect(destination, 302);
}
