"use client";

import type { LangContent } from "@/lib/content";

export function Pricing({ t }: { t: LangContent }) {
  return (
    <section id="pricing" className="max-w-[680px] mx-auto px-6 py-[clamp(64px,8vw,112px)] text-center">
      <div className="mb-[clamp(28px,3.5vw,48px)]">
        <div className="font-sans text-[11px] font-semibold tracking-wider2 uppercase text-peach mb-3">
          {t.pricing.eyebrow}
        </div>
        <h2 className="font-display font-normal text-ink opsz-144 m-0 text-[clamp(28px,4vw,48px)] leading-[1.1] tracking-tight2">
          {t.pricing.headline}
        </h2>
      </div>

      <div className="rounded-3xl border border-warm2 bg-surface px-[clamp(24px,4vw,48px)] py-[clamp(32px,5vw,56px)] flex flex-col items-center gap-6 shadow-[0_18px_50px_-30px_rgba(45,58,51,0.35)]">
        <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-peach text-surface font-sans text-[11px] font-semibold tracking-wider2 uppercase">
          {t.pricing.trial}
        </div>

        <div>
          <div className="font-display font-normal text-ink opsz-144 text-[clamp(40px,5.5vw,64px)] leading-none tracking-tightest">
            {t.pricing.price}
          </div>
          <div className="mt-2 font-sans text-[13px] text-ink3 tracking-tight7">{t.pricing.priceSub}</div>
        </div>

        <ul className="flex flex-col gap-3 w-full max-w-[360px] text-left m-0 p-0 list-none">
          {t.pricing.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-3 font-sans text-[15px] text-ink2 tracking-tight7">
              <span aria-hidden="true" className="mt-1 text-sage font-display text-[16px] leading-none">✓</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <div className="font-display italic text-[14px] text-ink3 tracking-tight5 max-w-[360px] [text-wrap:pretty]">
          {t.pricing.note}
        </div>

        <a
          href="#top"
          className="px-6 py-3 rounded-full bg-ink text-surface no-underline font-sans text-[14px] font-semibold tracking-tight7 hover:opacity-90 transition-opacity"
        >
          {t.pricing.cta}
        </a>
      </div>
    </section>
  );
}
