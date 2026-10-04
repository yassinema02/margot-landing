import Link from "next/link";
import { safeJson } from "@/lib/jsonld";
import { authorJsonLd, PUBLISHER_JSON_LD } from "@/lib/author";
import { Byline } from "@/components/Byline";
import { StoreLinks } from "@/components/StoreLinks";
import { RelatedLinks, type RelatedLink } from "@/components/RelatedLinks";
import {
  MARGOT_PRICE_NOTE,
  MARGOT_PRICES,
  MARGOT_ROWS,
  MARGOT_SCHEMA,
  PRICE_KEYS,
  PRICE_LABELS,
  ROW_KEYS,
  ROW_LABELS,
  margotSources,
} from "@/lib/compare/margot";
import type { Competitor, Lang } from "@/lib/compare/types";
import { Section, P, Ul, Li, Strong, Table } from "./prose";

const SITE_URL = "https://www.margotwardrobe.com";

export function comparisonPath(slug: string, lang: Lang) {
  return lang === "fr" ? `/fr/vs/${slug}` : `/vs/${slug}`;
}

// Section titles are the questions people type, so each block answers one.
function headings(name: string, lang: Lang) {
  return lang === "fr"
    ? {
        eyebrow: "Comparatif",
        inShort: "En bref",
        bottomLine: "Le verdict :",
        features: `Quelles différences entre Margot et ${name} ?`,
        feature: "Fonction",
        prices: `Combien coûtent Margot et ${name} ?`,
        plan: "Formule",
        theyDoWell: `Qu'est-ce que ${name} fait bien ?`,
        margotDifferent: "Qu'est-ce que Margot fait autrement ?",
        whoFor: `Pour qui ${name}, pour qui Margot ?`,
        chooseThem: `Choisis ${name} si`,
        chooseMargot: "Choisis Margot si",
        switching: `Peut-on passer de ${name} à Margot ?`,
        faq: `Questions fréquentes sur ${name} et Margot`,
        sources: "Sources",
        sourcesIntro: "Faits vérifiés sur les pages officielles suivantes :",
        related: "À lire aussi",
        cta: "Margot est gratuite sur iPhone et Android.",
        hub: "Comparatifs",
      }
    : {
        eyebrow: "Comparison",
        inShort: "In short",
        bottomLine: "Bottom line:",
        features: `What is the difference between Margot and ${name}?`,
        feature: "Feature",
        prices: `How much do Margot and ${name} cost?`,
        plan: "Plan",
        theyDoWell: `What does ${name} do well?`,
        margotDifferent: "What does Margot do differently?",
        whoFor: `Who should choose ${name}, and who should choose Margot?`,
        chooseThem: `Choose ${name} if`,
        chooseMargot: "Choose Margot if",
        switching: `Can you switch from ${name} to Margot?`,
        faq: `Questions people ask about ${name} and Margot`,
        sources: "Sources",
        sourcesIntro: "Facts checked on these official pages:",
        related: "Keep reading",
        cta: "Margot is free on iPhone and Android.",
        hub: "Comparisons",
      };
}

