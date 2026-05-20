"use client";

import type { LangContent } from "@/lib/content";
import { MargotSVG } from "./MargotSVG";
import { PhoneMockup } from "./PhoneMockup";
import { WaitlistForm } from "./WaitlistForm";
import { WaitlistCounter } from "./WaitlistCounter";

interface Props {
  t: LangContent;
  lang: "en" | "fr";
  submitted: boolean;
  setSubmitted: (v: boolean) => void;
  email: string;
  setEmail: (v: string) => void;
}

export function Hero({ t, lang, submitted, setSubmitted, email, setEmail }: Props) {
  return (
    <section id="top" className="max-w-[1280px] mx-auto px-6 pt-[clamp(48px,8vw,96px)] pb-20">
      <div className="hero-grid grid items-center gap-[clamp(32px,5vw,64px)] grid-cols-1 md:[grid-template-columns:minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="order-2 md:order-1">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border border-warm2 bg-surface font-sans text-[11px] font-semibold tracking-wider2 uppercase text-ink3">
            <span className="w-1.5 h-1.5 rounded-full bg-peach" />
            {t.hero.eyebrow}
          </div>
          <h1 className="font-display font-normal text-ink opsz-144 m-0 text-[clamp(54px,9vw,120px)] leading-[0.92] tracking-tightest">
            {t.hero.headline[0]}
            <br />
            <em>{t.hero.headline[1]}</em>
          </h1>
          <div className="mt-[clamp(20px,2.5vw,32px)] font-display italic text-ink2 opsz-96 text-[clamp(17px,1.8vw,22px)] leading-[1.4] tracking-tight6 max-w-[560px] [text-wrap:pretty]">
            {t.hero.subline}
          </div>
          <div className="mt-[clamp(28px,3vw,40px)]">
            <WaitlistForm t={t} lang={lang} submitted={submitted} setSubmitted={setSubmitted} email={email} setEmail={setEmail} variant="hero" />
            <div className="mt-3.5 ml-1">
              <WaitlistCounter fallback={t.hero.counterFallback} template={t.hero.counterTemplate} />
            </div>
          </div>
        </div>
        <div className="flex justify-center order-1 md:order-2">
          <div className="relative">
            <PhoneMockup variant="today" alt={t.hero.phoneAlt} size="hero" />
            <div
              aria-hidden="true"
              className="absolute -top-6 -right-6 md:-top-8 md:-right-10 w-[80px] md:w-[96px] pointer-events-none"
            >
              <MargotSVG state="pleased" size={96} showLegs={false} crop="face" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
