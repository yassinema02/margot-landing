import type { MetadataRoute } from "next";

const BASE = "https://www.margotwardrobe.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    // TODO: add /fr, /how-it-works, /pricing, /faq once those routes ship
  ];
}
