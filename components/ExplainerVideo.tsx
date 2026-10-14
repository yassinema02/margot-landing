"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { HomeLocale, HomeVideo } from "@/lib/home";
import styles from "./Landing.module.css";

// Silent 15 s loop. Nothing is downloaded until it scrolls into view; it plays
// while visible, pauses when it leaves, and never autoplays for reduced motion.
export function ExplainerVideo({ lang, copy }: { lang: HomeLocale; copy: HomeVideo }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pausedByUser = useRef(false);
  const [playing, setPlaying] = useState(false);
  const transcriptId = useId();

  useEffect(() => {
    const video = videoRef.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !pausedByUser.current) video.play().catch(() => {});
      else if (!entry.isIntersecting) video.pause();
    }, { threshold: 0.5 });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  function toggle() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      pausedByUser.current = false;
      video.play().catch(() => {});
    } else {
      pausedByUser.current = true;
      video.pause();
    }
  }

  return <figure className={styles.video}>
    <div className={styles.videoFrame}>
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        poster={`/video/margot-15s-${lang}-poster.webp`}
        aria-label={copy.label}
        aria-describedby={transcriptId}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onClick={toggle}
      >
        <source src={`/video/margot-15s-${lang}.mp4`} type="video/mp4" />
      </video>
      <button type="button" className={styles.videoToggle} onClick={toggle} aria-label={playing ? copy.pause : copy.play}>
        {playing
          ? <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="2" width="3.5" height="12" rx="1" fill="currentColor" /><rect x="9.5" y="2" width="3.5" height="12" rx="1" fill="currentColor" /></svg>
          : <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11a.8.8 0 0 0 1.2.7l9-5.5a.8.8 0 0 0 0-1.4l-9-5.5A.8.8 0 0 0 4 2.5Z" fill="currentColor" /></svg>}
      </button>
    </div>
    <figcaption className={styles.videoNote}>{copy.note}</figcaption>
    <p id={transcriptId} className={styles.visuallyHidden}>{copy.transcript}</p>
  </figure>;
}
