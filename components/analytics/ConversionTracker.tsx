"use client";

import { useEffect } from "react";
import { usePostHog } from "posthog-js/react";
import { trackGA } from "@/lib/analytics";

// Track store intent without hydrating each download link. Existing Apple
// event names stay stable; Android gets its own event and both carry placement.
export function ConversionTracker() {
  const ph = usePostHog();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      const link = target?.closest<HTMLAnchorElement>('a[data-cta="app-store"], a[data-cta="play-store"]');
      if (!link) return;
      const event = link.dataset.cta === "play-store" ? "play_store_click" : "app_store_click";
      const properties = {
        placement: link.dataset.placement ?? "other",
        language: document.documentElement.lang,
      };
      ph?.capture(event, properties);
      trackGA(event, properties);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [ph]);

  return null;
}
