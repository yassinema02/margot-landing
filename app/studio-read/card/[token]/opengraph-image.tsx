import { ImageResponse } from "next/og";
import { loadFraunces } from "@/lib/og-fonts";
import { getStudioRead } from "@/lib/studioRead/persist";

export const runtime = "nodejs";
export const alt = "Your style, read by Margot";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const C = { bg: "#ECEAE5", surface: "#F6F4EF", ink: "#2D3A33", ink2: "#4D5852", ink3: "#7C857F", peach: "#B85133" };
const FALLBACK_PALETTE = ["#EFE7D8", "#C8B49A", "#8A7D6B", "#3B3730"];

export default async function Image({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const data = await getStudioRead(token);

  // Neutral branded fallback when the token is missing/expired — never crash.
  const headline = data?.result.share_card.headline ?? "Read your style";
  const oneLiner = data?.result.share_card.one_liner ?? "Post your fit. Get your archetype.";
  const palette = data?.result.share_card.palette_hexes?.length ? data.result.share_card.palette_hexes : FALLBACK_PALETTE;

  const [fraunces400, fraunces400i] = await Promise.all([loadFraunces(false, 400), loadFraunces(true, 400)]);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: C.bg,
          padding: "72px 80px",
          fontFamily: "Fraunces",
          color: C.ink,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", fontFamily: "FrauncesItalic", fontSize: 46, letterSpacing: "-0.03em" }}>
          <span>Margot</span>
          <span style={{ color: C.peach, fontFamily: "Fraunces", marginLeft: 3 }}>.</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontFamily: "Fraunces", fontSize: 116, lineHeight: 0.95, letterSpacing: "-0.045em" }}>
            {headline}
          </div>
          <div style={{ display: "flex", fontFamily: "FrauncesItalic", fontSize: 34, color: C.ink2, letterSpacing: "-0.015em", marginTop: 22 }}>
            {oneLiner}
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 38 }}>
            {palette.slice(0, 4).map((hex, i) => (
              <div key={i} style={{ display: "flex", width: 150, height: 56, borderRadius: 10, backgroundColor: hex }} />
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontFamily: "sans-serif", fontSize: 17, fontWeight: 600, color: C.ink3, letterSpacing: "0.16em", textTransform: "uppercase" }}>
            margotwardrobe.com
          </div>
          <div style={{ display: "flex", fontFamily: "sans-serif", fontSize: 14, fontWeight: 700, color: C.peach, letterSpacing: "0.18em", textTransform: "uppercase" }}>
            Read yours →
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: fraunces400, style: "normal", weight: 400 },
        { name: "FrauncesItalic", data: fraunces400i, style: "normal", weight: 400 },
      ],
    },
  );
}
