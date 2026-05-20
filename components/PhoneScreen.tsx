// SVG mock screens shown inside <PhoneMockup>. Designed to scale crisply
// at hero (288px), step (224px), and feature (192px) sizes via viewBox.
//
// Brand palette mirrors tailwind.config.ts.

const C = {
  bg: "#ECEAE5",
  surface: "#F6F4EF",
  warm: "#DDDAD3",
  warm2: "#CECABF",
  ink: "#2D3A33",
  ink2: "#4D5852",
  ink3: "#7C857F",
  ink4: "#B0B5B0",
  ink5: "#D8D6D0",
  sage: "#5F7560",
  sageSoft: "#B8C2B0",
  peach: "#B85133",
  peachSoft: "#D9A38C",
  rust: "#A0421F",
  cream: "#F6F4EF",
};

const FONT_SERIF = "var(--font-fraunces), 'Fraunces', serif";
const FONT_SANS = "var(--font-inter-tight), 'Inter Tight', system-ui, sans-serif";

export type ScreenVariant = "today" | "grid" | "capture" | "check";

interface Props {
  variant: ScreenVariant;
  alt: string;
}

// Viewbox is 9:19, matching the bezel inner aspect.
const VB_W = 360;
const VB_H = 760;

function StatusBar({ tint = C.ink }: { tint?: string }) {
  return (
    <g>
      <text x={28} y={36} fontFamily={FONT_SANS} fontSize={13} fontWeight={600} fill={tint} letterSpacing="0.3">
        9:41
      </text>
      {/* Signal dots */}
      <g transform="translate(290 24)" fill={tint}>
        <rect x={0} y={4} width={3} height={8} rx={1} />
        <rect x={5} y={2} width={3} height={10} rx={1} />
        <rect x={10} y={0} width={3} height={12} rx={1} />
      </g>
      {/* Wifi */}
      <g transform="translate(312 22)" fill="none" stroke={tint} strokeWidth={1.6} strokeLinecap="round">
        <path d="M 0 10 Q 7 4 14 10" />
        <path d="M 3 13 Q 7 10 11 13" />
        <circle cx={7} cy={16} r={1.2} fill={tint} stroke="none" />
      </g>
      {/* Battery */}
      <g transform="translate(330 22)">
        <rect x={0} y={2} width={20} height={10} rx={2.5} fill="none" stroke={tint} strokeWidth={1.2} />
        <rect x={2} y={4} width={14} height={6} rx={1} fill={tint} />
        <rect x={20} y={5} width={1.5} height={4} rx={0.5} fill={tint} />
      </g>
    </g>
  );
}

