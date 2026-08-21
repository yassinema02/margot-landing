import type { LangContent } from "@/lib/content";
import { formatStat, type LiveStats } from "@/lib/stats";

export function Stats({ t, live }: { t: LangContent; live?: LiveStats | null }) {
  // Same order as t.stats.items; falls back to the static copy when the
  // live fetch failed (env missing, RPC down) so the section never breaks.
  const liveValues = live
    ? [live.garments, live.analyses, live.wardrobes, live.outfits]
    : null;
  return (
    <section className="max-w-[1040px] mx-auto px-6 py-[clamp(64px,8vw,112px)]">
      <div className="mb-[clamp(28px,3.5vw,48px)] text-center">
        <div className="font-sans text-[11px] font-semibold tracking-wider2 uppercase text-peach mb-3">
          {t.stats.eyebrow}
        </div>
        <h2 className="font-display font-normal text-ink opsz-144 m-0 text-[clamp(28px,4vw,48px)] leading-[1.1] tracking-tight2">
          {t.stats.headline}
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
        {t.stats.items.map((s, i) => (
          <div
            key={i}
            className="rounded-3xl border border-warm2 bg-surface px-[clamp(16px,2.4vw,32px)] py-[clamp(24px,3.2vw,36px)] text-center flex flex-col gap-2 shadow-[0_18px_50px_-30px_rgba(45,58,51,0.22)]"
          >
            <div className="font-display font-normal text-ink opsz-144 text-[clamp(32px,4vw,48px)] leading-none tracking-tightest">
              {liveValues?.[i] != null ? formatStat(liveValues[i], t.lang === "FR" ? "fr" : "en") : s.value}
            </div>
            <div className="font-sans text-[13px] text-ink3 tracking-tight7 [text-wrap:balance]">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center font-display italic text-[14px] text-ink3 tracking-tight5 [text-wrap:pretty]">
        {t.stats.note}
      </div>
    </section>
  );
}
