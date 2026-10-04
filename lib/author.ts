// Single author identity for every article, guide and comparison page, so the
// visible byline and the Article/WebPage JSON-LD always name the same person.
// `sameAs` is deliberately absent: the brand's social accounts identify the
// Organization (components/StructuredData.tsx), not the founder. Add personal
// profile URLs here only once they exist and are public.

const SITE_URL = "https://www.margotwardrobe.com";

export const AUTHOR = {
  name: "Yassine Benlahmr",
  url: `${SITE_URL}/press`,
  role: { en: "founder of Margot", fr: "fondateur de Margot" },
} as const;

export function authorJsonLd() {
  return {
    "@type": "Person",
    name: AUTHOR.name,
    url: AUTHOR.url,
    jobTitle: "Founder",
    worksFor: { "@type": "Organization", name: "Margot", url: `${SITE_URL}/` },
  };
}

export const PUBLISHER_JSON_LD = {
  "@type": "Organization",
  name: "Margot",
  url: `${SITE_URL}/`,
  logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
} as const;
