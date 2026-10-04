import Link from "next/link";
import { safeJson } from "@/lib/jsonld";
import { authorJsonLd, PUBLISHER_JSON_LD } from "@/lib/author";
import { Byline } from "@/components/Byline";
import { StoreLinks } from "@/components/StoreLinks";
import { RelatedLinks, type RelatedLink } from "@/components/RelatedLinks";
import type { AltEntry, FaqItem, Lang, Point, Source } from "@/lib/compare/types";
import { Section, H3, P, Ul, Li, Strong, Table } from "./prose";

const SITE_URL = "https://www.margotwardrobe.com";

export type AlternativesCopy = {
  path: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  lede: string;
  bottomLine: string;
  criteriaTitle: string;
  criteria: Point[];
  tableTitle: string;
  tableHead: [string, string, string, string, string];
  appsTitle: string;
  labels: { bestFor: string; platforms: string; french: string; price: string; compare: string; site: string };
  byNeedTitle: string;
  byNeed: Point[];
  faqTitle: string;
  faq: FaqItem[];
  sourcesTitle: string;
  sourcesIntro: string;
  relatedTitle: string;
  cta: string;
};

export function AlternativesArticle({
  lang,
  copy: t,
  apps,
  published,
  checked,
  sources,
  related,
}: {
  lang: Lang;
  copy: AlternativesCopy;
  apps: AltEntry[];
  published: string;
  checked: string;
  sources: Source[];
  related: RelatedLink[];
}) {
  const url = `${SITE_URL}${t.path}`;
  const inLanguage = lang === "fr" ? "fr-FR" : "en";

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: t.h1,
    description: t.metaDescription,
    url,
    mainEntityOfPage: url,
    inLanguage,
    datePublished: published,
    dateModified: checked,
    author: authorJsonLd(),
    publisher: PUBLISHER_JSON_LD,
    image: [`${SITE_URL}/opengraph-image`],
  };
  // The apps compared, in page order, so assistants can lift the list as is.
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t.h1,
    itemListOrder: "https://schema.org/ItemListUnordered",
    numberOfItems: apps.length,
    itemListElement: apps.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: { "@type": "SoftwareApplication", name: a.name, url: a.url, applicationCategory: "LifestyleApplication", operatingSystem: a.platforms },
    })),
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Margot", item: lang === "fr" ? `${SITE_URL}/fr` : `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: t.eyebrow, item: url },
    ],
  };
  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage,
    mainEntity: t.faq.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };

  return (
    <main className="bg-bg text-ink min-h-screen px-6 py-[clamp(48px,7vw,96px)]">
      <article className="max-w-[760px] mx-auto">
        <header className="mb-10">
          <div className="font-sans text-[11px] font-semibold tracking-wider2 uppercase text-peach mb-4">{t.eyebrow}</div>
          <h1 className="font-display font-normal text-ink opsz-144 m-0 text-[clamp(34px,4.6vw,56px)] leading-[1.05] tracking-tight2 [text-wrap:balance]">{t.h1}</h1>
          <p className="mt-6 font-sans text-[17px] leading-[1.6] text-ink2 tracking-tight7 max-w-[640px] [text-wrap:pretty]">{t.lede}</p>
          <Byline lang={lang} published={published} updated={checked} updatedLabel="checked" />
        </header>

        <div className="rounded-3xl border border-warm2 bg-surface px-[clamp(20px,3vw,32px)] py-[clamp(20px,3vw,28px)]">
          <p className="font-sans text-[16px] leading-[1.65] text-ink2 tracking-tight7 m-0 [text-wrap:pretty]">{t.bottomLine}</p>
        </div>

        <Section title={t.criteriaTitle}>
          <Ul>
            {t.criteria.map((c) => (
              <Li key={c.title}>
                <Strong>{c.title}</Strong> {c.body}
              </Li>
            ))}
          </Ul>
        </Section>

        <Section title={t.tableTitle}>
          <Table head={t.tableHead} rows={apps.map((a) => [a.name, a.bestFor, a.platforms, a.french, a.price])} />
        </Section>

        <Section title={t.appsTitle}>
          {apps.map((a) => (
            <div key={a.slug} className="mb-8">
              <H3 id={a.slug}>{a.name}</H3>
              <P>{a.summary}</P>
              <p className="font-sans text-[14px] leading-[1.6] text-ink3 m-0">
                <Strong>{t.labels.bestFor}</Strong> {a.bestFor}{" "}
                <span aria-hidden="true">·</span> <Strong>{t.labels.price}</Strong> {a.price}
              </p>
              <p className="font-sans text-[14px] mt-2 mb-0">
                {a.slug === "margot" ? null : a.vsPath ? (
                  <Link href={a.vsPath} className="text-ink underline decoration-peach underline-offset-4">
                    {t.labels.compare.replace("{name}", a.name)}
                  </Link>
                ) : (
                  <a href={a.url} target="_blank" rel="noopener noreferrer" className="text-ink3 underline decoration-peach/60 underline-offset-4">
                    {t.labels.site.replace("{name}", a.name)}
                  </a>
                )}
              </p>
            </div>
          ))}
        </Section>

        <Section title={t.byNeedTitle}>
          <Ul>
            {t.byNeed.map((n) => (
              <Li key={n.title}>
                <Strong>{n.title}</Strong> {n.body}
              </Li>
            ))}
          </Ul>
        </Section>

        <Section title={t.faqTitle}>
          <dl className="space-y-6">
            {t.faq.map(({ q, a }) => (
              <div key={q}>
                <dt className="font-sans text-[16px] font-semibold text-ink tracking-tight7 [text-wrap:pretty]">{q}</dt>
                <dd className="mt-2 ml-0 font-sans text-[16px] leading-[1.65] text-ink2 tracking-tight7 [text-wrap:pretty] max-w-[640px]">{a}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section title={t.sourcesTitle}>
          <P className="text-[14px]">{t.sourcesIntro}</P>
          <ul className="font-sans text-[14px] leading-[1.6] text-ink3 list-disc ml-6 space-y-1">
            {sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-ink3 underline decoration-peach/60 underline-offset-4 hover:text-ink">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </Section>

        <RelatedLinks title={t.relatedTitle} links={related} />

        <aside className="mt-16 rounded-3xl border border-warm2 bg-surface px-[clamp(24px,4vw,40px)] py-[clamp(28px,4vw,40px)] flex flex-col items-center text-center gap-5">
          <p className="font-display italic text-ink opsz-96 text-[clamp(18px,2vw,22px)] leading-[1.4] tracking-tight5 max-w-[460px] m-0 [text-wrap:pretty]">{t.cta}</p>
          <StoreLinks lang={lang} placement="alternatives" />
        </aside>
      </article>

      <script type="application/ld+json" suppressHydrationWarning>{safeJson(article)}</script>
      <script type="application/ld+json" suppressHydrationWarning>{safeJson(itemList)}</script>
      <script type="application/ld+json" suppressHydrationWarning>{safeJson(breadcrumb)}</script>
      <script type="application/ld+json" suppressHydrationWarning>{safeJson(faqPage)}</script>
    </main>
  );
}
