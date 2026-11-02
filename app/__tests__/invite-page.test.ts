import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { ReactElement } from "react";

// Request headers the page sees, set per test.
let requestHeaders = new Headers();
vi.mock("next/headers", () => ({ headers: async () => requestHeaders }));

// Anon Supabase client: rpc() scripted per test, or absent (no env).
const rpc = vi.fn();
let configured = true;
vi.mock("@/lib/supabase", () => ({ getSupabase: () => (configured ? { rpc } : null) }));

import InvitePage, { generateMetadata, dynamic, runtime } from "../(en)/i/[token]/page";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/launch";

const TOKEN = "0f8e2a4c-1b3d-4e5f-8a9b-0c1d2e3f4a5b";
const IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148";
const ANDROID = "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/130 Mobile Safari/537.36";
const DESKTOP = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15";

let ipCounter = 0;
function visit({ ua = IPHONE, lang = "fr-FR,fr;q=0.9", ip }: { ua?: string; lang?: string; ip?: string } = {}) {
  requestHeaders = new Headers({ "user-agent": ua, "accept-language": lang, "x-real-ip": ip ?? `10.0.0.${++ipCounter}` });
}

async function render(token = TOKEN): Promise<{ html: string; text: string }> {
  const el = (await InvitePage({ params: Promise.resolve({ token }) })) as ReactElement;
  const html = renderToStaticMarkup(el);
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
  return { html, text };
}

const INES = { display_name: "Inès", username: "ines.b", initial: "I" };

beforeEach(() => {
  rpc.mockReset();
  configured = true;
  visit();
});

describe("/i/[token] route config", () => {
  it("renders per request on Node", () => {
    expect(dynamic).toBe("force-dynamic");
    expect(runtime).toBe("nodejs");
  });
});

describe("/i/[token] metadata", () => {
  it("is never indexed", async () => {
    const meta = await generateMetadata();
    expect(meta.robots).toEqual({ index: false, follow: false });
  });

  it("stays neutral: no name, no username, no Supabase call", async () => {
    rpc.mockResolvedValue({ data: INES, error: null });
    const meta = await generateMetadata();
    const all = JSON.stringify(meta);
    expect(all).not.toContain("Inès");
    expect(all).not.toContain("ines.b");
    expect(all).not.toContain(TOKEN);
    expect(rpc).not.toHaveBeenCalled();
    expect(meta.title).toBe("Une invitation sur Margot");
  });

  it("link previews use the site's neutral card, never the inviter", async () => {
    let og = (await generateMetadata()).openGraph as { images?: unknown };
    expect(og.images).toEqual(["https://www.margotwardrobe.com/fr/opengraph-image"]);
    visit({ lang: "en-US" });
    og = (await generateMetadata()).openGraph as { images?: unknown };
    expect(og.images).toEqual(["https://www.margotwardrobe.com/opengraph-image"]);
  });

  it("does not pass the invitation URL on as a referrer", async () => {
    expect((await generateMetadata()).referrer).toBe("origin");
  });

  it("follows the visitor's language", async () => {
    visit({ lang: "es-ES,es;q=0.9" });
    expect((await generateMetadata()).title).toBe("Una invitación a Margot");
    visit({ lang: "en-GB,en;q=0.9" });
    expect((await generateMetadata()).title).toBe("An invitation to Margot");
  });
});

