import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAllPostSlugs, getPostBySlug, formatPostDate } from "@/lib/blog";
import { mdxComponents } from "@/components/blog/MdxComponents";
import { safeJson } from "@/lib/jsonld";

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
    author: { "@type": "Organization", "name": "Margot" },
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

        <aside className="mt-16 rounded-3xl border border-warm2 bg-surface px-[clamp(24px,4vw,40px)] py-[clamp(28px,4vw,40px)] text-center">
          <div className="font-sans text-[11px] font-semibold tracking-wider2 uppercase text-peach mb-3">
            Reserve your spot
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
    </main>
  );
}
