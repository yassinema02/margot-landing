import { ImageResponse } from "next/og";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog";

export const alt = "Margot — the magpie's notes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand palette mirror.
const C = {
  bg: "#ECEAE5",
  surface: "#F6F4EF",
  warm2: "#CECABF",
  ink: "#2D3A33",
  ink2: "#4D5852",
  ink3: "#7C857F",
  peach: "#B85133",
  sageSoft: "#3F5F52",
};

// Pre-generate every slug at build time.
export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

// Fetch a single Google Fonts woff2 instance. We pull one regular + one italic
// of Fraunces so the wordmark renders italic and the title renders upright,
// matching the homepage register.
async function loadFraunces(italic: boolean, weight: number): Promise<ArrayBuffer> {
  // Satori supports TTF/OTF/WOFF natively, not WOFF2. Google Fonts only serves
  // WOFF2 now, so we pull TTF from fontsource via jsdelivr instead. Same
  // glyphs, no extra decompressor dep.
  const style = italic ? "italic" : "normal";
  const url = `https://cdn.jsdelivr.net/fontsource/fonts/fraunces@latest/latin-${weight}-${style}.ttf`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fraunces TTF ${weight}/${style} fetch failed: ${res.status}`);
  return res.arrayBuffer();
}

export default async function Image({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  const title = post?.frontmatter.title ?? "The magpie's notes";
  const readingTime = post?.frontmatter.readingTime;

  const [fraunces400, fraunces400i] = await Promise.all([
    loadFraunces(false, 400),
    loadFraunces(true, 400),
  ]);

  // Tight letter spacing on titles to mimic the homepage's tracking-tight2.
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: C.bg,
          padding: "72px 80px",
          fontFamily: "Fraunces",
          color: C.ink,
        }}
      >
        {/* Top row — wordmark left, eyebrow right */}
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
              alignItems: "baseline",
              fontFamily: "FrauncesItalic",
              fontSize: 44,
              color: C.ink,
              letterSpacing: "-0.03em",
            }}
          >
            <span>Margot</span>
            <span style={{ color: C.peach, fontFamily: "Fraunces", marginLeft: 2 }}>.</span>
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "sans-serif",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: C.peach,
            }}
          >
            From the magpie&apos;s notes
          </div>
        </div>

        {/* Title — middle */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: 1040,
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Fraunces",
              fontSize: title.length > 60 ? 70 : 84,
              lineHeight: 1.04,
              letterSpacing: "-0.035em",
              color: C.ink,
              whiteSpace: "pre-wrap",
            }}
          >
            {title}
          </div>
        </div>

        {/* Footer row — small magpie + meta */}
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
              flexDirection: "column",
              gap: 4,
            }}
          >
            <div
              style={{
                display: "flex",
                fontFamily: "sans-serif",
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: "0.04em",
                color: C.ink3,
              }}
            >
              margotwardrobe.com
            </div>
            {readingTime ? (
              <div
                style={{
                  display: "flex",
                  fontFamily: "FrauncesItalic",
                  fontSize: 18,
                  color: C.ink2,
                }}
              >
                {readingTime} min read
              </div>
            ) : null}
          </div>

          {/* Magpie face — same simplified mark as /icon.svg */}
          <svg width={92} height={92} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
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
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: fraunces400, style: "normal", weight: 400 },
        { name: "FrauncesItalic", data: fraunces400i, style: "normal", weight: 400 },
      ],
    }
  );
}
