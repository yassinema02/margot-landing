"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { usePostHog } from "posthog-js/react";
import { MargotMark } from "@/components/MargotMark";
import { STUDIO_READ_COPY } from "@/lib/studioRead/copy";
import { MARGOT, onAccent, chipText, pickAccent } from "@/lib/studioRead/brand";
import type { Locale, StudioReadResult } from "@/lib/studioRead/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ResultCard({
  result,
  token,
  locale,
  onReset,
}: {
  result: StudioReadResult;
  token: string | null;
  locale: Locale;
  onReset: () => void;
}) {
  const c = STUDIO_READ_COPY[locale];
  const archetype = result.primary?.id ?? "unreadable";

  // ---- Unreadable: Margot gives guidance, no verdict. ----
  if (result.status === "unreadable" || !result.primary) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-6 px-6 py-12 text-center">
        <MargotMark size={88} tone="ink" accent={MARGOT.beakRust} />
        <h2 className="font-display opsz-144 mt-1 text-4xl sm:text-[46px] leading-[1.04] tracking-[-0.02em] text-ink">{result.share_card.headline}</h2>
        <p className="font-display italic text-xl sm:text-[23px] leading-[1.25]" style={{ color: MARGOT.textMuted }}>{result.why ? result.share_card.one_liner || result.why : ""}</p>
        <p className="max-w-md text-base leading-relaxed" style={{ color: MARGOT.textBody }}>{result.why}</p>
        <button onClick={onReset} className="mt-1.5 inline-flex h-14 items-center gap-2.5 rounded-[14px] bg-ink px-7 font-sans text-base font-semibold text-surface hover:bg-[#1F2A26] transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
          {c.retry}
        </button>
      </div>
    );
  }

  const isNeutral = result.status === "neutral";
  const accent = isNeutral ? pickAccent(result.share_card.palette_hexes) : pickAccent(result.share_card.palette_hexes);
  const label = isNeutral ? result.share_card.headline : result.primary.label;
  const margotLine = result.share_card.one_liner;
  const lean = isNeutral ? result.primary.label : result.secondary?.label ?? null;
  const leanLabel = isNeutral ? c.leanLabelNeutral : c.leanLabel;

  return (
    <div className="flex w-full flex-col items-start gap-10 lg:flex-row lg:gap-14">
      {/* LEFT — the collectible artifact + share */}
      <div className="mx-auto flex w-full max-w-[380px] flex-col gap-[18px] lg:mx-0 lg:w-[360px] lg:flex-none lg:sticky lg:top-8">
        <MargotBadge
          eyebrow={c.eyebrow}
          label={label}
          margotLine={margotLine}
          palette={result.share_card.palette_hexes}
          accent={accent}
          paletteLabel={c.paletteLabel}
          leanLabel={leanLabel}
          lean={lean}
        />
        {token && <ShareRow token={token} archetype={archetype} locale={locale} />}
      </div>

      {/* RIGHT — the read */}
      <div className="flex w-full min-w-0 flex-1 flex-col gap-[18px]">
        <div className="flex flex-col gap-1.5">
          <h2 className="font-display opsz-144 text-[34px] sm:text-[42px] leading-[1.0] tracking-[-0.02em] text-ink">
            {label}<span style={{ color: MARGOT.beakRust }}>.</span>
          </h2>
          <p className="font-display italic text-xl sm:text-[23px] leading-[1.2]" style={{ color: MARGOT.sage }}>{margotLine}</p>
        </div>

        {/* What I'm seeing */}
        <section className="flex flex-col gap-2.5 rounded-2xl border bg-white p-[22px]" style={{ borderColor: MARGOT.hairline }}>
          <Eyebrow>{c.whyLabel}</Eyebrow>
          <p className="text-base leading-[1.6]" style={{ color: MARGOT.textBody }}>{result.why}</p>
        </section>

        {/* Neutral unlock */}
        {isNeutral && (
          <div className="flex items-center gap-3.5 rounded-2xl px-5 py-[18px]" style={{ background: MARGOT.sageTint }}>
            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full" style={{ background: MARGOT.sage }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={MARGOT.cream} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></svg>
            </span>
            <span className="text-sm font-medium leading-snug" style={{ color: "#3C4A42" }}>{c.neutralUnlock}</span>
          </div>
        )}

        {/* Build the look */}
        {result.starter_kit.length > 0 && (
          <section className="flex flex-col gap-4 rounded-2xl border bg-white p-[22px]" style={{ borderColor: MARGOT.hairline }}>
            <Eyebrow>{c.kitLabel}</Eyebrow>
            <div className="grid grid-cols-1 items-start gap-x-10 gap-y-3.5 sm:grid-cols-2">
              {result.starter_kit.map((k, i) => (
                <div key={i} className="flex items-baseline gap-2.5">
                  <span className="h-[7px] w-[7px] flex-none -translate-y-0.5 rounded-full" style={{ background: accent }} />
                  <span className="whitespace-nowrap text-[15px] font-semibold text-ink">{k.piece}</span>
                  <span className="min-w-[10px] flex-1 -translate-y-1 border-b border-dotted" style={{ borderColor: MARGOT.borderStrong }} />
                  <span className="whitespace-nowrap text-[13.5px]" style={{ color: MARGOT.textMuted }}>{k.why}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bridge C */}
        <BridgeCard locale={locale} archetype={archetype} />

        {/* Email capture */}
        <EmailCard token={token} archetype={archetype} locale={locale} />
      </div>
    </div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: MARGOT.textMuted }}>
      {children}
    </span>
  );
}

/** BadgeB "The Spread" — the screenshot-worthy identity badge. */
function MargotBadge({
  eyebrow,
  label,
  margotLine,
  palette,
  accent,
  paletteLabel,
  leanLabel,
  lean,
}: {
  eyebrow: string;
  label: string;
  margotLine: string;
  palette: string[];
  accent: string;
  paletteLabel: string;
  leanLabel: string;
  lean: string | null;
}) {
  const t = onAccent(accent);
  return (
    <div className="flex flex-col overflow-hidden rounded-[28px] bg-surface" style={{ boxShadow: MARGOT.cream && "0 14px 40px rgba(31,42,38,0.16)" }}>
      {/* ACCENT FIELD */}
      <div className="flex min-h-[372px] flex-col gap-[18px] px-[26px] pb-[30px] pt-6" style={{ background: accent }}>
        <div className="flex items-start justify-between">
          <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: t.soft }}>{eyebrow}</span>
          <MargotMark size={30} tone={t.markTone} accent={t.sparkle} />
        </div>
        <div className="mt-auto flex flex-col gap-4">
          <h3 className="font-display opsz-144 text-[58px] leading-[0.95] tracking-[-0.02em] text-balance" style={{ color: t.text }}>
            {label}<span style={{ color: t.soft }}>.</span>
          </h3>
          <p className="font-display italic text-[23px] leading-[1.22] max-w-[280px]" style={{ color: t.text }}>{margotLine}</p>
        </div>
      </div>

      {/* THE COLOUR STORY */}
      <div className="flex flex-col gap-[18px] px-[26px] pb-6 pt-[22px]">
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: MARGOT.textMuted }}>{paletteLabel}</span>
          <div className="flex gap-1.5">
            {palette.slice(0, 4).map((hex, i) => (
              <div key={i} className="flex flex-1 flex-col gap-1.5">
                <div className="h-[62px] rounded-[10px]" style={{ background: hex, boxShadow: "inset 0 0 0 1px rgba(31,42,38,0.06)" }} />
                <span className="text-center text-[9px] font-medium tracking-[0.04em]" style={{ color: "#A7ACA6" }}>{hex}</span>
              </div>
            ))}
          </div>
        </div>
        {lean && (
          <div className="flex items-center justify-between border-t pt-4" style={{ borderColor: MARGOT.hairline }}>
            <div className="flex flex-col gap-0.5">
              <span className="whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.14em]" style={{ color: MARGOT.textMuted }}>{leanLabel}</span>
              <span className="text-[15px] font-semibold text-ink">{lean}</span>
            </div>
            <MargotMark size={22} tone="ink" accent={MARGOT.beakRust} showWordmark wordSize={20} />
          </div>
        )}
      </div>
    </div>
  );
}

