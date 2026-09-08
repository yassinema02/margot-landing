"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { usePostHog } from "posthog-js/react";
import { ResultCard } from "./ResultCard";
import { MargotSVG } from "@/components/MargotSVG";
import { STUDIO_READ_COPY } from "@/lib/studioRead/copy";
import { MARGOT } from "@/lib/studioRead/brand";
import type { Locale, StudioReadResult } from "@/lib/studioRead/types";

type Phase = "idle" | "loading" | "result";

// Downscale client-side: canvas → JPEG ≤ maxDim, raw base64 (no data: prefix).
async function downscaleToBase64(file: File, maxDim = 1024, quality = 0.85): Promise<string> {
  const dataUrl: string = await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(new Error("read failed"));
    r.readAsDataURL(file);
  });
  const img: HTMLImageElement = await new Promise((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("decode failed"));
    el.src = dataUrl;
  });
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no canvas ctx");
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", quality).split(",")[1] ?? "";
}

export function StudioReadClient({ locale }: { locale: Locale }) {
  const c = STUDIO_READ_COPY[locale];
  const ph = usePostHog();
  const inputRef = useRef<HTMLInputElement>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [result, setResult] = useState<StudioReadResult | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const openPicker = () => inputRef.current?.click();

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setError("");
    setFile(f);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const onSubmit = async () => {
    if (!file) {
      openPicker();
      return;
    }
    setPhase("loading");
    setError("");
    ph?.capture("studio_read_started", { locale });
    try {
      const imageBase64 = await downscaleToBase64(file);
      const res = await fetch("/api/studio-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64, locale }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { token: string; result: StudioReadResult };
      setResult(data.result);
      setToken(data.token);
      ph?.capture("studio_read_result", {
        archetype: data.result.primary?.id ?? "unreadable",
        status: data.result.status,
        confidence: data.result.primary?.confidence ?? null,
        style_signal: data.result.style_signal,
      });
      setPhase("result");
    } catch {
      setError(c.errorGeneric);
      setPhase("idle");
    }
  };

  const reset = () => {
    setPhase("idle");
    setResult(null);
    setToken(null);
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  // hidden input shared by every entry point — NO `capture` attr (mirror selfies allowed)
  const fileInput = <input ref={inputRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />;

  if (phase === "loading") {
    return (
      <div className="flex min-h-[460px] flex-col items-center justify-center gap-[34px] px-6 py-16 text-center">
        <div className="sr-pulse">
          <MargotSVG state="considering" size={120} crop="portrait" showLegs={false} />
        </div>
        <div className="flex flex-col items-center gap-3.5">
          <p className="font-display italic text-[28px] sm:text-[36px] leading-[1.18] tracking-[-0.01em] text-ink">{c.loadingLine}</p>
          <p className="text-[15px]" style={{ color: MARGOT.textMuted }}>{c.loadingSub}</p>
        </div>
        <div className="flex gap-2">
          {[0, 0.2, 0.4].map((d, i) => (
            <span key={i} className="sr-dot h-2 w-2 rounded-full" style={{ background: MARGOT.sage, animationDelay: `${d}s` }} />
          ))}
        </div>
      </div>
    );
  }

  if (phase === "result" && result) {
    return (
      <>
        {fileInput}
        <ResultCard result={result} token={token} locale={locale} onReset={reset} />
      </>
    );
  }

  // ---- IDLE / UPLOAD — two columns on desktop, stacked on mobile ----
  return (
    <div className="flex w-full flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
      {fileInput}
      {/* left — pitch + CTA */}
      <div className="flex w-full max-w-[480px] flex-col gap-6 lg:flex-1">
        <span className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: MARGOT.textMuted }}>{c.eyebrow}</span>
        <h1 className="font-display opsz-144 text-balance text-[44px] leading-[0.98] tracking-[-0.025em] text-ink sm:text-[60px] lg:text-[68px]">
          {c.post}<span style={{ color: MARGOT.beakRust }}>.</span>
        </h1>
        <p className="max-w-[420px] text-[17px] leading-relaxed sm:text-lg" style={{ color: MARGOT.textBody }}>{c.sub}</p>
        <div className="mt-1 flex items-center gap-4">
          <button onClick={onSubmit} className="flex h-[58px] items-center justify-center gap-2.5 rounded-[14px] bg-ink px-[30px] font-sans text-[17px] font-semibold text-surface hover:bg-[#1F2A26] transition-colors">
            {c.readBtn}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>
          </button>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-4">
          {c.reassure.map((item) => (
            <div key={item} className="flex items-center gap-1.5">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={MARGOT.sage} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
              <span className="text-[13.5px] font-medium" style={{ color: "#6B746D" }}>{item}</span>
            </div>
          ))}
        </div>
        {error && <p className="text-sm" style={{ color: MARGOT.rust }}>{error}</p>}
      </div>

      {/* right — drop target */}
      <div className="flex w-full max-w-[480px] flex-col gap-3.5 lg:flex-1">
        <button
          onClick={openPicker}
          className="relative block w-full rounded-3xl border-[1.5px] border-dashed bg-white p-3.5 text-left transition-colors hover:border-[#B0B5B0]"
          style={{ borderColor: MARGOT.borderStrong, boxShadow: "0 2px 8px rgba(31,42,38,0.05)" }}
        >
          <div className="flex h-[300px] items-center justify-center overflow-hidden rounded-2xl sm:h-[404px]" style={{ background: MARGOT.cream }}>
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="" className="h-full w-full object-contain" />
            ) : (
              <span className="px-8 text-center text-[15px] font-medium" style={{ color: MARGOT.textMuted }}>{c.dropHint}</span>
            )}
          </div>
        </button>
        <div className="flex items-center justify-between px-1">
          <span className="text-[13px]" style={{ color: MARGOT.textMuted }}>{c.dropFoot}</span>
          {previewUrl && (
            <button onClick={openPicker} className="text-[13px] font-medium underline hover:opacity-70" style={{ color: MARGOT.textMuted }}>{c.changePhoto}</button>
          )}
        </div>
      </div>
    </div>
  );
}
