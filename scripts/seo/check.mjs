#!/usr/bin/env node
/**
 * Weekly technical SEO monitor for www.margotwardrobe.com.
 *
 *   node scripts/seo/check.mjs                 # crawl sitemap + extra routes, print report
 *   node scripts/seo/check.mjs --psi           # also run PageSpeed Insights (mobile) on key pages
 *   node scripts/seo/check.mjs --json out.json # write machine-readable snapshot
 *   node scripts/seo/check.mjs --base https://preview-url.vercel.app
 *
 * Exit code 1 when any "error"-level issue is found, so it can gate CI.
 * No dependencies: Node 20+ fetch only. Reads server HTML (what crawlers see).
 */
import { writeFileSync } from "node:fs";
import { extractSignals, evaluate, parseSitemap } from "./lib.mjs";

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const opt = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
const BASE = opt("--base", "https://www.margotwardrobe.com").replace(/\/$/, "");
const UA = "Mozilla/5.0 (compatible; MargotSEOCheck/1.0; +https://www.margotwardrobe.com)";

// Routes that are public but intentionally kept out of the sitemap, or that
// must NOT be indexable. `indexable:false` only checks status + noindex.
const EXTRA = [
  { path: "/premium", indexable: false }, // deep-link landing, noindex by design
  { path: "/download", indexable: false }, // idem
  { path: "/fr/garde-robe-digitale", indexable: true },
  { path: "/fr/vs/whering", indexable: true },
  { path: "/fr/quoi-porter-aujourdhui", indexable: true },
  { path: "/this-page-does-not-exist-404", expectStatus: 404 },
];
const PSI_PAGES = ["/", "/fr", "/blog", "/vs/whering"];

async function get(url) {
  const t0 = performance.now();
  const res = await fetch(url, { headers: { "user-agent": UA, accept: "text/html" }, redirect: "follow" });
  const html = await res.text();
  return { status: res.status, finalUrl: res.url, html, ttfbMs: Math.round(performance.now() - t0) };
}

async function psi(url) {
  const api = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  api.searchParams.set("url", url);
  api.searchParams.set("strategy", "mobile");
  for (const c of ["PERFORMANCE", "SEO"]) api.searchParams.append("category", c);
  if (process.env.PSI_API_KEY) api.searchParams.set("key", process.env.PSI_API_KEY);
  const res = await fetch(api);
  if (!res.ok) return { error: `PSI ${res.status}` };
  const j = await res.json();
  const a = j.lighthouseResult?.audits ?? {};
  const ms = (k) => a[k]?.numericValue != null ? Math.round(a[k].numericValue) : null;
  const field = j.loadingExperience?.metrics ?? {};
  return {
    performance: Math.round((j.lighthouseResult?.categories?.performance?.score ?? 0) * 100),
    seo: Math.round((j.lighthouseResult?.categories?.seo?.score ?? 0) * 100),
    lcpMs: ms("largest-contentful-paint"),
    cls: a["cumulative-layout-shift"]?.numericValue ?? null,
    tbtMs: ms("total-blocking-time"),
    ttfbMs: ms("server-response-time"),
    fieldLcpMs: field.LARGEST_CONTENTFUL_PAINT_MS?.percentile ?? null,
    fieldInpMs: field.INTERACTION_TO_NEXT_PAINT?.percentile ?? null,
    fieldCls: field.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile ?? null,
  };
}

