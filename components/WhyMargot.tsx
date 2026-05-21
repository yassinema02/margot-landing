import type { LangContent } from "@/lib/content";

export function WhyMargot({ t }: { t: LangContent }) {
  return (
    <section className="max-w-[1080px] mx-auto px-6 py-[clamp(56px,7vw,104px)]">
      <div className="mb-[clamp(28px,3.5vw,48px)] text-center">
        <div className="font-sans text-[11px] font-semibold tracking-wider2 uppercase text-peach mb-3">
          {t.whyMargot.eyebrow}
        </div>
        <h2 className="font-display font-normal text-ink opsz-144 m-0 text-[clamp(32px,4.6vw,56px)] leading-[1.05] tracking-tight2">
          {t.whyMargot.headline}
        </h2>
        <p className="mt-4 font-display italic text-ink2 opsz-96 text-[clamp(15px,1.7vw,19px)] leading-[1.4] tracking-tight5 max-w-[560px] mx-auto [text-wrap:pretty]">
          {t.whyMargot.lead}
        </p>
      </div>

      <div className="grid gap-[clamp(16px,2vw,24px)] grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {t.whyMargot.cards.map((card, i) => (
          <article
            key={i}
            className="rounded-2xl border border-warm2 bg-bg px-[clamp(20px,2.5vw,28px)] py-[clamp(24px,3vw,32px)] flex flex-col gap-4"
          >
            <div className="font-sans text-[11px] font-semibold tracking-wider2 uppercase text-peach">
              {card.label}
            </div>
            <h3 className="font-display font-normal text-ink opsz-96 m-0 text-[clamp(22px,2.4vw,26px)] leading-[1.15] tracking-tight4 [text-wrap:balance]">
              {card.headline}
            </h3>
            <p className="font-sans text-[15px] leading-relaxed text-ink2 tracking-tight7 opacity-90 [text-wrap:pretty] m-0">
              {card.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
