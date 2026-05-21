import type { LangContent } from "@/lib/content";
import { MargotSVG } from "./MargotSVG";

export function MeetMargot({ t }: { t: LangContent }) {
  const headlineParts = t.meet.headline.split(" ");
  const last = headlineParts.pop();
  const head = headlineParts.join(" ");
  return (
    <section className="bg-surface border-y border-warm2 px-6 py-[clamp(72px,9vw,128px)]">
      <div className="max-w-[1200px] mx-auto">
        <div className="meet-grid grid items-center gap-[clamp(40px,6vw,96px)] grid-cols-1 md:[grid-template-columns:minmax(0,1fr)_minmax(0,1.2fr)]">
          <div className="flex justify-center order-1">
            <div className="w-[60%] max-w-[220px]">
              <MargotSVG state="considering" size={240} showLegs />
            </div>
          </div>
          <div className="order-2">
            <div className="font-sans text-[11px] font-semibold tracking-wider2 uppercase text-ink3">{t.meet.eyebrow}</div>
            <h2 className="font-display font-normal text-ink opsz-144 mt-3.5 mb-0 text-[clamp(40px,5.5vw,80px)] leading-[0.95] tracking-tighter2">
              {head} <em>{last}</em>
            </h2>
            <p className="font-display font-normal text-ink2 opsz-96 mt-6 max-w-[540px] text-[clamp(18px,1.8vw,22px)] leading-[1.5] tracking-tight6 [text-wrap:pretty]">
              {t.meet.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
