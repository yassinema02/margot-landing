import { ARCHETYPES } from "./archetypes";
import {
  isArchetypeId,
  type ArchetypeId,
  type Locale,
  type RawArchetypeRead,
  type StudioReadResult,
} from "./types";

// Soft neutral palette for the aspirational "pared-back" card (NOT from the face).
const NEUTRAL_PALETTE = ["#EFE7D8", "#C8B49A", "#8A7D6B", "#3B3730"];

const COPY = {
  unreadable: {
    en: { why: "I can't see your outfit clearly yet — show me a full-length fit (a mirror selfie works). Then I'll read your style.", headline: "Show me your fit", margot: "i can't read what i can't see." },
    fr: { why: "Je ne vois pas encore ta tenue — montre-moi un look en pied (un selfie miroir suffit). Ensuite je lis ton style.", headline: "Montre-moi ta tenue", margot: "je ne lis pas ce que je ne vois pas." },
  },
  neutralHeadline: { en: "You read pared-back", fr: "Tu lis épuré" },
  nudge: {
    en: "Upload your wardrobe in Margot to unlock your full archetype.",
    fr: "Charge ta garde-robe dans Margot pour révéler ton archétype complet.",
  },
};

/** Strip tags, collapse whitespace, drop the word "AI", cap length. */
function sanitize(s: string | undefined, max = 400): string {
  if (!s) return "";
  return s
    .replace(/<[^>]*>/g, " ")
    .replace(/\bAI\b/gi, "styling")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function neutralIdentity(leanLabel: string, locale: Locale): string {
  return locale === "fr"
    ? `Tu lis épuré — ta direction la plus proche, c'est ${leanLabel}.`
    : `You lean pared-back — your closest direction is ${leanLabel}.`;
}
function neutralWhy(leanLabel: string, locale: Locale): string {
  return locale === "fr"
    ? `Ta tenue est nette et discrète, sans parti pris marqué — et c'est un flex en soi. Ta tendance la plus proche, c'est ${leanLabel} : voilà par où l'assumer. ${COPY.nudge.fr}`
    : `Your fit reads clean and low-key, with no loud point of view — and that's its own flex. Your closest lean is ${leanLabel} — here's how to own it. ${COPY.nudge.en}`;
}

/**
 * Map the model's compact classification → the full, deterministic result.
 * The 3 baked-in conditions live here. The dustbin trigger is `distinctiveness`,
 * NOT confidence — a banal fit returns minimalist at HIGH confidence, so only the
 * independent distinctiveness signal can catch it.
 */
export function applyReframe(raw: RawArchetypeRead, locale: Locale): StudioReadResult {
  const distinct = raw?.distinctiveness ?? "low";
  const sig = raw?.style_signal ?? "none";
  const base = { style_signal: sig, distinctiveness: distinct } as const;

  // 1) Unreadable — no outfit visible, or no/invalid primary. Never a verdict.
  if (sig === "none" || !raw?.primary || !isArchetypeId(raw.primary.id)) {
    return {
      status: "unreadable",
      primary: null,
      secondary: null,
      why: COPY.unreadable[locale].why,
      starter_kit: [],
      share_card: { headline: COPY.unreadable[locale].headline, palette_hexes: NEUTRAL_PALETTE, one_liner: COPY.unreadable[locale].margot },
      ...base,
    };
  }

  const primaryId = raw.primary.id as ArchetypeId;
  const secondaryId = raw.secondary && isArchetypeId(raw.secondary.id) ? (raw.secondary.id as ArchetypeId) : null;

  // 2) Neutral / dustbin — PRUDENCE: only a CLEARLY HIGH distinctiveness earns a
  //    confident "read". Anything less (medium OR low), regardless of confidence,
  //    OR a partial signal → aspirational neutral. A false confident verdict on a
  //    banal fit is worse than "you read pared-back, your lean is {X}". This is the
  //    durable fix: routing depends on the distinctiveness AXIS, not the label.
  if (distinct !== "high" || sig === "partial") {
    const leanId = secondaryId ?? primaryId;
    const lean = ARCHETYPES[leanId];
    const leanLabel = lean.label[locale];
    return {
      status: "neutral",
      primary: { id: leanId, label: leanLabel, identity_line: neutralIdentity(leanLabel, locale), confidence: "low" },
      secondary: null,
      why: neutralWhy(leanLabel, locale),
      starter_kit: lean.starter_kit.map((p) => ({ piece: p.piece[locale], why: p.why[locale] })),
      share_card: {
        headline: COPY.neutralHeadline[locale],
        palette_hexes: NEUTRAL_PALETTE,
        one_liner: locale === "fr" ? "épuré. et c'est assumé." : "pared-back. and quietly sure of it.",
      },
      ...base,
    };
  }

  // 3) Read — a clear, deliberate archetype.
  const meta = ARCHETYPES[primaryId];
  return {
    status: "read",
    primary: { id: primaryId, label: meta.label[locale], identity_line: meta.identity_line[locale], confidence: raw.primary.confidence },
    secondary: secondaryId ? { id: secondaryId, label: ARCHETYPES[secondaryId].label[locale] } : null,
    why: sanitize(raw.why) || meta.identity_line[locale],
    starter_kit: meta.starter_kit.map((p) => ({ piece: p.piece[locale], why: p.why[locale] })),
    share_card: { headline: meta.label[locale], palette_hexes: meta.palette_hexes, one_liner: meta.one_liner[locale] },
    ...base,
  };
}
