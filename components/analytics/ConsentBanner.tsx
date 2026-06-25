"use client";

import Link from "next/link";
import { useConsent } from "./ConsentProvider";

const COPY = {
  en: {
    text: "We use cookies for analytics and advertising. Decline and we keep only anonymous, cookie-free stats.",
    accept: "Accept",
    decline: "Decline",
    privacy: "Privacy",
  },
  fr: {
    text: "Nous utilisons des cookies à des fins d'analyse et de publicité. En refusant, nous ne gardons que des statistiques anonymes, sans cookie.",
    accept: "Accepter",
    decline: "Refuser",
    privacy: "Confidentialité",
  },
} as const;

export function ConsentBanner({ lang = "en" }: { lang?: "en" | "fr" }) {
  const { consent, hydrated, accept, decline } = useConsent();

  // Wait for the stored choice to load so returning visitors never see a flash.
  if (!hydrated || consent !== null) return null;

  const c = COPY[lang];

  return (
    <div role="dialog" aria-label={c.privacy} className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4">
      <div className="mx-auto flex max-w-[680px] flex-col gap-3 rounded-xl border border-warm2 bg-surface px-5 py-4 shadow-lg sm:flex-row sm:items-center sm:justify-between">
        <p className="font-sans text-[13px] leading-relaxed text-ink2">
          {c.text}{" "}
          <Link href="/privacy" className="underline hover:text-ink">
            {c.privacy}
          </Link>
        </p>
        <div className="flex flex-shrink-0 gap-2">
          <button
            type="button"
            onClick={decline}
            className="rounded-full border border-warm2 bg-transparent px-4 py-2 font-sans text-[13px] font-semibold tracking-tight7 text-ink2 transition-colors hover:text-ink cursor-pointer"
          >
            {c.decline}
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-full border-none bg-ink px-4 py-2 font-sans text-[13px] font-semibold tracking-tight7 text-surface transition-opacity hover:opacity-90 cursor-pointer"
          >
            {c.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
