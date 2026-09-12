import type { Metadata } from "next";
import { HOME } from "@/lib/home";
import { LandingBody } from "@/components/LandingBody";
import { LandingStructuredData } from "@/components/StructuredData";
import { getLandingStats } from "@/lib/stats";

const SITE_URL = "https://www.margotwardrobe.com";
const DESCRIPTION = HOME.fr.description;

export const metadata: Metadata = {
  title: HOME.fr.title,
  description: DESCRIPTION,
  alternates: {
    canonical: "/fr",
    languages: {
      en: "/",
      fr: "/fr",
      "x-default": "/",
    },
  },
  openGraph: {
    title: HOME.fr.title,
    description: DESCRIPTION,
    url: `${SITE_URL}/fr`,
    siteName: "Margot",
    type: "website",
    locale: "fr_FR",
    alternateLocale: ["en_GB"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@margotwardrobe",
    creator: "@margotwardrobe",
    title: HOME.fr.title,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

// Mêmes chiffres vivants que "/" — ISR 1 h via landing_stats().
export const revalidate = 3600;

export default async function FrPage() {
  const liveStats = await getLandingStats();
  return (
    <>
      <LandingStructuredData lang="fr" />
      <LandingBody lang="fr" liveStats={liveStats} />
    </>
  );
}
