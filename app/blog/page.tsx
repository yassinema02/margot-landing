import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, formatPostDate } from "@/lib/blog";
import { safeJson } from "@/lib/jsonld";

const SITE_URL = "https://www.margotwardrobe.com";
const INDEX_TITLE = "The magpie's notes";
const INDEX_LEAD =
  "Short essays on wardrobes, restraint, and the small daily problem of getting dressed.";
const INDEX_DESCRIPTION = `${INDEX_LEAD} From the team building Margot.`;

export const metadata: Metadata = {
  title: `${INDEX_TITLE} · Margot`,
  description: INDEX_DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: `${INDEX_TITLE} · Margot`,
    description: INDEX_LEAD,
    url: `${SITE_URL}/blog`,
    type: "website",
    // og:image inherits from app/opengraph-image.tsx (root). Blog index doesn't
    // need its own variant — the homepage OG carries the brand identity well.
  },
  twitter: {
    card: "summary_large_image",
    site: "@margotwardrobe",
    creator: "@margotwardrobe",
    title: `${INDEX_TITLE} · Margot`,
    description: INDEX_LEAD,
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  // Blog (schema.org/Blog) is more semantically precise than CollectionPage
  // for an index of editorial posts — LLMs and rich-results engines treat the
  // two types differently when extracting article lists.
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${INDEX_TITLE} · Margot`,
    description: INDEX_LEAD,
    url: `${SITE_URL}/blog`,
    inLanguage: "en",
    publisher: { "@type": "Organization", name: "Margot" },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.frontmatter.title,
      url: `${SITE_URL}/blog/${p.frontmatter.slug}`,
      datePublished: p.frontmatter.date,
      description: p.frontmatter.excerpt,
      image: `${SITE_URL}/blog/${p.frontmatter.slug}/opengraph-image`,
      author: { "@type": "Organization", name: "Margot" },
    })),
  };

  return (
    <main className="bg-bg text-ink min-h-screen px-6 pt-[clamp(56px,8vw,96px)] pb-[clamp(48px,7vw,96px)]">
      <article className="max-w-[720px] mx-auto">
        <header className="mb-[clamp(40px,6vw,72px)]">
          <h1 className="font-display font-normal text-ink opsz-144 m-0 text-[clamp(40px,5vw,64px)] leading-[1.05] tracking-tight2 [text-wrap:balance]">
            The magpie&apos;s <em>notes</em>.
          </h1>
          <p className="mt-5 font-display italic text-ink3 opsz-96 text-[clamp(16px,1.7vw,19px)] leading-[1.45] tracking-tight5 max-w-[560px] [text-wrap:pretty]">
            {INDEX_LEAD}
          </p>
        </header>

        <ul className="m-0 p-0 list-none">
          {posts.map((p, i) => (
            <li
              key={p.frontmatter.slug}
              className={`py-8 ${i < posts.length - 1 ? "border-b border-warm2" : ""}`}
            >
              <Link
                href={`/blog/${p.frontmatter.slug}`}
                className="block no-underline group"
              >
                <div className="flex items-center gap-3 font-sans text-[11px] font-semibold tracking-wider2 uppercase text-ink3 mb-2">
                  <span>{formatPostDate(p.frontmatter.date)}</span>
                  <span aria-hidden="true">·</span>
                  <span>{p.frontmatter.readingTime} min read</span>
                </div>
                <h2 className="font-display font-normal text-ink opsz-96 m-0 text-[clamp(24px,3vw,32px)] leading-[1.15] tracking-tight4 [text-wrap:balance] group-hover:text-peach transition-colors">
                  {p.frontmatter.title}
                </h2>
                <p className="mt-3 font-display italic text-ink2 opsz-96 text-[clamp(15px,1.7vw,18px)] leading-[1.45] tracking-tight5 [text-wrap:pretty] m-0">
                  {p.frontmatter.excerpt}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </article>

      <script type="application/ld+json" suppressHydrationWarning>
        {safeJson(blogSchema)}
      </script>
    </main>
  );
}
