import type { Metadata } from "next";
import { headers } from "next/headers";

import { InviteDownload } from "@/components/InviteDownload";
import { MargotMark } from "@/components/MargotMark";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/launch";
import { clientIpFromHeaders, isRateLimited } from "@/lib/rateLimit";
import {
  INVITE_COPY,
  INVITE_ORIGIN,
  fetchInvitePreview,
  invitePlatform,
  inviteUrl,
  isInviteToken,
  logInviteUnavailable,
  pickInviteLocale,
  type InviteLookup,
} from "@/lib/socialInvite";

// /i/<token> — social invitation page (Social 1.8.3, sub-plan 8a).
//
// With the app installed, the universal link / App Link opens the app
// directly (AASA + assetlinks.json); this page is for everyone else. It shows
// who invites (display name, @username, initial: never a face, founder
// decision), one store button for the visitor's platform, and copies the link
// on tap so the freshly installed app can offer « Coller le lien ».
//
// Never indexed (metadata + X-Robots-Tag in next.config.mjs). The token is a
// bearer secret: it is not in the metadata, never sent on as a referrer
// (no-referrer), and the (invite) root layout loads no third-party tracker;
// PostHog only sees /i/:token. Lookups are rate limited per IP.
//
// Three states (lib/socialInvite.ts): valid (inviter + store + copy),
// invalid (malformed token or definite null from the RPC: « Ce lien n'est
// plus valable », nothing copied), unavailable (could not check: Supabase
// error or missing env, rate limit: neutral line, store, link still copied,
// the app checks it).

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Lookups per IP per minute before the page stops asking Supabase.
const PREVIEW_LIMIT = { windowMs: 60_000, limit: 30 };

type Params = Promise<{ token: string }>;

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const locale = pickInviteLocale(requestHeaders.get("accept-language"));
  const c = INVITE_COPY[locale];
  // Neutral on purpose: link previews are public, the inviter's name is not.
  // Same card as the home page (French card for French visitors).
  const image = locale === "fr" ? `${INVITE_ORIGIN}/fr/opengraph-image` : `${INVITE_ORIGIN}/opengraph-image`;
  return {
    title: c.metaTitle,
    description: c.pitch,
    robots: { index: false, follow: false },
    referrer: "no-referrer",
    openGraph: { title: c.metaTitle, description: c.pitch, siteName: "Margot", type: "website", images: [image] },
  };
}

async function lookUp(token: string, ip: string): Promise<InviteLookup> {
  if (!isInviteToken(token)) return { status: "invalid" };
  if (await isRateLimited("social-invite-preview", ip, PREVIEW_LIMIT)) {
    logInviteUnavailable("rate_limited");
    return { status: "unavailable" };
  }
  return fetchInvitePreview(token);
}

export default async function InvitePage({ params }: { params: Params }) {
  const { token } = await params;
  const requestHeaders = await headers();
  const locale = pickInviteLocale(requestHeaders.get("accept-language"));
  const platform = invitePlatform(requestHeaders.get("user-agent"));
  const c = INVITE_COPY[locale];
  const lookup = await lookUp(token, clientIpFromHeaders(requestHeaders));

  // A dead link is not copied: pasting it in the app would only repeat what
  // this page already said. A link we could not check is: the app checks it.
  const copyUrl = lookup.status === "invalid" ? undefined : inviteUrl(token);
  const placement = `social_invite${lookup.status === "valid" ? "" : `_${lookup.status}`}`;
  const playUrl = `${PLAY_STORE_URL}&referrer=${encodeURIComponent("utm_source=margot_site&utm_campaign=social_invite")}`;

  const appStore = (primary: boolean) => (
    <InviteDownload
      key="app_store"
      href={APP_STORE_URL}
      store="app_store"
      label={c.appStore}
      primary={primary}
      placement={placement}
      copyUrl={copyUrl}
    />
  );
  const playStore = (primary: boolean) => (
    <InviteDownload
      key="play_store"
      href={playUrl}
      store="play_store"
      label={c.playStore}
      primary={primary}
      placement={placement}
      copyUrl={copyUrl}
    />
  );
  const buttons =
    platform === "ios" ? [appStore(true)] : platform === "android" ? [playStore(true)] : [appStore(true), playStore(false)];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 py-12 text-center text-ink">
      <a href={locale === "fr" ? "/fr" : "/"} className="no-underline">
        <MargotMark fontSize={26} />
      </a>

      {lookup.status === "valid" ? (
        <>
          <div
            aria-hidden="true"
            className="mt-10 flex h-24 w-24 items-center justify-center rounded-full bg-ink font-display text-[40px] leading-none text-surface"
          >
            {lookup.preview.initial}
          </div>
          <h1 className="mt-6 max-w-sm break-words font-display text-3xl leading-tight tracking-tight5">
            <bdi>{lookup.preview.displayName}</bdi>
            {c.invitesYou}
          </h1>
          <p className="mt-2 font-sans text-sm text-ink3">@{lookup.preview.username}</p>
          <p className="mt-6 max-w-xs font-sans text-base leading-relaxed text-ink2">{c.pitch}</p>
        </>
      ) : lookup.status === "unavailable" ? (
        <>
          <h1 className="mt-10 max-w-sm font-display text-3xl leading-tight tracking-tight5">{c.metaTitle}</h1>
          <p className="mt-4 max-w-xs font-sans text-base leading-relaxed text-ink2">{c.unavailable}</p>
        </>
      ) : (
        <>
          <h1 className="mt-10 max-w-sm font-display text-3xl leading-tight tracking-tight5">{c.invalid}</h1>
          <p className="mt-4 max-w-xs font-sans text-base leading-relaxed text-ink2">{c.pitch}</p>
        </>
      )}

      <div className="mt-8 flex w-full max-w-xs flex-col gap-3">{buttons}</div>

      {copyUrl && <p className="mt-6 max-w-xs font-sans text-xs text-ink3">{c.hasApp}</p>}
    </main>
  );
}
