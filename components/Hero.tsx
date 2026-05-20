"use client";

import type { LangContent } from "@/lib/content";
import { MargotSVG } from "./MargotSVG";
import { WaitlistForm } from "./WaitlistForm";

interface Props {
  t: LangContent;
  submitted: boolean;
  setSubmitted: (v: boolean) => void;
  email: string;
  setEmail: (v: string) => void;
}

export function Hero({ t, submitted, setSubmitted, email, setEmail }: Props) {
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
          <div className="mt-[clamp(20px,2.5vw,32px)] font-display italic text-ink2 opsz-96 text-[clamp(18px,2vw,26px)] leading-[1.3] tracking-tight6 max-w-[540px]">
            {t.hero.subline}
          </div>
          <div className="mt-[clamp(28px,3vw,40px)]">
            <WaitlistForm t={t} submitted={submitted} setSubmitted={setSubmitted} email={email} setEmail={setEmail} variant="hero" />
          </div>
        </div>
        <div className="flex justify-center order-1 md:order-2">
          <div className="w-full max-w-[420px]">
            <MargotSVG state="considering" size={420} showLegs />
          </div>
        </div>
      </div>
    </section>
  );
}
