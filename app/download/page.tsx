import type { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";

import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/launch";

// /download — the tiny store page for bios and ads.
//
// In-app browsers (Instagram, TikTok) regularly kill raw store links: tap,
// blank page, silent leak. This page always renders, then a plain <a> tap
// (a user gesture) reliably opens the store. Platform is detected SERVER-side
// from the user-agent, so the visitor sees exactly one obvious button.
// Inside an in-app browser we also show the escape hatch (••• → open in
// browser), same pattern as the reference flow.
//
// Campaign tag: /download?c=ig_bio — rides the URL into PostHog pageviews
// (provider wraps the layout) and into the Play install referrer.

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Télécharger Margot",
  description: "Ta styliste, chaque matin. Télécharge Margot sur ton téléphone.",
  robots: { index: false },
};

function sanitizeCampaign(raw: string | string[] | undefined): string {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return "none";
  const clean = value.toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 64);
  return clean || "none";
}

type Search = Promise<Record<string, string | string[] | undefined>>;

export default async function DownloadPage({ searchParams }: { searchParams: Search }) {
  const requestHeaders = await headers();
  const userAgent = requestHeaders.get("user-agent") ?? "";
  const acceptLanguage = requestHeaders.get("accept-language") ?? "";
  const campaign = sanitizeCampaign((await searchParams).c);

  const isAndroid = /Android/i.test(userAgent);
  const isIos = /iPhone|iPad|iPod/i.test(userAgent);
  const isInApp = /Instagram|FBAN|FBAV|FB_IAB|TikTok|musical_ly|Snapchat/i.test(userAgent);
  const fr = /^fr\b|,fr\b/i.test(acceptLanguage);

  const playUrl = `${PLAY_STORE_URL}&referrer=${encodeURIComponent(
    `utm_source=margot_site&utm_campaign=${campaign}`,
  )}`;

  const t = fr
    ? {
        title: "Télécharger Margot",
        subtitle: "Ta styliste, chaque matin. Appuie sur le bouton pour ouvrir le store.",
        appStore: "Ouvrir l'App Store",
        playStore: "Ouvrir Google Play",
        notWorking: "Le bouton ne marche pas ?",
        steps: [
          "Touche le menu ••• en haut à droite",
          "Choisis « Ouvrir dans le navigateur »",
          "Réappuie sur le bouton",
        ],
      }
    : {
        title: "Get Margot",
        subtitle: "Your stylist, every morning. Tap the button to open the store.",
        appStore: "Open the App Store",
        playStore: "Open Google Play",
        notWorking: "Button not working?",
        steps: [
          "Tap the ••• menu in the top right",
          "Choose “Open in browser”",
          "Tap the button again",
        ],
      };

  // One obvious button for the detected platform; desktop gets both.
  const showAppStore = isIos || !isAndroid;
  const showPlayStore = isAndroid || (!isIos && !isAndroid);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#F5F0E8] px-6 text-center">
      <Image
        src="/download-icon.png"
        alt="Margot"
        width={96}
        height={96}
        priority
        className="rounded-[22px] shadow-md"
      />

      <h1 className="mt-6 font-serif text-3xl text-[#2B2620]">{t.title}</h1>
      <p className="mt-2 max-w-xs text-sm text-[#6F6459]">{t.subtitle}</p>

      <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
        {showAppStore && (
          <a
            href={APP_STORE_URL}
            className="rounded-full bg-[#2B2620] px-6 py-4 text-base font-medium text-[#F5F0E8]"
            data-ph-capture-attribute-download-store="app_store"
            data-ph-capture-attribute-download-campaign={campaign}
          >
            {t.appStore}
          </a>
        )}
        {showPlayStore && (
          <a
            href={playUrl}
            className={
              showAppStore
                ? "rounded-full border border-[#2B2620]/30 px-6 py-4 text-base font-medium text-[#2B2620]"
                : "rounded-full bg-[#2B2620] px-6 py-4 text-base font-medium text-[#F5F0E8]"
            }
            data-ph-capture-attribute-download-store="play_store"
            data-ph-capture-attribute-download-campaign={campaign}
          >
            {t.playStore}
          </a>
        )}
      </div>

      {isInApp && (
        <div className="mt-10 w-full max-w-xs text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6F6459]">
            {t.notWorking}
          </p>
          <ol className="mt-3 space-y-2">
            {t.steps.map((step, index) => (
              <li key={step} className="flex items-start gap-3 text-sm text-[#2B2620]">
                <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#2B2620]/10 text-xs text-[#2B2620]">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}
    </main>
  );
}
