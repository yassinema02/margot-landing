import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

const BASE = "https://www.margotwardrobe.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const blogEntries = getAllPosts().map((p) => ({
    url: `${BASE}/blog/${p.frontmatter.slug}`,
    lastModified: new Date(p.frontmatter.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...blogEntries,
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    // TODO: add /fr, /how-it-works, /pricing, /faq once those routes ship
  ];
}
