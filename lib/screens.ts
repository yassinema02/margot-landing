// App screens shown on the homepage. Files live in public/screens/<lang>/ and
// are produced by scripts/screens/build-screens.mjs from the native exports.

export type ScreenLang = "en" | "fr";

export const SCREEN_NAMES = [
  "home",
  "add-photo",
  "outfit-collection",
  "tryon-result",
  "chat-conversation",
  "shopping",
  "travel-packing",
  "styles",
] as const;
export type ScreenName = (typeof SCREEN_NAMES)[number];

/** Intrinsic size of every file: 780 px wide, native 1206 × 2622 ratio. */
export const SCREEN_SIZE = { width: 780, height: 1696 } as const;

/**
 * Vertical focus (0 = top, 100 = bottom) when a screen is shown in a cropped
 * card rather than a full phone, so the card shows the part its caption is
 * about. Tuned by eye on the rendered page, per language because the French
 * and English captures are not always scrolled to the same point.
 */
const FOCUS: Record<ScreenName, number> = {
  home: 0,
  "add-photo": 54,
  "outfit-collection": 99,
  "tryon-result": 39,
  "chat-conversation": 34,
  shopping: 36,
  "travel-packing": 36,
  styles: 39,
};
export const SCREEN_FOCUS: Record<ScreenLang, Record<ScreenName, number>> = {
  en: FOCUS,
  fr: { ...FOCUS, shopping: 52 },
};

export function screenSrc(lang: ScreenLang, name: ScreenName): string {
  return `/screens/${lang}/${name}.webp`;
}
