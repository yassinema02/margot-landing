import { getSupabase } from "../supabase";
import type { Locale, StudioReadResult } from "./types";

// Best-effort carry-over persistence of the DERIVED result, keyed by an opaque
// token. Email is attached LATER (separate call) when the user opts in — so the
// OG/share card can read the result by token BEFORE any email is given.
// Never persists the photo. Failures here must NOT break the API response, so
// every error is swallowed (the share card just 404s for that token until the
// carry-over migration is live).

export async function saveStudioReadAnon(token: string, result: StudioReadResult, locale: Locale): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  try {
    await sb.rpc("save_studio_read_anon", { p_token: token, p_result: result, p_locale: locale });
  } catch {
    /* best-effort */
  }
}

/** Consent step: attach an opted-in email to a previously-saved token. */
export async function attachStudioReadEmail(token: string, email: string): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  try {
    await sb.rpc("attach_studio_read_email", { p_token: token, p_email: email });
  } catch {
    /* best-effort */
  }
}

/** Read a derived result by token for the share/OG card. Null if absent/unconfigured. */
export async function getStudioRead(token: string): Promise<{ result: StudioReadResult; locale: Locale } | null> {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb.rpc("get_studio_read", { p_token: token });
    const row = Array.isArray(data) ? data[0] : data;
    if (error || !row?.result) return null;
    return { result: row.result as StudioReadResult, locale: row.locale === "fr" ? "fr" : "en" };
  } catch {
    return null;
  }
}
