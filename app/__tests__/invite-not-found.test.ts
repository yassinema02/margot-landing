import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { ReactElement } from "react";

// A notFound() under /i/ (none today) must render inside the tracker-free
// (invite) layout: its own not-found page, never the global 404 and its
// RootShell (GA4, Meta Pixel, Vercel Analytics) with a token in the URL.

let requestHeaders = new Headers();
vi.mock("next/headers", () => ({ headers: async () => requestHeaders }));

import InviteNotFound, { metadata } from "../(invite)/not-found";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/launch";

const read = (path: string) => readFileSync(fileURLToPath(new URL(path, import.meta.url)), "utf8");
const importsOf = (source: string) => Array.from(source.matchAll(/from\s+["']([^"']+)["']|import\s+["']([^"']+)["']/g), (m) => m[1] ?? m[2]);

const IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148";
const ANDROID = "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/130 Mobile Safari/537.36";
const DESKTOP = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15";

async function render({ ua = IPHONE, lang = "fr-FR,fr;q=0.9" } = {}): Promise<string> {
  requestHeaders = new Headers({ "user-agent": ua, "accept-language": lang });
  return renderToStaticMarkup((await InviteNotFound()) as ReactElement).replace(/&#x27;/g, "'");
}

describe("(invite) not-found", () => {
  it("lives in the (invite) group, so the tracker-free invite layout wraps it", () => {
    expect(() => read("../(invite)/not-found.tsx")).not.toThrow();
    expect(read("../(invite)/layout.tsx")).toContain("export default async function InviteRootLayout");
  });

  it("imports no tracker and not RootShell", () => {
    const imports = importsOf(read("../(invite)/not-found.tsx"));
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
  });

  it("renders no <html>, no GA/gtag, Meta Pixel, Vercel Analytics or cookie banner", async () => {
    const html = await render({ ua: DESKTOP });
    expect(html).not.toMatch(/<html|<body/);
    expect(html).not.toMatch(/gtag|googletagmanager|google-analytics|dataLayer/i);
    expect(html).not.toMatch(/fbq|facebook/i);
    expect(html).not.toMatch(/_vercel|insights/i);
    expect(html).not.toMatch(/cookie|consent/i);
  });

  it("the Margot mark, the calm line in the visitor's language, and a store button", async () => {
    const fr = await render();
    expect(fr).toContain("Margot");
    expect(fr).toContain("Ce lien n'est plus valable");
    expect(fr).toContain(`href="${APP_STORE_URL}"`);
    expect(fr).not.toContain("play.google.com");
    expect(fr).toContain('data-placement="social_invite_not_found"');
    expect(await render({ lang: "es-ES", ua: ANDROID })).toContain("Este enlace ya no es válido");
    const android = await render({ lang: "en-GB", ua: ANDROID });
    expect(android).toContain("This link is no longer valid");
    expect(android).toContain(PLAY_STORE_URL.replace(/&/g, "&amp;"));
    expect(android).not.toContain(APP_STORE_URL);
    const desktop = await render({ ua: DESKTOP });
    expect(desktop).toContain(APP_STORE_URL);
    expect(desktop).toContain("play.google.com");
  });

  it("is never indexed and never sends a referrer", () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(metadata.referrer).toBe("no-referrer");
  });
});
