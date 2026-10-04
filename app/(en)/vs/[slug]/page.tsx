import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComparisonArticle } from "@/components/compare/ComparisonArticle";
import { COMPETITORS, getCompetitor } from "@/lib/compare/competitors";
import { relatedForComparison } from "@/lib/related";

export const dynamicParams = false;

export function generateStaticParams() {
  return COMPETITORS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = getCompetitor((await params).slug);
  if (!c) return {};
  const t = c.copy.en;
  const path = `/vs/${c.slug}`;
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: { canonical: path, languages: { en: path, fr: `/fr/vs/${c.slug}`, "x-default": path } },
    openGraph: {
      title: t.metaTitle,
      description: t.metaDescription,
      url: `https://www.margotwardrobe.com${path}`,
      siteName: "Margot",
      type: "article",
      locale: "en_GB",
      alternateLocale: ["fr_FR"],
      publishedTime: c.published,
      modifiedTime: c.checked,
      images: ["https://www.margotwardrobe.com/opengraph-image"],
    },
    twitter: { card: "summary_large_image", site: "@margotwardrobe", title: t.metaTitle, description: t.metaDescription },
    robots: { index: true, follow: true },
  };
}

export default async function ComparisonPage({ params }: { params: Promise<{ slug: string }> }) {
  const c = getCompetitor((await params).slug);
  if (!c) notFound();
  return <ComparisonArticle competitor={c} lang="en" related={relatedForComparison(c.slug, "en")} />;
}
