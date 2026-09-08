import type { Metadata } from "next";
import { LandingBody } from "@/components/LandingBody";
import { LandingFaqStructuredData } from "@/components/StructuredData";
import { getLandingStats } from "@/lib/stats";

const SITE_URL = "https://www.margotwardrobe.com";
const DESCRIPTION =
  "Margot, l'application garde-robe IA : une tenue chaque matin depuis ce que tu possèdes déjà, un avis avant d'acheter, ta valise prête. Gratuit sur iOS et Android.";

export const metadata: Metadata = {
  title: "Margot · Application garde-robe digitale — ta tenue du jour",
  description: DESCRIPTION,
  // Mot-clé invisible "application garde-robe IA" pour le SEO, sans l'afficher.
  keywords: [
    "application garde-robe IA",
    "application garde-robe",
    "tenues quotidiennes",
    "quoi porter",
    "planificateur de tenues",
    "garde-robe capsule",
  ],
  alternates: {
    canonical: "/fr",
    languages: {
      en: "/",
      fr: "/fr",
      "x-default": "/",
    },
  },
  openGraph: {
    images: ["https://www.margotwardrobe.com/opengraph-image"],
    title: "Margot · Application garde-robe digitale — ta tenue du jour",
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
    title: "Margot · Application garde-robe digitale — ta tenue du jour",
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
      <LandingFaqStructuredData lang="fr" />
      <LandingBody lang="fr" liveStats={liveStats} />
    </>
  );
}
