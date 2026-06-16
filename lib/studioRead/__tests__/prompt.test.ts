import { describe, it, expect } from "vitest";
import { buildArchetypePrompt, MODEL, PROMPT_VERSION } from "../prompt";
import { ARCHETYPE_IDS } from "../types";

describe("archetype prompt", () => {
  it("pins model + version", () => {
    expect(MODEL).toBe("gemini-2.5-flash");
    expect(PROMPT_VERSION).toMatch(/archetype-v2/);
  });

  it("contains all 8 ids and the hard rules", () => {
    const en = buildArchetypePrompt("en");
    ARCHETYPE_IDS.forEach((id) => expect(en).toContain(id));
    expect(en).toContain("distinctiveness"); // the dustbin-closing field
    expect(en).toContain("confidence");
    expect(en).toContain("style_signal");
    expect(en).toContain("NEVER from skin colour"); // the protected attributes
    expect(en).toContain('NEVER use the word "AI"');
  });

  it("localizes the why language", () => {
    expect(buildArchetypePrompt("fr")).toContain("French");
    expect(buildArchetypePrompt("en")).toContain("English");
  });
});
