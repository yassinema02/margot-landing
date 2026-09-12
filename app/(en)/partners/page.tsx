import type { Metadata } from "next";
import { Partners } from "@/components/Partners";
import { safeJson } from "@/lib/jsonld";

const SITE_URL = "https://www.margotwardrobe.com";
const URL = `${SITE_URL}/partners`;
const TITLE = "Brand partnerships and affiliation · Margot";
const DESCRIPTION =
  "Information for brands and affiliate networks: product recommendations in Margot, placements in the app, partnership approach and contact details.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/partners", languages: { en: "/partners", fr: "/fr/partenaires", "x-default": "/partners" } },
  openGraph: { images: ["https://www.margotwardrobe.com/opengraph-image"], title: TITLE, description: DESCRIPTION, url: URL, type: "website" },
  twitter: { card: "summary_large_image", site: "@margotwardrobe", title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
};

export default function PartnersPage() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Margot", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Partners", item: URL },
    ],
  };

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: TITLE,
    description: DESCRIPTION,
    url: URL,
    isPartOf: { "@type": "WebSite", name: "Margot", url: `${SITE_URL}/` },
    about: { "@type": "Organization", name: "Margot", url: `${SITE_URL}/` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(webPage) }} />
      <Partners lang="EN" />
    </>
  );
}
