import { LandingBody } from "@/components/LandingBody";
import { getLandingStats } from "@/lib/stats";

// Server component. metadata for "/" is owned by app/layout.tsx (which already
// declares hreflang alternates for fr + x-default). The interactive body is a
// "use client" import so the form state + ?ref= capture still work.

// The "Margot in numbers" section pulls live aggregates from the landing_stats
// RPC; ISR re-renders the page at most once an hour so the figures stay fresh
// without a deploy.
export const revalidate = 3600;

export default async function Page() {
  const liveStats = await getLandingStats();
  return <LandingBody lang="en" liveStats={liveStats} />;
}
