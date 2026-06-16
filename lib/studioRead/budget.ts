import { getKv } from "../rateLimit";

// Global daily ceiling on Gemini calls so a viral spike can't run the bill away.
// Counts per UTC day via KV (in-memory fallback for dev). DAILY_GEMINI_CAP unset
// or 0 => no cap (returns false).

function utcDay(): string {
  return new Date().toISOString().slice(0, 10);
}

const mem = { day: "", count: 0 };

/** Increment today's counter and return true if we're now OVER the cap. */
export async function overDailyGeminiBudget(): Promise<boolean> {
  const cap = Number(process.env.DAILY_GEMINI_CAP ?? "0");
  if (!cap || cap <= 0) return false;
  const day = utcDay();
  const kv = await getKv();
  if (!kv) {
    if (mem.day !== day) {
      mem.day = day;
      mem.count = 0;
    }
    mem.count += 1;
    return mem.count > cap;
  }
  const key = `studio-read:budget:${day}`;
  try {
    const count = await kv.incr(key);
    if (count === 1) await kv.pexpire(key, 36 * 60 * 60 * 1000).catch(() => undefined);
    return count > cap;
  } catch {
    return false;
  }
}
