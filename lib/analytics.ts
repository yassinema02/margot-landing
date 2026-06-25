// GA4 event helper. PostHog events are still sent via usePostHog() at each call
// site (cookieless, no consent needed); this mirrors the conversion-relevant
// ones into GA4 for Google Ads import. gtag itself respects Consent Mode v2, so
// before the visitor accepts, these are modeled/cookieless rather than dropped.
type GtagParams = Record<string, unknown>;

export function trackGA(event: string, params: GtagParams = {}): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  w.gtag?.("event", event, params);
}
