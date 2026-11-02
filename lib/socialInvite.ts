import { getSupabase } from "./supabase";

// Social invitations: https://www.margotwardrobe.com/i/<token>.
//
// The page reads the inviter through `social_invite_preview(p_token uuid)`
// (SECURITY DEFINER, granted to anon): display name, username and initial,
// nothing else, and null when the token is unknown, expired, revoked, the
// social switch is off or the inviter has no social profile. Founder
// decision: no face on any public web page, so nothing else is ever read or
// rendered.
//
// Three outcomes, never an exception, never a raw error on the page:
// - valid: the inviter to show;
// - invalid: a definite answer that the link is dead (malformed token, or
//   null from the RPC);
// - unavailable: we could not check (no env, Supabase error or exception,
//   unexpected payload, rate limit). The page then still offers the store
//   and copies the link: the app checks it after install.
// Logs carry a reason and the Postgres/PostgREST error code only: never the
// token, never an error message.

export const INVITE_ORIGIN = "https://www.margotwardrobe.com";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// Same rule as the CHECK on social_profiles.username.
const USERNAME = /^[a-z0-9._]{3,24}$/;
const DISPLAY_NAME_MAX = 40;
// C0/C1 controls and bidi overrides/isolates: a display name must not be able
// to reorder or hide the text around it.
const UNSAFE_CHARS = /[\u0000-\u001F\u007F-\u009F‎‏‪-‮⁦-⁩]/g;

export type InvitePreview = { displayName: string; username: string; initial: string };

export type InviteLookup =
  | { status: "valid"; preview: InvitePreview }
  | { status: "invalid" }
  | { status: "unavailable" };

export type UnavailableReason = "not_configured" | "rpc_error" | "exception" | "bad_payload" | "rate_limited";

/** Server log for a lookup we could not complete: reason and error code only. */
export function logInviteUnavailable(reason: UnavailableReason, code?: unknown): void {
  const safeCode = typeof code === "string" && /^[A-Za-z0-9_]{1,16}$/.test(code) ? code : undefined;
  console.warn("[social-invite] preview unavailable", safeCode ? { reason, code: safeCode } : { reason });
}

export function isInviteToken(token: unknown): token is string {
  return typeof token === "string" && UUID.test(token);
}

/** Canonical invitation link (www: the apex redirects, apps do not follow). */
export function inviteUrl(token: string): string {
  return `${INVITE_ORIGIN}/i/${token.toLowerCase()}`;
}

function cleanText(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return Array.from(value.replace(UNSAFE_CHARS, "").trim()).slice(0, max).join("").trim();
}

function firstChar(value: string): string {
  return Array.from(value)[0] ?? "";
}

function toPreview(data: unknown): InvitePreview | null {
  const row = Array.isArray(data) ? null : data;
  if (!row || typeof row !== "object") return null;
  const { display_name, username, initial } = row as Record<string, unknown>;
  const displayName = cleanText(display_name, DISPLAY_NAME_MAX);
  if (!displayName) return null;
  if (typeof username !== "string" || !USERNAME.test(username)) return null;
  const shown = firstChar(cleanText(initial, 2)) || firstChar(displayName);
  return { displayName, username, initial: shown.toLocaleUpperCase() };
}

/** Looks up the inviter of an invitation link (never throws). */
export async function fetchInvitePreview(token: string): Promise<InviteLookup> {
  if (!isInviteToken(token)) return { status: "invalid" };
  const sb = getSupabase();
  if (!sb) {
    logInviteUnavailable("not_configured");
    return { status: "unavailable" };
  }
  let data: unknown;
  try {
    const result = await sb.rpc("social_invite_preview", { p_token: token.toLowerCase() });
    if (result.error) {
      logInviteUnavailable("rpc_error", result.error.code);
      return { status: "unavailable" };
    }
    data = result.data;
  } catch {
    logInviteUnavailable("exception");
    return { status: "unavailable" };
  }
  if (data === null) return { status: "invalid" };
  const preview = toPreview(data);
  if (!preview) {
    logInviteUnavailable("bad_payload");
    return { status: "unavailable" };
  }
  return { status: "valid", preview };
}

export type InviteLocale = "fr" | "en" | "es";

/**
 * Visitor language from Accept-Language: the best-ranked of fr, en, es
 * (q-values first, then order), English otherwise, as on /download.
 */
export function pickInviteLocale(acceptLanguage: string | null | undefined): InviteLocale {
  const entries = (acceptLanguage ?? "")
    .slice(0, 1024)
    .split(",")
    .map((part, index) => {
      const [tag = "", ...params] = part.split(";").map((piece) => piece.trim());
      const qParam = params.find((param) => param.toLowerCase().startsWith("q="));
      const q = qParam === undefined ? 1 : Number(qParam.slice(2));
      return { lang: tag.toLowerCase().split("-")[0], q: Number.isFinite(q) ? q : 0, index };
    })
    .filter((entry) => entry.q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index);
  for (const { lang } of entries) {
    if (lang === "fr" || lang === "en" || lang === "es") return lang;
  }
  return "en";
}

export type InvitePlatform = "ios" | "android" | "other";

/** Which store to offer, from the user-agent (same tests as /download). */
export function invitePlatform(userAgent: string | null | undefined): InvitePlatform {
  const ua = userAgent ?? "";
  if (/Android/i.test(ua)) return "android";
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  return "other";
}

// Copy rules: tutoiement, no em dash, no emoji, never "IA"/"AI", no trailing
// exclamation mark, no reward. French is the founder's copy, verbatim; the
// invalid-link line is the app's `social.invite.no_longer_valid`.
export const INVITE_COPY: Record<
  InviteLocale,
  {
    metaTitle: string;
    /** Follows the inviter's display name. */
    invitesYou: string;
    pitch: string;
    hasApp: string;
    invalid: string;
    unavailable: string;
    appStore: string;
    playStore: string;
  }
> = {
  fr: {
    metaTitle: "Une invitation sur Margot",
    invitesYou: " t'invite sur Margot",
    pitch: "Margot choisit ta tenue chaque matin, avec les vêtements que tu as déjà.",
    hasApp: "Déjà l'app ? Ouvre ce lien sur ton téléphone.",
    invalid: "Ce lien n'est plus valable",
    unavailable: "On n'a pas pu vérifier ce lien, il reste peut-être valable. Installe Margot et colle-le dans l'app.",
    appStore: "Télécharger dans l'App Store",
    playStore: "Disponible sur Google Play",
  },
  en: {
    metaTitle: "An invitation to Margot",
    invitesYou: " invited you to Margot",
    pitch: "Margot picks your outfit every morning, from the clothes you already own.",
    hasApp: "Already have the app? Open this link on your phone.",
    invalid: "This link is no longer valid",
    unavailable: "We couldn't check this link, it may still be valid. Install Margot and paste it in the app.",
    appStore: "Download on the App Store",
    playStore: "Get it on Google Play",
  },
  es: {
    metaTitle: "Una invitación a Margot",
    invitesYou: " te invita a Margot",
    pitch: "Margot elige tu outfit cada mañana, con la ropa que ya tienes.",
    hasApp: "¿Ya tienes la app? Abre este enlace en tu teléfono.",
    invalid: "Este enlace ya no es válido",
    unavailable: "No hemos podido comprobar este enlace, puede que siga siendo válido. Instala Margot y pégalo en la app.",
    appStore: "Descargar en el App Store",
    playStore: "Disponible en Google Play",
  },
};
