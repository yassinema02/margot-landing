"use client";

import { useState } from "react";
import Image from "next/image";

type Size = "hero" | "step" | "feature";

interface Props {
  src: string;
  alt: string;
  size: Size;
  priority?: boolean;
}

const SIZE_MAP: Record<Size, { outerW: string; widthPx: number; heightPx: number }> = {
  // 9:19 aspect, inner image area roughly matches a modern iPhone notch frame.
  hero:    { outerW: "w-72",  widthPx: 288, heightPx: 608 },
  step:    { outerW: "w-56",  widthPx: 224, heightPx: 473 },
  feature: { outerW: "w-48",  widthPx: 192, heightPx: 405 },
};

export function PhoneMockup({ src, alt, size, priority = false }: Props) {
  const [errored, setErrored] = useState(false);
  const cfg = SIZE_MAP[size];

  return (
    <div
      className={`${cfg.outerW} relative shrink-0 rounded-[2.5rem] bg-neutral-900 p-[6px] shadow-[0_22px_60px_-20px_rgba(45,58,51,0.45)]`}
      style={{ aspectRatio: "9 / 19" }}
    >
      {/* Notch */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[10px] z-10 h-[18px] w-[80px] -translate-x-1/2 rounded-full bg-neutral-900"
      />
      {/* Inner bezel + screen */}
      <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-neutral-100">
        {errored ? (
          <div className="flex h-full w-full items-center justify-center bg-surface px-4 text-center">
            <span className="font-display italic text-ink3 text-[15px] tracking-tight5">
              Screenshot pending
            </span>
          </div>
        ) : (
          <Image
            src={src}
            alt={alt}
            width={cfg.widthPx}
            height={cfg.heightPx}
            priority={priority}
            onError={() => setErrored(true)}
            className="h-full w-full object-cover"
            sizes={`${cfg.widthPx}px`}
          />
        )}
      </div>
    </div>
  );
}
