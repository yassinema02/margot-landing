"use client";

import { useEffect } from "react";
import type { PostHog } from "posthog-js";
import { usePostHog } from "posthog-js/react";
import { trackGA } from "@/lib/analytics";

// Track store intent without hydrating each download link. Existing Apple
// event names stay stable; Android gets its own event and both carry placement.
// `ga: false` (invitation page, whose URL carries a token) keeps the tap in
// PostHog only.
export function storeClickHandler(ph: PostHog | undefined, { ga }: { ga: boolean }) {
  return (e: MouseEvent) => {
    const target = e.target instanceof Element ? e.target : null;
    const link = target?.closest<HTMLAnchorElement>('a[data-cta="app-store"], a[data-cta="play-store"]');
    if (!link) return;
    const event = link.dataset.cta === "play-store" ? "play_store_click" : "app_store_click";
    const properties = {
      placement: link.dataset.placement ?? "other",
      language: document.documentElement.lang,
    };
    ph?.capture(event, properties);
    if (ga) trackGA(event, properties);
  };
}

export function ConversionTracker({ ga = true }: { ga?: boolean }) {
  const ph = usePostHog();

  useEffect(() => {
    const onClick = storeClickHandler(ph, { ga });
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [ph, ga]);

  return null;
}
