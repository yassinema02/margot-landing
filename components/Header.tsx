"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./Landing.module.css";

export function Header() {
  const fr = usePathname()?.startsWith("/fr") ?? false;
  const [open, setOpen] = useState(false);
  const links = [
    { href: "#comment-ca-marche", label: fr ? "Comment ça marche" : "How it works" },
    { href: "#dans-lapp", label: fr ? "Dans l’app" : "Inside the app" },
    { href: "#le-journal", label: fr ? "Le journal" : "The journal" },
  ];
  return <header className={styles.header} onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); }}>
    <a className={styles.skipLink} href="#main-content">{fr ? "Aller au contenu" : "Skip to content"}</a>
    <Link href={fr ? "/fr" : "/"} className={styles.wordmark} aria-label={fr ? "Margot, accueil" : "Margot, home"}>Margot.</Link>
    <nav aria-label={fr ? "Navigation principale" : "Main navigation"} className={styles.desktopNav}>{links.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</nav>
    <div className={styles.headerActions}>
      <Link href={fr ? "/" : "/fr"} hrefLang={fr ? "en" : "fr"} lang={fr ? "en" : "fr"} className={styles.languageLink} aria-label={fr ? "View in English" : "Voir en français"}>{fr ? "EN" : "FR"}</Link>
      <a href="#telecharger" className={styles.headerDownload}>{fr ? "Télécharger" : "Download"}</a>
      <button type="button" className={styles.menuButton} aria-expanded={open} aria-controls="mobile-navigation" aria-label={fr ? "Menu de navigation" : "Navigation menu"} onClick={() => setOpen(!open)}>{open ? "×" : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M3 7h18M3 16h18" /></svg>}</button>
    </div>
    <nav id="mobile-navigation" aria-label={fr ? "Navigation mobile" : "Mobile navigation"} className={styles.mobileNav} hidden={!open}>{links.map(link => <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</a>)}</nav>
  </header>;
}
