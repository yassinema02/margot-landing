import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/launch";
import type { HomeLocale } from "@/lib/home";
import styles from "./Landing.module.css";

export function StoreLinks({ lang, placement }: { lang: HomeLocale; placement: string }) {
  return <div className={styles.storeLinks}>
    <a href={APP_STORE_URL} data-cta="app-store" data-placement={placement} aria-label={lang === "fr" ? "Télécharger Margot sur l’App Store" : "Download Margot on the App Store"}>
      <svg viewBox="0 0 24 24" width="23" height="23" aria-hidden="true" fill="currentColor"><path d="M17.05 12.54c.02 3.18 2.79 4.23 2.82 4.24-.03.08-.44 1.51-1.46 2.99-.89 1.28-1.82 2.55-3.28 2.58-1.43.03-1.89-.84-3.52-.84-1.64 0-2.15.81-3.49.87-1.41.05-2.48-1.39-3.37-2.67-1.82-2.62-3.21-7.4-1.34-10.63.93-1.6 2.59-2.62 4.39-2.65 1.37-.03 2.66.92 3.49.92.84 0 2.4-1.13 4.04-.97.69.03 2.62.28 3.86 2.1-.1.06-2.31 1.34-2.29 4.06ZM14.38 4.62c.75-.91 1.26-2.17 1.12-3.43-1.09.04-2.41.73-3.2 1.65-.7.81-1.31 2.11-1.15 3.35 1.21.1 2.46-.62 3.23-1.57Z" /></svg>
      <span><small>{lang === "fr" ? "Télécharger sur" : "Download on the"}</small><strong>App Store</strong></span>
    </a>
    <a href={PLAY_STORE_URL} data-cta="play-store" data-placement={placement} aria-label={lang === "fr" ? "Télécharger Margot sur Google Play" : "Download Margot on Google Play"}>
      <svg viewBox="0 0 24 24" width="23" height="23" aria-hidden="true" fill="currentColor"><path d="m3 2 11 10L3 22V2Zm12.5 8.6L5.8 1.8 18 8.4l-2.5 2.2Zm0 2.8 2.5 2.2-12.2 6.6 9.7-8.8ZM17 12l2.8-2.5 2.1 1.2c1.1.6 1.1 2 0 2.6l-2.1 1.2L17 12Z" /></svg>
      <span><small>{lang === "fr" ? "Disponible sur" : "Get it on"}</small><strong>Google Play</strong></span>
    </a>
  </div>;
}
