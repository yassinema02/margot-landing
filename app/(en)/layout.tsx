import type { Metadata } from "next";
import { RootShell } from "@/components/RootShell";

const SITE_URL = "https://www.margotwardrobe.com";
const DESCRIPTION =
  "Margot is the AI wardrobe app that turns your closet into daily outfits, shopping verdicts and packing lists from what you already own. Free on iOS and Android.";

// EN metadata only — /fr ships its own metadata via app/(fr)/layout.tsx + app/(fr)/fr/page.tsx.
// alternates.languages adds the hreflang annotations that point Google at the
// FR equivalent of every EN page.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Margot · Wardrobe app — daily outfits from what you own",
  description: DESCRIPTION,
  applicationName: "Margot",
  authors: [{ name: "Margot" }],
  // Invisible SEO keywords — "AI wardrobe app" lives here (not in the visible
  // title) so the brand stays AI-free on screen while keeping the search anchor.
  keywords: [
    "AI wardrobe app",
    "wardrobe app",
    "outfit planner",
    "daily outfit ideas",
    "what to wear",
    "capsule wardrobe",
  ],
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      fr: "/fr",
      "x-default": "/",
    },
  },
  openGraph: {
    title: "Margot · Wardrobe app — daily outfits from what you own",
    description: DESCRIPTION,
    url: `${SITE_URL}/`,
    siteName: "Margot",
    type: "website",
    locale: "en_GB",
    alternateLocale: ["fr_FR"],
    // og:image + twitter:image are auto-injected from app/opengraph-image.tsx.
  },
  twitter: {
    card: "summary_large_image",
    site: "@margotwardrobe",
    creator: "@margotwardrobe",
    title: "Margot · Wardrobe app — daily outfits from what you own",
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
  // Pinterest domain ownership verification.
  verification: { other: { "p:domain_verify": "057ec41d4b52055b45f12b1a360e087c" } },
  // iOS Smart App Banner — Safari on iPhone shows a native "Margot · Get" banner
  // that deep-links to the App Store listing.
  itunes: { appId: "6766047882" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <RootShell lang="en">{children}</RootShell>;
}
