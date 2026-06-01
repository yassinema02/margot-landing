// Launch countdown configuration.
//
// Target: midnight in Morocco (UTC+1) on Saturday, June 6 2026 — which is
// 01:00 in Paris (CEST). The explicit +01:00 offset keeps this unambiguous
// regardless of the visitor's timezone. Update this single line if the
// launch date moves.
export const LAUNCH_ISO = "2026-06-06T00:00:00+01:00";

export const LAUNCH_TS = new Date(LAUNCH_ISO).getTime();

// TODO(launch): replace with the live App Store URL once the app is approved.
// Until then this points at a placeholder; the countdown only reveals the
// download button when the timer hits zero, so a wrong link won't ship early.
export const APP_STORE_URL = "https://apps.apple.com/app/margot";
