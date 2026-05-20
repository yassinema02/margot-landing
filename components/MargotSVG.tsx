import type { MargotState } from "@/lib/content";

const C = {
  ink: "#2D3A33",
  inkDeep: "#1F2A26",
  iridescent: "#2E4A40",
  iridescentLight: "#3F5F52",
  white: "#FFFFFF",
  cream: "#F6F4EF",
  beak: "#B85133",
  beakShadow: "#8E3D24",
  scarfPeach: "#D88A6A",
  scarfSage: "#5F7560",
  scarfRust: "#A0421F",
};

type Crop = "full" | "portrait" | "face";

export interface MargotSVGProps {
  state?: MargotState;
  size?: number;
  showLegs?: boolean;
  crop?: Crop;
  scarfOverride?: string;
  className?: string;
}

export function MargotSVG({
  state = "considering",
  size = 200,
  showLegs = true,
  crop = "full",
  scarfOverride,
  className,
}: MargotSVGProps) {
  const viewBox =
    crop === "face" ? "20 20 130 90" : crop === "portrait" ? "0 10 150 150" : "0 0 200 220";
  const [, , vbW, vbH] = viewBox.split(" ").map(Number);
  const h = size * (vbH / vbW);
  const cropOn = crop !== "full";

  const headTilt = state === "considering" ? -5 : state === "skeptical" ? 5 : -1;
  const tailRotate = state === "pleased" ? -10 : state === "skeptical" ? -16 : -6;
  const bodyLift = state === "pleased" ? -3 : 0;

  const scarf =
    scarfOverride ??
    (state === "pleased" ? C.scarfSage : state === "skeptical" ? C.scarfRust : C.scarfPeach);
  const scarfDeep =
    state === "pleased" ? "#465944" : state === "skeptical" ? "#7A311A" : "#B8704F";

  const renderEye = () => {
    if (state === "pleased") {
      return <path d="M 58 54 Q 65 49 72 54" stroke={C.cream} strokeWidth={2} fill="none" strokeLinecap="round" />;
    }
    if (state === "skeptical") {
      return (
        <g>
          <path d="M 58 55 Q 65 58 72 55" stroke={C.cream} strokeWidth={1.8} fill="none" strokeLinecap="round" />
          <path d="M 56 50 Q 65 47 74 51" stroke={C.inkDeep} strokeWidth={1.4} fill="none" strokeLinecap="round" opacity={0.7} />
        </g>
      );
    }
    return <circle cx={65} cy={54} r={1.7} fill={C.cream} />;
  };

  const renderScarf = () => {
    if (state === "pleased") {
      return (
        <g>
          <path d="M 38 96 Q 80 108 130 102 L 135 124 Q 80 132 38 122 Z" fill={scarf} />
          <ellipse cx={86} cy={113} rx={9} ry={6} fill={scarfDeep} opacity={0.6} />
          <path d="M 38 122 Q 22 132 14 150 L 28 142 Q 38 134 40 124 Z" fill={scarf} />
          <path d="M 14 150 L 22 144 L 24 152 Z" fill={scarfDeep} opacity={0.7} />
          <path d="M 135 124 Q 144 138 148 154 L 134 144 Q 128 134 128 124 Z" fill={scarf} />
          <path d="M 148 154 L 140 148 L 138 156 Z" fill={scarfDeep} opacity={0.7} />
        </g>
      );
    }
    if (state === "skeptical") {
      return (
        <g>
          <path d="M 42 100 Q 80 106 128 100 L 128 120 Q 80 124 44 120 Z" fill={scarf} />
          <ellipse cx={86} cy={111} rx={7} ry={5} fill={scarfDeep} opacity={0.55} />
          <path d="M 44 120 L 42 134 L 50 124 Z" fill={scarf} />
        </g>
      );
    }
    return (
      <g>
        <path d="M 40 99 Q 80 106 130 100 L 132 121 Q 80 126 42 121 Z" fill={scarf} />
        <ellipse cx={86} cy={112} rx={8} ry={5} fill={scarfDeep} opacity={0.5} />
        <path d="M 42 121 Q 36 138 40 152 L 46 142 Q 50 132 48 122 Z" fill={scarf} />
        <path d="M 40 152 L 44 146 L 46 152 Z" fill={scarfDeep} opacity={0.7} />
      </g>
    );
  };

  return (
    <svg
      viewBox={viewBox}
      width={size}
      height={h}
      className={className}
      style={{ display: "block", overflow: "visible" }}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {!cropOn && (
        <g transform={`rotate(${tailRotate} 135 130)`}>
          <path
            d="M 122 118 Q 150 135 188 200 L 195 212 L 180 208 L 155 188 Q 130 168 116 142 Q 110 128 122 118 Z"
            fill={C.ink}
          />
          <path d="M 188 200 L 195 212 L 180 208 L 174 198 Z" fill={C.inkDeep} />
          <path d="M 142 162 Q 162 175 180 198 L 174 202 L 148 178 Z" fill={C.inkDeep} opacity={0.55} />
        </g>
      )}

      <g transform={`translate(0 ${bodyLift})`}>
        <path
          d="M 38 95 C 36 60 70 32 105 36 C 138 40 144 70 142 95 C 145 145 138 180 122 190 C 92 198 58 188 46 170 C 32 145 36 110 38 95 Z"
          fill={C.white}
        />
        <path
          d="M 95 75 C 130 78 150 95 152 130 C 154 165 142 184 122 188 C 102 188 92 175 90 150 C 88 120 88 95 95 75 Z"
          fill={C.ink}
        />
        <path d="M 108 110 Q 130 125 148 158" stroke={C.inkDeep} strokeWidth={1.2} fill="none" opacity={0.35} />

        {renderScarf()}

        <g transform={`rotate(${headTilt} 80 88)`}>
          <path
            d="M 42 58 C 40 28 68 22 86 24 C 110 26 118 44 116 65 C 114 84 95 92 78 91 C 58 90 44 80 42 58 Z"
            fill={C.ink}
          />
          <path
            d="M 52 42 C 65 32 100 32 112 46 C 112 58 96 60 80 60 C 64 60 52 54 52 42 Z"
            fill={C.iridescent}
            opacity={0.7}
          />
          <path
            d="M 60 36 C 72 30 95 30 106 40 C 104 48 88 50 76 48 C 66 47 60 42 60 36 Z"
            fill={C.iridescentLight}
            opacity={0.5}
          />
          <path d="M 44 62 L 12 70 L 44 80 Z" fill={C.beak} />
          <path d="M 12 70 L 44 80 L 44 75 L 24 73 Z" fill={C.beakShadow} opacity={0.9} />
          <path d="M 12 70 L 44 65" stroke={C.beakShadow} strokeWidth={0.6} opacity={0.6} />
          {renderEye()}
        </g>
      </g>

      {showLegs && !cropOn && (
        <g>
          <line x1={78} y1={190} x2={76} y2={208} stroke={C.ink} strokeWidth={2.4} strokeLinecap="round" />
          <line x1={98} y1={190} x2={100} y2={208} stroke={C.ink} strokeWidth={2.4} strokeLinecap="round" />
          <g stroke={C.ink} strokeWidth={1.8} strokeLinecap="round" fill="none">
            <path d="M 76 208 L 71 213" />
            <path d="M 76 208 L 76 214" />
            <path d="M 76 208 L 81 213" />
            <path d="M 100 208 L 95 213" />
            <path d="M 100 208 L 100 214" />
            <path d="M 100 208 L 105 213" />
          </g>
        </g>
      )}
    </svg>
  );
}
