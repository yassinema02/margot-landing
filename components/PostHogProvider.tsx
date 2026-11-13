"use client";

/**
 * PostHog (EU) for the public landing.
 *
 * Cookieless by design: `persistence: 'memory'` means no cookie and no
 * localStorage, so no consent banner is required (decided 2026-06-01). The
 * tradeoff is that the anonymous id resets each page load — fine for a
 * top-of-funnel marketing site. `person_profiles: 'identified_only'` keeps
 * anonymous pageviews cheap (the landing has no login, so we never identify).
 *
 * No-op when NEXT_PUBLIC_POSTHOG_KEY is unset (local dev / preview without the
 * env var), so nothing breaks and nothing is sent.
 *
 * App Router note: posthog-js only auto-captures the first pageview, so we
 * disable that and emit `$pageview` manually on every pathname/search change.
 *
 * Invitation links (/i/<token>) carry a single-use token. `before_send`
 * rewrites it to /i/:token in every event (pageview, pageleave, autocapture,
 * heatmaps, store clicks: URL, pathname, referrer, session entry). The
 * invitation layout also passes `disableFlags`: the /flags request is not an
 * event, it carries $initial_current_url / $initial_pathname, and the landing
 * uses no feature flag. The rest of the site keeps its remote config.
 */

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog, { type PostHogConfig } from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { redactInviteEvent, redactInviteToken } from "@/lib/redactInviteToken";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";

export const POSTHOG_OPTIONS: Partial<PostHogConfig> = {
  api_host: POSTHOG_HOST,
  person_profiles: "identified_only",
  persistence: "memory", // cookieless — no banner needed
  capture_pageview: false, // emitted manually below for App Router
  capture_pageleave: true,
  disable_surveys: true, // not used — avoids loading surveys.js
  disable_session_recording: true, // no replay on the landing
  before_send: redactInviteEvent, // /i/<token> → /i/:token everywhere
};

/** Init options; `disableFlags` skips /flags and remote config entirely. */
export const VOTE_EVENTS = ['social_vote_web_viewed','social_vote_web_voted','social_vote_web_store_clicked','social_reported'] as const;
type VoteEvent = typeof VOTE_EVENTS[number];
type VoteProps = {locale?: string; platform?: string; result?: string; target_kind?: string; reason?: string};
let strictVoteReady=false;
const TRANSPORT_UUID=/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
const VALUES = {locale:['fr','en','es'],platform:['ios','android','other'],result:['ok','unavailable','limited','service_unavailable','clicked']};
export function strictVoteEvent(event: unknown) {
  if (!event || typeof event !== 'object') return null;
  const e=event as {event?:unknown;properties?:Record<string,unknown>;uuid?:unknown;timestamp?:unknown};
  if(!POSTHOG_KEY || !strictVoteReady || posthog._isIdentified())return null;
  const anonymousId=posthog.get_distinct_id();
  if(typeof anonymousId!=='string'||!TRANSPORT_UUID.test(anonymousId)||typeof e.uuid!=='string'||!TRANSPORT_UUID.test(e.uuid)||!(e.timestamp instanceof Date)||!Number.isFinite(e.timestamp.getTime()))return null;
  if (!VOTE_EVENTS.includes(e.event as VoteEvent)) return null;
  if(e.event==='social_reported') {
    if(e.properties?.target_kind!=='vote' || typeof e.properties?.reason!=='string' || !['harassment','hate','sexual','violence','spam','privacy','other'].includes(e.properties.reason))return null;
    return {uuid:e.uuid,timestamp:e.timestamp,event:e.event,properties:{target_kind:'vote',reason:e.properties.reason,token:POSTHOG_KEY,distinct_id:anonymousId}};
  }
  const properties:VoteProps={};
  for(const key of ['locale','platform','result'] as const){
    const value=e.properties?.[key];
    if(value!==undefined){if(typeof value!=='string'||!VALUES[key].includes(value))return null;properties[key]=value;}
  }
  return {uuid:e.uuid,timestamp:e.timestamp,event:e.event as string,properties:{...properties,token:POSTHOG_KEY,distinct_id:anonymousId}};
}
export function captureVoteEvent(event:VoteEvent,props:VoteProps) {
  configurePostHog({disableFlags:true,strictVote:true});
  if(POSTHOG_KEY && strictVoteReady && !posthog._isIdentified()) posthog.capture(event,props);
}
export function posthogOptions({ disableFlags, strictVote=false }: { disableFlags: boolean; strictVote?: boolean }): Partial<PostHogConfig> {
  if(strictVote)return {...POSTHOG_OPTIONS,autocapture:false,capture_pageleave:false,advanced_disable_flags:true,disable_external_dependency_loading:true,before_send:strictVoteEvent as PostHogConfig['before_send']};
  return disableFlags ? { ...POSTHOG_OPTIONS, advanced_disable_flags: true } : POSTHOG_OPTIONS;
}

// Root layouts usually reload the document. Also protect an already loaded
// singleton: switch config before capture and discard its previous identity.
export function configurePostHog({disableFlags,strictVote=false}:{disableFlags:boolean;strictVote?:boolean}) {
  if(!POSTHOG_KEY)return;
  const options=posthogOptions({disableFlags,strictVote});
  if(!posthog.__loaded)posthog.init(POSTHOG_KEY,options);
  else if(strictVote && !strictVoteReady){posthog.set_config(options);posthog.reset(true);}
  else if(!strictVote && strictVoteReady)posthog.set_config({...options,autocapture:true,capture_pageleave:true,advanced_disable_flags:disableFlags,disable_external_dependency_loading:false});
  strictVoteReady=strictVote && posthog.__loaded && !posthog._isIdentified();
}

/** `$current_url` of a manual pageview, invitation token removed. */
export function pageviewUrl(origin: string, pathname: string, query: string): string {
  return redactInviteToken(origin + pathname + (query ? `?${query}` : ""));
}

export function PostHogProvider({
  children,
  disableFlags = false,
  strictVote = false,
}: {
  children: React.ReactNode;
  /** Invitation page: no /flags request (see header). */
  disableFlags?: boolean;
  strictVote?: boolean;
}) {
  useEffect(() => {
    configurePostHog({disableFlags,strictVote});
  }, [disableFlags, strictVote]);

  // Without a key there's no client to provide — render children untouched.
  if (!POSTHOG_KEY) return <>{children}</>;

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        {!strictVote && <PageViewTracker />}
      </Suspense>
      {children}
    </PHProvider>
  );
}

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ph = usePostHog();

  useEffect(() => {
    if (!pathname || !ph) return;
    const url = pageviewUrl(window.origin, pathname, searchParams?.toString() ?? "");
    ph.capture("$pageview", { $current_url: url, $pathname: redactInviteToken(pathname) });
  }, [pathname, searchParams, ph]);

  return null;
}
