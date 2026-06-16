import { getSupabase } from "../supabase";
import type { StudioReadResult } from "./types";

// Best-effort anonymous persistence of the DERIVED result, keyed by an opaque
// token. Email is attached LATER (separate RPC) when the user opts in — so the
// OG/share card can read the result by token BEFORE any email is given.
// Never persists the photo. Failure here must NOT break the API response, so
// every error is swallowed (the share card just 404s for that token until the
// carry-over migration is live).
export async function saveStudioReadAnon(token: string, result: StudioReadResult): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  try {
    await sb.rpc("save_studio_read_anon", { p_token: token, p_result: result });
  } catch {
    /* best-effort */
  }
}
