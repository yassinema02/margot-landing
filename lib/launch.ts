// Launch countdown configuration.
//
// Target: midnight in Morocco (UTC+1) on Saturday, June 6 2026 — which is
// 01:00 in Paris (CEST). The explicit +01:00 offset keeps this unambiguous
// regardless of the visitor's timezone. Update this single line if the
// launch date moves.
export const LAUNCH_ISO = "2026-06-06T00:00:00+01:00";

export const LAUNCH_TS = new Date(LAUNCH_ISO).getTime();

// Live App Store listing. The country code is intentionally omitted so each
// visitor lands on their local store; Apple resolves the region automatically.
export const APP_STORE_URL =
  "https://apps.apple.com/app/margot-wardrobe-made-easy/id6766047882";