function ShareRow({ token, archetype, locale }: { token: string; archetype: string; locale: Locale }) {
  const c = STUDIO_READ_COPY[locale];
  const ph = usePostHog();
  const [copied, setCopied] = useState(false);
  const cardUrl = () => `${window.location.origin}/studio-read/card/${token}`;
  const fire = () => ph?.capture("studio_read_shared", { archetype });

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(cardUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  };
  const onShare = async () => {
    fire();
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ url: cardUrl(), title: c.metaTitle });
        return;
      } catch {
        /* cancelled */
      }
    }
    await onCopy();
  };

  return (
    <div className="flex gap-2.5">
      <button onClick={onShare} className="flex h-[50px] flex-1 items-center justify-center gap-2 rounded-xl bg-ink font-sans text-[14.5px] font-semibold text-surface hover:bg-[#1F2A26] transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" /><path d="M12 16V3" /><path d="M7 8l5-5 5 5" /></svg>
        {c.shareBtn}
      </button>
      <button onClick={() => { fire(); onCopy(); }} className="flex h-[50px] flex-none items-center justify-center gap-2 rounded-xl border bg-white px-[18px] font-sans text-[14.5px] font-semibold text-ink hover:bg-surface transition-colors" style={{ borderColor: MARGOT.borderStrong }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" /><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" /></svg>
        {copied ? c.copied : c.copyBtn}
      </button>
    </div>
  );
}

