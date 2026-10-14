import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("llms-full.txt", () => {
  it("describes the homepage visuals as they are now", () => {
    const text = readFileSync(join(process.cwd(), "public", "llms-full.txt"), "utf8");
    expect(text).not.toMatch(/before\/after/i);
    expect(text).toMatch(/homepage shows screens from the app/i);
  });
});
