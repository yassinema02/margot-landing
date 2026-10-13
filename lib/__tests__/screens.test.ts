import { existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { SCREEN_FOCUS, SCREEN_NAMES, SCREEN_SIZE, screenSrc } from "../screens";

describe("app screens", () => {
  it("builds language-specific paths", () => {
    expect(screenSrc("fr", "home")).toBe("/screens/fr/home.webp");
    expect(screenSrc("en", "styles")).toBe("/screens/en/styles.webp");
  });

  it("gives every screen a focus between 0 and 100 in each language", () => {
    for (const lang of ["fr", "en"] as const) {
      for (const name of SCREEN_NAMES) {
        expect(SCREEN_FOCUS[lang][name], `${lang}/${name}`).toBeGreaterThanOrEqual(0);
        expect(SCREEN_FOCUS[lang][name], `${lang}/${name}`).toBeLessThanOrEqual(100);
      }
    }
  });

  for (const lang of ["fr", "en"] as const) {
    for (const name of SCREEN_NAMES) {
      it(`ships ${lang}/${name} at the declared size`, async () => {
        const file = join(process.cwd(), "public", screenSrc(lang, name));
        expect(existsSync(file), file).toBe(true);
        const meta = await sharp(file).metadata();
        expect({ width: meta.width, height: meta.height }).toEqual(SCREEN_SIZE);
      });
    }
  }
});