function TodayScreen() {
  return (
    <>
      <rect width={VB_W} height={VB_H} fill={C.bg} />
      <StatusBar />

      <text x={28} y={92} fontFamily={FONT_SANS} fontSize={11} fontWeight={700} letterSpacing="2" fill={C.peach}>
        TODAY · 21 MAY
      </text>
      <text x={28} y={138} fontFamily={FONT_SERIF} fontSize={32} fontStyle="italic" fill={C.ink}>
        Cream tee,
      </text>
      <text x={28} y={172} fontFamily={FONT_SERIF} fontSize={32} fontStyle="italic" fill={C.ink}>
        pleated linen.
      </text>

      {/* Weather pill */}
      <g transform="translate(28 196)">
        <rect width={130} height={28} rx={14} fill={C.surface} stroke={C.warm2} />
        <circle cx={16} cy={14} r={5} fill={C.peachSoft} />
        <text x={30} y={18} fontFamily={FONT_SANS} fontSize={11} fontWeight={500} fill={C.ink2}>
          18° · cloudy · paris
        </text>
      </g>

      {/* Outfit card */}
      <g transform="translate(28 244)">
        <rect width={304} height={328} rx={22} fill={C.surface} stroke={C.warm2} />

        {/* 2x2 grid of items */}
        {/* Top — cream tee */}
        <g transform="translate(20 20)">
          <rect width={126} height={126} rx={14} fill={C.warm} />
          <path d="M 28 28 L 50 18 L 76 18 L 98 28 L 92 44 L 76 38 L 76 102 L 50 102 L 50 38 L 34 44 Z" fill={C.cream} stroke={C.ink5} strokeWidth={1} />
        </g>
        {/* Pants — sage */}
        <g transform="translate(158 20)">
          <rect width={126} height={126} rx={14} fill={C.warm} />
          <path d="M 44 18 L 82 18 L 88 50 L 80 108 L 68 108 L 64 60 L 60 108 L 48 108 L 42 50 Z" fill={C.sageSoft} stroke={C.ink5} strokeWidth={1} />
        </g>
        {/* Shoes — loafers */}
        <g transform="translate(20 158)">
          <rect width={126} height={126} rx={14} fill={C.warm} />
          <ellipse cx={42} cy={86} rx={26} ry={12} fill={C.peachSoft} stroke={C.ink5} strokeWidth={1} />
          <ellipse cx={86} cy={86} rx={26} ry={12} fill={C.peachSoft} stroke={C.ink5} strokeWidth={1} />
          <rect x={36} y={72} width={12} height={6} rx={1} fill={C.ink5} opacity={0.6} />
          <rect x={80} y={72} width={12} height={6} rx={1} fill={C.ink5} opacity={0.6} />
        </g>
        {/* Jacket */}
        <g transform="translate(158 158)">
          <rect width={126} height={126} rx={14} fill={C.warm} />
          <path d="M 30 24 L 48 18 L 64 32 L 80 18 L 96 24 L 100 90 L 92 108 L 32 108 L 24 90 Z" fill={C.warm2} stroke={C.ink5} strokeWidth={1} />
          <line x1={64} y1={32} x2={64} y2={108} stroke={C.ink5} strokeWidth={1} />
        </g>
      </g>

      <text x={28} y={616} fontFamily={FONT_SERIF} fontSize={13} fontStyle="italic" fill={C.ink3}>
        Soft palette today — you’ve leaned
      </text>
      <text x={28} y={634} fontFamily={FONT_SERIF} fontSize={13} fontStyle="italic" fill={C.ink3}>
        on navy three times this week.
      </text>

      {/* CTA */}
      <g transform="translate(28 666)">
        <rect width={304} height={52} rx={26} fill={C.ink} />
        <text x={152} y={32} fontFamily={FONT_SANS} fontSize={14} fontWeight={600} fill={C.cream} textAnchor="middle">
          Wear this look →
        </text>
      </g>
    </>
  );
}

function GridScreen() {
  const tiles: Array<{ x: number; y: number; fill: string; shape: "tee" | "pants" | "shoe" | "coat" }> = [
    { x: 0, y: 0, fill: C.warm, shape: "tee" },
    { x: 1, y: 0, fill: C.sageSoft, shape: "tee" },
    { x: 2, y: 0, fill: C.peachSoft, shape: "tee" },
    { x: 0, y: 1, fill: C.ink5, shape: "pants" },
    { x: 1, y: 1, fill: C.warm2, shape: "pants" },
    { x: 2, y: 1, fill: C.sageSoft, shape: "pants" },
    { x: 0, y: 2, fill: C.cream, shape: "coat" },
    { x: 1, y: 2, fill: C.peachSoft, shape: "shoe" },
    { x: 2, y: 2, fill: C.warm, shape: "shoe" },
    { x: 0, y: 3, fill: C.sageSoft, shape: "coat" },
    { x: 1, y: 3, fill: C.warm2, shape: "tee" },
    { x: 2, y: 3, fill: C.ink5, shape: "pants" },
  ];

  return (
    <>
      <rect width={VB_W} height={VB_H} fill={C.bg} />
      <StatusBar />

      <text x={28} y={92} fontFamily={FONT_SANS} fontSize={11} fontWeight={700} letterSpacing="2" fill={C.peach}>
        WARDROBE
      </text>
      <text x={28} y={134} fontFamily={FONT_SERIF} fontSize={30} fontStyle="italic" fill={C.ink}>
        87 pieces.
      </text>
      <text x={28} y={158} fontFamily={FONT_SANS} fontSize={12} fill={C.ink3}>
        12 you haven’t worn in 60 days.
      </text>

      {/* Filter chips */}
      {[
        { x: 28, w: 50, label: "All", active: true },
        { x: 86, w: 58, label: "Tops", active: false },
        { x: 152, w: 78, label: "Bottoms", active: false },
        { x: 238, w: 64, label: "Shoes", active: false },
      ].map((chip, i) => (
        <g key={i} transform={`translate(${chip.x} 184)`}>
          <rect width={chip.w} height={28} rx={14} fill={chip.active ? C.ink : C.surface} stroke={chip.active ? C.ink : C.warm2} />
          <text x={chip.w / 2} y={18} fontFamily={FONT_SANS} fontSize={11} fontWeight={500} fill={chip.active ? C.cream : C.ink2} textAnchor="middle">
            {chip.label}
          </text>
        </g>
      ))}

      {/* Item grid 3 cols × 4 rows */}
      {tiles.map((tile, i) => {
        const cellW = 96;
        const cellH = 116;
        const gap = 8;
        const gridX = 28 + tile.x * (cellW + gap);
        const gridY = 232 + tile.y * (cellH + gap);
        return (
          <g key={i} transform={`translate(${gridX} ${gridY})`}>
            <rect width={cellW} height={cellH} rx={12} fill={C.surface} stroke={C.warm2} />
            {tile.shape === "tee" && (
              <path d="M 22 22 L 38 14 L 58 14 L 74 22 L 70 34 L 58 30 L 58 86 L 38 86 L 38 30 L 26 34 Z" fill={tile.fill} stroke={C.ink5} strokeWidth={0.8} />
            )}
            {tile.shape === "pants" && (
              <path d="M 34 14 L 62 14 L 66 38 L 60 92 L 50 92 L 48 50 L 46 92 L 36 92 L 30 38 Z" fill={tile.fill} stroke={C.ink5} strokeWidth={0.8} />
            )}
            {tile.shape === "shoe" && (
              <>
                <ellipse cx={48} cy={70} rx={22} ry={10} fill={tile.fill} stroke={C.ink5} strokeWidth={0.8} />
                <rect x={40} y={56} width={16} height={6} rx={1} fill={C.ink5} opacity={0.5} />
              </>
            )}
            {tile.shape === "coat" && (
              <path d="M 26 22 L 38 14 L 50 26 L 62 14 L 74 22 L 76 80 L 70 92 L 30 92 L 24 80 Z" fill={tile.fill} stroke={C.ink5} strokeWidth={0.8} />
            )}
          </g>
        );
      })}
    </>
  );
}

