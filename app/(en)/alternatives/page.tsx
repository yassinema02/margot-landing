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

const t = ALTERNATIVES_COPY.en;

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.metaDescription,
  alternates: { canonical: t.path, languages: { en: "/alternatives", fr: "/fr/alternatives", "x-default": "/alternatives" } },
  openGraph: {
    title: t.metaTitle,
    description: t.metaDescription,
    url: `https://www.margotwardrobe.com${t.path}`,
    siteName: "Margot",
    type: "article",
    locale: "en_GB",
    alternateLocale: ["fr_FR"],
    publishedTime: ALTERNATIVES_PUBLISHED,
    modifiedTime: ALTERNATIVES_CHECKED,
    images: ["https://www.margotwardrobe.com/opengraph-image"],
  },
  twitter: { card: "summary_large_image", site: "@margotwardrobe", title: t.metaTitle, description: t.metaDescription },
  robots: { index: true, follow: true },
};

export default function AlternativesPage() {
  return (
    <AlternativesArticle
      lang="en"
      copy={t}
      apps={alternativesEntries("en")}
      published={ALTERNATIVES_PUBLISHED}
      checked={ALTERNATIVES_CHECKED}
      sources={alternativesSources("en")}
      related={relatedForAlternatives("en")}
    />
  );
}
