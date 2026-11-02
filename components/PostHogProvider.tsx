"use client";

/**
 * PostHog (EU) for the public landing.
 *
 * Cookieless by design: `persistence: 'memory'` means no cookie and no
 * localStorage, so no consent banner is required (decided 2026-06-01). The
 * tradeoff is that the anonymous id resets each page load — fine for a
 * top-of-funnel marketing site. `person_profiles: 'identified_only'` keeps
 * anonymous pageviews cheap (the landing has no login, so we never identify).
 *
 * No-op when NEXT_PUBLIC_POSTHOG_KEY is unset (local dev / preview without the
 * env var), so nothing breaks and nothing is sent.
 *
 * App Router note: posthog-js only auto-captures the first pageview, so we
 * disable that and emit `$pageview` manually on every pathname/search change.
 *
 * Invitation links (/i/<token>) carry a single-use token. `before_send`
 * rewrites it to /i/:token in every event (pageview, pageleave, autocapture,
 * heatmaps, store clicks: URL, pathname, referrer, session entry). The
 * invitation layout also passes `disableFlags`: the /flags request is not an
 * event, it carries $initial_current_url / $initial_pathname, and the landing
 * uses no feature flag. The rest of the site keeps its remote config.
 */

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog, { type PostHogConfig } from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { redactInviteEvent, redactInviteToken } from "@/lib/redactInviteToken";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";

export const POSTHOG_OPTIONS: Partial<PostHogConfig> = {
  api_host: POSTHOG_HOST,
  person_profiles: "identified_only",
  persistence: "memory", // cookieless — no banner needed
  capture_pageview: false, // emitted manually below for App Router
  capture_pageleave: true,
  disable_surveys: true, // not used — avoids loading surveys.js
  disable_session_recording: true, // no replay on the landing
  before_send: redactInviteEvent, // /i/<token> → /i/:token everywhere
};

/** Init options; `disableFlags` skips /flags and remote config entirely. */
export function posthogOptions({ disableFlags }: { disableFlags: boolean }): Partial<PostHogConfig> {
  return disableFlags ? { ...POSTHOG_OPTIONS, advanced_disable_flags: true } : POSTHOG_OPTIONS;
}

/** `$current_url` of a manual pageview, invitation token removed. */
export function pageviewUrl(origin: string, pathname: string, query: string): string {
  return redactInviteToken(origin + pathname + (query ? `?${query}` : ""));
}

export function PostHogProvider({
  children,
  disableFlags = false,
}: {
  children: React.ReactNode;
  /** Invitation page: no /flags request (see header). */
  disableFlags?: boolean;
}) {
  useEffect(() => {
    if (!POSTHOG_KEY || posthog.__loaded) return;
    posthog.init(POSTHOG_KEY, posthogOptions({ disableFlags }));
  }, [disableFlags]);

  // Without a key there's no client to provide — render children untouched.
  if (!POSTHOG_KEY) return <>{children}</>;

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      {children}
    </PHProvider>
  );
}

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ph = usePostHog();

  useEffect(() => {
    if (!pathname || !ph) return;
    const url = pageviewUrl(window.origin, pathname, searchParams?.toString() ?? "");
    ph.capture("$pageview", { $current_url: url, $pathname: redactInviteToken(pathname) });
  }, [pathname, searchParams, ph]);

  return null;
}
