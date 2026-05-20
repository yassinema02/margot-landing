"use client";

import { useState } from "react";
import type { LangContent } from "@/lib/content";
import { MargotSVG } from "./MargotSVG";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function FooterNewsletter({ t, lang }: { t: LangContent; lang: "en" | "fr" }) {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setErr("invalid");
      return;
    }
    setErr("");
    setPending(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, lang }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setDone(true);
    } catch {
      setErr("network");
    } finally {
      setPending(false);
    }
  };

  if (done) {
    return (
      <div className="font-display italic text-[14px] text-sage tracking-tight5">{t.success.eyebrow}</div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-1.5 w-full max-w-[360px]">
      <label className="font-sans text-[11px] font-semibold tracking-wider2 uppercase text-ink3">
        {t.footer.newsletterLabel}
      </label>
      <div className="flex gap-1.5 bg-bg p-1 rounded-full border border-warm2">
        <input
          type="email"
          required
          value={email}
          placeholder={t.hero.placeholder}
          onChange={(e) => setEmail(e.target.value)}
          aria-label={t.footer.newsletterLabel}
          className="flex-1 px-3.5 py-2 bg-transparent border-none outline-none font-sans text-[13px] text-ink tracking-tight7 min-w-0"
        />
        <button
          type="submit"
          disabled={pending}
          className={`px-4 py-2 rounded-full bg-ink text-surface border-none font-sans text-[12px] font-semibold tracking-tight7 whitespace-nowrap ${pending ? "cursor-wait opacity-70" : "cursor-pointer"}`}
        >
          {pending ? "…" : t.footer.newsletterButton}
        </button>
      </div>
      {err && (
        <div className="font-sans text-[11px] text-peach">{t.hero.placeholder}</div>
      )}
    </form>
  );
}

export function Footer({ t, lang }: { t: LangContent; lang: "en" | "fr" }) {
  return (
    <footer className="bg-surface border-t border-warm2 px-6 py-14">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-10">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] items-start">
          <div className="flex items-center gap-3.5">
            <MargotSVG state="considering" size={44} showLegs={false} crop="portrait" />
            <div>
              <div className="font-display italic font-normal text-[26px] text-ink opsz-96 tracking-tight3 leading-none">
                Margot<span className="text-peach not-italic">.</span>
              </div>
              <div className="font-display italic text-[13px] text-ink3 mt-1">{t.footer.tagline}</div>
            </div>
          </div>
          <FooterNewsletter t={t} lang={lang} />
        </div>

        <nav className="flex gap-[clamp(14px,2vw,28px)] flex-wrap items-center">
          {t.footer.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="font-sans text-[13px] font-medium text-ink2 no-underline tracking-tight7 pb-0.5 border-b border-transparent hover:border-peach hover:text-ink transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="pt-6 border-t border-warm2 flex justify-between items-center gap-4 flex-wrap">
          <div className="font-sans text-xs text-ink3 tracking-[0.04em]">{t.footer.madeIn}</div>
          <div className="font-sans text-[11px] text-ink3 tracking-[0.06em]">{t.footer.legal}</div>
        </div>
      </div>
    </footer>
  );
}
