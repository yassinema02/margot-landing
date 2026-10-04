import type { RelatedLink } from "@/components/RelatedLinks";
import { COMPETITORS } from "@/lib/compare/competitors";

// One registry of the editorial pages, so every guide, article and comparison
// links to its closest neighbours with a descriptive title. Add a page here
// once and it can appear in any "Keep reading" block.

const EN: Record<string, RelatedLink> = {
  "/blog/what-to-wear-today": {
    href: "/blog/what-to-wear-today",
    title: "What to wear today, finally answered",
    blurb: "Why the morning decision is tiring, and how a daily outfit takes it off your plate.",
  },
  "/blog/ai-outfit-planner-does-it-work": {
    href: "/blog/ai-outfit-planner-does-it-work",
    title: "Does an outfit planner app actually work?",
    blurb: "What these apps do well, what they do badly, and what to expect from one.",
  },
  "/blog/how-to-sell-on-vinted": {
    href: "/blog/how-to-sell-on-vinted",
    title: "How to sell on Vinted, properly",
    blurb: "Titles, prices, photos and descriptions that help a listing sell.",
  },
  "/alternatives": {
    href: "/alternatives",
    title: "Wardrobe apps compared",
    blurb: "Margot, Whering, Acloset, Alta Daily, Fits and Stylebook side by side.",
  },
};

const FR: Record<string, RelatedLink> = {
  "/fr/garde-robe-digitale": {
    href: "/fr/garde-robe-digitale",
    title: "Garde-robe digitale : le guide complet",
    blurb: "Créer ton dressing virtuel en 45 minutes, puis le faire vivre au quotidien.",
  },
  "/fr/quoi-porter-aujourdhui": {
    href: "/fr/quoi-porter-aujourdhui",
    title: "Quoi porter aujourd'hui ?",
    blurb: "La méthode en trois questions, et la tenue du jour préparée par Margot.",
  },
  "/fr/alternatives": {
    href: "/fr/alternatives",
    title: "Alternatives à Whering : le comparatif",
    blurb: "Six applications de dressing comparées, prix en euros et sources officielles.",
  },
};

for (const c of COMPETITORS) {
  EN[`/vs/${c.slug}`] = {
    href: `/vs/${c.slug}`,
    title: `Margot vs ${c.name}`,
    blurb: c.copy.en.bottomLine.charAt(0).toUpperCase() + c.copy.en.bottomLine.slice(1),
  };
  FR[`/fr/vs/${c.slug}`] = {
    href: `/fr/vs/${c.slug}`,
    title: `${c.name} ou Margot ?`,
    blurb: c.copy.fr.bottomLine.charAt(0).toUpperCase() + c.copy.fr.bottomLine.slice(1),
  };
}

function pick(registry: Record<string, RelatedLink>, paths: string[]) {
  return paths.map((p) => registry[p]).filter((l): l is RelatedLink => Boolean(l));
}

/** Two other comparisons (the next ones in the list), the hub and the main guide. */
export function relatedForComparison(slug: string, lang: "en" | "fr"): RelatedLink[] {
  const i = COMPETITORS.findIndex((c) => c.slug === slug);
  const others = [1, 2].map((k) => COMPETITORS[(i + k) % COMPETITORS.length].slug);
  return lang === "fr"
    ? pick(FR, ["/fr/alternatives", ...others.map((s) => `/fr/vs/${s}`), "/fr/garde-robe-digitale"])
    : pick(EN, ["/alternatives", ...others.map((s) => `/vs/${s}`), "/blog/what-to-wear-today"]);
}

export function relatedForAlternatives(lang: "en" | "fr"): RelatedLink[] {
  return lang === "fr"
    ? pick(FR, ["/fr/garde-robe-digitale", "/fr/quoi-porter-aujourdhui"])
    : pick(EN, ["/blog/what-to-wear-today", "/blog/ai-outfit-planner-does-it-work"]);
}

/** For a blog post (EN): the other posts and the comparisons hub. */
export function relatedForPost(slug: string): RelatedLink[] {
  const self = `/blog/${slug}`;
  return pick(
    EN,
    ["/blog/what-to-wear-today", "/blog/ai-outfit-planner-does-it-work", "/blog/how-to-sell-on-vinted", "/alternatives"].filter((p) => p !== self),
  );
}

/** For the French guides: the other guide, the hub and the Whering comparison. */
export function relatedForFrGuide(path: string): RelatedLink[] {
  return pick(
    FR,
    ["/fr/garde-robe-digitale", "/fr/quoi-porter-aujourdhui", "/fr/alternatives", "/fr/vs/whering"].filter((p) => p !== path),
  );
}

/** Blog index: the comparisons hub and every head-to-head page. */
export function relatedForBlogIndex(): RelatedLink[] {
  return pick(EN, ["/alternatives", ...COMPETITORS.map((c) => `/vs/${c.slug}`)]);
}