function CaptureScreen() {
  return (
    <>
      <rect width={VB_W} height={VB_H} fill={C.ink} />
      <StatusBar tint={C.cream} />

      <text x={28} y={92} fontFamily={FONT_SANS} fontSize={11} fontWeight={700} letterSpacing="2" fill={C.peachSoft}>
        ADD A PIECE
      </text>
      <text x={28} y={124} fontFamily={FONT_SERIF} fontSize={22} fontStyle="italic" fill={C.cream}>
        Hold steady.
      </text>

      {/* Viewfinder */}
      <g transform="translate(40 168)">
        <rect width={280} height={400} rx={18} fill="none" stroke={C.cream} strokeWidth={1} opacity={0.3} />
        {/* corners */}
        {[
          { x: 0, y: 0, d: "M 0 28 L 0 0 L 28 0" },
          { x: 252, y: 0, d: "M 0 0 L 28 0 L 28 28" },
          { x: 0, y: 372, d: "M 0 0 L 0 28 L 28 28" },
          { x: 252, y: 372, d: "M 0 28 L 28 28 L 28 0" },
        ].map((c, i) => (
          <path key={i} transform={`translate(${c.x} ${c.y})`} d={c.d} fill="none" stroke={C.cream} strokeWidth={2.4} strokeLinecap="round" />
        ))}

        {/* Garment silhouette — wool sweater */}
        <g transform="translate(60 90)">
          <path
            d="M 30 30 L 60 10 L 100 10 L 130 30 L 150 80 L 130 100 L 130 220 L 30 220 L 30 100 L 10 80 Z"
            fill={C.warm}
            opacity={0.85}
          />
          <path d="M 30 30 Q 80 50 130 30" stroke={C.warm2} strokeWidth={2} fill="none" />
          <path d="M 80 20 L 80 220" stroke={C.warm2} strokeWidth={0.8} opacity={0.5} />
        </g>

        {/* Detection chip */}
        <g transform="translate(36 16)">
          <rect width={150} height={30} rx={15} fill={C.cream} />
          <circle cx={14} cy={15} r={4} fill={C.sage} />
          <text x={26} y={19} fontFamily={FONT_SANS} fontSize={11} fontWeight={600} fill={C.ink}>
            wool · cream · sweater
          </text>
        </g>
      </g>

      {/* Capture button */}
      <g transform="translate(180 638)">
        <circle r={32} fill="none" stroke={C.cream} strokeWidth={3} />
        <circle r={24} fill={C.cream} />
      </g>
      <text x={180} y={712} fontFamily={FONT_SANS} fontSize={11} fill={C.cream} textAnchor="middle" opacity={0.7}>
        tap to add · or pick from camera roll
      </text>
    </>
  );
}

