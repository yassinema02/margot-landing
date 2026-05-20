import type { LangContent } from "@/lib/content";

export function Pricing({ t }: { t: LangContent }) {
  return (
    <section className="max-w-[820px] mx-auto px-6 py-[clamp(72px,9vw,128px)] text-center">
      <div className="flex flex-col gap-3.5">
        {t.pricing.map((line, i) => (
          <div
            key={i}
            className={`font-display italic font-normal opsz-96 text-[clamp(20px,2.4vw,30px)] leading-[1.4] tracking-tight5 [text-wrap:pretty] ${
              i === 0 ? "text-ink" : "text-ink2"
            }`}
          >
            {line}
          </div>
        ))}
      </div>
    </section>
  );
}
