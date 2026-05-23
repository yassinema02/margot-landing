import type { Metadata } from "next";
import { LandingBody } from "@/components/LandingBody";

const SITE_URL = "https://www.margotwardrobe.com";
const DESCRIPTION =
  "Margot est l'app garde-robe IA qui vous habille à partir de ce que vous avez déjà — une tenue chaque matin, météo et agenda intégrés. Rejoignez la bêta privée.";

export const metadata: Metadata = {
  title: "Margot · App garde-robe IA — votre tenue, chaque matin",
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
    title: "Margot · App garde-robe IA",
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
    title: "Margot · App garde-robe IA",
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export default function FrPage() {
  return <LandingBody lang="fr" />;
}
