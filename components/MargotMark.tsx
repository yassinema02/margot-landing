// The constant Margot signature — the magpie + `margot.` wordmark with the rust
// full stop. This is the brand-recognition anchor that rides over every
// archetype accent in the viral loop. Pure SVG; safe in server + client trees.

export function MargotMark({
  size = 40,
  tone = "ink",
  accent = "#B85133",
  showWordmark = false,
  wordSize,
  wordColor,
}: {
  size?: number;
  tone?: "ink" | "cream";
  accent?: string;
  showWordmark?: boolean;
  wordSize?: number;
  wordColor?: string;
}) {
  const ink = "#2D3A33";
  const cream = "#F6F4EF";
  const irid = "#2E4A40";
  const body = tone === "cream" ? cream : ink;
  const blade = tone === "cream" ? ink : cream;
  const wing = tone === "cream" ? "#D8D4CB" : irid;
  const ws = wordSize ?? Math.round(size * 0.62);
  const wc = wordColor ?? (tone === "cream" ? cream : ink);
  const w = Math.round((size * 100) / 108);

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
      <svg width={w} height={size} viewBox="0 0 100 108" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", overflow: "visible" }}>
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
      {showWordmark && (
        <span className="font-display" style={{ fontWeight: 500, fontSize: ws, letterSpacing: "-0.03em", lineHeight: 1, color: wc }}>
          margot<span style={{ color: accent }}>.</span>
        </span>
      )}
    </span>
  );
}
