"use client";

import { useState, type FormEvent } from "react";
import { usePostHog } from "posthog-js/react";
import { trackGA } from "@/lib/analytics";
import { MargotMark } from "@/components/MargotMark";
import { MargotIcon } from "@/components/MargotIcon";
import { MargotSVG } from "@/components/MargotSVG";
import { STUDIO_READ_COPY } from "@/lib/studioRead/copy";
import { MARGOT, onAccent, pickAccent } from "@/lib/studioRead/brand";
import { APP_STORE_URL } from "@/lib/launch";
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

  // ---- Unreadable: Margot gives guidance, no verdict, no funnel. ----
  if (result.status === "unreadable" || !result.primary) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-6 px-6 py-12 text-center">
        <MargotSVG state="skeptical" size={96} crop="portrait" showLegs={false} />
        <h2 className="font-display opsz-144 mt-1 text-4xl sm:text-[46px] leading-[1.04] tracking-[-0.02em] text-ink">{result.share_card.headline}</h2>
        <p className="font-display italic text-xl sm:text-[23px] leading-[1.25]" style={{ color: MARGOT.textMuted }}>{result.share_card.one_liner}</p>
        <p className="max-w-md text-base leading-relaxed" style={{ color: MARGOT.textBody }}>{result.why}</p>
        <button onClick={onReset} className="mt-1.5 inline-flex h-14 items-center gap-2.5 rounded-[14px] bg-ink px-7 font-sans text-base font-semibold text-surface hover:bg-[#1F2A26] transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
          {c.retry}
        </button>
      </div>
    );
  }

  const isNeutral = result.status === "neutral";
  const accent = pickAccent(result.share_card.palette_hexes);
  const label = isNeutral ? result.share_card.headline : result.primary.label;
  const margotLine = result.share_card.one_liner;
  const lean = isNeutral ? result.primary.label : result.secondary?.label ?? null;
  const leanLabel = isNeutral ? c.leanLabelNeutral : c.leanLabel;

  // Centered funnel: the shareable hook (free) → the locked dossier → one CTA.
  return (
    <div className="mx-auto flex w-full max-w-[440px] flex-col items-stretch gap-5">
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

      {/* the read itself — free, the substance that makes it shareable */}
      <p className="px-1 text-[15px] leading-[1.6]" style={{ color: MARGOT.textBody }}>{result.why}</p>

      {/* THE LOCKED DOSSIER — the app-only personalized layer (the install driver) */}
      <LockedDossier result={result} archetype={archetype} accent={accent} locale={locale} />

      <EmailCard token={token} archetype={archetype} locale={locale} />

      <button onClick={onReset} className="mx-auto mt-1 font-sans text-sm underline hover:opacity-70" style={{ color: MARGOT.textMuted }}>
        {c.retry}
      </button>
    </div>
  );
}

function Eyebrow({ children }: { children: string }) {
  return (
    <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: MARGOT.textMuted }}>
      {children}
    </span>
  );
}

function LockIcon({ size = 14, color = MARGOT.textMuted }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "0 0 auto" }}>
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

/** A redacted line — looks like real content you can't quite read. */
function BlurredBars({ widths }: { widths: string[] }) {
  return (
    <div className="flex flex-col gap-1.5" style={{ filter: "blur(3.5px)", opacity: 0.65 }} aria-hidden="true">
      {widths.map((w, i) => (
        <span key={i} className="h-2.5 rounded-full" style={{ width: w, background: MARGOT.borderStrong }} />
      ))}
    </div>
  );
}

/** The conversion engine: 2 key pieces free, the rest + the personalized
 *  wardrobe layer locked behind the app — with a single strong CTA. */
