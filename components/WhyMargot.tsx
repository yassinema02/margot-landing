import type { LangContent } from "@/lib/content";
import { ComparisonTable } from "./ComparisonTable";

export function WhyMargot({ t }: { t: LangContent }) {
  return (
    <section className="max-w-[1080px] mx-auto px-6 py-[clamp(56px,7vw,104px)]">
      <div className="mb-[clamp(28px,3.5vw,48px)] text-center">
        <div className="font-sans text-[11px] font-semibold tracking-wider2 uppercase text-peach mb-3">
          {t.whyMargot.eyebrow}
        </div>
        <h2 className="font-display font-normal text-ink opsz-144 m-0 text-[clamp(28px,4vw,48px)] leading-[1.1] tracking-tight2 max-w-[760px] mx-auto">
          {t.whyMargot.headline}
        </h2>
      </div>
      <ComparisonTable headers={t.whyMargot.headers} rows={t.whyMargot.rows} />
    </section>
  );
}
