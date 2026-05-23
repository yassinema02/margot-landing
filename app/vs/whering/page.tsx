import type { Metadata } from "next";
import Link from "next/link";
import { safeJson } from "@/lib/jsonld";

const SITE_URL = "https://www.margotwardrobe.com";
const URL = `${SITE_URL}/vs/whering`;
const TITLE = "Margot vs Whering: which AI wardrobe app fits how you actually get dressed";
const DESCRIPTION =
  "An honest comparison: Whering is a social wardrobe with seven million users. Margot is a quiet daily-styling app built for restraint. Both pick outfits with AI. Here's how they actually differ.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/vs/whering" },
  keywords: [
    "whering alternative",
    "margot vs whering",
    "ai wardrobe app comparison",
    "best wardrobe app",
    "ai outfit planner uk",
  ],
  openGraph: {
    title: "Margot vs Whering — an honest comparison",
    description: DESCRIPTION,
    url: URL,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    site: "@margotwardrobe",
    title: "Margot vs Whering — an honest comparison",
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export default function VsWheringPage() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Margot", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Comparisons", item: `${SITE_URL}/vs/whering` },
      { "@type": "ListItem", position: 3, name: "Margot vs Whering", item: URL },
    ],
  };

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: TITLE,
    description: DESCRIPTION,
    url: URL,
    isPartOf: {
      "@type": "WebSite",
      name: "Margot",
      url: `${SITE_URL}/`,
    },
    primaryImageOfPage: { "@type": "ImageObject", url: `${SITE_URL}/opengraph-image` },
    about: [
      { "@type": "SoftwareApplication", name: "Margot", url: SITE_URL },
      { "@type": "SoftwareApplication", name: "Whering" },
    ],
  };

  // Comparison-specific FAQ. Distinct from the homepage FAQ so it can answer
  // the questions someone actually has when researching which app to pick.
  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is Margot a Whering alternative?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, in the loose sense that both apps catalogue your wardrobe and suggest outfits with AI. The lived experience is quite different: Whering is built around a social feed and community, while Margot is built around one quiet daily decision and a few restraint features (check before you buy, Vinted listing assistant). Whering will feel right if you enjoy sharing outfits and seeing friends'. Margot will feel right if you want the morning question answered and the rest of the time to be private.",
        },
      },
      {
        "@type": "Question",
        name: "Does Whering have AI outfit suggestions like Margot?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Whering offers AI-generated outfit suggestions and weather-aware styling. The honest difference is not the existence of the feature, it is the framing: Whering surfaces many suggestions across many surfaces. Margot suggests one outfit each morning, on purpose, so the morning is finished in under a minute.",
        },
      },
      {
        "@type": "Question",
        name: "Which is cheaper, Margot or Whering?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Whering offers a free tier with most core features and a paid Plus tier. Margot is £4.99 a month after a 7-day free trial — no free permanent tier yet. If price is the main constraint, Whering wins. If you want a focused product with no upsell surface, Margot is the cleaner fit.",
        },
      },
      {
        "@type": "Question",
        name: "Can I import my Whering wardrobe into Margot?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Not yet. Whering does not currently expose a wardrobe export and Margot has no import path for it. The cleanest move if you are switching is to photograph items as you wear them over a few weeks. Margot starts working with as few as five items.",
        },
      },
    ],
  };

  const rows = [
    { feature: "Daily AI outfit suggestion", margot: "Yes — one per morning", whering: "Yes — many suggestions across feed" },
    { feature: "Weather-aware styling", margot: "Yes", whering: "Yes" },
    { feature: "Calendar-aware styling", margot: "Yes — reads your events", whering: "Limited" },
    { feature: "Check before you buy", margot: "Yes — buy / consider / skip verdict", whering: "Yes — Cherry-pick" },
    { feature: "Vinted listing auto-draft", margot: "Yes — for unworn pieces", whering: "Not as a feature" },
    { feature: "Social wardrobe feed", margot: "No — by design", whering: "Yes — core experience" },
    { feature: "Cost-per-wear analytics", margot: "Yes", whering: "Yes" },
    { feature: "Platform", margot: "iOS (Android later)", whering: "iOS + Android" },
    { feature: "Free tier", margot: "7-day trial, then £4.99/month", whering: "Free + paid tier" },
    { feature: "Established userbase", margot: "Private beta", whering: "≈ 7 million users" },
  ];

  return (
    <main className="bg-bg text-ink min-h-screen px-6 py-[clamp(48px,7vw,96px)]">
      <article className="max-w-[760px] mx-auto">
        <Link
          href="/"
          className="font-sans text-[12px] font-medium tracking-tight7 text-ink3 hover:text-ink no-underline"
        >
          ← Back to Margot
        </Link>

        <header className="mt-8 mb-10">
          <div className="font-sans text-[11px] font-semibold tracking-wider2 uppercase text-peach mb-4">
            Comparison · Honest
          </div>
          <h1 className="font-display font-normal text-ink opsz-144 m-0 text-[clamp(36px,5vw,60px)] leading-[1.05] tracking-tight2 [text-wrap:balance]">
            Margot vs <em>Whering</em>.
          </h1>
          <p className="mt-5 font-display italic text-ink3 opsz-96 text-[clamp(16px,1.7vw,19px)] leading-[1.45] tracking-tight5 max-w-[620px] [text-wrap:pretty]">
            Both let an AI pick your outfits from photos of your closet. One is a social network for wardrobes. The other is a quiet morning routine. Here's how to tell which one fits you.
          </p>
        </header>

        <hr className="border-warm2 my-10" />

        <Section title="The short answer">
          <P>
            <Strong>Whering</Strong> is a community-first social wardrobe with about seven million users. You photograph your clothes, get outfit suggestions, and follow friends to see what they wore. It is the broader, busier product. <a href="https://whering.co.uk" target="_blank" rel="noopener noreferrer" className="text-ink underline decoration-peach underline-offset-4">whering.co.uk</a>.
          </P>
          <P>
            <Strong>Margot</Strong> is a single-purpose styling app. One outfit a morning, picked from the closet you already own, with weather and calendar context, plus a small set of restraint features (check before you buy, auto-drafted Vinted listings for unworn pieces). No social feed. No game mechanics. Currently in private beta.
          </P>
          <P>
            Pick Whering if you enjoy seeing friends' outfits and want one app for everything. Pick Margot if you want the morning decision finished by the time the kettle whistles and would rather your wardrobe stay private.
          </P>
        </Section>

        <Section title="What Whering does well">
          <Ul>
            <Li>
              <Strong>Community.</Strong> Seven million users is not a vanity metric — it means an active feed, real outfit inspiration from people who dress like you, and a sense of belonging if that is what you want from a wardrobe app.
            </Li>
            <Li>
              <Strong>Cross-platform.</Strong> iOS and Android, with feature parity.
            </Li>
            <Li>
              <Strong>Free tier.</Strong> Most of the core features work without paying.
            </Li>
            <Li>
              <Strong>Breadth.</Strong> Outfit planner, calendar of looks, friend feed, packing tools, statistics. If you want one app for everything, Whering covers more surface area.
            </Li>
          </Ul>
        </Section>

        <Section title="What Margot does differently">
          <Ul>
            <Li>
              <Strong>One decision per day.</Strong> Margot is built around a single suggestion each morning, not a stream. The feed is the closet itself, not a social timeline. If you find scrolling through outfits to be its own form of decision fatigue, this matters.
            </Li>
            <Li>
              <Strong>Calendar-aware styling.</Strong> Margot reads your day — the meeting, the rain, the dinner — and adjusts. Most wardrobe apps stop at weather. Margot does both.
            </Li>
            <Li>
              <Strong>Check before you buy, with a verdict.</Strong> Margot doesn't just score a candidate purchase — it tells you <em>buy</em>, <em>consider</em>, or <em>skip</em> based on whether the piece pairs with at least three things you already own. The honest answer, not a number.
            </Li>
            <Li>
              <Strong>Vinted listing assistant.</Strong> Items unworn for months get an auto-drafted Vinted listing: title, description, suggested price. One tap to publish.
            </Li>
            <Li>
              <Strong>No social layer.</Strong> Margot does not share, post, follow, or rank. The wardrobe stays yours.
            </Li>
          </Ul>
        </Section>

        <Section title="Feature by feature">
          <div className="overflow-x-auto my-6">
            <table className="w-full border-collapse text-left text-[14px]">
              <thead>
                <tr className="border-b border-warm2">
                  <Th>Feature</Th>
                  <Th>Margot</Th>
                  <Th>Whering</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.feature} className="border-b border-warm2/60 last:border-b-0">
                    <td className="py-3 pr-4 font-sans text-[14px] font-medium text-ink tracking-tight7 align-top">
                      {r.feature}
                    </td>
                    <td className="py-3 pr-4 font-sans text-[14px] text-ink2 tracking-tight7 align-top">
                      {r.margot}
                    </td>
                    <td className="py-3 font-sans text-[14px] text-ink2 tracking-tight7 align-top">
                      {r.whering}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Who each is for">
          <P>
            <Strong>Whering is for you if</Strong> — you enjoy the social side of clothes. You want to see what friends wore, share your own outfits, and feel like part of a community of dressers. You also probably want a free option and don't mind a busier app surface.
          </P>
          <P>
            <Strong>Margot is for you if</Strong> — you want the morning question answered and nothing else. You are tired of scrolling. You'd like fewer choices, not more. You also might be the kind of person who texts photos of clothes to one friend rather than posting them publicly.
          </P>
          <P className="text-ink3 font-display italic">
            Both are reasonable answers. The taste call is whether you want a wardrobe community or a wardrobe assistant.
          </P>
        </Section>

        <aside className="mt-16 rounded-3xl border border-warm2 bg-surface px-[clamp(24px,4vw,40px)] py-[clamp(28px,4vw,40px)] text-center">
          <div className="font-sans text-[11px] font-semibold tracking-wider2 uppercase text-peach mb-3">
            Try Margot
          </div>
          <p className="font-display italic text-ink opsz-96 text-[clamp(18px,2vw,22px)] leading-[1.4] tracking-tight5 max-w-[460px] mx-auto m-0 [text-wrap:pretty]">
            Margot is in private beta. The waitlist is open.
          </p>
          <Link
            href="/#top"
            className="inline-block mt-5 px-6 py-3 rounded-full bg-ink text-surface no-underline font-sans text-[14px] font-semibold tracking-tight7 hover:opacity-90 transition-opacity"
          >
            Reserve my spot
          </Link>
        </aside>

        <div className="mt-12 font-display italic text-ink3 text-[13px]">
          Related: <Link href="/blog/alternative-to-whering" className="text-ink underline decoration-peach underline-offset-4">our long-form piece on what's missing from the Whering experience</Link>.
        </div>
      </article>

      <script type="application/ld+json" suppressHydrationWarning>
        {safeJson(webPage)}
      </script>
      <script type="application/ld+json" suppressHydrationWarning>
        {safeJson(breadcrumb)}
      </script>
      <script type="application/ld+json" suppressHydrationWarning>
        {safeJson(faqPage)}
      </script>
    </main>
  );
}

// --- shared layout helpers (kept local to avoid touching /privacy's copies) ---

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-display font-normal text-ink opsz-96 text-[clamp(22px,2.4vw,28px)] leading-[1.2] tracking-tight4 mt-10 mb-4 [text-wrap:balance]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function P({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={`font-sans text-[16px] leading-[1.65] text-ink2 tracking-tight7 [text-wrap:pretty] my-4 max-w-[640px] ${className ?? ""}`}
    >
      {children}
    </p>
  );
}

function Ul({ children }: { children: React.ReactNode }) {
  return (
    <ul className="font-sans text-[16px] leading-[1.65] text-ink2 tracking-tight7 list-disc ml-6 mb-5 space-y-2 max-w-[640px]">
      {children}
    </ul>
  );
}

function Li({ children }: { children: React.ReactNode }) {
  return <li className="[text-wrap:pretty]">{children}</li>;
}

function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-ink">{children}</strong>;
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="py-3 pr-4 font-sans text-[11px] font-semibold tracking-wider2 uppercase text-ink3">
      {children}
    </th>
  );
}