function BridgeCard({ locale, archetype }: { locale: Locale; archetype: string }) {
  const c = STUDIO_READ_COPY[locale];
  const ph = usePostHog();
  return (
    <div className="flex flex-col items-start gap-5 rounded-[20px] border p-6 sm:flex-row sm:items-center sm:gap-[22px]" style={{ background: MARGOT.cream, borderColor: MARGOT.hairline }}>
      <MargotMark size={52} tone="ink" accent={MARGOT.beakRust} />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <p className="font-display italic text-[23px] leading-[1.2] text-ink">{c.bridgeTitle}</p>
        <p className="text-[14.5px] leading-[1.5]" style={{ color: MARGOT.textBody }}>{c.bridgeBody}</p>
      </div>
      <a
        href="/"
        onClick={() => ph?.capture("studio_read_bridge_clicked", { archetype })}
        className="flex h-[52px] flex-none items-center justify-center rounded-xl px-[26px] font-sans text-[15.5px] font-semibold text-white no-underline transition-colors"
        style={{ background: MARGOT.beakRust }}
      >
        {c.bridgeBtn}
      </a>
    </div>
  );
}

function EmailCard({ token, archetype, locale }: { token: string | null; archetype: string; locale: Locale }) {
  const c = STUDIO_READ_COPY[locale];
  const ph = usePostHog();
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  if (done) {
    return (
      <div className="rounded-2xl border bg-white p-[22px]" style={{ borderColor: MARGOT.hairline }}>
        <p className="text-[15px] font-medium" style={{ color: MARGOT.sage }}>{c.emailSuccess}</p>
      </div>
    );
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setError(c.emailPh);
      return;
    }
    setError("");
    setPending(true);
    try {
      const res = await fetch("/api/studio-read/attach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, archetype, lang: locale }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      ph?.capture("studio_read_email_captured", { archetype });
      setDone(true);
    } catch {
      setError(c.errorGeneric);
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 rounded-2xl border bg-white p-[22px]" style={{ borderColor: MARGOT.hairline }}>
      <div className="flex flex-col gap-1">
        <span className="text-base font-semibold text-ink">{c.emailTitle}</span>
        <span className="text-[13px] leading-snug" style={{ color: MARGOT.textMuted }}>{c.emailNote}</span>
      </div>
      <div className="flex gap-2">
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={c.emailPh}
          className="h-[50px] min-w-0 flex-1 rounded-xl border bg-white px-4 font-sans text-[14.5px] text-ink outline-none focus:border-ink"
          style={{ borderColor: MARGOT.borderStrong }}
        />
        <button type="submit" disabled={pending} className="h-[50px] flex-none rounded-xl bg-ink px-5 font-sans text-[14.5px] font-semibold text-surface hover:bg-[#1F2A26] transition-colors disabled:opacity-60">
          {pending ? c.emailSending : c.emailBtn}
        </button>
      </div>
      {error && <p className="text-xs" style={{ color: MARGOT.rust }}>{error}</p>}
      <p className="text-[11px] leading-snug" style={{ color: MARGOT.textFaint }}>
        {c.consent}{" "}
        <a href={c.privacyHref} className="underline hover:opacity-70">{c.privacyLinkText}</a>
      </p>
    </form>
  );
}