const main = async () => {
  const smRes = await fetch(`${BASE}/sitemap.xml`, { headers: { "user-agent": UA } });
  // The sitemap always emits production URLs; when checking a preview or a
  // local build, rewrite them onto --base so we crawl what we built.
  const PROD = "https://www.margotwardrobe.com";
  const sitemapUrls = (smRes.ok ? parseSitemap(await smRes.text()) : []).map((u) =>
    BASE !== PROD && u.startsWith(PROD) ? BASE + u.slice(PROD.length) : u,
  );
  const robots = await fetch(`${BASE}/robots.txt`, { headers: { "user-agent": UA } }).then((r) => (r.ok ? r.text() : ""));
  const llms = await fetch(`${BASE}/llms.txt`, { headers: { "user-agent": UA } }).then((r) => r.status);

  // Sitemap URLs first; EXTRA entries override flags for URLs already listed
  // (e.g. legal pages) and add the rest, so no URL is crawled twice.
  const targets = sitemapUrls.map((u) => ({ url: u, indexable: true, inSitemap: true }));
  for (const e of EXTRA) {
    const url = `${BASE}${e.path}`;
    const existing = targets.find((t) => t.url.replace(/\/$/, "") === url);
    if (existing) Object.assign(existing, e);
    else targets.push({ url, ...e, inSitemap: false });
  }

  const pages = [];
  for (const t of targets) {
    try {
      const r = await get(t.url);
      const sig = extractSignals(r.html, t.url);
      let issues;
      if (t.expectStatus) {
        issues = r.status === t.expectStatus ? [] : [{ rule: "status", level: "error", detail: `expected ${t.expectStatus}, got ${r.status}` }];
      } else {
        issues = evaluate(sig, { status: r.status, finalUrl: r.finalUrl, expectIndexable: t.indexable !== false });
        if (t.indexable === false && !(sig.robots && /noindex/i.test(sig.robots)))
          issues.push({ rule: "robots", level: "warn", detail: "expected noindex" });
      }
      pages.push({ ...t, status: r.status, ttfbMs: r.ttfbMs, signals: sig, issues });
    } catch (e) {
      pages.push({ ...t, status: 0, issues: [{ rule: "fetch", level: "error", detail: String(e.message) }] });
    }
  }

  // Cross-page checks: duplicate titles/descriptions, hreflang reciprocity, sitemap ⊆ indexable.
  const global = [];
  const byTitle = new Map();
  for (const p of pages) {
    const t = p.signals?.title;
    if (t) byTitle.set(t, [...(byTitle.get(t) ?? []), p.url]);
  }
  for (const [t, urls] of byTitle) if (urls.length > 1) global.push({ rule: "duplicate-title", level: "warn", detail: `"${t}" on ${urls.join(", ")}` });
  const hrefIndex = new Map(pages.map((p) => [p.url.replace(/\/$/, ""), p]));
  for (const p of pages) {
    for (const h of p.signals?.hreflang ?? []) {
      const other = hrefIndex.get(h.href.replace(/\/$/, ""));
      if (other && !(other.signals?.hreflang ?? []).some((x) => x.href.replace(/\/$/, "") === p.url.replace(/\/$/, "")))
        global.push({ rule: "hreflang-reciprocity", level: "warn", detail: `${p.url} → ${h.href} not reciprocated` });
    }
  }
  const aiBots = ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"];
  for (const b of aiBots) {
    const block = new RegExp(`User-agent:\\s*${b}[\\s\\S]*?Disallow:\\s*/\\s*$`, "im");
    if (block.test(robots)) global.push({ rule: "ai-bot-blocked", level: "error", detail: b });
  }
  if (llms !== 200) global.push({ rule: "llms.txt", level: "warn", detail: `HTTP ${llms}` });

  const psiResults = {};
  if (flag("--psi")) {
    for (const path of PSI_PAGES) {
      psiResults[path] = await psi(`${BASE}${path}`);
      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  // ---- Report -------------------------------------------------------------
  const errors = pages.flatMap((p) => p.issues.filter((i) => i.level === "error")).length + global.filter((g) => g.level === "error").length;
  const warns = pages.flatMap((p) => p.issues.filter((i) => i.level === "warn")).length + global.filter((g) => g.level === "warn").length;
  const lines = [];
  lines.push(`# SEO check — ${BASE} — ${new Date().toISOString().slice(0, 10)}`);
  lines.push(`Pages: ${pages.length} (sitemap ${sitemapUrls.length}) · errors: ${errors} · warnings: ${warns}`);
  lines.push("");
  lines.push("| URL | HTTP | TTFB | title | desc | h1 | JSON-LD | words | issues |");
  lines.push("|---|---|---|---|---|---|---|---|---|");
  for (const p of pages) {
    const s = p.signals ?? {};
    const path = p.url.replace(BASE, "") || "/";
    const types = (s.jsonld ?? []).flatMap((j) => j.types).join(",") || "—";
    const iss = p.issues.map((i) => `${i.level === "error" ? "❌" : "⚠️"} ${i.rule}: ${i.detail}`).join("<br>") || "✅";
    lines.push(`| ${path} | ${p.status} | ${p.ttfbMs ?? "—"}ms | ${s.title?.length ?? "—"} | ${s.description?.length ?? "—"} | ${s.h1s?.length ?? "—"} | ${types} | ${s.wordCount ?? "—"} | ${iss} |`);
  }
  if (global.length) {
    lines.push("", "## Cross-page");
    for (const g of global) lines.push(`- ${g.level === "error" ? "❌" : "⚠️"} ${g.rule}: ${g.detail}`);
  }
  if (flag("--psi")) {
    lines.push("", "## PageSpeed Insights (mobile)", "", "| page | perf | seo | LCP lab | TBT | TTFB | LCP field | INP field | CLS field |", "|---|---|---|---|---|---|---|---|---|");
    for (const [path, r] of Object.entries(psiResults)) {
      if (r.error) lines.push(`| ${path} | ${r.error} |`);
      else lines.push(`| ${path} | ${r.performance} | ${r.seo} | ${r.lcpMs}ms | ${r.tbtMs}ms | ${r.ttfbMs}ms | ${r.fieldLcpMs ?? "n/a"} | ${r.fieldInpMs ?? "n/a"} | ${r.fieldCls ?? "n/a"} |`);
    }
  }
  const report = lines.join("\n");
  console.log(report);

  const jsonPath = opt("--json", null);
  if (jsonPath) {
    writeFileSync(jsonPath, JSON.stringify({ date: new Date().toISOString(), base: BASE, errors, warns, pages, global, psi: psiResults }, null, 2));
    console.error(`\nsnapshot → ${jsonPath}`);
  }
  process.exit(errors > 0 ? 1 : 0);
};

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
