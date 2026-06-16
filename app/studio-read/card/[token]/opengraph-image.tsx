import { ImageResponse } from "next/og";
import { loadFraunces } from "@/lib/og-fonts";
import { getStudioRead } from "@/lib/studioRead/persist";
import { MARGOT, onAccent, chipText, pickAccent } from "@/lib/studioRead/brand";

export const runtime = "nodejs";
export const alt = "Your style, read by Margot";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const FALLBACK_PALETTE = ["#EFE7D8", "#C8B49A", "#8A7D6B", "#3B3730"];

// Inline magpie mark for Satori (the DOM <MargotMark> can't be used here).
function Magpie({ size: s, tone, accent }: { size: number; tone: "ink" | "cream"; accent: string }) {
  const body = tone === "cream" ? MARGOT.cream : MARGOT.moss;
  const blade = tone === "cream" ? MARGOT.moss : MARGOT.cream;
  const wing = tone === "cream" ? "#D8D4CB" : MARGOT.irid;
  const w = Math.round((s * 100) / 108);
  return (
    <svg width={w} height={s} viewBox="0 0 100 108" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "flex" }}>
      <path d="M56,56 L96,105 L83,104 C68,90 57,78 49,67 Z" fill={body} />
      <ellipse cx="45" cy="53" rx="21" ry="23" fill={body} />
      <path d="M31,46 C25,56 27,69 39,74 C32,65 31,55 36,48 Z" fill={blade} />
      <path d="M47,33 C60,38 63,55 55,70 C52,56 50,45 43,38 Z" fill={wing} opacity="0.92" />
      <circle cx="32" cy="26" r="14" fill={body} />
      <path d="M19,24 L5,27 L20,33 Z" fill={accent} />
      <circle cx="30" cy="24" r="3.4" fill={blade} />
      <circle cx="29.2" cy="24.3" r="1.5" fill={body} />
      <path d="M78,12 C79,19 80,20 87,21 C80,22 79,23 78,30 C77,23 76,22 69,21 C76,20 77,19 78,12 Z" fill={accent} />
    </svg>
  );
}

export default async function Image({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const data = await getStudioRead(token);
  const [fr400, fr400i] = await Promise.all([loadFraunces(false, 400), loadFraunces(true, 400)]);
  const fonts = [
    { name: "Fraunces", data: fr400, style: "normal" as const, weight: 400 as const },
    { name: "FrauncesItalic", data: fr400i, style: "normal" as const, weight: 400 as const },
  ];

  // ---- Branded fallback (token missing/expired) ----
  if (!data) {
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30, padding: 70, background: MARGOT.cream }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Magpie size={92} tone="ink" accent={MARGOT.beakRust} />
            <span style={{ fontFamily: "Fraunces", fontSize: 76, fontWeight: 400, letterSpacing: "-0.03em", color: MARGOT.moss }}>
              margot<span style={{ color: MARGOT.beakRust }}>.</span>
            </span>
          </div>
          <span style={{ fontFamily: "FrauncesItalic", fontSize: 46, color: MARGOT.textBody, letterSpacing: "-0.01em" }}>read your style.</span>
          <span style={{ fontSize: 20, fontWeight: 500, letterSpacing: "0.06em", color: MARGOT.textMuted }}>margotwardrobe.com</span>
        </div>
      ),
      { ...size, fonts },
    );
  }

  const sc = data.result.share_card;
  const palette = sc.palette_hexes?.length ? sc.palette_hexes.slice(0, 4) : FALLBACK_PALETTE;
  const accent = pickAccent(palette);
  const t = onAccent(accent);
  const eyebrow = data.locale === "fr" ? "UN PORTRAIT MARGOT" : "A MARGOT READ";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: accent, fontFamily: "Fraunces" }}>
        {/* LEFT — accent flood, the reveal */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "70px 64px" }}>
          <span style={{ fontFamily: "sans-serif", fontSize: 21, fontWeight: 600, letterSpacing: "0.2em", color: t.soft }}>{eyebrow}</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            <span style={{ display: "flex", fontSize: 112, fontWeight: 400, lineHeight: 0.92, letterSpacing: "-0.025em", color: t.text }}>
              {sc.headline}<span style={{ color: t.soft }}>.</span>
            </span>
            <span style={{ fontFamily: "FrauncesItalic", fontSize: 40, lineHeight: 1.2, letterSpacing: "-0.01em", color: t.text, maxWidth: 560 }}>{sc.one_liner}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Magpie size={46} tone={t.markTone} accent={t.sparkle} />
            <span style={{ fontSize: 40, fontWeight: 400, letterSpacing: "-0.03em", color: t.text }}>
              margot<span style={{ color: t.sparkle }}>.</span>
            </span>
            <span style={{ fontSize: 19, fontWeight: 500, letterSpacing: "0.04em", color: t.soft, marginLeft: 10 }}>margotwardrobe.com</span>
          </div>
        </div>
        {/* RIGHT — the colour story */}
        <div style={{ width: 392, display: "flex", flexDirection: "column" }}>
          {palette.map((hex, i) => (
            <div key={i} style={{ flex: 1, display: "flex", alignItems: "flex-end", padding: "22px 26px", background: hex }}>
              <span style={{ fontFamily: "sans-serif", fontSize: 18, fontWeight: 600, letterSpacing: "0.08em", color: chipText(hex) }}>{hex}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
