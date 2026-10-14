import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { MARGOT_LIMITS } from "../compare/margot";
import { HOME, type HomeCopy } from "../home";
import { SCREEN_NAMES } from "../screens";

const LANGS = ["fr", "en"] as const;

// Top-level fields that never appear in the page body.
const HIDDEN_FIELDS = new Set(["title", "description", "schemaDescription"]);

function visibleStrings(copy: HomeCopy): string[] {
  const out: string[] = [];
  const walk = (value: unknown, key: string | null): void => {
    if (key === "href" || key === "name") return; // URLs and screen ids
    if (typeof value === "string") out.push(value);
    else if (Array.isArray(value)) value.forEach((item) => walk(item, null));
    else if (value && typeof value === "object") Object.entries(value).forEach(([k, v]) => walk(v, k));
  };
  Object.entries(copy)
    .filter(([key]) => !HIDDEN_FIELDS.has(key))
    .forEach(([key, value]) => walk(value, key));
  return out;
}

describe("HOME", () => {
  it("has the same structure in French and English", () => {
    for (const key of ["steps", "features", "faq", "guides", "offerFreeItems", "offerPremiumItems", "stats"] as const) {
      expect(HOME.en[key].length, key).toBe(HOME.fr[key].length);
    }
    expect(HOME.fr.steps).toHaveLength(3);
    expect(HOME.fr.features).toHaveLength(4);
    expect(HOME.fr.faq).toHaveLength(6);
  });

  it.each(LANGS)("uses each app screen at most once in %s", (lang) => {
    const t = HOME[lang];
    const used = [...t.steps.map((s) => s.screen), ...t.features.map((f) => f.screen)].map((s) => s.name);
    expect(new Set(used).size).toBe(used.length);
    for (const name of used) expect(SCREEN_NAMES).toContain(name);
  });

  it.each(LANGS)("describes every %s image for screen readers", (lang) => {
    const t = HOME[lang];
    for (const screen of [...t.steps.map((s) => s.screen), ...t.features.map((f) => f.screen)]) {
      expect(screen.alt.length, screen.name).toBeGreaterThan(30);
    }
    expect(t.comparison.beforeAlt.length).toBeGreaterThan(30);
    expect(t.comparison.afterAlt.length).toBeGreaterThan(30);
    expect(t.video.transcript.length).toBeGreaterThan(30);
  });

  it.each(LANGS)("ships the %s video, its poster and the slider photos", (lang) => {
    const files = [`video/margot-15s-${lang}.mp4`, `video/margot-15s-${lang}-poster.webp`, ...["before", "after", "blazer", "tank", "jeans", "sneakers"].map((n) => `editorial/avant-apres/${n}.webp`)];
    for (const file of files) expect(existsSync(join(process.cwd(), "public", file)), file).toBe(true);
  });

  it.each(LANGS)("keeps visible %s copy free of AI wording and em dashes", (lang) => {
    const strings = visibleStrings(HOME[lang]);
    expect(strings.length).toBeGreaterThan(40);
    for (const text of strings) expect(text, text).not.toMatch(/\b(IA|AI)\b|—/);
  });

  it.each(LANGS)("quotes every %s quota from MARGOT_LIMITS", (lang) => {
    const free = HOME[lang].offerFreeItems.join(" | ");
    const premium = HOME[lang].offerPremiumItems.join(" | ");
    expect(free).toContain(String(MARGOT_LIMITS.freePieces));
    expect(free).toContain(String(MARGOT_LIMITS.freeOutfitsPerDay));
    expect(free).toContain(String(MARGOT_LIMITS.freeTryOnsPerWeek));
    expect(premium).toContain(String(MARGOT_LIMITS.premiumOutfitsPerDay));
    expect(premium).toContain(String(MARGOT_LIMITS.premiumTryOnsPerDay));
  });

  it("keeps the JSON-LD app description as it is in production", () => {
    expect(HOME.fr.schemaDescription).toMatch(/^Margot est une application de dressing et une styliste personnelle assistée par l’IA\./);
    expect(HOME.en.schemaDescription).toMatch(/^Margot is a wardrobe app and an AI-assisted personal stylist\./);
  });
});
