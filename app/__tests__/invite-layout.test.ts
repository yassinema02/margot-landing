import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement, type ReactElement } from "react";

// /i/<token> carries a bearer token in its URL (whoever holds it can become
// friends with the inviter and take the paywall exemption). Its root layout
// must not load any tracker that ships the page URL to a third party.

let requestHeaders = new Headers();
vi.mock("next/headers", () => ({ headers: async () => requestHeaders }));
// next/font only runs under the Next compiler.
vi.mock("@/lib/fonts", () => ({ fraunces: { variable: "font-f" }, montserrat: { variable: "font-m" } }));

const read = (path: string) => readFileSync(fileURLToPath(new URL(path, import.meta.url)), "utf8");
const importsOf = (source: string) => Array.from(source.matchAll(/from\s+["']([^"']+)["']|import\s+["']([^"']+)["']/g), (m) => m[1] ?? m[2]);

type Layout = (props: { children: React.ReactNode }) => Promise<ReactElement>;
let InviteLayout: Layout;

beforeAll(async () => {
  // Even with every tracker configured, none may appear on /i/.
  process.env.NEXT_PUBLIC_GA_ID = "G-TESTTEST";
  InviteLayout = (await import("../(invite)/layout")).default as unknown as Layout;
});

async function render(lang?: string): Promise<string> {
  requestHeaders = new Headers(lang ? { "accept-language": lang } : {});
  return renderToStaticMarkup(await InviteLayout({ children: createElement("main", null, "page") }));
}

describe("invite root layout", () => {
  it("renders no GA/gtag, Meta Pixel, Vercel Analytics or cookie banner", async () => {
    const html = await render("fr-FR");
    expect(html).not.toMatch(/gtag|googletagmanager|google-analytics|G-TESTTEST|dataLayer/i);
    expect(html).not.toMatch(/fbq|facebook/i);
    expect(html).not.toMatch(/_vercel|vercel|insights/i);
    expect(html).not.toMatch(/cookie|consent/i);
    expect(html).toContain("<main>page</main>");
  });

  it("does not even import them", () => {
    const imports = importsOf(read("../(invite)/layout.tsx"));
    for (const banned of [
      "@vercel/analytics",
      "@next/third-parties",
      "next/script",
      "@/components/RootShell",
      "@/components/analytics/MetaPixel",
      "@/components/analytics/ConsentBanner",
      "@/components/analytics/ConsentProvider",
    ]) {
      expect(imports.some((spec) => spec.startsWith(banned))).toBe(false);
    }
    expect(imports).toContain("@/components/PostHogProvider");
  });

  it("keeps PostHog with /flags off, and store taps to PostHog only", () => {
    const source = read("../(invite)/layout.tsx");
    expect(source).toMatch(/<PostHogProvider\s+disableFlags\s*>/);
    expect(source).toMatch(/<ConversionTracker\s+ga=\{false\}\s*\/>/);
  });

  it("<html lang> follows the visitor (so store-tap events carry the right language)", async () => {
    expect(await render("fr-FR,fr;q=0.9")).toMatch(/<html lang="fr"/);
    expect(await render("es-MX,es;q=0.9")).toMatch(/<html lang="es"/);
    expect(await render("en-GB")).toMatch(/<html lang="en"/);
    expect(await render("de-DE")).toMatch(/<html lang="en"/);
    expect(await render()).toMatch(/<html lang="en"/);
  });
});

describe("the other root layouts are unchanged", () => {
  it("(en) and (fr) still go through RootShell, which keeps its analytics", () => {
    expect(read("../(en)/layout.tsx")).toContain('<RootShell lang="en">');
    expect(read("../(fr)/layout.tsx")).toContain('<RootShell lang="fr">');
    const shell = read("../../components/RootShell.tsx");
    for (const kept of ["<Analytics />", "<GoogleAnalytics", "<MetaPixel />", "<ConsentBanner", "<ConversionTracker />"]) {
      expect(shell).toContain(kept);
    }
  });

  it("no invitation route is left under (en)", () => {
    expect(() => read("../(en)/i/[token]/page.tsx")).toThrow();
  });
});
