"use client";

import { LANDING_CONTENT } from "@/lib/content";

interface Props {
  lang: "en" | "fr";
  setLang: (l: "en" | "fr") => void;
}

export function Header({ lang, setLang }: Props) {
  const t = LANDING_CONTENT[lang];
  return (
    <header className="sticky top-0 z-50 bg-bg/85 backdrop-blur-md backdrop-saturate-150 border-b border-warm2 px-6 py-3.5 flex justify-between items-center">
      <a href="#top" className="no-underline">
        <div className="font-display italic font-normal text-2xl tracking-tight3 text-ink opsz-96">
          Margot<span className="text-peach not-italic">.</span>
        </div>
      </a>
      <button
        onClick={() => setLang(lang === "en" ? "fr" : "en")}
        aria-label="Switch language"
        className="font-sans text-[11px] font-semibold tracking-wider2 uppercase px-3 py-1.5 rounded-full border border-ink text-ink bg-transparent cursor-pointer flex items-center gap-1.5"
      >
        {t.lang} <span className="text-ink3">·</span> <span className="text-ink3">{t.toggle}</span>
      </button>
    </header>
  );
}
