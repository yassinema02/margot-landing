"use client";

import { useState, type FormEvent } from "react";
import { usePostHog } from "posthog-js/react";
import { AppStoreBadge } from "@/components/AppStoreBadge";
import { STUDIO_READ_COPY } from "@/lib/studioRead/copy";
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
  const ph = usePostHog();
  const archetype = result.primary?.id ?? "unreadable";

  // --- Unreadable: no verdict, just guidance + retry. No share/email/bridge. ---
  if (result.status === "unreadable" || !result.primary) {
    return (
      <div className="mx-auto max-w-md text-center">
        <h2 className="font-display text-3xl text-ink tracking-tighter2">{result.share_card.headline}</h2>
        <p className="mt-4 text-ink2 leading-relaxed">{result.why}</p>
        <button
          onClick={onReset}
          className="mt-8 inline-flex items-center rounded-xl bg-ink px-5 py-3 font-sans text-sm font-semibold text-surface hover:opacity-90 transition-opacity"
        >
          {c.tryAnother}
        </button>
      </div>
    );
  }

  const isNeutral = result.status === "neutral";
  const headline = isNeutral ? result.share_card.headline : result.primary.label;

  return (
    <div className="mx-auto max-w-lg">
      {/* Hero */}
      <div className="text-center">
        <p className="font-sans text-xs font-semibold uppercase tracking-wider2 text-peach">{c.kicker}</p>
        <h2 className="mt-2 font-display text-5xl text-ink tracking-tightest leading-[0.95]">{headline}</h2>
        <p className="mt-3 font-display italic text-lg text-ink2">{result.primary.identity_line}</p>
      </div>

      {/* Palette */}
      <div className="mt-7">
        <p className="font-sans text-xs font-semibold uppercase tracking-wider2 text-ink3">{c.paletteLabel}</p>
        <div className="mt-2 flex gap-2">
          {result.share_card.palette_hexes.map((hex, i) => (
            <span
              key={`${hex}-${i}`}
              className="h-9 flex-1 rounded-md border border-black/5"
              style={{ backgroundColor: hex }}
              title={hex}
            />
          ))}
        </div>
      </div>

      {/* Why */}
      <p className="mt-6 text-ink2 leading-relaxed">{result.why}</p>

      {/* Closest lean (read only — for neutral the lean IS the headline) */}
      {!isNeutral && result.secondary && (
        <p className="mt-3 font-sans text-sm text-ink3">
          {c.closestLean}: <span className="text-ink2 font-medium">{result.secondary.label}</span>
        </p>
      )}

      {/* Starter kit */}
      {result.starter_kit.length > 0 && (
        <div className="mt-7">
          <p className="font-sans text-xs font-semibold uppercase tracking-wider2 text-ink3">{c.starterKitLabel}</p>
          <ul className="mt-3 flex flex-col gap-3">
            {result.starter_kit.map((p, i) => (
              <li key={i} className="rounded-xl border border-warm2 bg-surface p-3.5">
                <span className="font-display text-base text-ink">{p.piece}</span>
                <span className="block text-sm text-ink3 leading-snug mt-0.5">{p.why}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Share row */}
      {token && <ShareRow token={token} archetype={archetype} locale={locale} />}

      {/* Bridge C — the whole point: drive the app install + carry-over */}
      <div className="mt-8 rounded-2xl border border-warm2 bg-surface p-6 text-center">
        <h3 className="font-display text-2xl text-ink tracking-tighter2">{c.bridgeTitle(result.primary.label)}</h3>
        <p className="mt-2 text-ink2 leading-relaxed">{c.bridgeBody(result.starter_kit.length)}</p>
        <div className="mt-5 flex justify-center">
          <span onClick={() => ph?.capture("studio_read_bridge_clicked", { archetype })}>
            <AppStoreBadge lang={locale === "fr" ? "FR" : "EN"} size="lg" />
          </span>
        </div>
        <EmailCapture token={token} archetype={archetype} locale={locale} />
      </div>

      <div className="mt-6 text-center">
        <button onClick={onReset} className="font-sans text-sm text-ink3 underline hover:text-ink2">
          {c.tryAnother}
        </button>
      </div>
    </div>
  );
}

function ShareRow({ token, archetype, locale }: { token: string; archetype: string; locale: Locale }) {
  const c = STUDIO_READ_COPY[locale];
  const ph = usePostHog();
  const [copied, setCopied] = useState(false);

  const cardUrl = () => `${window.location.origin}/studio-read/card/${token}`;
  const fireShared = () => ph?.capture("studio_read_shared", { archetype });

  const onShare = async () => {
    fireShared();
    const url = cardUrl();
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ url, title: c.metaTitle });
        return;
      } catch {
        /* user cancelled / unsupported — fall through to copy */
      }
    }
    await onCopy();
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(cardUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — no-op */
    }
  };

  return (
    <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
      <button
        onClick={onShare}
        className="inline-flex items-center rounded-xl bg-ink px-4 py-2.5 font-sans text-sm font-semibold text-surface hover:opacity-90 transition-opacity"
      >
        {c.share}
      </button>
      <button
        onClick={() => {
          fireShared();
          onCopy();
        }}
        className="inline-flex items-center rounded-xl border border-warm2 px-4 py-2.5 font-sans text-sm font-medium text-ink2 hover:bg-surface transition-colors"
      >
        {copied ? c.copied : c.copyLink}
      </button>
      <a
        href={`/studio-read/card/${token}/opengraph-image`}
        download
        onClick={fireShared}
        className="inline-flex items-center rounded-xl border border-warm2 px-4 py-2.5 font-sans text-sm font-medium text-ink2 hover:bg-surface transition-colors no-underline"
      >
        {c.download}
      </a>
    </div>
  );
}

function EmailCapture({ token, archetype, locale }: { token: string | null; archetype: string; locale: Locale }) {
  const c = STUDIO_READ_COPY[locale];
  const ph = usePostHog();
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  if (done) return <p className="mt-5 text-sm text-walnut font-medium">{c.emailSuccess}</p>;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setError(c.emailPlaceholder);
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
    <form onSubmit={onSubmit} className="mt-6">
      <p className="font-sans text-sm font-semibold text-ink mb-2">{c.emailHeading}</p>
      <div className="flex gap-2">
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={c.emailPlaceholder}
          className="min-w-0 flex-1 rounded-xl border border-warm2 bg-bg px-3.5 py-2.5 font-sans text-sm text-ink placeholder:text-ink4 focus:outline-none focus:border-ink3"
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-xl bg-peach px-4 py-2.5 font-sans text-sm font-semibold text-surface hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {pending ? c.emailSending : c.emailCta}
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-rust">{error}</p>}
      <p className="mt-2 text-[11px] leading-snug text-ink4">
        {c.emailConsent}{" "}
        <a href={c.privacyHref} className="underline hover:text-ink3">
          {c.privacyLinkText}
        </a>
      </p>
    </form>
  );
}
