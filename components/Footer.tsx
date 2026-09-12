"use client";
import Link from "next/link";
import type { HomeLocale } from "@/lib/home";
import { useConsent } from "./analytics/ConsentProvider";
import styles from "./Landing.module.css";

export function Footer({ lang }: { lang: HomeLocale }) {
  const { reset } = useConsent();
  const fr = lang === "fr";
  const home = fr ? "/fr" : "/";
  const groups = [
    { title: "Margot", links: [
      { label: fr ? "L’application" : "The app", href: `${home}#dans-lapp` },
      { label: fr ? "Gratuit et Premium" : "Free and Premium", href: `${home}#offre` },
      { label: fr ? "Télécharger" : "Download", href: `${home}#telecharger` },
      { label: fr ? "Découvrir mon style" : "Discover my style", href: `${fr ? "/fr" : ""}/studio-read` },
    ] },
    { title: fr ? "À lire" : "Explore", links: fr ? [
      { label: "Garde-robe digitale", href: "/fr/garde-robe-digitale" },
      { label: "Quoi porter aujourd’hui", href: "/fr/quoi-porter-aujourdhui" },
      { label: "Margot ou Whering", href: "/fr/vs/whering" },
    ] : [
      { label: "The journal", href: "/blog" },
      { label: "What to wear today", href: "/blog/what-to-wear-today" },
      { label: "Margot vs Whering", href: "/vs/whering" },
    ] },
    { title: fr ? "Restons en contact" : "Keep in touch", links: [
      { label: "Instagram", href: "https://instagram.com/margotwardrobe" },
      { label: "TikTok", href: "https://tiktok.com/@margotwardrobe" },
      { label: "Contact", href: "mailto:margot@margotwardrobe.com" },
      { label: fr ? "Presse" : "Press", href: "/press" },
      { label: fr ? "Partenaires" : "Partners", href: fr ? "/fr/partenaires" : "/partners" },
    ] },
  ];
  return <footer className={styles.footer}>
    <div className={styles.footerTop}>
      <div><Link href={home} className={styles.footerWordmark}>Margot.</Link><p>{fr ? "De nouvelles idées pour tes vêtements." : "New possibilities for your clothes."}</p></div>
      {groups.map(group => <nav key={group.title} aria-label={group.title}><h2>{group.title}</h2>{group.links.map(link => <a href={link.href} key={link.href}>{link.label}</a>)}</nav>)}
    </div>
    <div className={styles.footerBottom}>
      <span>© {new Date().getFullYear()} Margot · YAVREN</span>
      <div><Link href={fr ? "/fr/confidentialite" : "/privacy"}>{fr ? "Confidentialité" : "Privacy"}</Link><Link href={fr ? "/fr/conditions" : "/terms"}>{fr ? "Conditions" : "Terms"}</Link><Link href="/mentions-legales">{fr ? "Mentions légales" : "Legal notice"}</Link><button type="button" onClick={reset}>{fr ? "Cookies" : "Cookie settings"}</button></div>
    </div>
  </footer>;
}
