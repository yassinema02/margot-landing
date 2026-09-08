import type { Metadata } from "next";
import { Partners } from "@/components/Partners";
import { safeJson } from "@/lib/jsonld";

const SITE_URL = "https://www.margotwardrobe.com";
const URL = `${SITE_URL}/partners`;
const TITLE = "Partners · Margot";
const DESCRIPTION =
  "For brands and affiliate networks: how Margot recommends products, where the product card appears in the app, and how we work with advertisers. Awin publisher Yavren, ID 3048471.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/partners", languages: { fr: "/fr/partenaires" } },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, type: "website" },
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
