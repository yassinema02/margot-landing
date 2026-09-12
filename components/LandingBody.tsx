import Image from "next/image";
import Link from "next/link";
import { HOME, type HomeLocale } from "@/lib/home";
import { formatStat, type LiveStats } from "@/lib/stats";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { StoreLinks } from "./StoreLinks";
import { ProductPreview } from "./ProductPreview";
import { OutfitComparison } from "./OutfitComparison";
import styles from "./Landing.module.css";

export function LandingBody({ lang, liveStats }: { lang: HomeLocale; liveStats?: LiveStats | null }) {
  const t = HOME[lang];
  return <div className={styles.landing}>
    <Header />
    <main id="main-content">
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.heroCopy}>
          <p className={styles.category}>{t.category}</p>
          <h1 id="home-title">{t.headline}</h1>
          <p className={styles.heroIntro}>{t.intro}</p>
          <StoreLinks lang={lang} placement="hero" />
          <p className={styles.micro}>{t.free}</p>
          <a href="#comment-ca-marche" className={styles.explore}>{t.explore}<span aria-hidden="true">↓</span></a>
        </div>
        <OutfitComparison copy={t.comparison} />
      </section>
      <section className={styles.statement} aria-labelledby="statement-title">
        <Image src="/mascot/mascot-thinking.png" alt="" width={66} height={66} sizes="66px" />
        <h2 id="statement-title">{t.statement}</h2><p>{t.statementBody}</p>
        {liveStats && <div className={styles.stats}>
          <dl>{[liveStats.wardrobes, liveStats.garments, liveStats.outfits].map((value, i) => <div key={i}><dt>{t.stats[i]}</dt><dd>{formatStat(value, lang)}</dd></div>)}</dl>
          <p>{t.statsNote}</p>
        </div>}
      </section>
      <section id="comment-ca-marche" className={styles.stepsSection} aria-labelledby="steps-title">
        <div className={styles.container}>
          <h2 id="steps-title">{t.stepsTitle}</h2>
          <ol className={styles.steps}>{t.steps.map((step, i) => <li key={step.title}>
            <span className={styles.stepNumber} aria-hidden="true">{i + 1}</span>
            <h3>{step.title}</h3><p>{step.body}</p>
          </li>)}</ol>
        </div>
      </section>
      <section id="dans-lapp" className={styles.product} aria-labelledby="product-title"><div className={styles.container}><ProductPreview lang={lang} /></div></section>
      <section id="offre" className={styles.offer} aria-labelledby="offer-title">
        <div className={styles.container}>
          <div className={styles.offerHeading}><h2 id="offer-title">{t.offerTitle}</h2><p className={styles.body}>{t.offerIntro}</p></div>
          <div className={styles.offerGrid}>
            <article><p>{t.offerFree}</p><h3>Margot</h3><p>{t.offerFreeBody}</p><a href="#telecharger" className={styles.textLink}>{t.download}</a></article>
            <article><p>{t.offerPremium}</p><h3>Margot Premium</h3><p>{t.offerPremiumBody}</p><span className={styles.offerNote}>{t.offerNote}</span></article>
          </div>
        </div>
      </section>
      <section id="le-journal" className={styles.guides} aria-labelledby="guides-title">
        <div className={styles.container}>
          <h2 id="guides-title">{t.guidesTitle}</h2><p className={styles.body}>{t.guidesBody}</p>
          <div className={styles.guideGrid}>{t.guides.map((guide) => <article key={guide.href}>
            <p className={styles.guideCategory}>{guide.category}</p><h3><Link href={guide.href}>{guide.title}</Link></h3><p>{guide.body}</p>
            <Link href={guide.href} className={styles.textLink} aria-label={`${lang === "fr" ? "Lire" : "Read"} : ${guide.title}`}>{lang === "fr" ? "Lire le guide" : "Read the guide"}</Link>
          </article>)}</div>
        </div>
      </section>
      <section id="questions" className={styles.faq} aria-labelledby="faq-title">
        <div className={styles.faqGrid}>
          <div><h2 id="faq-title">{t.faqTitle}</h2><p className={styles.body}>{t.faqIntro}</p></div>
          <div>{t.faq.map(({ q, a }) => <details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}
            <Link className={styles.privacyLink} href={lang === "fr" ? "/fr/confidentialite" : "/privacy"}>{t.privacy}</Link>
          </div>
        </div>
      </section>
      <section id="telecharger" className={styles.closing} aria-labelledby="closing-title">
        <Image src="/mascot/mascot-welcome.png" alt="" width={84} height={84} sizes="84px" />
        <h2 id="closing-title">{t.closing}</h2><p>{t.closingBody}</p>
        <StoreLinks lang={lang} placement="closing" /><p className={styles.micro}>{t.free}</p>
      </section>
    </main>
    <Footer lang={lang} />
  </div>;
}
