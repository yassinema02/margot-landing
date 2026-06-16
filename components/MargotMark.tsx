// The Margot wordmark — the canonical site logo. Matches Header / Footer / Hero
// exactly: "Margot" in Fraunces italic with a non-italic peach full stop.
// Pass `color`/`dotColor` to render it over an archetype accent.

export function MargotMark({
  fontSize = 24,
  color,
  dotColor,
  className,
}: {
  fontSize?: number;
  color?: string;
  dotColor?: string;
  className?: string;
}) {
  return (
    <span
      className={`font-display italic font-normal opsz-96 ${color ? "" : "text-ink"} ${className ?? ""}`}
      style={{ fontSize, letterSpacing: "-0.02em", lineHeight: 1, ...(color ? { color } : {}) }}
    >
      Margot
      <span className={dotColor ? "not-italic" : "text-peach not-italic"} style={dotColor ? { color: dotColor } : undefined}>
        .
      </span>
    </span>
  );
}
