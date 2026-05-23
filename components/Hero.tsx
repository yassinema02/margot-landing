"use client";

import type { LangContent } from "@/lib/content";
import { MargotSVG } from "./MargotSVG";
import { WaitlistForm } from "./WaitlistForm";
import { WaitlistCounter } from "./WaitlistCounter";

interface Props {
  t: LangContent;
  lang: "en" | "fr";
  submitted: boolean;
  setSubmitted: (v: boolean) => void;
  email: string;
  setEmail: (v: string) => void;
  refCode: string | null;
  setRefCode: (v: string | null) => void;
  position: number | null;
  setPosition: (v: number | null) => void;
}

export function Hero({
  t,
  lang,
  submitted,
  setSubmitted,
  email,
  setEmail,
  refCode,
  setRefCode,
  position,
  setPosition,
}: Props) {
  return (
    <section
      id="top"
      className="relative max-w-[720px] mx-auto px-6 pt-[clamp(56px,9vw,112px)] pb-[clamp(48px,7vw,96px)] text-center"
    >
      {/* Small magpie — wax-seal decoration, top-right */}
      <div
        aria-hidden="true"
        className="absolute top-[clamp(20px,3vw,40px)] right-[clamp(20px,3vw,48px)] opacity-70 pointer-events-none"
      >
        <MargotSVG state="considering" size={56} showLegs={false} crop="face" />
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-7 rounded-full border border-warm2 bg-surface font-sans text-[11px] font-semibold tracking-wider2 uppercase text-ink3">
        <span className="w-1.5 h-1.5 rounded-full bg-peach" />
        {t.hero.eyebrow}
      </div>

      <h1 className="font-display font-normal text-ink opsz-144 m-0 text-[clamp(56px,9.5vw,120px)] leading-[0.95] tracking-tightest [text-wrap:balance]">
        {t.hero.headline[0]}{" "}
        <em>{t.hero.headline[1]}</em>
      </h1>

      <p className="mx-auto mt-3 font-display italic text-ink3 opsz-96 text-[clamp(12px,1.1vw,14px)] tracking-tight5 [text-wrap:balance]">
        {t.hero.seoLine}
      </p>

      <p className="mx-auto mt-[clamp(20px,2.5vw,32px)] font-display italic text-ink2 opsz-96 text-[clamp(17px,1.8vw,22px)] leading-[1.45] tracking-tight6 max-w-[560px] [text-wrap:pretty]">
        {t.hero.subline}
      </p>

      <div className="mt-[clamp(28px,3.5vw,44px)] flex flex-col items-center gap-3.5">
        <WaitlistForm
          t={t}
          lang={lang}
          submitted={submitted}
          setSubmitted={setSubmitted}
          email={email}
          setEmail={setEmail}
          refCode={refCode}
          setRefCode={setRefCode}
          position={position}
          setPosition={setPosition}
          variant="hero"
        />
        <WaitlistCounter fallback={t.hero.counterFallback} template={t.hero.counterTemplate} />
      </div>
    </section>
  );
}