describe("/i/[token] valid invitation", () => {
  it("shows the inviter's name, username and initial, in French", async () => {
    rpc.mockResolvedValue({ data: INES, error: null });
    const { text } = await render();
    expect(text).toContain("Inès t'invite sur Margot");
    expect(text).toContain("@ines.b");
    expect(text).toContain("Margot choisit ta tenue chaque matin, avec les vêtements que tu as déjà.");
    expect(text).toContain("Déjà l'app ? Ouvre ce lien sur ton téléphone.");
    expect(text).toMatch(/\bI\b/);
    expect(rpc).toHaveBeenCalledWith("social_invite_preview", { p_token: TOKEN });
  });

  it("never shows a face: no image at all", async () => {
    rpc.mockResolvedValue({ data: { ...INES, avatar_url: "https://example.com/face.jpg" }, error: null });
    const { html } = await render();
    expect(html).not.toMatch(/<img|<picture|background-image|face\.jpg/i);
  });

  it("iPhone: App Store only", async () => {
    rpc.mockResolvedValue({ data: INES, error: null });
    const { html } = await render();
    expect(html).toContain(`href="${APP_STORE_URL}"`);
    expect(html).not.toContain("play.google.com");
  });

  it("Android: Google Play only, tagged for the Play console", async () => {
    visit({ ua: ANDROID });
    rpc.mockResolvedValue({ data: INES, error: null });
    const { html } = await render();
    expect(html).toContain(PLAY_STORE_URL);
    expect(html).toContain("utm_campaign%3Dsocial_invite");
    expect(html).not.toContain("apps.apple.com");
  });

  it("desktop: both stores", async () => {
    visit({ ua: DESKTOP });
    rpc.mockResolvedValue({ data: INES, error: null });
    const { html } = await render();
    expect(html).toContain("apps.apple.com");
    expect(html).toContain("play.google.com");
  });

  it("Spanish and English copy", async () => {
    rpc.mockResolvedValue({ data: INES, error: null });
    visit({ lang: "es-MX,es;q=0.9" });
    let { text } = await render();
    expect(text).toContain("Inès te invita a Margot");
    expect(text).toContain("Margot elige tu outfit cada mañana, con la ropa que ya tienes.");
    expect(text).toContain("¿Ya tienes la app? Abre este enlace en tu teléfono.");

    visit({ lang: "de-DE,de;q=0.9" });
    ({ text } = await render());
    expect(text).toContain("Inès invited you to Margot");
    expect(text).toContain("Already have the app? Open this link on your phone.");
  });

  it("marks up the content in the visitor's language", async () => {
    rpc.mockResolvedValue({ data: INES, error: null });
    visit({ lang: "fr-FR" });
    expect((await render()).html).toContain('lang="fr"');
  });

  it("tracks store taps under their own placement", async () => {
    rpc.mockResolvedValue({ data: INES, error: null });
    const { html } = await render();
    expect(html).toContain('data-placement="social_invite"');
  });
});

describe("/i/[token] invalid or unavailable", () => {
  it("unknown, expired or revoked token: calm message and a store button", async () => {
    rpc.mockResolvedValue({ data: null, error: null });
    const { html, text } = await render();
    expect(text).toContain("Ce lien n'est plus valable");
    expect(html).toContain(`href="${APP_STORE_URL}"`);
    expect(text).not.toContain("@");
    expect(text).not.toContain("Déjà l'app");
    expect(html).toContain('data-placement="social_invite_invalid"');
  });

  it("not a uuid: no Supabase call at all", async () => {
    const { text } = await render("not-a-token");
    expect(text).toContain("Ce lien n'est plus valable");
    expect(rpc).not.toHaveBeenCalled();
  });

  it("Supabase error: same calm message, no technical detail", async () => {
    rpc.mockResolvedValue({ data: null, error: { message: "permission denied for function social_invite_preview", code: "42501" } });
    const { html, text } = await render();
    expect(text).toContain("Ce lien n'est plus valable");
    expect(html).not.toMatch(/permission|42501|error/i);
  });

  it("Supabase throws: same calm message", async () => {
    rpc.mockRejectedValue(new Error("fetch failed"));
    expect((await render()).text).toContain("Ce lien n'est plus valable");
  });

  it("no Supabase configured (build, preview): renders, does not crash", async () => {
    configured = false;
    expect((await render()).text).toContain("Ce lien n'est plus valable");
  });

  it("other languages", async () => {
    rpc.mockResolvedValue({ data: null, error: null });
    visit({ lang: "en-US" });
    expect((await render()).text).toContain("This link is no longer valid");
    visit({ lang: "es-ES" });
    expect((await render()).text).toContain("Este enlace ya no es válido");
  });

  it("rate limit: past 30 lookups a minute from one address, no more Supabase calls", async () => {
    rpc.mockResolvedValue({ data: INES, error: null });
    for (let i = 0; i < 30; i++) {
      visit({ ip: "203.0.113.7" });
      expect((await render()).text).toContain("Inès t'invite sur Margot");
    }
    expect(rpc).toHaveBeenCalledTimes(30);

    visit({ ip: "203.0.113.7" });
    expect((await render()).text).toContain("Ce lien n'est plus valable");
    expect(rpc).toHaveBeenCalledTimes(30);

    // Another address is not affected.
    visit({ ip: "203.0.113.8" });
    expect((await render()).text).toContain("Inès t'invite sur Margot");
  });

  it("rate limit keys on x-real-ip, never on the spoofable x-forwarded-for", async () => {
    rpc.mockResolvedValue({ data: INES, error: null });
    for (let i = 0; i < 30; i++) {
      requestHeaders = new Headers({ "user-agent": IPHONE, "x-real-ip": "198.51.100.9", "x-forwarded-for": `1.2.3.${i}` });
      await render();
    }
    requestHeaders = new Headers({ "user-agent": IPHONE, "x-real-ip": "198.51.100.9", "x-forwarded-for": "9.9.9.9" });
    expect((await render()).text).toContain("This link is no longer valid");
  });
});
