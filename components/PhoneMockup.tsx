import { PhoneScreen, type ScreenVariant } from "./PhoneScreen";

type Size = "hero" | "step" | "feature";

interface Props {
  variant: ScreenVariant;
  alt: string;
  size: Size;
}

const SIZE_MAP: Record<Size, string> = {
  hero: "w-72",     // 288px
  step: "w-56",     // 224px
  feature: "w-48",  // 192px
};

export function PhoneMockup({ variant, alt, size }: Props) {
  return (
    <div
      className={`${SIZE_MAP[size]} relative shrink-0 rounded-[2.5rem] bg-neutral-900 p-[6px] shadow-[0_22px_60px_-20px_rgba(45,58,51,0.45)]`}
      style={{ aspectRatio: "9 / 19" }}
    >
      {/* Notch */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[10px] z-10 h-[18px] w-[80px] -translate-x-1/2 rounded-full bg-neutral-900"
      />
      {/* Inner screen */}
      <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-bg">
        <PhoneScreen variant={variant} alt={alt} />
      </div>
    </div>
  );
}
