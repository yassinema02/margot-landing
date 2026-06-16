// Margot design-system tokens used by the Studio Read surfaces. These mirror
// the locked Margot palette (moss plumage / cream+ash ground / rust beak).
// Kept as plain values so both client components and the next/og (Satori)
// route can share them.

export const MARGOT = {
  moss: "#2D3A33",
  mossDeep: "#1F2A26",
  irid: "#2E4A40",
  white: "#FFFFFF",
  cream: "#F6F4EF",
  ash: "#ECEAE5",
  warm: "#DDDAD3",
  pageDesk: "#D9D6CE",
  beakRust: "#B85133", // the single most identifying mark — the rust full stop
  peach: "#D88A6A",
  sage: "#5F7560",
  rust: "#A0421F",
  textBody: "#4A554E",
  textMuted: "#8A938C",
  textFaint: "#B4BAB4",
  hairline: "#E0DDD6",
  borderStrong: "#CFCBC3",
  sageTint: "#E8EDE7",
} as const;

function lum(hex: string): number {
  const h = (hex || "#000").replace("#", "");
  if (h.length < 6) return 0;
  const c = (i: number) => parseInt(h.slice(i, i + 2), 16) / 255;
  const f = (x: number) => (x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4));
  return 0.2126 * f(c(0)) + 0.7152 * f(c(2)) + 0.0722 * f(c(4));
}

/** Text/mark treatment that reads over a given archetype accent. */
export function onAccent(accent: string) {
  const light = lum(accent) > 0.45;
  return {
    light,
    text: light ? "#2A2620" : MARGOT.cream,
    soft: light ? "rgba(42,38,32,0.62)" : "rgba(246,244,239,0.72)",
    markTone: (light ? "ink" : "cream") as "ink" | "cream",
    sparkle: light ? MARGOT.beakRust : MARGOT.cream,
  };
}

/** Hex label colour for a paint-chip of a given colour. */
export function chipText(hex: string): string {
  return lum(hex) > 0.45 ? "rgba(42,38,32,0.66)" : "rgba(246,244,239,0.82)";
}

/** The flood-worthy hero colour of a palette. The design uses palette[0], but
 *  some taxonomy palettes lead with a near-white — pick the first colour with
 *  enough depth to flood the accent field, else fall back to palette[0]. */
export function pickAccent(palette: string[]): string {
  return palette.find((h) => lum(h) < 0.7) ?? palette[0] ?? MARGOT.moss;
}
