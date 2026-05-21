"use client";

import { useState } from "react";
import type { LangContent } from "@/lib/content";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  variant?: "hero" | "footer";
}

function readIncomingRef(): string | null {
  try {
    return localStorage.getItem("margot:incoming_ref");
  } catch {
    return null;
  }
}

export function WaitlistForm({
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
  variant = "hero",
}: Props) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setError(t.hero.placeholder);
      return;
    }
    setError("");
    setPending(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, lang, ref: readIncomingRef() }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { ok?: boolean; refCode?: string; position?: number };
      if (data.refCode) setRefCode(data.refCode);
      if (typeof data.position === "number") setPosition(data.position);
      setSubmitted(true);
    } catch {
      setError(t.hero.placeholder);
    } finally {
      setPending(false);
    }
  };

  const maxW = variant === "hero" ? "max-w-[520px]" : "max-w-[600px]";

  if (submitted) {
    const inviteUrl =
      typeof window !== "undefined" && refCode
        ? `${window.location.origin}/?ref=${refCode}`
        : "";
    const headline = position !== null
      ? t.success.headline.replace("{N}", position.toLocaleString(lang === "fr" ? "fr-FR" : "en-US"))
      : t.success.headline.replace("{N}", "—");

    const onCopy = async () => {
      try {
        await navigator.clipboard?.writeText(inviteUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      } catch {
        /* no-op */
      }
    };

    const onShare = async () => {
      const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
      if (nav.share && inviteUrl) {
        try {
          await nav.share({
            title: "Margot",
            text: t.success.shareText,
            url: inviteUrl,
          });
          return;
        } catch {
          /* user cancelled or unsupported — fall through to copy */
        }
      }
      onCopy();
    };

    return (
      <div className={`bg-surface border border-warm2 rounded-lg px-7 py-6 ${maxW} text-left`}>
        <div className="font-sans text-[11px] font-semibold tracking-widish uppercase text-sage">
          · {t.success.eyebrow}
        </div>
        <div className="mt-2.5 font-display italic text-[30px] leading-[1.1] tracking-tight4 text-ink opsz-144">
          {headline}
        </div>
        <div className="mt-2 font-sans text-sm text-ink2 leading-relaxed max-w-[460px]">
          {t.success.body}
        </div>

        {refCode && (
          <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-full bg-bg border border-warm2 max-w-full overflow-hidden">
            <span className="font-sans text-[11px] font-semibold tracking-wider2 uppercase text-ink3 flex-shrink-0">
              link
            </span>
            <span className="font-mono text-[12px] text-ink truncate" title={inviteUrl}>
              {inviteUrl.replace(/^https?:\/\//, "")}
            </span>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={onCopy}
            className="px-[18px] py-2.5 rounded-full bg-ink text-surface border-none font-sans text-[13px] font-semibold tracking-tight7 cursor-pointer hover:opacity-90 transition-opacity"
          >
            {copied ? t.success.copied : t.success.cta}
          </button>
          <button
            onClick={onShare}
            className="font-sans text-xs text-ink3 hover:text-ink transition-colors cursor-pointer bg-transparent border-none p-0"
          >
            {t.success.hint}
          </button>
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
