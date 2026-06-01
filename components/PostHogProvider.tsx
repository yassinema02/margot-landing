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
 */

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!POSTHOG_KEY || posthog.__loaded) return;
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      person_profiles: "identified_only",
      persistence: "memory", // cookieless — no banner needed
      capture_pageview: false, // emitted manually below for App Router
      capture_pageleave: true,
      disable_surveys: true, // not used — avoids loading surveys.js
      disable_session_recording: true, // no replay on the landing
    });
  }, []);

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
    let url = window.origin + pathname;
    const qs = searchParams?.toString();
    if (qs) url += `?${qs}`;
    ph.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams, ph]);

  return null;
}
