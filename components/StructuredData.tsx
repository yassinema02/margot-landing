import { HOME } from "@/lib/home";
import { safeJson } from "@/lib/jsonld";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/launch";

const SITE_URL = "https://www.margotwardrobe.com";

function LdScript({ payload }: { payload: unknown }) {
  return (
    <script type="application/ld+json" suppressHydrationWarning>
      {safeJson(payload)}
    </script>
  );
}

/**
 * FAQPage for the landing pages only. Google's guidelines require the FAQ
 * markup to describe FAQ content visible on *that* page, so this is emitted
 * by app/(en)/page.tsx and app/(fr)/fr/page.tsx — not by the root layout —
 * and in the page's language. Sourced from the same dictionary that renders
 * the FAQ section so the two never drift.
 */
export function LandingStructuredData({ lang }: { lang: "en" | "fr" }) {
  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: lang === "fr" ? "fr-FR" : "en",
    mainEntity: HOME[lang].faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
  const t = HOME[lang];
  return <>
    <LdScript payload={faqPage} />
    <LdScript payload={{
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#app`,
      name: "Margot",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "iOS, Android",
      inLanguage: lang,
      description: t.faq[0].a,
      url: `${SITE_URL}${lang === "fr" ? "/fr" : "/"}`,
      image: `${SITE_URL}/opengraph-image`,
      downloadUrl: [APP_STORE_URL, PLAY_STORE_URL],
      installUrl: [APP_STORE_URL, PLAY_STORE_URL],
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR", description: t.free },
      author: { "@type": "Organization", name: "Margot", url: SITE_URL },
    }} />
  </>;
}

/** Site-wide entities (Organization, WebSite). Rendered by RootShell on every page. */
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

  // WebSite identifies the site and its publisher.
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Margot",
    alternateName: "Margot Wardrobe",
    url: `${SITE_URL}/`,
    inLanguage: ["en", "fr"],
    publisher: { "@type": "Organization", name: "Margot" },
  };

  return (
    <>
      <LdScript payload={organization} />
      <LdScript payload={website} />
    </>
  );
}
