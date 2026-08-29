// Live App Store listing. The country code is intentionally omitted so each
// visitor lands on their local store; Apple resolves the region automatically.
export const APP_STORE_URL =
  "https://apps.apple.com/app/margot-outfit-planner/id6766047882";

// Live Play Store listing (published 2026-07, build 1.7.2).
export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.vestiaire.app";

// App Store rating. Set to null until there are real reviews — the trust strip
// then shows honest signals (free / no ads / private) instead of empty stars.
// Once reviews land, fill this in (check https://itunes.apple.com/lookup?id=6766047882)
// and the strip auto-switches to ★ rating + count. e.g. { average: 4.9, count: 27 }.
export const APP_STORE_RATING: { average: number; count: number } | null = null;
