import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAllPostSlugs, getPostBySlug, formatPostDate } from "@/lib/blog";
import { mdxComponents } from "@/components/blog/MdxComponents";
import { safeJson } from "@/lib/jsonld";
import { AppStoreBadge } from "@/components/AppStoreBadge";

// Per-post FAQ — rendered visibly AND emitted as FAQPage schema from the same
// source so the two never drift. Questions are phrased the way people actually
// ask AI assistants, so the answers are extractable/citeable.
const FAQ_BY_SLUG: Record<string, { q: string; a: string }[]> = {
  "what-to-wear-today": [
    { q: "Is there an app that tells you what to wear each day?", a: "Yes. Margot suggests one outfit every morning from the clothes you already own, chosen for the day's weather and your calendar. It's free on the App Store and starts working after you add as few as five pieces." },
    { q: "How do I stop wasting time deciding what to wear?", a: "Remove the decision instead of speeding it up. Margot picks one outfit each morning from your own wardrobe, so getting dressed takes seconds rather than the five-to-twelve minutes most people lose to it." },
    { q: "Does Margot use the weather and my calendar?", a: "Yes. Margot reads the local weather and the events on your calendar — the meeting, the rain, the dinner — and adjusts the suggested outfit to suit the day in front of you." },
  ],
  "ai-outfit-planner-does-it-work": [
    { q: "Does AI outfit planning actually work in 2026?", a: "For getting dressed faster from clothes you already own, yes. For replacing a human stylist who reads your body and personality in a room, no. The realistic win is a quicker morning and fewer impulse purchases, not a personal-shopper replacement." },
    { q: "What can an AI stylist app actually do?", a: "It can catalogue your wardrobe from photos, suggest outfits that match the weather and your calendar, and flag when a potential purchase duplicates what you already own. It cannot judge fit in person or replace a stylist's eye." },
    { q: "Is there a free AI outfit planner?", a: "Yes. Margot is free to download on the App Store and Google Play, with daily outfit suggestions from your own wardrobe. A Premium tier ($14.99/month or $59.99/year) unlocks unlimited suggestions plus the shopping and resale features." },
  ],
  "alternative-to-whering": [
    { q: "What is a good alternative to Whering?", a: "Margot is the closest restraint-first alternative: the same category (AI wardrobe with outfit suggestions) but built around one quiet daily outfit and no social feed. Choose Whering for a wardrobe community; choose Margot to have the morning decision answered privately." },
    { q: "Is Margot free like Whering?", a: "Both have a free tier. Margot is free to download on the App Store and Google Play, with an optional Premium tier at $14.99/month or $59.99/year." },
    { q: "Can I switch from Whering to Margot?", a: "There is no direct import yet. The simplest path is to photograph items as you wear them over a couple of weeks; Margot starts working with as few as five pieces." },
  ],
  "how-to-sell-on-vinted": [
    { q: "How do I sell clothes on Vinted fast?", a: "Three things move a listing: a specific title (Brand · Item · Detail · Size), an honest price 10–15% above the median sold price, and three clear photos (full piece, fabric close-up, label or flaw). Together they take about five minutes per item." },
    { q: "What makes a Vinted listing sell?", a: "Specificity, not better clothes. A clear title, a price benchmarked to sold listings, and honest photos in natural light. Vague listings sit for months; specific ones sell in days." },
    { q: "Can an app write my Vinted listings?", a: "Yes. Margot auto-drafts a Vinted listing — title, description, suggested price — for pieces you haven't worn in months, ready to publish in one tap. It's free on the App Store." },
  ],
};

