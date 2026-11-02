import { beforeAll, describe, expect, it } from "vitest";

type HeaderRule = { source: string; headers: { key: string; value: string }[] };

// next.config.mjs is plain JS (allowJs is off): loaded by URL, typed here.
let nextConfig: { headers: () => Promise<HeaderRule[]> };
beforeAll(async () => {
  nextConfig = (await import(/* @vite-ignore */ new URL("../../next.config.mjs", import.meta.url).href)).default;
});

describe("next.config headers for /i/", () => {
  it("never indexes an invitation and never sends it on as a referrer", async () => {
    const rules = await nextConfig.headers();
    const invite = rules.findIndex((rule) => rule.source === "/i/:path*");
    expect(invite).toBeGreaterThanOrEqual(0);
    expect(rules[invite].headers).toEqual(
      expect.arrayContaining([
        { key: "X-Robots-Tag", value: "noindex, nofollow" },
        { key: "Referrer-Policy", value: "no-referrer" },
      ]),
    );
    // Next applies the last matching value: the /i/ rule must come after the
    // site-wide one (strict-origin-when-cross-origin).
    const global = rules.findIndex((rule) => rule.source === "/(.*)");
    expect(invite).toBeGreaterThan(global);
  });

  it("leaves the site-wide headers alone", async () => {
    const rules = await nextConfig.headers();
    const global = rules.find((rule) => rule.source === "/(.*)")!;
    expect(global.headers).toContainEqual({ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" });
  });
});
