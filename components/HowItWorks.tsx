import type { LangContent } from "@/lib/content";

export function HowItWorks({ t }: { t: LangContent }) {
  return (
    <section className="max-w-[1200px] mx-auto px-6 py-[clamp(56px,7vw,104px)]">
      <div className="mb-[clamp(40px,5vw,72px)] text-center">
        <div className="font-sans text-[11px] font-semibold tracking-wider2 uppercase text-peach mb-3">
          {t.howItWorks.eyebrow}
        </div>
        <h2 className="font-display font-normal text-ink opsz-144 m-0 text-[clamp(32px,4.6vw,56px)] leading-[1.05] tracking-tight2 max-w-[820px] mx-auto [text-wrap:balance]">
          {t.howItWorks.headline}
        </h2>
      </div>

      <div className="grid gap-[clamp(32px,4vw,56px)] grid-cols-1 md:grid-cols-3 md:divide-x md:divide-warm2/40">
        {t.howItWorks.steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center text-center md:px-[clamp(16px,2vw,28px)]">
            <div className="font-display italic text-peach opsz-144 text-[clamp(56px,7vw,88px)] leading-none tracking-tightest mb-4">
              {step.num}
            </div>
            <div className="font-display font-normal text-ink opsz-96 text-[clamp(22px,2.6vw,28px)] leading-[1.15] tracking-tight4 mb-3 max-w-[280px] [text-wrap:balance]">
              {step.title}
            </div>
            <div className="font-sans text-[15px] leading-relaxed text-ink2 tracking-tight7 [text-wrap:pretty] max-w-[320px]">
              {step.body}
            </div>
            <hr aria-hidden="true" className="mt-7 mb-4 w-20 h-px border-0 bg-warm2" />
            <div className="font-display italic text-[14px] text-ink3 tracking-tight5 max-w-[260px] [text-wrap:pretty]">
              {step.stamp}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
