import { buildArchetypePrompt, MODEL } from "./prompt";
import { applyReframe } from "./reframe";
import type { Locale, RawArchetypeRead, StudioReadResult } from "./types";

const ENDPOINT = (model: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

/** A safe "unreadable" result for any failure path — engine never throws. */
function unreadable(locale: Locale): StudioReadResult {
  return applyReframe({ primary: null, secondary: null, style_signal: "none", distinctiveness: "low" }, locale);
}

/**
 * Classify an outfit photo into an archetype result.
 * - Holds NO key in the client: callers run this server-side only.
 * - Never throws: Gemini safety blocks, non-200s, empty/oversized/malformed
 *   output all map to a graceful `unreadable` result (the API surfaces it as a
 *   normal 200, never a 5xx).
 * - The photo is used in-memory only; this function never persists it.
 */
export async function classifyFit(imageBase64: string, locale: Locale): Promise<StudioReadResult> {
  const key = process.env.GEMINI_API_KEY;
  if (!key || !imageBase64) return unreadable(locale);
  try {
    const res = await fetch(ENDPOINT(MODEL), {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        contents: [
          { parts: [{ text: buildArchetypePrompt(locale) }, { inline_data: { mime_type: "image/jpeg", data: imageBase64 } }] },
        ],
        generationConfig: { temperature: 0.2 },
      }),
    });
    if (!res.ok) return unreadable(locale);
    const j = (await res.json()) as {
      candidates?: { finishReason?: string; content?: { parts?: { text?: string }[] } }[];
    };
    const cand = j?.candidates?.[0];
    if (!cand || cand.finishReason === "SAFETY") return unreadable(locale);
    const text = (cand.content?.parts ?? []).map((p) => p?.text).filter(Boolean).join("");
    if (!text || text.length > 50_000) return unreadable(locale);
    const s = text.replace(/```json?/gi, "").replace(/```/g, "");
    const a = s.indexOf("{");
    const b = s.lastIndexOf("}");
    if (a === -1 || b <= a) return unreadable(locale);
    const raw = JSON.parse(s.slice(a, b + 1)) as RawArchetypeRead;
    return applyReframe(raw, locale);
  } catch {
    return unreadable(locale);
  }
}
