import { describe, it, expect } from "vitest";
import { extractSignals, evaluate, parseSitemap, publicPageUrl } from "./lib.mjs";

describe("preview canonical validation", () => {
  it("validates production canonicals on a local preview", () => {
    const url = publicPageUrl("http://localhost:3210/", "http://localhost:3210", "https://www.margotwardrobe.com");
    expect(evaluate(extractSignals(page(), url), { status: 200 })).toEqual([]);
  });
  it("preserves the path so a canonical pointing at the wrong page still fails", () => {
    const url = publicPageUrl("http://localhost:3210/fr", "http://localhost:3210", "https://www.margotwardrobe.com");
    expect(evaluate(extractSignals(page(), url), { status: 200 }).some(i => i.rule === "canonical")).toBe(true);
  });
  it("does not mask redirects to another origin", () => {
    expect(publicPageUrl("https://another-site.com/fr", "http://localhost:3210", "https://www.margotwardrobe.com")).toBe("https://another-site.com/fr");
  });
});

const page = (over = "") => `<!doctype html><html lang="en"><head>
<title>Margot — your personal stylist, from your own wardrobe</title>
<meta name="description" content="Photograph your clothes, get a daily outfit from what you already own, and check whether a new piece is worth buying before you spend.">
<link rel="canonical" href="https://www.margotwardrobe.com/">
<link rel="alternate" hreflang="en" href="https://www.margotwardrobe.com/">
<link rel="alternate" hreflang="fr" href="https://www.margotwardrobe.com/fr">
<link rel="alternate" hreflang="x-default" href="https://www.margotwardrobe.com/">
<meta property="og:title" content="Margot"><meta property="og:image" content="https://www.margotwardrobe.com/opengraph-image">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Margot"}</script>
${over}
</head><body><h1>Your personal stylist</h1><p>${"word ".repeat(300)}</p><a href="/fr">FR</a><a href="https://x.com/margot">x</a><img src="a.png" alt="a"></body></html>`;

describe("extractSignals", () => {
  it("counts rendered characters, including Next.js numeric HTML entities", () => {
    const html = page().replace('Margot — your personal stylist, from your own wardrobe', 'Margot&#x27;s wardrobe &#8212; daily outfits');
    expect(extractSignals(html, 'https://www.margotwardrobe.com/').title).toBe("Margot's wardrobe — daily outfits");
  });
  it("reads head signals from server HTML", () => {
    const s = extractSignals(page(), "https://www.margotwardrobe.com/");
    expect(s.title).toMatch(/Margot/);
    expect(s.description?.length).toBeGreaterThan(70);
    expect(s.canonical).toBe("https://www.margotwardrobe.com/");
    expect(s.lang).toBe("en");
    expect(s.hreflang.map((h) => h.lang)).toEqual(["en", "fr", "x-default"]);
    expect(s.h1s).toEqual(["Your personal stylist"]);
    expect(s.jsonld[0]).toEqual({ ok: true, types: ["Organization"] });
    expect(s.internalLinks).toBe(1);
    expect(s.imagesMissingAlt).toBe(0);
    expect(s.wordCount).toBeGreaterThan(250);
  });

  it("flags broken JSON-LD instead of throwing", () => {
    const s = extractSignals(page(`<script type="application/ld+json">{not json</script>`), "https://www.margotwardrobe.com/");
    expect(s.jsonld.some((j) => !j.ok)).toBe(true);
  });
});

describe("evaluate", () => {
  it("passes a healthy page", () => {
    const s = extractSignals(page(), "https://www.margotwardrobe.com/");
    expect(evaluate(s, { status: 200 })).toEqual([]);
  });

  it("catches lang mismatch on FR paths and missing description", () => {
    const html = page().replace('lang="en"', 'lang="en"').replace(/<meta name="description"[^>]*>/, "");
    const s = extractSignals(html, "https://www.margotwardrobe.com/fr");
    const rules = evaluate(s, { status: 200 }).map((i) => `${i.rule}:${i.level}`);
    expect(rules).toContain("lang:error");
    expect(rules).toContain("description:error");
    expect(rules).toContain("canonical:warn");
  });

  it("only checks status for non-indexable pages", () => {
    const s = extractSignals("<html><body>x</body></html>", "https://www.margotwardrobe.com/privacy");
    expect(evaluate(s, { status: 200, expectIndexable: false })).toEqual([]);
    expect(evaluate(s, { status: 500, expectIndexable: false })[0].rule).toBe("status");
  });
});

describe("parseSitemap", () => {
  it("extracts locs", () => {
    expect(parseSitemap("<urlset><url><loc>https://a/</loc></url><url><loc> https://a/b </loc></url></urlset>")).toEqual(["https://a/", "https://a/b"]);
  });
});
