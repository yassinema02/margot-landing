import type { LangContent } from "@/lib/content";
import { PhoneMockup } from "./PhoneMockup";

export function HowItWorks({ t }: { t: LangContent }) {
  return (
    <section className="max-w-[1280px] mx-auto px-6 py-[clamp(56px,7vw,104px)]">
      <div className="mb-[clamp(32px,4vw,56px)] text-center">
        <div className="font-sans text-[11px] font-semibold tracking-wider2 uppercase text-peach mb-3">
          {t.howItWorks.eyebrow}
        </div>
        <h2 className="font-display font-normal text-ink opsz-144 m-0 text-[clamp(32px,4.6vw,56px)] leading-[1.05] tracking-tight2 max-w-[820px] mx-auto">
          {t.howItWorks.headline}
        </h2>
      </div>

      <div className="grid gap-[clamp(28px,3.5vw,48px)] grid-cols-1 md:grid-cols-3">
        {t.howItWorks.steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            <div className="font-display italic text-peach opsz-144 text-[clamp(56px,7vw,88px)] leading-none tracking-tightest mb-4">
              {step.num}
            </div>
            <div className="font-display font-normal text-ink opsz-96 text-[clamp(22px,2.6vw,28px)] leading-[1.15] tracking-tight4 mb-3 max-w-[280px]">
              {step.title}
            </div>
            <div className="font-sans text-[15px] leading-relaxed text-ink2 tracking-tight7 [text-wrap:pretty] max-w-[320px] mb-7">
              {step.body}
            </div>
            <PhoneMockup src={step.img} alt={step.imgAlt} size="step" />
          </div>
        ))}
      </div>
    </section>
  );
}
