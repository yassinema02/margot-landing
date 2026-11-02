import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The anon client is replaced by a fake whose rpc() each test scripts.
const rpc = vi.fn();
let configured = true;
vi.mock("@/lib/supabase", () => ({
  getSupabase: () => (configured ? { rpc } : null),
}));

import {
  INVITE_COPY,
  fetchInvitePreview,
  invitePlatform,
  inviteUrl,
  isInviteToken,
  pickInviteLocale,
} from "@/lib/socialInvite";

const TOKEN = "0f8e2a4c-1b3d-4e5f-8a9b-0c1d2e3f4a5b";

let warn: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  rpc.mockReset();
  configured = true;
  warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
});

afterEach(() => {
  warn.mockRestore();
});

describe("isInviteToken", () => {
  it("accepts a uuid, lower or upper case", () => {
    expect(isInviteToken(TOKEN)).toBe(true);
    expect(isInviteToken(TOKEN.toUpperCase())).toBe(true);
  });

  it("rejects anything else", () => {
    for (const bad of ["", "abc", `${TOKEN}x`, ` ${TOKEN}`, TOKEN.replace(/-/g, ""), "../../etc", undefined, null, 42]) {
      expect(isInviteToken(bad as unknown)).toBe(false);
    }
  });
});

describe("inviteUrl", () => {
  it("is the canonical www link, token in lower case", () => {
    expect(inviteUrl(TOKEN.toUpperCase())).toBe(`https://www.margotwardrobe.com/i/${TOKEN}`);
  });
});

describe("fetchInvitePreview", () => {
  it("never calls Supabase for a token that is not a uuid: invalid", async () => {
    for (const bad of ["abc", "", `${TOKEN}/x`, "1; drop table x"]) {
      expect(await fetchInvitePreview(bad)).toEqual({ status: "invalid" });
    }
    expect(rpc).not.toHaveBeenCalled();
  });

  it("calls social_invite_preview with the lower-case token", async () => {
    rpc.mockResolvedValue({ data: { display_name: "Inès", username: "ines.b", initial: "I" }, error: null });
    const lookup = await fetchInvitePreview(TOKEN.toUpperCase());
    expect(rpc).toHaveBeenCalledTimes(1);
    expect(rpc).toHaveBeenCalledWith("social_invite_preview", { p_token: TOKEN });
    expect(lookup).toEqual({ status: "valid", preview: { displayName: "Inès", username: "ines.b", initial: "I" } });
  });

  it("invalid only for a definite null from the RPC (unknown, expired, revoked)", async () => {
    rpc.mockResolvedValue({ data: null, error: null });
    expect(await fetchInvitePreview(TOKEN)).toEqual({ status: "invalid" });
  });

  it("unavailable when Supabase is not configured", async () => {
    configured = false;
    expect(await fetchInvitePreview(TOKEN)).toEqual({ status: "unavailable" });
  });

  it("unavailable on a Supabase error, without throwing", async () => {
    rpc.mockResolvedValue({ data: null, error: { message: "permission denied for function", code: "42501" } });
    expect(await fetchInvitePreview(TOKEN)).toEqual({ status: "unavailable" });
  });

  it("unavailable when the call itself throws", async () => {
    rpc.mockRejectedValue(new Error("fetch failed"));
    expect(await fetchInvitePreview(TOKEN)).toEqual({ status: "unavailable" });
  });

  it("unavailable when the payload does not have the expected shape (our bug, not the link's)", async () => {
    const bad = [
      "Inès",
      [],
      { display_name: "Inès" },
      { display_name: "", username: "ines", initial: "I" },
      { display_name: "   ", username: "ines", initial: "I" },
      { display_name: "Inès", username: "Not Valid!", initial: "I" },
      { display_name: "Inès", username: 12, initial: "I" },
    ];
    for (const data of bad) {
      rpc.mockResolvedValueOnce({ data, error: null });
      expect(await fetchInvitePreview(TOKEN)).toEqual({ status: "unavailable" });
    }
  });

  it("logs the error code only: never the token, never the message", async () => {
    rpc.mockResolvedValue({ data: null, error: { message: `permission denied, token ${TOKEN}`, code: "42501" } });
    await fetchInvitePreview(TOKEN);
    rpc.mockRejectedValue(new Error(`boom ${TOKEN}`));
    await fetchInvitePreview(TOKEN);
    configured = false;
    await fetchInvitePreview(TOKEN);

    expect(warn).toHaveBeenCalledTimes(3);
    const logged = JSON.stringify(warn.mock.calls);
    expect(logged).toContain("42501");
    expect(logged).not.toContain(TOKEN);
    expect(logged).not.toMatch(/permission denied|boom/);
  });

  it("logs nothing for a valid or a dead link", async () => {
    rpc.mockResolvedValueOnce({ data: null, error: null });
    await fetchInvitePreview(TOKEN);
    rpc.mockResolvedValueOnce({ data: { display_name: "Inès", username: "ines", initial: "I" }, error: null });
    await fetchInvitePreview(TOKEN);
    expect(warn).not.toHaveBeenCalled();
  });

  it("keeps only the three public fields", async () => {
    rpc.mockResolvedValue({
      data: { display_name: "Inès", username: "ines", initial: "I", user_id: "secret", avatar_url: "https://x/y.jpg" },
      error: null,
    });
    expect(await fetchInvitePreview(TOKEN)).toEqual({
      status: "valid",
      preview: { displayName: "Inès", username: "ines", initial: "I" },
    });
  });

  it("cleans the display name and derives a missing or blank initial", async () => {
    rpc.mockResolvedValue({ data: { display_name: "  \u202Eélodie\u0007  ", username: "elo", initial: " " }, error: null });
    expect(await fetchInvitePreview(TOKEN)).toEqual({
      status: "valid",
      preview: { displayName: "élodie", username: "elo", initial: "É" },
    });
  });

  it("caps an oversized display name", async () => {
    rpc.mockResolvedValue({ data: { display_name: "a".repeat(500), username: "abc", initial: "A" }, error: null });
    const lookup = await fetchInvitePreview(TOKEN);
    expect(lookup.status).toBe("valid");
    if (lookup.status === "valid") expect(Array.from(lookup.preview.displayName).length).toBeLessThanOrEqual(40);
  });
});

