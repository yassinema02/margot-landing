"use client";

import { useEffect } from "react";
import { usePostHog } from "posthog-js/react";
import { trackGA } from "@/lib/analytics";

// Delegated click tracking for the App Store CTAs, which render across the site
// as <a data-cta="app-store"> (server component, ~9 usages). Catching them here
// avoids touching every call site. app_store_click is the landing's primary
// install-intent conversion and wasn't tracked anywhere before. Fires to both
// PostHog and GA4.
export function ConversionTracker() {
  const ph = usePostHog();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest('[data-cta="app-store"]')) return;
      ph?.capture("app_store_click");
      trackGA("app_store_click");
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [ph]);

  return null;
}
