import { getSupabase } from "./supabase";

// Live figures for the "Margot in numbers" section, fetched server-side from
// the landing_stats() SECURITY DEFINER RPC (aggregates only, floored values —
// no PII, anon-key safe). Pages that consume this export `revalidate = 3600`,
// so the numbers refresh at most once an hour without any manual edit.
export type LiveStats = {
  garments: number;
  analyses: number;
  outfits: number;
  wardrobes: number;
};

export async function getLandingStats(): Promise<LiveStats | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.rpc("landing_stats");
    if (error || !data) return null;
    const raw = data as Record<string, unknown>;
    const n = (v: unknown) => (typeof v === "number" && v > 0 ? v : null);
    const garments = n(raw.garments);
    const analyses = n(raw.analyses);
    const outfits = n(raw.outfits);
    const wardrobes = n(raw.wardrobes);
    if (!garments || !analyses || !outfits || !wardrobes) return null;
    return { garments, analyses, outfits, wardrobes };
  } catch {
    // Static fallback values in content.ts take over — never break the page.
    return null;
  }
}

// "25600" -> "25,600+" (en) / "25 600+" (fr, narrow no-break space).
export function formatStat(value: number, lang: "en" | "fr"): string {
  return `${new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-US").format(value)}+`;
}
