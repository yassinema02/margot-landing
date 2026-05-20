// Vestiaire design tokens — cribbed from /projects/.../Vestiaire Redesign.
// Ash & Moss direction. Cool ash neutral. Deep moss ink. Rust accent.
// Fraunces (display, opsz 96) + Inter Tight (everything else).

const T = {
  bg:        '#ECEAE5',
  surface:   '#F6F4EF',
  warm:      '#DDDAD3',
  warm2:     '#CECABF',

  ink:       '#2D3A33',
  ink2:      '#4D5852',
  ink3:      '#7C857F',
  ink4:      '#B0B5B0',
  ink5:      '#D8D6D0',

  walnut:    '#5C6B5E',
  peach:     '#B85133',
  sage:      '#5F7560',
  rust:      '#A0421F',
};

// Display — Fraunces serif, the editorial voice.
function Display({ children, size = 32, weight = 400, italic = false, style }) {
  return (
    <h2 style={{
      margin: 0,
      fontFamily: '"Fraunces", serif',
      fontWeight: weight, fontSize: size, lineHeight: 1.05,
      letterSpacing: '-0.025em', color: T.ink,
      fontVariationSettings: '"opsz" 96, "SOFT" 50',
      fontStyle: italic ? 'italic' : 'normal',
      ...style,
    }}>{children}</h2>
  );
}

function Eyebrow({ children, color, style }) {
  return (
    <div style={{
      fontFamily: '"Inter Tight", sans-serif',
      fontSize: 10, fontWeight: 600,
      letterSpacing: '0.14em', textTransform: 'uppercase',
      color: color || T.ink3, ...style,
    }}>{children}</div>
  );
}

function Body({ children, size = 14, color, weight = 400, style }) {
  return (
    <p style={{
      margin: 0,
      fontFamily: '"Inter Tight", sans-serif',
      fontSize: size, fontWeight: weight, lineHeight: 1.55,
      color: color || T.ink2,
      letterSpacing: '-0.005em',
      textWrap: 'pretty',
      ...style,
    }}>{children}</p>
  );
}

// Caption — small text + label rows
function SmallCaps({ children, color, style }) {
  return (
    <span style={{
      fontFamily: '"Inter Tight", sans-serif',
      fontSize: 11, fontWeight: 500, color: color || T.ink3,
      letterSpacing: '-0.005em', ...style,
    }}>{children}</span>
  );
}

// Mono — for hex values etc
function Mono({ children, style }) {
  return (
    <span style={{
      fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
      fontSize: 11, color: T.ink2, letterSpacing: '0.01em',
      ...style,
    }}>{children}</span>
  );
}

window.T = T;
window.Display = Display;
window.Eyebrow = Eyebrow;
window.Body = Body;
window.SmallCaps = SmallCaps;
window.Mono = Mono;
