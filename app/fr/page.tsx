import type { Metadata } from "next";
import { LandingBody } from "@/components/LandingBody";

const SITE_URL = "https://www.margotwardrobe.com";
const DESCRIPTION =
  "Margot simplifie votre garde-robe : tenues quotidiennes, avis avant achat, valise de voyage et suivi de ce que vous possédez déjà. Rejoignez la bêta privée.";

export const metadata: Metadata = {
  title: "Margot · La garde-robe simplifiée",
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
    title: "Margot · La garde-robe simplifiée",
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
    title: "Margot · La garde-robe simplifiée",
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export default function FrPage() {
  return <LandingBody lang="fr" />;
}
