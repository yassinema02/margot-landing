import type { Metadata } from "next";
import { headers } from "next/headers";

import { InviteDownload } from "@/components/InviteDownload";
import { MargotMark } from "@/components/MargotMark";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/launch";
import { INVITE_COPY, invitePlatform, pickInviteLocale } from "@/lib/socialInvite";

// 404 of the invitation pages (/i/…). Today nothing under (invite) calls
// notFound(); if a future change does, Next renders this page inside the
// tracker-free (invite) root layout, never the global app/not-found.tsx and
// its RootShell (GA4, Meta Pixel, Vercel Analytics) with a bearer token in
// the URL. Same calm line as a dead link, the Margot mark and a store button;
// nothing is copied (there is no valid link to paste).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function InviteNotFound() {
  const requestHeaders = await headers();
  const locale = pickInviteLocale(requestHeaders.get("accept-language"));
  const platform = invitePlatform(requestHeaders.get("user-agent"));
  const c = INVITE_COPY[locale];
  const placement = "social_invite_not_found";
  const playUrl = `${PLAY_STORE_URL}&referrer=${encodeURIComponent("utm_source=margot_site&utm_campaign=social_invite")}`;
  const appStore = (primary: boolean) => (
    <InviteDownload key="app_store" href={APP_STORE_URL} store="app_store" label={c.appStore} primary={primary} placement={placement} />
  );
  const playStore = (primary: boolean) => (
    <InviteDownload key="play_store" href={playUrl} store="play_store" label={c.playStore} primary={primary} placement={placement} />
  );
  const buttons =
    platform === "ios" ? [appStore(true)] : platform === "android" ? [playStore(true)] : [appStore(true), playStore(false)];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 py-12 text-center text-ink">
      <a href={locale === "fr" ? "/fr" : "/"} className="no-underline">
        <MargotMark fontSize={26} />
      </a>
      <h1 className="mt-10 max-w-sm font-display text-3xl leading-tight tracking-tight5">{c.invalid}</h1>
      <p className="mt-4 max-w-xs font-sans text-base leading-relaxed text-ink2">{c.pitch}</p>
      <div className="mt-8 flex w-full max-w-xs flex-col gap-3">{buttons}</div>
    </main>
  );
}
