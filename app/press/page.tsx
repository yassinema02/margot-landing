import type { Metadata } from "next";
import Link from "next/link";
import { safeJson } from "@/lib/jsonld";

const SITE_URL = "https://www.margotwardrobe.com";
const URL = `${SITE_URL}/press`;
const TITLE = "Press kit · Margot";
const DESCRIPTION =
  "Press kit for Margot, the AI wardrobe app. Boilerplate at three lengths, founder bio, downloadable brand assets, founder soundbites, and contact for journalists.";
const PRESS_EMAIL = "hello@margotwardrobe.com";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/press" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@margotwardrobe",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export default function PressPage() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Margot", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Press kit", item: URL },
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

  const facts: [string, string][] = [
    ["Name", "Margot"],
    ["Tagline", "the magpie who reads your closet"],
    ["What it is", "AI wardrobe app for daily outfit suggestions from clothes you already own"],
    ["Status", "Private beta · public launch mid-2026"],
    ["Platform", "iOS first; Android later"],
    ["Pricing", "Free tier + Premium at $9.99 / mo or $39.99 / yr (Save 67%) · regional pricing in EUR + GBP · Family Sharing"],
    ["Headquarters", "Casablanca, Morocco"],
    ["Primary markets", "France · United Kingdom"],
    ["Founder", "Yassine Benlahmr"],
    ["Site", "margotwardrobe.com"],
    ["Socials", "@margotwardrobe on Instagram, TikTok, X"],
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

        <header className="mt-8 mb-12">
          <div className="font-sans text-[11px] font-semibold tracking-wider2 uppercase text-peach mb-4">
            Press kit · For journalists, writers, editors
          </div>
          <h1 className="font-display font-normal text-ink opsz-144 m-0 text-[clamp(40px,5.5vw,68px)] leading-[1.02] tracking-tight2 [text-wrap:balance]">
            Press <em>kit</em>.
          </h1>
          <p className="mt-5 font-display italic text-ink3 opsz-96 text-[clamp(16px,1.7vw,19px)] leading-[1.45] tracking-tight5 max-w-[620px] [text-wrap:pretty]">
            Everything you need to write about Margot: boilerplate at three lengths, founder
            details, brand assets, and a way to reach us when you have questions.
          </p>
        </header>

        <Section title="The short version">
          <P>
            Margot is an AI wardrobe app that helps people get dressed from what they already own —
            not buy more. Each morning, Margot suggests one outfit based on the user's actual
            closet, the weather where they are, and the calendar in front of them. She also tells
            users when <em>not</em> to buy something — by checking whether a piece pairs with three
            things they already own — and auto-drafts Vinted listings for items left unworn for
            months.
          </P>
          <P>
            Currently in private beta. Public launch imminent. Built in Casablanca by Yassine
            Benlahmr, for users in Paris, London, and anywhere else people have wardrobes that feel
            larger than they need to.
          </P>
        </Section>

        <Hr />

        <Section title="Key facts">
          <dl className="grid grid-cols-[140px_1fr] gap-x-6 gap-y-3 max-w-[640px] mt-2">
            {facts.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="font-sans text-[12px] font-semibold tracking-wider2 uppercase text-ink3 pt-1">
                  {k}
                </dt>
                <dd className="font-sans text-[15px] leading-[1.55] text-ink tracking-tight7 m-0 [text-wrap:pretty]">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section title="Boilerplate · 50 words">
          <Quote>
            Margot is an AI wardrobe app for people who already own enough clothes. She catalogues
            what you have, watches the weather and your calendar, and suggests one outfit each
            morning. She also tells you when not to buy something — by checking whether it pairs
            with three things you already own.
          </Quote>
        </Section>

        <Section title="Boilerplate · 150 words">
          <Quote>
            Margot is the AI wardrobe app for people who want a quiet morning, not a social network
            for their closet. Each morning, Margot suggests one outfit based on the user's actual
            wardrobe, the weather where they are, and the calendar in front of them. She also tells
            users when <em>not</em> to buy something — by checking whether a piece pairs with three
            things they already own — and auto-drafts Vinted listings for items left unworn for
            months.
            <br />
            <br />
            Currently in private TestFlight. Built in Casablanca for Paris and London by founder
            Yassine Benlahmr. Public launch imminent. Margot is free to start, with a Premium tier at
            $9.99 per month or $39.99 per year (Save 67%), and regional equivalents in EUR and GBP.
          </Quote>
        </Section>

        <Section title="Boilerplate · 300 words">
          <Quote>
            <strong className="font-semibold text-ink">Margot</strong> is an AI wardrobe app for
            people who already own enough clothes. The premise is unfashionable in a category full
            of social feeds and game mechanics: most people don't need more pieces, they need a way
            to remember the ones they have.
            <br />
            <br />
            Each morning, Margot suggests one outfit based on three inputs: the user's actual
            wardrobe (photographed once and tagged automatically by Margot's vision pipeline), the
            weather where they are, and the calendar in front of them — the meeting, the rain, the
            dinner they forgot they had. The suggestion arrives before the kettle whistles. There
            is no social feed.
            <br />
            <br />
            Margot also runs in the opposite direction of every other shopping app. When a user is
            tempted by something new, Margot's "Check Before You Buy" feature scores whether the
            piece pairs with at least three items they already own, and gives a buy / consider /
            skip verdict in the founder's voice. For items that have gone unworn for months, Margot
            auto-drafts a Vinted listing — title, description, suggested price — ready to publish
            in one tap.
            <br />
            <br />
            Built in Casablanca by founder Yassine Benlahmr and currently in private TestFlight,
            Margot launches publicly mid-2026. Margot is free to start, with a Premium tier at $9.99
            per month or $39.99 per year (Save 67%), and Family Sharing on iOS.
            The brand voice is literary and restrained, the visual identity is editorial cream and
            terracotta, and the brand mascot is a magpie — the bird who collects everything that
            shines and remembers where she put it.
          </Quote>
        </Section>

        <Hr />

        <Section title="The founder">
          <P>
            <Strong>Yassine Benlahmr</Strong> is the solo founder and operator of Margot. He builds
            from Casablanca, with a focus on quiet products that respect a user's morning. Margot
            started from his own frustration with wardrobe apps that turned getting dressed into a
            social performance — and from the observation that nobody actually needs more clothes,
            they just need to remember the ones they have.
          </P>
          <P>
            Before Margot, Yassine worked on consumer iOS products and AI tooling. He writes the
            essays on{" "}
            <Link href="/blog" className="text-ink underline decoration-peach underline-offset-4">
              the magpie's notes
            </Link>{" "}
            himself.
          </P>
          <P className="text-ink3 italic">
            For interview requests or background calls, contact{" "}
            <a
              href={`mailto:${PRESS_EMAIL}?subject=Press%20enquiry`}
              className="text-ink not-italic underline decoration-peach underline-offset-4"
            >
              {PRESS_EMAIL}
            </a>
            .
          </P>
        </Section>

        <Hr />

        <Section title="Brand assets">
          <P>
            All assets below are released for editorial use covering Margot. Please don't modify
            colors, distort proportions, or place the mark on busy backgrounds — there's a reason
            it lives on cream.
          </P>

          <div className="grid sm:grid-cols-2 gap-5 mt-6">
            <AssetCard
              title="Brand mark (SVG)"
              note="Magpie face, scales infinitely. Use on cream or white backgrounds."
              href="/press/margot-mark.svg"
            >
              <svg viewBox="0 0 32 32" className="w-20 h-20" aria-hidden="true">
                <rect width="32" height="32" rx="7" fill="#ECEAE5" />
                <path
                  d="M 9 13 C 9 7 14 5 18 5.5 C 24 6 25 11 24.5 16 C 24 21 19 22 16 22 C 12 21.5 9 18.5 9 13 Z"
                  fill="#2D3A33"
                />
                <ellipse cx={17} cy={10} rx={6} ry={2} fill="#3F5F52" opacity={0.55} />
                <path d="M 9 14 L 2 16 L 9 18 Z" fill="#A84A2D" />
                <circle cx={14} cy={12} r={0.9} fill="#F6F4EF" />
              </svg>
            </AssetCard>

            <AssetCard
              title="Wordmark (SVG)"
              note="Set in Fraunces italic. The period is always peach. Don't substitute another typeface."
              href="/press/margot-wordmark.svg"
            >
              <div className="font-display italic text-ink text-[40px] tracking-tightest leading-none">
                Margot<span className="text-peach not-italic">.</span>
              </div>
            </AssetCard>

            <AssetCard
              title="App icon"
              note="The same magpie mark, rendered as the iOS app icon (180×180 PNG)."
              href="/apple-icon.png"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/apple-icon.png" alt="" width={80} height={80} className="rounded-2xl" />
            </AssetCard>

            <AssetCard
              title="Brand palette"
              note="Colors, type families, and rules-of-thumb. Plain text — easy to paste into a brief."
              href="/press/brand-palette.txt"
            >
              <div className="flex gap-2 flex-wrap">
                {[
                  ["#ECEAE5", "Cream"],
                  ["#2D3A33", "Ink"],
                  ["#A84A2D", "Peach"],
                  ["#5F7560", "Sage"],
                ].map(([hex, label]) => (
                  <div key={hex} className="flex flex-col items-center">
                    <div
                      className="w-10 h-10 rounded-md border border-warm2"
                      style={{ background: hex }}
                    />
                    <div className="mt-1 font-sans text-[10px] tracking-wider2 uppercase text-ink3">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </AssetCard>
          </div>

          <P className="mt-6 text-ink3 italic text-[14px]">
            App screenshots are not yet public — the app is in private TestFlight. We'll share
            high-resolution screens directly with credentialed press on request.
          </P>
        </Section>

        <Hr />

        <Section title="Founder soundbites">
          <P className="text-ink3 italic text-[14px] mt-0">
            Quotes ready to pull. Attribute to Yassine Benlahmr, founder of Margot.
          </P>

          <Soundbite>
            "Most people don't need more clothes. They need a way to remember the ones they have."
          </Soundbite>
          <Soundbite>
            "We built Margot for the kind of person who texts a photo of an outfit to one friend
            rather than posting it publicly. There's no social feed by design."
          </Soundbite>
          <Soundbite>
            "The hardest thing we built isn't the outfit suggestion. It's the part where Margot
            tells you not to buy something — and means it."
          </Soundbite>
          <Soundbite>
            "A magpie collects everything that shines and remembers where she put it. That's a
            wardrobe assistant, not a community."
          </Soundbite>
        </Section>

        <Hr />

        <Section title="Coverage">
          <P className="italic font-display text-ink2">
            Margot is in private beta. There is no press coverage yet. We'd be happy to be your
            first.
          </P>
        </Section>

        <Hr />

        <Section title="Contact">
          <P>
            <Strong>Press enquiries</Strong> — interview requests, background calls, embargoed
            access, screenshots, demo of the app: <br />
            <a
              href={`mailto:${PRESS_EMAIL}?subject=Press%20enquiry%20%E2%80%94%20Margot`}
              className="text-ink underline decoration-peach underline-offset-4 hover:decoration-2"
            >
              {PRESS_EMAIL}
            </a>
          </P>
          <P>
            <Strong>Time zone</Strong> — Casablanca (WET/WEST). Most replies within a working day.
          </P>
          <P>
            <Strong>For everything else</Strong> — the waitlist, the blog, the comparison pages
            and the privacy policy live at{" "}
            <Link href="/" className="text-ink underline decoration-peach underline-offset-4">
              margotwardrobe.com
            </Link>
            .
          </P>
        </Section>

        <div className="mt-16 font-display italic text-ink3 text-[14px]">
          Thank you for writing about Margot. Be honest. Skip the SaaS adjectives.
        </div>
      </article>

      <script type="application/ld+json" suppressHydrationWarning>
        {safeJson(webPage)}
      </script>
      <script type="application/ld+json" suppressHydrationWarning>
        {safeJson(breadcrumb)}
      </script>
    </main>
  );
}

// --- helpers ---

function Section({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      {title && (
        <h2 className="font-display font-normal text-ink opsz-96 text-[clamp(22px,2.4vw,28px)] leading-[1.2] tracking-tight4 mt-10 mb-4 [text-wrap:balance]">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

function P({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={`font-sans text-[16px] leading-[1.65] text-ink2 tracking-tight7 [text-wrap:pretty] my-4 max-w-[640px] ${
        className ?? ""
      }`}
    >
      {children}
    </p>
  );
}

function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-ink">{children}</strong>;
}

function Hr() {
  return <hr className="my-10 border-0 h-px bg-warm2" />;
}

function Quote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="border-l-2 border-peach pl-5 font-display text-[clamp(16px,1.8vw,19px)] leading-[1.55] text-ink2 tracking-tight5 my-4 max-w-[640px] [text-wrap:pretty]">
      {children}
    </blockquote>
  );
}

function Soundbite({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="font-display italic text-ink text-[clamp(18px,2vw,22px)] leading-[1.4] tracking-tight4 my-6 max-w-[620px] [text-wrap:pretty] border-l-2 border-peach pl-5">
      {children}
    </blockquote>
  );
}

function AssetCard({
  title,
  note,
  href,
  children,
}: {
  title: string;
  note: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      download
      className="rounded-2xl border border-warm2 bg-surface px-5 py-6 flex flex-col gap-4 hover:border-ink/40 transition-colors no-underline"
    >
      <div className="flex items-center justify-center h-24">{children}</div>
      <div>
        <div className="font-sans text-[11px] font-semibold tracking-wider2 uppercase text-peach mb-1">
          Download
        </div>
        <div className="font-display font-normal text-ink opsz-96 text-[18px] leading-[1.2] tracking-tight4">
          {title}
        </div>
        <div className="mt-1 font-sans text-[13px] text-ink2 leading-[1.45] tracking-tight7 [text-wrap:pretty]">
          {note}
        </div>
      </div>
    </a>
  );
}
