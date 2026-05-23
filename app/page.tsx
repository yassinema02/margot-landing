import { LandingBody } from "@/components/LandingBody";

// Server component. metadata for "/" is owned by app/layout.tsx (which already
// declares hreflang alternates for fr + x-default). The interactive body is a
// "use client" import so the form state + ?ref= capture still work.
export default function Page() {
  return <LandingBody lang="en" />;
}
