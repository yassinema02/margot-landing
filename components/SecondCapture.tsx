"use client";

import type { LangContent } from "@/lib/content";
import { AppStoreBadge } from "./AppStoreBadge";
import { DownloadQR } from "./DownloadQR";

export function SecondCapture({ t }: { t: LangContent }) {
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
        <AppStoreBadge lang={t.lang} size="lg" />
        <span className="font-sans text-[12px] text-ink3 tracking-tight7">
          {t.lang === "FR" ? "Gratuit · iPhone" : "Free · iPhone"}
        </span>
        <div className="mt-2">
          <DownloadQR lang={t.lang} />
        </div>
      </div>
    </section>
  );
}
