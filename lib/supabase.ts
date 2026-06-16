import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-only anon client for the landing. Used to persist the DERIVED Studio
// Read result (never the photo, never PII beyond an opt-in email later). The
// anon key is gated to the carry-over RPCs by RLS / SECURITY DEFINER. Returns
// null when env is absent so callers degrade gracefully instead of throwing.
let client: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  client = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
  return client;
}
