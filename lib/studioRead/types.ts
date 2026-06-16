// Studio Read — shared types for the archetype engine.

export const ARCHETYPE_IDS = [
  "quiet_luxury",
  "minimalist",
  "bold_glam",
  "boho",
  "streetwear",
  "dark_academia",
  "romantic",
  "edgy",
] as const;

export type ArchetypeId = (typeof ARCHETYPE_IDS)[number];
export type Confidence = "high" | "medium" | "low";
export type StyleSignal = "strong" | "partial" | "none";
export type Locale = "en" | "fr";

export function isArchetypeId(v: unknown): v is ArchetypeId {
  return typeof v === "string" && (ARCHETYPE_IDS as readonly string[]).includes(v);
}

/** Raw shape the model returns — classification only. The card content
 *  (labels, identity, starter kit, palette) is built deterministically from
 *  our taxonomy in `applyReframe`, never trusted from the model. */
export type RawArchetypeRead = {
  primary: { id: string; confidence: Confidence } | null;
  secondary: { id: string } | null;
  why?: string;
  style_signal: StyleSignal;
  distinctiveness: Confidence; // judged INDEPENDENTLY of confidence
};

export type StudioReadResult = {
  status: "read" | "neutral" | "unreadable";
  primary: { id: ArchetypeId; label: string; identity_line: string; confidence: Confidence } | null;
  secondary: { id: ArchetypeId; label: string } | null;
  why: string;
  starter_kit: { piece: string; why: string }[];
  share_card: { headline: string; palette_hexes: string[]; one_liner: string };
  style_signal: StyleSignal;
  distinctiveness: Confidence;
};
