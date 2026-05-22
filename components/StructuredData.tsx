import { LANDING_CONTENT } from "@/lib/content";

const SITE_URL = "https://www.margotwardrobe.com";

// Safe JSON.stringify for embedding inside a <script> tag — escapes "<"
// (and therefore "</script>") so no closing-tag break-out is possible.
// After this, the payload contains zero "<", ">", or "&" characters, so
// passing it as a React text child is safe and avoids dangerouslySetInnerHTML.
function safeJson(obj: unknown): string {
  return JSON.stringify(obj)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

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

  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Margot",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "iOS",
    description:
      "AI wardrobe app that styles you from what you already own — daily outfit suggestions, weather and calendar aware.",
    offers: {
      "@type": "Offer",
      price: "5.99",
      priceCurrency: "EUR",
    },
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
      <LdScript payload={softwareApplication} />
      <LdScript payload={faqPage} />
    </>
  );
}
