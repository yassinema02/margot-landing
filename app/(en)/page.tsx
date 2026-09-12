import type { Metadata } from "next";
import { HOME } from "@/lib/home";
import { LandingBody } from "@/components/LandingBody";
import { LandingStructuredData } from "@/components/StructuredData";
import { getLandingStats } from "@/lib/stats";

const SITE_URL = "https://www.margotwardrobe.com";
const DESCRIPTION = HOME.en.description;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: HOME.en.title,
  description: DESCRIPTION,
  applicationName: "Margot",
  authors: [{ name: "Margot" }],
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      fr: "/fr",
      "x-default": "/",
    },
  },
  openGraph: {
    title: HOME.en.title,
    description: DESCRIPTION,
    url: `${SITE_URL}/`,
    siteName: "Margot",
    type: "website",
    locale: "en_GB",
    alternateLocale: ["fr_FR"],
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: HOME.en.headline }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@margotwardrobe",
    creator: "@margotwardrobe",
    title: HOME.en.title,
    description: DESCRIPTION,
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
  // Pinterest domain ownership verification.
  verification: { other: { "p:domain_verify": "057ec41d4b52055b45f12b1a360e087c" } },
  // iOS Smart App Banner — Safari on iPhone shows a native "Margot · Get" banner
  // that deep-links to the App Store listing.
  itunes: { appId: "6766047882" },
};

// Keep the page server-rendered; refresh optional aggregate proof hourly.
export const revalidate = 3600;

export default async function Page() {
  const liveStats = await getLandingStats();
  return (
    <>
      <LandingStructuredData lang="en" />
      <LandingBody lang="en" liveStats={liveStats} />
    </>
  );
}
