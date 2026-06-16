import { describe, it, expect } from "vitest";
import { ARCHETYPE_IDS, isArchetypeId } from "../types";
import { ARCHETYPES } from "../archetypes";

const HEX = /^#[0-9A-Fa-f]{6}$/;

describe("archetype taxonomy", () => {
  it("has exactly 8 stable, unique ids", () => {
    expect(ARCHETYPE_IDS).toHaveLength(8);
    expect(new Set(ARCHETYPE_IDS).size).toBe(8);
  });

  it("isArchetypeId guards correctly", () => {
    expect(isArchetypeId("boho")).toBe(true);
    expect(isArchetypeId("not_a_thing")).toBe(false);
    expect(isArchetypeId(null)).toBe(false);
  });

  it("every id has complete, well-formed meta (en+fr, 4 hexes, 5-7 pieces)", () => {
    for (const id of ARCHETYPE_IDS) {
      const m = ARCHETYPES[id];
      expect(m, id).toBeDefined();
      for (const loc of ["en", "fr"] as const) {
        expect(m.label[loc].length, `${id}.label.${loc}`).toBeGreaterThan(0);
        expect(m.identity_line[loc].length, `${id}.identity.${loc}`).toBeGreaterThan(0);
        expect(m.one_liner[loc].length, `${id}.one_liner.${loc}`).toBeGreaterThan(0);
      }
      expect(m.palette_hexes, `${id}.palette`).toHaveLength(4);
      m.palette_hexes.forEach((h) => expect(h, `${id} hex ${h}`).toMatch(HEX));
      expect(m.starter_kit.length, `${id}.kit`).toBeGreaterThanOrEqual(5);
      expect(m.starter_kit.length, `${id}.kit`).toBeLessThanOrEqual(7);
      m.starter_kit.forEach((piece, i) => {
        expect(piece.piece.en.length, `${id}.kit[${i}].piece.en`).toBeGreaterThan(0);
        expect(piece.piece.fr.length, `${id}.kit[${i}].piece.fr`).toBeGreaterThan(0);
        expect(piece.why.en.length, `${id}.kit[${i}].why.en`).toBeGreaterThan(0);
        expect(piece.why.fr.length, `${id}.kit[${i}].why.fr`).toBeGreaterThan(0);
      });
    }
  });
});
