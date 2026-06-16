// The Margot app-icon mark — the exact glyph from app/icon.svg (favicon) and the
// root opengraph-image. A self-contained rounded tile (its own ash ground), so
// it stays legible over any archetype accent. Use where a compact bird mark is
// wanted; use <MargotSVG> for the full mascot illustration.

export function MargotIcon({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true" style={{ display: "block" }}>
      <rect width="32" height="32" rx="7" fill="#ECEAE5" />
      <path d="M 9 13 C 9 7 14 5 18 5.5 C 24 6 25 11 24.5 16 C 24 21 19 22 16 22 C 12 21.5 9 18.5 9 13 Z" fill="#2D3A33" />
      <ellipse cx="17" cy="10" rx="6" ry="2" fill="#3F5F52" opacity="0.55" />
      <path d="M 9 14 L 2 16 L 9 18 Z" fill="#B85133" />
      <circle cx="14" cy="12" r="0.9" fill="#F6F4EF" />
    </svg>
  );
}
