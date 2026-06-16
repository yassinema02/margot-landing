import { ImageResponse } from "next/og";
import { loadFraunces } from "@/lib/og-fonts";
import { getStudioRead } from "@/lib/studioRead/persist";
import { MARGOT, onAccent, chipText, pickAccent } from "@/lib/studioRead/brand";

export const runtime = "nodejs";
export const alt = "Your style, read by Margot";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const FALLBACK_PALETTE = ["#EFE7D8", "#C8B49A", "#8A7D6B", "#3B3730"];

// Canonical Margot app-tile mark (same glyph as app/icon.svg + the root OG) —
// self-contained, legible over any accent. Inlined for Satori.
function AppTile({ size: s }: { size: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "flex" }}>
      <rect width="32" height="32" rx="7" fill="#ECEAE5" />
      <path d="M 9 13 C 9 7 14 5 18 5.5 C 24 6 25 11 24.5 16 C 24 21 19 22 16 22 C 12 21.5 9 18.5 9 13 Z" fill="#2D3A33" />
      <ellipse cx="17" cy="10" rx="6" ry="2" fill="#3F5F52" opacity="0.55" />
      <path d="M 9 14 L 2 16 L 9 18 Z" fill="#B85133" />
      <circle cx="14" cy="12" r="0.9" fill="#F6F4EF" />
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
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <AppTile size={84} />
            <span style={{ fontFamily: "FrauncesItalic", fontSize: 76, fontWeight: 400, letterSpacing: "-0.02em", color: MARGOT.moss }}>
              Margot<span style={{ color: MARGOT.beakRust }}>.</span>
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
            <span style={{ display: "flex", fontSize: sc.headline.length > 16 ? 72 : sc.headline.length > 11 ? 90 : 112, fontWeight: 400, lineHeight: 0.95, letterSpacing: "-0.025em", color: t.text }}>
              {sc.headline + "."}
            </span>
            <span style={{ fontFamily: "FrauncesItalic", fontSize: 40, lineHeight: 1.2, letterSpacing: "-0.01em", color: t.text, maxWidth: 560 }}>{sc.one_liner}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <AppTile size={48} />
            <span style={{ fontFamily: "FrauncesItalic", fontSize: 40, fontWeight: 400, letterSpacing: "-0.02em", color: t.text }}>
              Margot<span style={{ color: t.sparkle }}>.</span>
            </span>
            <span style={{ fontFamily: "sans-serif", fontSize: 19, fontWeight: 500, letterSpacing: "0.04em", color: t.soft, marginLeft: 10 }}>margotwardrobe.com</span>
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
