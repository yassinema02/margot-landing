"use client";

import { useState } from "react";
import type { LangContent } from "@/lib/content";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Props {
  t: LangContent;
  submitted: boolean;
  setSubmitted: (v: boolean) => void;
  email: string;
  setEmail: (v: string) => void;
  variant?: "hero" | "footer";
}

export function WaitlistForm({ t, submitted, setSubmitted, email, setEmail, variant = "hero" }: Props) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setError(t.hero.placeholder);
      return;
    }
    setError("");
    setPending(true);
    // TODO: swap with Beehiiv endpoint.
    setTimeout(() => {
      setPending(false);
      setSubmitted(true);
    }, 700);
  };

  const maxW = variant === "hero" ? "max-w-[520px]" : "max-w-[600px]";

  if (submitted) {
    return (
      <div className={`bg-surface border border-warm2 rounded-lg px-7 py-6 ${maxW}`}>
        <div className="font-sans text-[11px] font-semibold tracking-widish uppercase text-sage">· {t.success.eyebrow}</div>
        <div className="mt-2.5 font-display italic text-[30px] leading-[1.1] tracking-tight4 text-ink opsz-144">
          {t.success.headline}
        </div>
        <div className="mt-2 font-sans text-sm text-ink2 leading-relaxed max-w-[440px]">{t.success.body}</div>
        <div className="mt-4 flex items-center gap-3.5">
          <button
            onClick={() => navigator.clipboard?.writeText("https://margot.app/?ref=you")}
            className="px-[18px] py-2.5 rounded-full bg-ink text-surface border-none font-sans text-[13px] font-semibold tracking-tight7 cursor-pointer"
          >
            {t.success.cta}
          </button>
          <span className="font-sans text-xs text-ink3">{t.success.hint}</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={`flex flex-col gap-2.5 w-full ${maxW}`}>
      <div className="flex gap-2 bg-surface p-1.5 rounded-full border border-warm2">
        <input
          type="email"
          required
          value={email}
          placeholder={t.hero.placeholder}
          onChange={(e) => setEmail(e.target.value)}
          aria-label={t.hero.placeholder}
          className="flex-1 px-[18px] py-2.5 bg-transparent border-none outline-none font-sans text-[15px] text-ink tracking-tight7 min-w-0"
        />
        <button
          type="submit"
          disabled={pending}
          className={`px-5 py-2.5 rounded-full bg-ink text-surface border-none font-sans text-[13px] font-semibold tracking-tight7 whitespace-nowrap ${pending ? "cursor-wait opacity-70" : "cursor-pointer"}`}
        >
          {pending ? "…" : t.hero.button}
        </button>
      </div>
      <div className={`font-sans text-xs ml-1 ${error ? "text-peach" : "text-ink3"}`}>{t.hero.micro}</div>
    </form>
  );
}
