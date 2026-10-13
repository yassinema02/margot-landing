#!/usr/bin/env node
/**
 * Converts native app screens (1206 × 2622 PNG) into the WebP files served
 * from public/screens/<lang>/. Run again whenever the app UI changes:
 *
 *   node scripts/screens/build-screens.mjs <source-dir>
 *
 * <source-dir> must contain fr/ and en/ folders with one PNG per screen,
 * named like the entries of SCREEN_NAMES in lib/screens.ts.
 * sharp ships with Next.js, so no extra dependency is needed.
 */
import { mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const WIDTH = 780;
const [source] = process.argv.slice(2);
if (!source) {
  console.error("Usage: node scripts/screens/build-screens.mjs <source-dir>");
  process.exit(1);
}

for (const lang of ["fr", "en"]) {
  const from = join(source, lang);
  const to = join("public", "screens", lang);
  mkdirSync(to, { recursive: true });
  for (const file of readdirSync(from).filter((name) => name.endsWith(".png"))) {
    const out = join(to, file.replace(/\.png$/, ".webp"));
    const info = await sharp(join(from, file)).resize({ width: WIDTH }).webp({ quality: 82 }).toFile(out);
    console.log(`${out}  ${info.width}×${info.height}  ${Math.round(info.size / 1024)} KB`);
  }
}
