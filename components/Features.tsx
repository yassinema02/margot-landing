import type { LangContent } from "@/lib/content";
import { MargotSVG } from "./MargotSVG";

export function Features({ t }: { t: LangContent }) {
  return (
    <section className="max-w-[1280px] mx-auto px-6 py-[clamp(48px,6vw,88px)]">
      <div className="grid gap-[clamp(24px,3vw,40px)] [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
        {t.features.map((f, i) => (
          <div key={i} className="px-6 py-8 bg-surface border border-warm2 rounded-lg">
            <div className="h-[92px] mb-6 flex items-center">
              <MargotSVG state={f.state} size={84} showLegs={false} crop="portrait" />
            </div>
            <div className="font-display font-normal text-ink opsz-96 text-[26px] leading-[1.1] tracking-tight4 mb-3">
              {f.title}
            </div>
            <div className="font-sans text-[15px] leading-relaxed text-ink2 tracking-tight7 [text-wrap:pretty]">
              {f.body}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