const SITE_URL = "https://www.margotwardrobe.com";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const { frontmatter: f } = post;
  const url = `${SITE_URL}/blog/${f.slug}`;
  // openGraph.images / twitter.images are auto-populated by Next from the
  // sibling opengraph-image.tsx file convention. Don't duplicate here or
  // Next will use the explicit value and skip the generated one.
  return {
    title: f.metaTitle,
    description: f.metaDescription,
    keywords: f.keywords,
    alternates: { canonical: `/blog/${f.slug}` },
    openGraph: {
      title: f.metaTitle,
      description: f.metaDescription,
      url,
      type: "article",
      publishedTime: f.date,
    },
    twitter: {
      card: "summary_large_image",
      site: "@margotwardrobe",
      creator: "@margotwardrobe",
      title: f.metaTitle,
      description: f.metaDescription,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  const { frontmatter: f, content } = post;

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: f.title,
    description: f.excerpt,
    // Person author rather than Organization — feeds E-E-A-T signals
    // (Google treats individual byline + sameAs links as a stronger
    // expertise indicator than a faceless org).
    author: {
      "@type": "Person",
      name: "Yassine Benlahmr",
      url: `${SITE_URL}/press`,
      jobTitle: "Founder",
      worksFor: { "@type": "Organization", name: "Margot", url: `${SITE_URL}/` },
      sameAs: [
        "https://instagram.com/margotwardrobe",
        "https://tiktok.com/@margotwardrobe",
        "https://x.com/margotwardrobe",
      ],
    },
    publisher: {
      "@type": "Organization",
      name: "Margot",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
    },
    datePublished: f.date,
    dateModified: f.date,
    image: `${SITE_URL}/blog/${f.slug}/opengraph-image`,
    mainEntityOfPage: `${SITE_URL}/blog/${f.slug}`,
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Margot", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "The magpie's notes", item: `${SITE_URL}/blog` },
      {
        "@type": "ListItem",
        position: 3,
        name: f.title,
        item: `${SITE_URL}/blog/${f.slug}`,
      },
    ],
  };

  // Per-post HowTo schemas. Keyed by slug so we can add more later (e.g.
  // "how to digitise your wardrobe in fifteen minutes") without churning
  // the page shell.
  const howTo: Record<string, Record<string, unknown>> = {
    "how-to-sell-on-vinted": {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to sell on Vinted, properly",
      description:
        "A precise five-minute routine for titles, prices, photos and descriptions that move on Vinted.",
      totalTime: "PT5M",
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Write a specific title",
          text: "Use the shape Brand · Item description · Notable detail · Size. Example: Acne Studios cigarette trousers · charcoal · pleated front · 36.",
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Research the price",
          text: "Filter Vinted to sold listings of the same brand and item. List ten to fifteen percent above the median sold price.",
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Take three photos",
          text: "Full piece flat in natural light, a fabric close-up, and a label or honest flaw close-up.",
        },
        {
          "@type": "HowToStep",
          position: 4,
          name: "Write a short description",
          text: "Three to four sentences: piece, size, condition, fit note. Skip personality.",
        },
      ],
    },
  };
  const postHowTo = howTo[f.slug];

  const postFaq = FAQ_BY_SLUG[f.slug];
  const faqPage = postFaq
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: postFaq.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      }
    : null;

  return (
    <main className="bg-bg text-ink min-h-screen px-6 pt-[clamp(48px,7vw,88px)] pb-[clamp(48px,7vw,96px)]">
      <article className="max-w-[720px] mx-auto">
        <header className="mb-10">
          <div className="font-sans text-[11px] font-semibold tracking-wider2 uppercase text-peach mb-4">
            From the magpie&apos;s notes
          </div>
          <h1 className="font-display font-normal text-ink opsz-144 m-0 text-[clamp(40px,5.5vw,72px)] leading-[1.02] tracking-tight2 [text-wrap:balance]">
            {f.title}
          </h1>
          <p className="mt-5 font-display italic text-ink3 opsz-96 text-[clamp(16px,1.7vw,19px)] leading-[1.45] tracking-tight5 max-w-[600px] [text-wrap:pretty]">
            {f.excerpt}
          </p>
          <div className="mt-5 font-sans text-[12px] tracking-wider2 uppercase text-ink3">
            {formatPostDate(f.date)} <span aria-hidden="true">·</span> {f.readingTime} min read
          </div>
        </header>

        <hr className="border-warm2 my-10" />

        <div className="prose-margot">
          <Markdown remarkPlugins={[remarkGfm]} components={mdxComponents}>
            {content}
          </Markdown>
        </div>

        {postFaq ? (
          <section className="mt-16">
            <h2 className="font-display font-normal text-ink opsz-96 text-[clamp(22px,2.4vw,28px)] leading-[1.2] tracking-tight4 mb-6 [text-wrap:balance]">
              Questions, briefly.
            </h2>
            <dl className="space-y-6">
              {postFaq.map(({ q, a }) => (
                <div key={q}>
                  <dt className="font-sans text-[16px] font-semibold text-ink tracking-tight7 [text-wrap:pretty]">
                    {q}
                  </dt>
                  <dd className="mt-2 font-sans text-[16px] leading-[1.65] text-ink2 tracking-tight7 [text-wrap:pretty] max-w-[640px]">
                    {a}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        <aside className="mt-16 rounded-3xl border border-warm2 bg-surface px-[clamp(24px,4vw,40px)] py-[clamp(28px,4vw,40px)] flex flex-col items-center text-center">
          <div className="font-sans text-[11px] font-semibold tracking-wider2 uppercase text-peach mb-3">
            Try Margot
          </div>
          <p className="font-display italic text-ink opsz-96 text-[clamp(18px,2vw,22px)] leading-[1.4] tracking-tight5 max-w-[460px] mx-auto m-0 mb-5 [text-wrap:pretty]">
            Margot is live and free on the App Store. One outfit, every morning.
          </p>
          <AppStoreBadge lang="EN" size="lg" />
        </aside>

        <div className="mt-12">
          <Link
            href="/blog"
            className="font-sans text-[12px] font-medium tracking-tight7 text-ink3 hover:text-ink no-underline"
          >
            ← All notes
          </Link>
        </div>
      </article>

      <script type="application/ld+json" suppressHydrationWarning>
        {safeJson(article)}
      </script>
      <script type="application/ld+json" suppressHydrationWarning>
        {safeJson(breadcrumb)}
      </script>
      {postHowTo ? (
        <script type="application/ld+json" suppressHydrationWarning>
          {safeJson(postHowTo)}
        </script>
      ) : null}
      {faqPage ? (
        <script type="application/ld+json" suppressHydrationWarning>
          {safeJson(faqPage)}
        </script>
      ) : null}
    </main>
  );
}
