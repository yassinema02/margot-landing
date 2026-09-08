import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

const BASE = "https://www.margotwardrobe.com";

// `updated` is the last *content* change of the page, maintained by hand when
// a page is edited (see docs/seo README, weekly check). Google only trusts
// <lastmod> when it is consistent, so we never emit the build time here.
type Page = {
  path: string;
  updated: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
  /** hreflang pair. `en`/`fr` paths; x-default = the EN page when one exists, else self. */
  languages?: { en?: string; fr?: string };
};

const PAGES: Page[] = [
  { path: "/", updated: "2026-09-08", changeFrequency: "weekly", priority: 1, languages: { en: "/", fr: "/fr" } },
  { path: "/fr", updated: "2026-09-08", changeFrequency: "weekly", priority: 1, languages: { en: "/", fr: "/fr" } },
  { path: "/fr/garde-robe-digitale", updated: "2026-09-08", changeFrequency: "monthly", priority: 0.9, languages: { fr: "/fr/garde-robe-digitale" } },
  { path: "/fr/quoi-porter-aujourdhui", updated: "2026-09-08", changeFrequency: "monthly", priority: 0.8, languages: { en: "/blog/what-to-wear-today", fr: "/fr/quoi-porter-aujourdhui" } },
  { path: "/vs/whering", updated: "2026-09-08", changeFrequency: "monthly", priority: 0.8, languages: { en: "/vs/whering", fr: "/fr/vs/whering" } },
  { path: "/fr/vs/whering", updated: "2026-09-08", changeFrequency: "monthly", priority: 0.8, languages: { en: "/vs/whering", fr: "/fr/vs/whering" } },
  { path: "/blog", updated: "2026-09-08", changeFrequency: "weekly", priority: 0.8 },
  { path: "/press", updated: "2026-09-02", changeFrequency: "monthly", priority: 0.5 },
  { path: "/partners", updated: "2026-08-27", changeFrequency: "monthly", priority: 0.6, languages: { en: "/partners", fr: "/fr/partenaires" } },
  { path: "/fr/partenaires", updated: "2026-08-27", changeFrequency: "monthly", priority: 0.6, languages: { en: "/partners", fr: "/fr/partenaires" } },
  { path: "/studio-read", updated: "2026-08-20", changeFrequency: "monthly", priority: 0.5, languages: { en: "/studio-read", fr: "/fr/studio-read" } },
  { path: "/fr/studio-read", updated: "2026-08-20", changeFrequency: "monthly", priority: 0.5, languages: { en: "/studio-read", fr: "/fr/studio-read" } },
  { path: "/privacy", updated: "2026-08-01", changeFrequency: "yearly", priority: 0.3, languages: { en: "/privacy", fr: "/fr/confidentialite" } },
  { path: "/fr/confidentialite", updated: "2026-08-01", changeFrequency: "yearly", priority: 0.3, languages: { en: "/privacy", fr: "/fr/confidentialite" } },
  { path: "/terms", updated: "2026-08-01", changeFrequency: "yearly", priority: 0.3, languages: { en: "/terms", fr: "/fr/conditions" } },
  { path: "/fr/conditions", updated: "2026-08-01", changeFrequency: "yearly", priority: 0.3, languages: { en: "/terms", fr: "/fr/conditions" } },
  { path: "/mentions-legales", updated: "2026-08-01", changeFrequency: "yearly", priority: 0.3 },
  { path: "/delete-account", updated: "2026-08-01", changeFrequency: "yearly", priority: 0.2 },
];

function entry(p: Page): MetadataRoute.Sitemap[number] {
  const e: MetadataRoute.Sitemap[number] = {
    url: `${BASE}${p.path}`,
    lastModified: new Date(p.updated),
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  };
  if (p.languages) {
    const languages: Record<string, string> = {};
    if (p.languages.en) languages.en = `${BASE}${p.languages.en}`;
    if (p.languages.fr) languages.fr = `${BASE}${p.languages.fr}`;
    languages["x-default"] = `${BASE}${p.languages.en ?? p.path}`;
    e.alternates = { languages };
  }
  return e;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const blogEntries: MetadataRoute.Sitemap = getAllPosts().map((p) => {
    const fr = p.frontmatter.alternateFr;
    return entry({
      path: `/blog/${p.frontmatter.slug}`,
      updated: p.frontmatter.updated ?? p.frontmatter.date,
      changeFrequency: "monthly",
      priority: 0.7,
      languages: fr ? { en: `/blog/${p.frontmatter.slug}`, fr } : undefined,
    });
  });
  return [...PAGES.map(entry), ...blogEntries];
}
