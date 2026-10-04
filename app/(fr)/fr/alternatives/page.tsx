import type { Metadata } from "next";
import { AlternativesArticle } from "@/components/compare/AlternativesArticle";
import {
  ALTERNATIVES_CHECKED,
  ALTERNATIVES_COPY,
  ALTERNATIVES_PUBLISHED,
  alternativesEntries,
  alternativesSources,
} from "@/lib/compare/alternatives";
import { relatedForAlternatives } from "@/lib/related";

const t = ALTERNATIVES_COPY.fr;

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.metaDescription,
  alternates: { canonical: t.path, languages: { fr: "/fr/alternatives", en: "/alternatives", "x-default": "/alternatives" } },
  openGraph: {
    title: t.metaTitle,
    description: t.metaDescription,
    url: `https://www.margotwardrobe.com${t.path}`,
    siteName: "Margot",
    type: "article",
    locale: "fr_FR",
    alternateLocale: ["en_GB"],
    publishedTime: ALTERNATIVES_PUBLISHED,
    modifiedTime: ALTERNATIVES_CHECKED,
    images: ["https://www.margotwardrobe.com/opengraph-image"],
  },
  twitter: { card: "summary_large_image", site: "@margotwardrobe", title: t.metaTitle, description: t.metaDescription },
  robots: { index: true, follow: true },
};

export default function AlternativesPageFr() {
  return (
    <AlternativesArticle
      lang="fr"
      copy={t}
      apps={alternativesEntries("fr")}
      published={ALTERNATIVES_PUBLISHED}
      checked={ALTERNATIVES_CHECKED}
      sources={alternativesSources("fr")}
      related={relatedForAlternatives("fr")}
    />
  );
}
