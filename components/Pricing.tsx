"use client";

import type { LangContent } from "@/lib/content";
import { useDetectedCurrency } from "@/lib/useDetectedCurrency";
import { APP_STORE_URL } from "@/lib/launch";

export function Pricing({ t }: { t: LangContent }) {
  const currency = useDetectedCurrency();
  const monthlyPrice = t.pricing.premium.monthly[currency];
  const annualPrice = t.pricing.premium.annual[currency];
  const annualMonthly = t.pricing.premium.annualMonthly[currency];

  return (
    <section
      id="pricing"
      className="max-w-[1040px] mx-auto px-6 py-[clamp(64px,8vw,112px)]"
    >
      <div className="mb-[clamp(28px,3.5vw,48px)] text-center">
        <div className="font-sans text-[11px] font-semibold tracking-wider2 uppercase text-peach mb-3">
          {t.pricing.eyebrow}
        </div>
        <h2 className="font-display font-normal text-ink opsz-144 m-0 text-[clamp(28px,4vw,48px)] leading-[1.1] tracking-tight2">
          {t.pricing.headline}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 items-stretch">
        {/* Free tier */}
        <div className="rounded-3xl border border-warm2 bg-surface px-[clamp(24px,3.2vw,40px)] py-[clamp(28px,4vw,44px)] flex flex-col gap-6 shadow-[0_18px_50px_-30px_rgba(45,58,51,0.22)]">
          <div className="flex items-center justify-between">
            <div className="font-sans text-[11px] font-semibold tracking-wider2 uppercase text-ink3">
              {t.pricing.free.label}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="font-display font-normal text-ink opsz-144 text-[clamp(40px,5vw,56px)] leading-none tracking-tightest">
              {t.pricing.free.price}
            </div>
            <div className="font-display italic text-[14px] text-ink3 tracking-tight5 [text-wrap:pretty]">
              {t.pricing.free.tagline}
            </div>
          </div>

          <ul className="flex flex-col gap-3 w-full text-left m-0 p-0 list-none">
            {t.pricing.free.bullets.map((b, i) => (
              <li
                key={i}
                className="flex items-start gap-3 font-sans text-[15px] text-ink2 tracking-tight7"
              >
                <span
                  aria-hidden="true"
                  className="mt-1 text-sage font-display text-[16px] leading-none"
                >
                  ✓
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-2">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-cta="app-store"
              className="inline-block px-6 py-3 rounded-full border border-ink text-ink no-underline font-sans text-[14px] font-semibold tracking-tight7 hover:bg-ink hover:text-surface transition-colors"
            >
              {t.pricing.free.cta}
            </a>
          </div>
        </div>

        {/* Premium tier */}
        <div className="relative rounded-3xl border border-ink bg-ink text-surface px-[clamp(24px,3.2vw,40px)] py-[clamp(28px,4vw,44px)] flex flex-col gap-6 shadow-[0_22px_60px_-28px_rgba(45,58,51,0.55)]">
          <div className="flex items-center justify-between gap-3">
            <div className="font-sans text-[11px] font-semibold tracking-wider2 uppercase text-peach">
              {t.pricing.premium.label}
            </div>
            <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-peach text-surface font-sans text-[10px] font-semibold tracking-wider2 uppercase">
              {t.pricing.premium.annualBadge}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-baseline gap-2 flex-wrap">
              <div className="font-display font-normal opsz-144 text-[clamp(40px,5vw,56px)] leading-none tracking-tightest">
                {annualPrice}
              </div>
              <div className="font-sans text-[14px] text-ink5 tracking-tight7">
                {t.pricing.premium.cadenceYear}
              </div>
            </div>
            <div className="font-sans text-[13px] text-ink5 tracking-tight7">
              {annualMonthly}
              <span className="mx-2 text-ink4">·</span>
              <span>
                {monthlyPrice} {t.pricing.premium.cadenceMonth}
              </span>
            </div>
            <div className="font-display italic text-[14px] text-ink5 tracking-tight5 [text-wrap:pretty]">
              {t.pricing.premium.tagline}
            </div>
          </div>

          <ul className="flex flex-col gap-3 w-full text-left m-0 p-0 list-none">
            {t.pricing.premium.bullets.map((b, i) => (
              <li
                key={i}
                className="flex items-start gap-3 font-sans text-[15px] text-ink5 tracking-tight7"
              >
                <span
                  aria-hidden="true"
                  className="mt-1 text-peach font-display text-[16px] leading-none"
                >
                  ✓
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-2">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-cta="app-store"
              className="inline-block px-6 py-3 rounded-full bg-surface text-ink no-underline font-sans text-[14px] font-semibold tracking-tight7 hover:opacity-90 transition-opacity"
            >
              {t.pricing.premium.cta}
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center font-display italic text-[14px] text-ink3 tracking-tight5 [text-wrap:pretty]">
        {t.pricing.note}
      </div>
    </section>
  );
}
