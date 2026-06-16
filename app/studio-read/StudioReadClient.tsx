"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { usePostHog } from "posthog-js/react";
import { ResultCard } from "./ResultCard";
import { STUDIO_READ_COPY } from "@/lib/studioRead/copy";
import type { Locale, StudioReadResult } from "@/lib/studioRead/types";

type Phase = "idle" | "loading" | "result";

// Downscale client-side to keep the upload small and the photo off any network
// at full resolution. Canvas → JPEG ≤ maxDim, returns raw base64 (no data: prefix).
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

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setError("");
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const onSubmit = async () => {
    if (!file) return;
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

  if (phase === "result" && result) {
    return <ResultCard result={result} token={token} locale={locale} onReset={reset} />;
  }

  return (
    <div className="mx-auto max-w-md text-center">
      <p className="font-sans text-xs font-semibold uppercase tracking-wider2 text-peach">{c.kicker}</p>
      <h1 className="mt-2 font-display text-4xl sm:text-5xl text-ink tracking-tightest leading-[0.98]">{c.title}</h1>
      <p className="mt-4 text-ink2 leading-relaxed">{c.nudge}</p>

      {/* NO capture attr — forcing the rear camera would block the mirror selfies we allow. */}
      <input ref={inputRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" id="studio-read-file" />

      <div className="mt-8">
        {previewUrl ? (
          <div className="flex flex-col items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt=""
              className="max-h-80 w-auto rounded-2xl border border-warm2 object-contain"
            />
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={onSubmit}
                disabled={phase === "loading"}
                className="inline-flex items-center rounded-xl bg-ink px-6 py-3 font-sans text-sm font-semibold text-surface hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {phase === "loading" ? c.loading : c.cta}
              </button>
              <label htmlFor="studio-read-file" className="cursor-pointer font-sans text-sm text-ink3 underline hover:text-ink2">
                {c.changePhoto}
              </label>
            </div>
          </div>
        ) : (
          <label
            htmlFor="studio-read-file"
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-warm2 bg-surface px-6 py-14 hover:border-ink4 transition-colors"
          >
            <span className="font-sans text-sm font-semibold text-ink">{c.choosePhoto}</span>
          </label>
        )}
      </div>

      {error && <p className="mt-4 text-sm text-rust">{error}</p>}
    </div>
  );
}