function LockedDossier({ result, archetype, accent, locale }: { result: StudioReadResult; archetype: string; accent: string; locale: Locale }) {
  const c = STUDIO_READ_COPY[locale];
  const ph = usePostHog();
  const kit = result.starter_kit;
  const free = kit.slice(0, 2);
  const lockedCount = Math.max(0, kit.length - 2);

  return (
    <div className="flex flex-col gap-3">
      <p className="px-1 font-display italic text-lg" style={{ color: MARGOT.sage }}>{c.dossierLead}</p>

      <section className="overflow-hidden rounded-2xl border" style={{ borderColor: MARGOT.hairline, background: MARGOT.cream }}>
        {/* header */}
        <div className="flex items-start gap-3 px-5 py-4" style={{ borderBottom: `1px solid ${MARGOT.hairline}` }}>
          <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full" style={{ background: MARGOT.warm }}>
            <LockIcon size={15} color={MARGOT.moss} />
          </span>
          <div className="flex flex-col gap-0.5">
            <p className="font-display text-[19px] leading-tight text-ink">{c.dossierTitle}</p>
            <p className="text-[13px] leading-snug" style={{ color: MARGOT.textMuted }}>{c.dossierSub}</p>
          </div>
        </div>

        {/* key pieces — 2 shown, rest locked */}
        <div className="flex flex-col gap-3 px-5 py-4" style={{ borderBottom: `1px solid ${MARGOT.hairline}` }}>
          <div className="flex items-baseline justify-between gap-3">
            <Eyebrow>{c.keyPiecesTitle}</Eyebrow>
            <span className="text-[11px]" style={{ color: MARGOT.textMuted }}>
              {free.length} {c.shownWord} · {lockedCount} {c.inAppWord}
            </span>
          </div>
          {free.map((p, i) => (
            <div key={i} className="flex items-baseline gap-2.5">
              <span className="h-[7px] w-[7px] flex-none -translate-y-0.5 rounded-full" style={{ background: accent }} />
              <span className="text-[15px] font-semibold text-ink">{p.piece}</span>
              <span className="min-w-[10px] flex-1 -translate-y-1 border-b border-dotted" style={{ borderColor: MARGOT.borderStrong }} />
              <span className="text-[13px]" style={{ color: MARGOT.textMuted }}>{p.why}</span>
            </div>
          ))}
          {lockedCount > 0 &&
            Array.from({ length: Math.min(lockedCount, 3) }).map((_, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span className="h-[7px] w-[7px] flex-none rounded-full" style={{ background: MARGOT.borderStrong }} />
                <span className="h-3 flex-1 rounded-full" style={{ background: MARGOT.borderStrong, filter: "blur(3px)", opacity: 0.6, maxWidth: `${70 - i * 12}%` }} />
                <LockIcon size={13} />
              </div>
            ))}
        </div>

        {/* the personalized layer — app only, the real reason to install */}
        {c.lockedRows.map((row, i) => (
          <div key={i} className="flex items-center gap-3 px-5 py-3.5" style={{ borderBottom: `1px solid ${MARGOT.hairline}` }}>
            <LockIcon size={14} />
            <span className="flex-1 text-[14px] font-medium" style={{ color: MARGOT.textBody }}>{row}</span>
            <div className="w-16 flex-none">
              <BlurredBars widths={["100%", "62%"]} />
            </div>
          </div>
        ))}

        {/* the one CTA */}
        <div className="p-5">
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="app-store"
            onClick={() => ph?.capture("studio_read_bridge_clicked", { archetype })}
            className="flex h-[56px] w-full items-center justify-center gap-2.5 rounded-xl bg-ink font-sans text-base font-semibold text-surface no-underline transition-colors hover:bg-[#1F2A26]"
          >
            {c.installCta}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>
          </a>
        </div>
      </section>
    </div>
  );
}

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
    <div className="mx-auto flex w-full max-w-[360px] flex-col overflow-hidden rounded-[28px] bg-surface" style={{ boxShadow: "0 14px 40px rgba(31,42,38,0.16)" }}>
      <div className="flex min-h-[372px] flex-col gap-[18px] px-[26px] pb-[30px] pt-6" style={{ background: accent }}>
        <div className="flex items-start justify-between">
          <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: t.soft }}>{eyebrow}</span>
          <MargotIcon size={34} />
        </div>
        <div className="mt-auto flex flex-col gap-4">
          <h3 className="font-display opsz-144 text-[58px] leading-[0.95] tracking-[-0.02em] text-balance" style={{ color: t.text }}>
            {label}<span style={{ color: t.soft }}>.</span>
          </h3>
          <p className="font-display italic text-[23px] leading-[1.22] max-w-[280px]" style={{ color: t.text }}>{margotLine}</p>
        </div>
      </div>
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
            <MargotMark fontSize={20} />
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
    <div className="mx-auto flex w-full max-w-[360px] gap-2.5">
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

function EmailCard({ token, archetype, locale }: { token: string | null; archetype: string; locale: Locale }) {
  const c = STUDIO_READ_COPY[locale];
  const ph = usePostHog();
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  if (done) {
    return (
      <div className="rounded-2xl border bg-white p-[18px]" style={{ borderColor: MARGOT.hairline }}>
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
      trackGA("studio_read_email_captured", { archetype });
      setDone(true);
    } catch {
      setError(c.errorGeneric);
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 rounded-2xl border bg-white p-[18px]" style={{ borderColor: MARGOT.hairline }}>
      <div className="flex flex-col gap-1">
        <span className="text-[15px] font-semibold text-ink">{c.carryTitle}</span>
        <span className="text-[13px] leading-snug" style={{ color: MARGOT.textMuted }}>{c.carryNote}</span>
      </div>
      <div className="flex gap-2">
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={c.emailPh}
          className="h-12 min-w-0 flex-1 rounded-xl border bg-white px-4 font-sans text-[14.5px] text-ink outline-none focus:border-ink"
          style={{ borderColor: MARGOT.borderStrong }}
        />
        <button type="submit" disabled={pending} className="h-12 flex-none rounded-xl bg-ink px-5 font-sans text-[14.5px] font-semibold text-surface hover:bg-[#1F2A26] transition-colors disabled:opacity-60">
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
