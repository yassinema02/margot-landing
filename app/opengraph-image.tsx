import { ImageResponse } from "next/og";
import { loadFraunces } from "@/lib/og-fonts";

export const alt = "Margot — the magpie who reads your closet";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand palette mirror.
const C = {
  bg: "#ECEAE5",
  surface: "#F6F4EF",
  ink: "#2D3A33",
  ink2: "#4D5852",
  ink3: "#7C857F",
  peach: "#B85133",
  sageSoft: "#3F5F52",
};

export default async function Image() {
  const [fraunces400, fraunces400i] = await Promise.all([
    loadFraunces(false, 400),
    loadFraunces(true, 400),
  ]);

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
        {/* Top row — wordmark left, magpie right */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              fontFamily: "FrauncesItalic",
              fontSize: 52,
              letterSpacing: "-0.03em",
            }}
          >
            <span>Margot</span>
            <span
              style={{
                color: C.peach,
                fontFamily: "Fraunces",
                marginLeft: 3,
              }}
            >
              .
            </span>
          </div>

          <svg
            width={92}
            height={92}
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="32" height="32" rx="7" fill={C.surface} />
            <path
              d="M 9 13 C 9 7 14 5 18 5.5 C 24 6 25 11 24.5 16 C 24 21 19 22 16 22 C 12 21.5 9 18.5 9 13 Z"
              fill={C.ink}
            />
            <ellipse cx={17} cy={10} rx={6} ry={2} fill={C.sageSoft} opacity={0.55} />
            <path d="M 9 14 L 2 16 L 9 18 Z" fill={C.peach} />
            <circle cx={14} cy={12} r={0.9} fill={C.surface} />
          </svg>
        </div>

        {/* Middle — H1 (two lines, second word italic) + small subline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Fraunces",
              fontSize: 124,
              lineHeight: 0.95,
              letterSpacing: "-0.045em",
            }}
          >
            Your wardrobe,
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "FrauncesItalic",
              fontSize: 124,
              lineHeight: 0.95,
              letterSpacing: "-0.045em",
              marginTop: 4,
            }}
          >
            observed.
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "FrauncesItalic",
              fontSize: 26,
              color: C.ink2,
              letterSpacing: "-0.015em",
              marginTop: 28,
            }}
          >
            AI wardrobe app · daily outfits · for what you already own.
          </div>
        </div>

        {/* Bottom row — domain + live badge */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "sans-serif",
              fontSize: 17,
              fontWeight: 600,
              color: C.ink3,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            margotwardrobe.com
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "sans-serif",
              fontSize: 14,
              fontWeight: 700,
              color: C.peach,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Now on the App Store
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
