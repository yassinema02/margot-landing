"use client";

import type { LangContent } from "@/lib/content";
import { WaitlistForm } from "./WaitlistForm";

interface Props {
  t: LangContent;
  submitted: boolean;
  setSubmitted: (v: boolean) => void;
  email: string;
  setEmail: (v: string) => void;
}

export function SecondCapture({ t, submitted, setSubmitted, email, setEmail }: Props) {
  return (
    <section className="bg-bg border-t border-warm2 px-6 py-[clamp(64px,8vw,112px)]">
      <div className="max-w-[620px] mx-auto flex flex-col items-center gap-6 text-center">
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`w-[5px] h-[5px] rounded-full ${i === 1 ? "bg-peach" : "bg-ink4"}`} />
          ))}
        </div>
        <div className="font-display italic opsz-96 text-ink2 text-[clamp(22px,2.2vw,28px)] leading-[1.35] tracking-tight5 max-w-[460px]">
          {t.hero.subline}
        </div>
        <div className="w-full flex justify-center">
          <WaitlistForm t={t} submitted={submitted} setSubmitted={setSubmitted} email={email} setEmail={setEmail} variant="footer" />
        </div>
      </div>
    </section>
  );
}
