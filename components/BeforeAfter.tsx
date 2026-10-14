"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import type { HomeComparison } from "@/lib/home";
import styles from "./Landing.module.css";

const DIR = "/editorial/avant-apres";
// The four pieces she wears in the "after" photo, all taken from the heap in the "before" photo.
const PIECES = ["blazer", "tank", "jeans", "sneakers"] as const;
// Intro sweep played once when the slider first comes into view: mostly "before",
// then mostly "after", then back to the middle.
const INTRO = [
  { to: 86, ms: 650 },
  { to: 16, ms: 1100 },
  { to: 50, ms: 700 },
];
const clamp = (v: number) => Math.max(0, Math.min(100, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

export function BeforeAfter({ copy }: { copy: HomeComparison }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pos = useRef(50);
  const target = useRef(50);
  const frame = useRef(0);
  const intro = useRef<"idle" | "playing" | "done">("idle");
  const [touched, setTouched] = useState(false);
  const instructionId = useId();

  // Position lives in a CSS variable: dragging never re-renders React.
  function paint(value: number) {
    pos.current = value;
    stageRef.current?.style.setProperty("--p", value.toFixed(2));
    const input = inputRef.current;
    if (input) {
      const rounded = Math.round(value);
      input.value = String(rounded);
      input.setAttribute("aria-valuetext", `${copy.before} ${rounded} %, ${copy.after} ${100 - rounded} %`);
    }
  }

  // Follows the pointer with a short ease so the divider glides instead of jumping.
  function glideTo(value: number) {
    target.current = clamp(value);
    if (frame.current) return;
    const step = () => {
      const delta = target.current - pos.current;
      if (Math.abs(delta) < 0.05) {
        paint(target.current);
        frame.current = 0;
        return;
      }
      paint(pos.current + delta * 0.28);
      frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
  }

  function takeOver() {
    intro.current = "done";
    if (!touched) setTouched(true);
  }

  function fromPointer(event: PointerEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    return ((event.clientX - bounds.left) / bounds.width) * 100;
  }

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || intro.current !== "idle") return;
      observer.disconnect();
      intro.current = "playing";
      let leg = 0;
      let from = pos.current;
      let start = performance.now() + 350;
      const tick = (now: number) => {
        if (cancelled || intro.current !== "playing") return;
        const { to, ms } = INTRO[leg];
        const t = Math.max(0, Math.min(1, (now - start) / ms));
        paint(from + (to - from) * ease(t));
        if (t === 1) {
          leg += 1;
          if (leg === INTRO.length) {
            intro.current = "done";
            return;
          }
          from = to;
          start = now;
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    observer.observe(stage);
    return () => {
      cancelled = true;
      observer.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, []);

  return <figure className={styles.compare}>
    <div ref={stageRef} className={styles.compareStage} style={{ "--p": 50 } as CSSProperties}>
      <div className={styles.compareLayer}>
        <Image src={`${DIR}/after.webp`} alt={copy.afterAlt} fill priority quality={60} sizes="(max-width: 760px) calc(100vw - 32px), 460px" draggable={false} />
        <span className={`${styles.compareTag} ${styles.compareTagAfter}`}>{copy.after}</span>
        <div className={styles.compareOutfit} aria-hidden="true">
          <p>{copy.today}</p>
          <div>{PIECES.map((piece) => <span key={piece}><Image src={`${DIR}/${piece}.webp`} alt="" width={56} height={56} sizes="56px" /></span>)}</div>
        </div>
      </div>
      <div className={`${styles.compareLayer} ${styles.compareBefore}`}>
        <Image src={`${DIR}/before.webp`} alt={copy.beforeAlt} fill priority quality={60} sizes="(max-width: 760px) calc(100vw - 32px), 460px" draggable={false} />
        <span className={styles.compareTag}>{copy.before}</span>
        <span className={styles.compareThought} aria-hidden="true">{copy.thought}</span>
      </div>
      <input
        ref={inputRef}
        className={styles.compareInput}
        type="range"
        min={0}
        max={100}
        defaultValue={50}
        aria-label={copy.label}
        aria-describedby={instructionId}
        aria-valuetext={`${copy.before} 50 %, ${copy.after} 50 %`}
        onChange={(event) => {
          takeOver();
          paint(Number(event.target.value));
        }}
        onPointerDown={(event) => {
          if (!event.isPrimary || event.button !== 0) return;
          event.preventDefault();
          event.currentTarget.focus({ preventScroll: true });
          event.currentTarget.setPointerCapture(event.pointerId);
          takeOver();
          glideTo(fromPointer(event));
        }}
        onPointerMove={(event) => {
          // With a mouse the divider follows the cursor, no click needed; on touch it follows the drag.
          if (event.pointerType !== "mouse" && !event.currentTarget.hasPointerCapture(event.pointerId)) return;
          takeOver();
          glideTo(fromPointer(event));
        }}
      />
      <div className={styles.compareDivider} aria-hidden="true">
        <span className={styles.compareHandle} data-touched={touched || undefined}>
          <svg width="30" height="20" viewBox="0 0 28 18" fill="none"><path d="m9 4-5 5 5 5M19 4l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
        {!touched && <span className={styles.compareHint}>{copy.hint}</span>}
      </div>
    </div>
    <figcaption className={styles.compareCaption}>
      <span>{copy.caption}</span>
      <span id={instructionId} className={styles.compareInstruction}>{copy.instruction}</span>
      <small>{copy.note}</small>
    </figcaption>
  </figure>;
}