describe("pickInviteLocale", () => {
  it("follows the visitor's first supported language", () => {
    expect(pickInviteLocale("fr-FR,fr;q=0.9,en;q=0.8")).toBe("fr");
    expect(pickInviteLocale("es-ES,es;q=0.9,en;q=0.8")).toBe("es");
    expect(pickInviteLocale("en-US,en;q=0.9,fr;q=0.8")).toBe("en");
    expect(pickInviteLocale("de-DE,de;q=0.9,es;q=0.8,fr;q=0.5")).toBe("es");
  });

  it("honours q-values over order", () => {
    expect(pickInviteLocale("en;q=0.4,fr;q=0.9")).toBe("fr");
    expect(pickInviteLocale("fr;q=0,es")).toBe("es");
  });

  it("falls back to English", () => {
    expect(pickInviteLocale("")).toBe("en");
    expect(pickInviteLocale(null)).toBe("en");
    expect(pickInviteLocale("de-DE,it;q=0.8")).toBe("en");
    expect(pickInviteLocale("*")).toBe("en");
  });
});

describe("invitePlatform", () => {
  it("detects iOS, Android and the rest", () => {
    expect(invitePlatform("Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15")).toBe("ios");
    expect(invitePlatform("Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)")).toBe("ios");
    expect(invitePlatform("Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/130 Mobile")).toBe("android");
    expect(invitePlatform("Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 Safari/605.1.15")).toBe("other");
    expect(invitePlatform("")).toBe("other");
    expect(invitePlatform(null)).toBe("other");
  });
});

describe("INVITE_COPY", () => {
  it("uses the founder's French copy verbatim", () => {
    expect(INVITE_COPY.fr.invitesYou).toBe(" t'invite sur Margot");
    expect(INVITE_COPY.fr.pitch).toBe("Margot choisit ta tenue chaque matin, avec les vêtements que tu as déjà.");
    expect(INVITE_COPY.fr.hasApp).toBe("Déjà l'app ? Ouvre ce lien sur ton téléphone.");
    expect(INVITE_COPY.fr.invalid).toBe("Ce lien n'est plus valable");
    expect(INVITE_COPY.fr.unavailable).toBe(
      "On n'a pas pu vérifier ce lien, il reste peut-être valable. Installe Margot et colle-le dans l'app.",
    );
  });

  it("matches the app's wording for an invalid link in every language", () => {
    expect(INVITE_COPY.en.invalid).toBe("This link is no longer valid");
    expect(INVITE_COPY.es.invalid).toBe("Este enlace ya no es válido");
  });

  it("follows the copy rules: no em dash, no emoji, no AI, no exclamation, no reward", () => {
    for (const locale of ["fr", "en", "es"] as const) {
      for (const text of Object.values(INVITE_COPY[locale])) {
        expect(text).not.toMatch(/[—–]/);
        expect(text).not.toMatch(/\p{Extended_Pictographic}/u);
        expect(text).not.toMatch(/\bIA\b|\bAI\b/);
        expect(text).not.toMatch(/!\s*$/);
        expect(text).not.toMatch(/récompense|reward|recompensa|gratuit|free|gratis/i);
      }
    }
  });
});
