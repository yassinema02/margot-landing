"use client";

import { useEffect, useState } from "react";
import { LAUNCH_TS, APP_STORE_URL } from "@/lib/launch";

export interface CountdownContent {
  eyebrow: string;
  labels: { days: string; hours: string; minutes: string; seconds: string };
  liveEyebrow: string;
  liveHeadline: string;
  cta: string;
}

interface Props {
  c: CountdownContent;
  size?: "lg" | "sm";
}

function parts(diffMs: number) {
  const total = Math.max(0, Math.floor(diffMs / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

const pad = (n: number) => n.toString().padStart(2, "0");

export function Countdown({ c, size = "lg" }: Props) {
  // `now` stays null until mount so server and first client render match
  // (the timer can't be known at build time). Once mounted we tick each second.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const launched = now !== null && now >= LAUNCH_TS;

  if (launched) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-warm2 bg-surface font-sans text-[11px] font-semibold tracking-wider2 uppercase text-sage">
          <span className="w-1.5 h-1.5 rounded-full bg-sage" />
          {c.liveEyebrow}
        </div>
        {size === "lg" && (
          <p className="font-display italic text-ink2 opsz-96 text-[clamp(18px,2vw,24px)] tracking-tight6 [text-wrap:balance] max-w-[460px] text-center">
            {c.liveHeadline}
          </p>
        )}
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center rounded-full bg-ink text-surface no-underline font-sans font-semibold tracking-tight7 hover:opacity-90 transition-opacity ${
            size === "lg" ? "px-7 py-3.5 text-[15px]" : "px-5 py-2.5 text-[13px]"
          }`}
        >
          {c.cta}
        </a>
      </div>
    );
  }

  const { days, hours, minutes, seconds } = parts(
    now === null ? LAUNCH_TS - Date.now() : LAUNCH_TS - now,
  );
  // Before mount, `now` is null — render the static target delta so the markup
  // is deterministic; the seconds start animating the instant the effect runs.
  const pending = now === null;

  const units = [
    { value: days, label: c.labels.days, padded: false },
    { value: hours, label: c.labels.hours, padded: true },
    { value: minutes, label: c.labels.minutes, padded: true },
    { value: seconds, label: c.labels.seconds, padded: true },
  ];

  const numberCls =
    size === "lg"
      ? "text-[clamp(34px,6vw,56px)]"
      : "text-[clamp(24px,5vw,32px)]";
  const cardPad = size === "lg" ? "px-[clamp(12px,2.5vw,22px)] py-3.5" : "px-3 py-2.5";
  const minW = size === "lg" ? "min-w-[clamp(62px,12vw,92px)]" : "min-w-[52px]";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-warm2 bg-surface font-sans text-[11px] font-semibold tracking-wider2 uppercase text-ink3">
        <span className="w-1.5 h-1.5 rounded-full bg-peach" />
        {c.eyebrow}
      </div>

      <div
        className={`flex items-stretch ${size === "lg" ? "gap-2.5 sm:gap-3.5" : "gap-2"} ${pending ? "opacity-90" : ""}`}
        role="timer"
        aria-live="off"
      >
        {units.map((u) => (
          <div
            key={u.label}
            className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-warm2 bg-surface ${cardPad} ${minW} shadow-[0_14px_40px_-30px_rgba(45,58,51,0.4)]`}
          >
            <span
              className={`font-display font-normal text-ink opsz-144 leading-none tracking-tightest tabular-nums ${numberCls}`}
            >
              {u.padded ? pad(u.value) : u.value}
            </span>
            <span className="font-sans text-[10px] font-semibold tracking-wider2 uppercase text-ink3">
              {u.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
