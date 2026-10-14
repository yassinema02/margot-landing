import Image from "next/image";
import Link from "next/link";
import { HOME, type HomeLocale } from "@/lib/home";
import { APP_STORE_URL } from "@/lib/launch";
import { formatStat, type LiveStats } from "@/lib/stats";
import { AppScreen } from "./AppScreen";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { StoreLinks } from "./StoreLinks";
import styles from "./Landing.module.css";

export function LandingBody({ lang, liveStats }: { lang: HomeLocale; liveStats?: LiveStats | null }) {
  const t = HOME[lang];
  return <div className={styles.landing}>
    <Header />
    <main id="main-content">
      <section id="top" className={styles.hero} aria-labelledby="home-title">
        <div className={styles.heroCopy}>
          <p className={styles.category}>{t.category}</p>
          <h1 id="home-title">{t.headline.split(/(?<=\.)\s+/).map((sentence, i) => <span key={sentence}>{i > 0 && " "}{sentence}</span>)}</h1>
          <p className={styles.heroIntro}>{t.intro}</p>
          <StoreLinks lang={lang} placement="hero" />
          <p className={styles.micro}>{t.free}</p>
        </div>
        <div className={styles.heroVisual}>
          <AppScreen lang={lang} screen={t.heroScreen} variant="phone" sizes="(max-width: 760px) 250px, 300px" priority />
        </div>
      </section>
      {liveStats && <div className={styles.proof}>
        <dl>{[liveStats.wardrobes, liveStats.garments, liveStats.outfits].map((value, i) => <div key={t.stats[i]}><dt>{t.stats[i]}</dt><dd>{formatStat(value, lang)}</dd></div>)}</dl>
        <p>{t.statsNote}</p>
      </div>}
      <section id="comment-ca-marche" className={styles.stepsSection} aria-labelledby="steps-title">
        <div className={styles.container}>
          <h2 id="steps-title">{t.stepsTitle}</h2>
          <ol className={styles.steps}>{t.steps.map((step, i) => <li key={step.title}>
            <span className={styles.stepNumber} aria-hidden="true">{i + 1}</span>
            <h3>{step.title}</h3><p>{step.body}</p>
            <AppScreen lang={lang} screen={step.screen} variant="card" sizes="(max-width: 760px) 340px, 360px" />
          </li>)}</ol>
          <p className={styles.screensNote}>{t.screensNote}</p>
        </div>
      </section>
      <section id="dans-lapp" className={styles.features} aria-labelledby="features-title">
        <div className={styles.container}><h2 id="features-title">{t.featuresTitle}</h2></div>
        <div className={styles.featureRail} role="region" aria-labelledby="features-title" tabIndex={0}>
          <ul>{t.features.map((feature) => <li key={feature.title}>
            <AppScreen lang={lang} screen={feature.screen} variant="card" sizes="(max-width: 760px) 300px, 280px" />
            <h3>{feature.title}</h3><p>{feature.body}</p>
          </li>)}</ul>
        </div>
        <div className={styles.container}><p className={styles.screensNote}>{t.screensNote}</p></div>
      </section>
      <section id="offre" className={styles.offer} aria-labelledby="offer-title">
        <div className={styles.container}>
          <h2 id="offer-title">{t.offerTitle}</h2>
          <div className={styles.offerGrid}>
            <article>
              <h3>{t.offerFree}</h3>
              <ul>{t.offerFreeItems.map((item) => <li key={item}>{item}</li>)}</ul>
              <a href="#telecharger" className={styles.textLink}>{t.download}</a>
            </article>
            <article className={styles.offerPremium}>
              <h3>{t.offerPremium}</h3>
              <ul>{t.offerPremiumItems.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          </div>
          <p className={styles.offerNote}>{t.offerNote}</p>
        </div>
      </section>
      <section id="questions" className={styles.faq} aria-labelledby="faq-title">
        <div className={styles.faqGrid}>
          <div><h2 id="faq-title">{t.faqTitle}</h2><p className={styles.body}>{t.faqIntro}</p></div>
          <div>
            {t.faq.map(({ q, a }) => <details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}
            <Link className={styles.privacyLink} href={lang === "fr" ? "/fr/confidentialite" : "/privacy"}>{t.privacy}</Link>
            <nav className={styles.readMore} aria-labelledby="read-more-title">
              <h3 id="read-more-title">{t.readMoreTitle}</h3>
              <ul>{t.guides.map((guide) => <li key={guide.href}><Link href={guide.href}>{guide.title}</Link></li>)}</ul>
            </nav>
          </div>
        </div>
      </section>
      <section id="telecharger" className={styles.closing} aria-labelledby="closing-title">
        <Image src="/mascot/mascot-welcome.png" alt="" width={84} height={84} sizes="84px" />
        <h2 id="closing-title">{t.closing}</h2><p>{t.closingBody}</p>
        <StoreLinks lang={lang} placement="closing" /><p className={styles.micro}>{t.free}</p>
        <a href={APP_STORE_URL} className={styles.qr} data-cta="app-store" data-placement="closing-qr">
          <Image src="/app-qr.svg" alt="" width={88} height={88} unoptimized /><span>{t.qr}</span>
        </a>
      </section>
    </main>
    <Footer lang={lang} />
  </div>;
}
