"use client";
import { useState } from "react";
import Image from "next/image";
import { HOME, type HomeLocale } from "@/lib/home";
import styles from "./Landing.module.css";

export function ProductPreview({ lang }: { lang: HomeLocale }) {
  const [selected, setSelected] = useState(0);
  const t = HOME[lang];
  return <div className={styles.productGrid}>
    <figure className={styles.appFigure}>
      <div className={styles.appImage} id="app-preview" aria-live="polite" aria-atomic="true">
        <Image src={t.previews[selected].src} alt={t.previews[selected].alt} width={700} height={1516} sizes="(max-width: 600px) 80vw, 340px" />
      </div>
      <figcaption>{t.productCaption}</figcaption>
    </figure>
    <div className={styles.productCopy}>
      <h2 id="product-title">{t.productTitle}</h2><p className={styles.body}>{t.productBody}</p>
      <div className={styles.previewChoices} aria-label={lang === "fr" ? "Choisir un aperçu de Margot" : "Choose a Margot preview"}>
        {t.previews.map((item, i) => <div key={item.src} className={selected === i ? styles.selectedPreview : styles.previewChoice}>
          <h3><button type="button" aria-pressed={selected === i} aria-controls="app-preview" onClick={() => setSelected(i)}>{item.title}<span aria-hidden="true">{selected === i ? "−" : "+"}</span></button></h3>
          <p>{item.body}</p>
        </div>)}
      </div>
    </div>
  </div>;
}
