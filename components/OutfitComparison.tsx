"use client";

import Image from "next/image";
import { useId, useState, type PointerEvent } from "react";
import styles from "./Landing.module.css";

type ComparisonCopy = {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  label: string;
  instruction: string;
  caption: string;
  note: string;
};

export function OutfitComparison({ copy }: { copy: ComparisonCopy }) {
  const [position, setPosition] = useState(50);
  const instructionId = useId();

  function moveDivider(event: PointerEvent<HTMLInputElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    setPosition(Math.round(Math.max(0, Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100))));
  }

  return <figure className={styles.heroPhoto}>
    <div className={styles.comparisonStage}>
      <Image src="/editorial/outfit-after.png" alt={copy.afterAlt} fill priority sizes="(max-width: 760px) 100vw, (max-width: 1600px) 800px, 50vw" draggable={false} />
      <div className={styles.comparisonBefore} style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <Image src="/editorial/outfit-before.png" alt={copy.beforeAlt} fill priority sizes="(max-width: 760px) 100vw, (max-width: 1600px) 800px, 50vw" draggable={false} />
      </div>
      <div className={styles.comparisonLabels} aria-hidden="true">
        <span style={{ opacity: position === 0 ? 0 : 1 }}>{copy.before}</span>
        <span style={{ opacity: position === 100 ? 0 : 1 }}>{copy.after}</span>
      </div>
      <input
        className={styles.comparisonInput}
        type="range"
        min={0}
        max={100}
        value={position}
        aria-label={copy.label}
        aria-describedby={instructionId}
        aria-valuetext={`${copy.before} : ${position} %, ${copy.after} : ${100 - position} %`}
        onChange={(event) => setPosition(Number(event.target.value))}
        onPointerDown={(event) => {
          if (!event.isPrimary || event.button !== 0) return;
          event.preventDefault();
          event.currentTarget.focus({ preventScroll: true });
          event.currentTarget.setPointerCapture(event.pointerId);
          moveDivider(event);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) moveDivider(event);
        }}
      />
      <div className={styles.comparisonDivider} style={{ left: `${position}%` }} aria-hidden="true">
        <span className={styles.comparisonHandle}>
          <svg width="28" height="18" viewBox="0 0 28 18" fill="none"><path d="m9 4-5 5 5 5M19 4l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
      </div>
    </div>
    <figcaption className={styles.comparisonCaption}>
      <span>{copy.caption}</span>
      <span id={instructionId} className={styles.comparisonInstruction}>{copy.instruction}</span>
      <small>{copy.note}</small>
    </figcaption>
  </figure>;
}
