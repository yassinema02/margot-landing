// Live App Store listing. The country code is intentionally omitted so each
// visitor lands on their local store; Apple resolves the region automatically.
export const APP_STORE_URL =
  "https://apps.apple.com/app/margot-wardrobe-made-easy/id6766047882";

// App Store rating. Set to null until there are real reviews — the trust strip
// then shows honest signals (free / no ads / private) instead of empty stars.
// Once reviews land, fill this in (check https://itunes.apple.com/lookup?id=6766047882)
// and the strip auto-switches to ★ rating + count. e.g. { average: 4.9, count: 27 }.
export const APP_STORE_RATING: { average: number; count: number } | null = null;
