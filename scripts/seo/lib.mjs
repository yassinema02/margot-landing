/**
 * Pure HTML → SEO signal extraction. No network, no DOM: regex-based on
 * server-rendered HTML so it works on any Node 20+ without dependencies.
 * Used by scripts/seo/check.mjs (weekly monitor) and covered by lib.test.mjs.
 */

const decode = (s = "") =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Math.min(parseInt(hex, 16), 0x10ffff)))
    .replace(/&#(\d+);/g, (_, decimal) => String.fromCodePoint(Math.min(Number(decimal), 0x10ffff)))
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function attr(tag, name) {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return m ? decode(m[2] ?? m[3] ?? m[4] ?? "") : null;
}

function tags(html, name) {
  return html.match(new RegExp(`<${name}\\b[^>]*>`, "gi")) ?? [];
}

function metaContent(html, key, value) {
  for (const t of tags(html, "meta")) {
    const k = attr(t, key);
    if (k && k.toLowerCase() === value.toLowerCase()) return attr(t, "content");
  }
  return null;
}

export function extractSignals(html, url) {
  const head = html.slice(0, Math.max(html.indexOf("</head>"), 0) || html.length);
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) =>
    decode(m[1].replace(/<[^>]+>/g, "")),
  );
  // Next 15 may stream metadata into <body> for non-bot user agents; we
  // read the whole document but remember whether it sat inside <head>.
  const links = tags(html, "link");
  const headLinks = tags(head, "link");
  const canonical = links.map((t) => (attr(t, "rel") === "canonical" ? attr(t, "href") : null)).find(Boolean) ?? null;
  const canonicalInHead = headLinks.some((t) => attr(t, "rel") === "canonical");
  const hreflang = links
    .filter((t) => (attr(t, "rel") || "").toLowerCase() === "alternate" && attr(t, "hreflang"))
    .map((t) => ({ lang: attr(t, "hreflang"), href: attr(t, "href") }));
  const htmlTag = tags(html, "html")[0] ?? "";
  const jsonld = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((m) => {
    try {
      const data = JSON.parse(m[1]);
      const items = Array.isArray(data) ? data : data["@graph"] ? data["@graph"] : [data];
      return { ok: true, types: items.map((i) => i && i["@type"]).flat().filter(Boolean) };
    } catch (e) {
      return { ok: false, types: [], error: String(e.message) };
    }
  });
  const body = html.slice(html.search(/<body\b/i));
  const text = decode(
    body
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  );
  const imgs = tags(body, "img");
  const origin = (() => {
    try {
      return new URL(url).origin;
    } catch {
      return "";
    }
  })();
  const anchors = tags(body, "a").map((t) => attr(t, "href")).filter(Boolean);
  const internal = anchors.filter((h) => h.startsWith("/") || (origin && h.startsWith(origin)));

  return {
    url,
    title: titleMatch ? decode(titleMatch[1]) : null,
    description: metaContent(html, "name", "description"),
    robots: metaContent(html, "name", "robots"),
    canonical,
    canonicalInHead,
    lang: attr(htmlTag, "lang"),
    hreflang,
    h1s,
    ogTitle: metaContent(html, "property", "og:title"),
    ogImage: metaContent(html, "property", "og:image"),
    jsonld,
    wordCount: text ? text.split(" ").length : 0,
    imagesMissingAlt: imgs.filter((t) => attr(t, "alt") === null).length,
    internalLinks: internal.length,
  };
}

/** Rules a public marketing page must satisfy. Returns a list of {rule, level, detail}. */
export function publicPageUrl(url, crawlBase, publicBase) {
  const page = new URL(url);
  const crawl = new URL(crawlBase);
  return page.origin === crawl.origin
    ? new URL(`${page.pathname}${page.search}${page.hash}`, publicBase).href
    : page.href;
}

export function evaluate(sig, { status, finalUrl, expectIndexable = true } = {}) {
  const issues = [];
  const push = (rule, level, detail) => issues.push({ rule, level, detail });
  const path = (() => {
    try {
      return new URL(sig.url).pathname;
    } catch {
      return "";
    }
  })();
  const isFr = path === "/fr" || path.startsWith("/fr/") || path === "/mentions-legales";

  if (status !== 200) push("status", "error", `HTTP ${status}`);
  if (finalUrl && finalUrl !== sig.url) push("redirect", "warn", `→ ${finalUrl}`);
  if (!expectIndexable) return issues;

  if (!sig.title) push("title", "error", "missing");
  else if (sig.title.length < 25 || sig.title.length > 65) push("title", "warn", `${sig.title.length} chars`);
  if (!sig.description) push("description", "error", "missing");
  else if (sig.description.length < 70 || sig.description.length > 165)
    push("description", "warn", `${sig.description.length} chars`);
  if (sig.h1s.length !== 1) push("h1", sig.h1s.length === 0 ? "error" : "warn", `${sig.h1s.length} h1`);
  if (!sig.canonical) push("canonical", "error", "missing");
  else if (sig.canonical.replace(/\/$/, "") !== sig.url.replace(/\/$/, "")) push("canonical", "warn", sig.canonical);
  else if (!sig.canonicalInHead) push("canonical", "warn", "streamed into <body> (page is dynamic)");
  if (sig.robots && /noindex/i.test(sig.robots)) push("robots", "error", sig.robots);
  if (!sig.lang) push("lang", "error", "missing");
  else if (isFr && !sig.lang.toLowerCase().startsWith("fr")) push("lang", "error", `${sig.lang} on FR path`);
  else if (!isFr && sig.lang.toLowerCase().startsWith("fr")) push("lang", "warn", `${sig.lang} on non-FR path`);
  if (sig.hreflang.length) {
    const self = sig.hreflang.some((h) => h.href.replace(/\/$/, "") === sig.url.replace(/\/$/, ""));
    if (!self) push("hreflang", "warn", "no self-referencing entry");
    if (!sig.hreflang.some((h) => h.lang === "x-default")) push("hreflang", "warn", "no x-default");
  }
  for (const j of sig.jsonld) if (!j.ok) push("jsonld", "error", j.error);
  if (sig.jsonld.length === 0) push("jsonld", "warn", "no structured data");
  if (sig.wordCount < 250) push("thin", "warn", `${sig.wordCount} words`);
  if (sig.imagesMissingAlt > 0) push("alt", "warn", `${sig.imagesMissingAlt} img without alt`);
  if (!sig.ogImage) push("og", "warn", "no og:image");
  return issues;
}

export function parseSitemap(xml) {
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => decode(m[1]));
}