export function ComparisonArticle({
  competitor: c,
  lang,
  related,
}: {
  competitor: Competitor;
  lang: Lang;
  related: RelatedLink[];
}) {
  const t = c.copy[lang];
  const h = headings(c.name, lang);
  const path = comparisonPath(c.slug, lang);
  const url = `${SITE_URL}${path}`;
  const home = lang === "fr" ? `${SITE_URL}/fr` : `${SITE_URL}/`;
  const hub = `${SITE_URL}${lang === "fr" ? "/fr/alternatives" : "/alternatives"}`;

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: t.metaTitle,
    description: t.metaDescription,
    url,
    inLanguage: lang === "fr" ? "fr-FR" : "en",
    datePublished: c.published,
    dateModified: c.checked,
    author: authorJsonLd(),
    publisher: PUBLISHER_JSON_LD,
    isPartOf: { "@type": "WebSite", name: "Margot", url: `${SITE_URL}/` },
    primaryImageOfPage: { "@type": "ImageObject", url: `${SITE_URL}/opengraph-image` },
    about: [
      MARGOT_SCHEMA,
      { "@type": "SoftwareApplication", name: c.name, url: c.url, applicationCategory: "LifestyleApplication", operatingSystem: c.operatingSystem },
    ],
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Margot", item: home },
      { "@type": "ListItem", position: 2, name: h.hub, item: hub },
      { "@type": "ListItem", position: 3, name: t.h1.replace(/[?.]$/, ""), item: url },
    ],
  };
  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: lang === "fr" ? "fr-FR" : "en",
    mainEntity: t.faq.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };

  return (
    <main className="bg-bg text-ink min-h-screen px-6 py-[clamp(48px,7vw,96px)]">
      <article className="max-w-[760px] mx-auto">
        <header className="mb-10">
          <div className="font-sans text-[11px] font-semibold tracking-wider2 uppercase text-peach mb-4">{h.eyebrow}</div>
          <h1 className="font-display font-normal text-ink opsz-144 m-0 text-[clamp(36px,5vw,60px)] leading-[1.05] tracking-tight2 [text-wrap:balance]">
            {t.h1}
          </h1>
          <p className="mt-6 font-sans text-[17px] leading-[1.6] text-ink2 tracking-tight7 max-w-[640px] [text-wrap:pretty]">{t.lede}</p>
          <Byline lang={lang} published={c.published} updated={c.checked} updatedLabel="checked" />
        </header>

        <div className="rounded-3xl border border-warm2 bg-surface px-[clamp(20px,3vw,32px)] py-[clamp(20px,3vw,28px)]">
          <div className="font-sans text-[11px] font-semibold tracking-wider2 uppercase text-peach mb-3">{h.inShort}</div>
          <p className="font-sans text-[16px] leading-[1.65] text-ink2 tracking-tight7 m-0 [text-wrap:pretty]">
            <Strong>{h.bottomLine}</Strong> {t.bottomLine}
          </p>
        </div>

        <Section title={h.features}>
          <Table
            head={[h.feature, "Margot", c.name]}
            rows={ROW_KEYS.flatMap((k) => {
              const them = t.rows[k];
              return them ? [[ROW_LABELS[k][lang], MARGOT_ROWS[k][lang], them]] : [];
            })}
          />
        </Section>

        <Section title={h.prices}>
          <Table
            head={[h.plan, "Margot", c.name]}
            rows={PRICE_KEYS.map((k) => [PRICE_LABELS[k][lang], MARGOT_PRICES[k][lang], t.prices[k]])}
          />
          <P className="text-[14px] text-ink3">
            {t.priceNote} {MARGOT_PRICE_NOTE[lang]}
          </P>
        </Section>

        <Section title={h.theyDoWell}>
          <Ul>
            {t.theyDoWell.map((pt) => (
              <Li key={pt.title}>
                <Strong>{pt.title}</Strong> {pt.body}
              </Li>
            ))}
          </Ul>
        </Section>

        <Section title={h.margotDifferent}>
          <Ul>
            {t.margotDifferent.map((pt) => (
              <Li key={pt.title}>
                <Strong>{pt.title}</Strong> {pt.body}
              </Li>
            ))}
          </Ul>
        </Section>

        <Section title={h.whoFor}>
          <P>
            <Strong>{h.chooseThem}</Strong> {t.chooseThem}
          </P>
          <P>
            <Strong>{h.chooseMargot}</Strong> {t.chooseMargot}
          </P>
        </Section>

        <Section title={h.switching}>
          <P>{t.switching}</P>
        </Section>

        <Section title={h.faq}>
          <dl className="space-y-6">
            {t.faq.map(({ q, a }) => (
              <div key={q}>
                <dt className="font-sans text-[16px] font-semibold text-ink tracking-tight7 [text-wrap:pretty]">{q}</dt>
                <dd className="mt-2 ml-0 font-sans text-[16px] leading-[1.65] text-ink2 tracking-tight7 [text-wrap:pretty] max-w-[640px]">{a}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section title={h.sources}>
          <P className="text-[14px]">{h.sourcesIntro}</P>
          <ul className="font-sans text-[14px] leading-[1.6] text-ink3 list-disc ml-6 space-y-1">
            {[...c.sources, ...margotSources(lang)].map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-ink3 underline decoration-peach/60 underline-offset-4 hover:text-ink">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </Section>

        <RelatedLinks title={h.related} links={related} />

        <aside className="mt-16 rounded-3xl border border-warm2 bg-surface px-[clamp(24px,4vw,40px)] py-[clamp(28px,4vw,40px)] flex flex-col items-center text-center gap-5">
          <p className="font-display italic text-ink opsz-96 text-[clamp(18px,2vw,22px)] leading-[1.4] tracking-tight5 max-w-[460px] m-0 [text-wrap:pretty]">{h.cta}</p>
          <StoreLinks lang={lang} placement={`vs-${c.slug}`} />
        </aside>

        <p className="mt-10 font-sans text-[14px] text-ink3">
          <Link href={lang === "fr" ? "/fr/alternatives" : "/alternatives"} className="text-ink underline decoration-peach underline-offset-4">
            {lang === "fr" ? "Toutes les applications de dressing comparées" : "Every wardrobe app we compared"}
          </Link>
        </p>
      </article>

      <script type="application/ld+json" suppressHydrationWarning>{safeJson(webPage)}</script>
      <script type="application/ld+json" suppressHydrationWarning>{safeJson(breadcrumb)}</script>
      <script type="application/ld+json" suppressHydrationWarning>{safeJson(faqPage)}</script>
    </main>
  );
}