function CheckScreen() {
  return (
    <>
      <rect width={VB_W} height={VB_H} fill={C.bg} />
      <StatusBar />

      <text x={28} y={92} fontFamily={FONT_SANS} fontSize={11} fontWeight={700} letterSpacing="2" fill={C.peach}>
        CHECK BEFORE YOU BUY
      </text>

      {/* Product card */}
      <g transform="translate(28 110)">
        <rect width={304} height={92} rx={18} fill={C.surface} stroke={C.warm2} />
        <rect x={14} y={14} width={64} height={64} rx={10} fill={C.warm} />
        {/* blazer silhouette */}
        <path d="M 36 28 L 46 22 L 56 32 L 56 70 L 36 70 Z" fill={C.warm2} transform="translate(8 4)" />
        <text x={94} y={38} fontFamily={FONT_SERIF} fontSize={16} fontStyle="italic" fill={C.ink}>
          Linen blazer
        </text>
        <text x={94} y={56} fontFamily={FONT_SANS} fontSize={11} fill={C.ink3}>
          arket · oat · €189
        </text>
        <text x={94} y={76} fontFamily={FONT_SANS} fontSize={10} fontWeight={600} letterSpacing="1.2" fill={C.sage}>
          PAIRS WITH 12 ITEMS
        </text>
      </g>

      {/* Big score */}
      <g transform="translate(180 280)">
        <circle r={70} fill="none" stroke={C.warm2} strokeWidth={6} />
        <circle
          r={70}
          fill="none"
          stroke={C.sage}
          strokeWidth={6}
          strokeDasharray={`${(82 / 100) * 2 * Math.PI * 70} ${2 * Math.PI * 70}`}
          strokeLinecap="round"
          transform="rotate(-90)"
        />
        <text x={0} y={6} fontFamily={FONT_SERIF} fontSize={48} fontStyle="italic" fill={C.ink} textAnchor="middle">
          82
        </text>
        <text x={0} y={28} fontFamily={FONT_SANS} fontSize={10} fontWeight={600} letterSpacing="1.4" fill={C.ink3} textAnchor="middle">
          GOOD MATCH
        </text>
      </g>

      {/* Insight rows */}
      <g transform="translate(28 410)">
        {[
          { ok: true, label: "Fills a layering gap" },
          { ok: true, label: "Works with 4 pairs of trousers" },
          { ok: false, label: "You own 2 similar in cream" },
        ].map((row, i) => (
          <g key={i} transform={`translate(0 ${i * 64})`}>
            <rect width={304} height={52} rx={14} fill={C.surface} stroke={C.warm2} />
            <circle cx={28} cy={26} r={11} fill={row.ok ? C.sage : C.peach} opacity={0.18} />
            {row.ok ? (
              <path d="M 22 26 L 26 30 L 34 22" transform="translate(0 0)" stroke={row.ok ? C.sage : C.peach} strokeWidth={2.4} fill="none" strokeLinecap="round" />
            ) : (
              <text x={28} y={31} fontFamily={FONT_SANS} fontSize={14} fontWeight={700} fill={C.peach} textAnchor="middle">!</text>
            )}
            <text x={54} y={31} fontFamily={FONT_SANS} fontSize={12} fontWeight={500} fill={C.ink2}>
              {row.label}
            </text>
          </g>
        ))}
      </g>

      <text x={180} y={640} fontFamily={FONT_SERIF} fontSize={13} fontStyle="italic" fill={C.ink3} textAnchor="middle">
        Margot says: borderline.
      </text>
      <text x={180} y={660} fontFamily={FONT_SERIF} fontSize={13} fontStyle="italic" fill={C.ink3} textAnchor="middle">
        Sleep on it.
      </text>
    </>
  );
}

export function PhoneScreen({ variant, alt }: Props) {
  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      role="img"
      aria-label={alt}
    >
      {variant === "today" && <TodayScreen />}
      {variant === "grid" && <GridScreen />}
      {variant === "capture" && <CaptureScreen />}
      {variant === "check" && <CheckScreen />}
    </svg>
  );
}
