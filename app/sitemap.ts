import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

const BASE = "https://www.margotwardrobe.com";

// hreflang in sitemap: each URL declares its language alternates via the
// `alternates.languages` field. Google reads this to serve the right
// language version per visitor. /fr only mirrors the landing for now —
// sub-pages stay EN-only and don't declare a French alternate.

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const blogEntries = getAllPosts().map((p) => ({
    url: `${BASE}/blog/${p.frontmatter.slug}`,
    lastModified: new Date(p.frontmatter.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: `${BASE}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: { en: `${BASE}/`, fr: `${BASE}/fr` },
      },
    },
    {
      url: `${BASE}/fr`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: { en: `${BASE}/`, fr: `${BASE}/fr` },
      },
    },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...blogEntries,
    { url: `${BASE}/vs/whering`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/press`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    // TODO: /fr/privacy, /fr/terms, /fr/press, /fr/blog, /fr/vs/whering when those translate
  ];
}
