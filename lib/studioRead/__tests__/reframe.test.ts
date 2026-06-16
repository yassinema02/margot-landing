import { describe, it, expect } from "vitest";
import { applyReframe } from "../reframe";
import type { RawArchetypeRead } from "../types";

const raw = (o: Partial<RawArchetypeRead>): RawArchetypeRead => ({
  primary: null,
  secondary: null,
  style_signal: "strong",
  distinctiveness: "high",
  ...o,
});

describe("applyReframe", () => {
  it("no outfit (style_signal none) -> unreadable, no verdict", () => {
    const r = applyReframe(raw({ style_signal: "none", distinctiveness: "low", primary: { id: "minimalist", confidence: "low" } }), "en");
    expect(r.status).toBe("unreadable");
    expect(r.primary).toBeNull();
    expect(r.starter_kit).toHaveLength(0);
  });

  it("THE DUSTBIN: confident minimalist + LOW distinctiveness -> neutral, never 'undefined'", () => {
    const r = applyReframe(raw({ style_signal: "strong", distinctiveness: "low", primary: { id: "minimalist", confidence: "high" }, secondary: { id: "streetwear" } }), "en");
    expect(r.status).toBe("neutral");
    expect(JSON.stringify(r).toLowerCase()).not.toContain("undefined");
    expect(r.share_card.headline.toLowerCase()).toContain("pared-back");
    // leans on the secondary, never presents a confident "minimalist" verdict
    expect(r.primary?.id).toBe("streetwear");
    expect(r.primary?.confidence).toBe("low");
    expect(r.why.toLowerCase()).toContain("upload your wardrobe");
  });

  it("partial signal -> neutral even when distinctiveness is high", () => {
    const r = applyReframe(raw({ style_signal: "partial", distinctiveness: "high", primary: { id: "edgy", confidence: "high" }, secondary: { id: "streetwear" } }), "en");
    expect(r.status).toBe("neutral");
  });

  it("PRUDENCE: strong signal + MEDIUM distinctiveness -> neutral (not a confident read), even at high confidence", () => {
    const r = applyReframe(raw({ style_signal: "strong", distinctiveness: "medium", primary: { id: "streetwear", confidence: "high" }, secondary: null }), "en");
    expect(r.status).toBe("neutral");
    expect(JSON.stringify(r).toLowerCase()).not.toContain("undefined");
  });

  it("strong + high distinctiveness -> read, with deterministic taxonomy content", () => {
    const r = applyReframe(raw({ distinctiveness: "high", style_signal: "strong", primary: { id: "boho", confidence: "high" }, secondary: { id: "romantic" } }), "en");
    expect(r.status).toBe("read");
    expect(r.primary?.id).toBe("boho");
    expect(r.primary?.label).toBe("Boho");
    expect(r.secondary?.label).toBe("Romantic");
    expect(r.starter_kit.length).toBeGreaterThanOrEqual(5);
    expect(r.share_card.palette_hexes).toHaveLength(4);
  });

  it("fr locale yields fr labels", () => {
    const r = applyReframe(raw({ distinctiveness: "high", style_signal: "strong", primary: { id: "romantic", confidence: "high" }, secondary: { id: "boho" } }), "fr");
    expect(r.primary?.label).toBe("Romantique");
  });

  it("hallucinated / invalid primary id -> unreadable (never crashes)", () => {
    const r = applyReframe(raw({ primary: { id: "cottagecore", confidence: "high" } }), "en");
    expect(r.status).toBe("unreadable");
  });
});
