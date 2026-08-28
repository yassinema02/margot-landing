import type { Metadata } from "next";
import { Partners } from "@/components/Partners";
import { safeJson } from "@/lib/jsonld";

const SITE_URL = "https://www.margotwardrobe.com";
const URL = `${SITE_URL}/fr/partenaires`;
const TITLE = "Partenaires · Margot";
const DESCRIPTION =
  "Pour les marques et les réseaux d'affiliation : comment Margot recommande des produits, où la fiche produit apparaît dans l'application, et notre façon de travailler avec les annonceurs. Éditeur Awin Yavren, ID 3048471.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/fr/partenaires", languages: { en: "/partners" } },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, type: "website", locale: "fr_FR" },
  twitter: { card: "summary_large_image", site: "@margotwardrobe", title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
};

export default function PartenairesPage() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Margot", item: `${SITE_URL}/fr` },
      { "@type": "ListItem", position: 2, name: "Partenaires", item: URL },
    ],
  };

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: TITLE,
    description: DESCRIPTION,
    url: URL,
    inLanguage: "fr-FR",
    isPartOf: { "@type": "WebSite", name: "Margot", url: `${SITE_URL}/` },
    about: { "@type": "Organization", name: "Margot", url: `${SITE_URL}/` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(webPage) }} />
      <Partners lang="FR" />
    </>
  );
}
