import { LANDING_CONTENT } from "@/lib/content";
import { safeJson } from "@/lib/jsonld";
import { APP_STORE_URL } from "@/lib/launch";

const SITE_URL = "https://www.margotwardrobe.com";

function LdScript({ payload }: { payload: unknown }) {
  return (
    <script type="application/ld+json" suppressHydrationWarning>
      {safeJson(payload)}
    </script>
  );
}

export function StructuredData() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Margot",
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/icon.svg`,
    sameAs: [
      "https://instagram.com/margotwardrobe",
      "https://tiktok.com/@margotwardrobe",
      "https://x.com/margotwardrobe",
    ],
  };

  // WebSite schema enables Google's sitelinks search box and gives LLMs a
  // canonical entity to anchor to when reasoning about the brand.
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Margot",
    alternateName: "Margot Wardrobe",
    url: `${SITE_URL}/`,
    inLanguage: ["en", "fr"],
    publisher: { "@type": "Organization", name: "Margot" },
  };

  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Margot",
    applicationCategory: "LifestyleApplication",
    applicationSubCategory: "FashionApplication",
    operatingSystem: "iOS",
    // "AI" lives here (and in meta keywords + llms.txt) for the search/LLM
    // signal on "AI wardrobe app" WITHOUT showing in the visible title/snippet.
    description:
      "AI wardrobe app that styles you from what you already own — daily outfit suggestions, weather and calendar aware.",
    keywords:
      "AI wardrobe app, AI stylist, outfit planner, wardrobe app, daily outfits, what to wear, capsule wardrobe",
    url: `${SITE_URL}/`,
    image: `${SITE_URL}/opengraph-image`,
    downloadUrl: APP_STORE_URL,
    installUrl: APP_STORE_URL,
    featureList: [
      "Daily outfit suggestions from your existing wardrobe",
      "Weather-aware styling",
      "Calendar-aware styling (suits the meeting, the rain, the dinner)",
      "Check Before You Buy — compatibility scoring against your closet",
      "Auto-generated Vinted listings for unworn pieces",
      "Sustainability and cost-per-wear analytics",
    ],
    offers: [
      {
        "@type": "Offer",
        name: "Margot Premium Monthly",
        price: "9.99",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: APP_STORE_URL,
      },
      {
        "@type": "Offer",
        name: "Margot Premium Annual",
        price: "39.99",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: APP_STORE_URL,
      },
    ],
    author: { "@type": "Organization", name: "Margot" },
  };

  // Source FAQ from the same dictionary that renders the FAQ section so the
  // two never drift. EN is what the canonical page renders today.
  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: LANDING_CONTENT.en.faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <>
      <LdScript payload={organization} />
      <LdScript payload={website} />
      <LdScript payload={softwareApplication} />
      <LdScript payload={faqPage} />
    </>
  );
}
