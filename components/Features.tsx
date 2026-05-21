import type { LangContent } from "@/lib/content";

export function Features({ t }: { t: LangContent }) {
  return (
    <section className="max-w-[1280px] mx-auto px-6 py-[clamp(48px,6vw,88px)]">
      <div className="grid gap-[clamp(20px,2.5vw,32px)] [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
        {t.features.map((f, i) => (
          <article
            key={i}
            className="px-[clamp(24px,2.5vw,32px)] py-[clamp(28px,3vw,40px)] bg-surface border border-warm2 rounded-2xl flex flex-col"
          >
            <div className="font-display italic text-ink3 opsz-96 text-[13px] tracking-tight5 opacity-50 mb-1">
              {f.epigraph}
            </div>
            <div className="font-sans text-[11px] font-semibold tracking-wider2 uppercase text-peach mb-5">
              {f.label}
            </div>
            <h3 className="font-display font-normal text-ink opsz-96 m-0 text-[clamp(22px,2.4vw,26px)] leading-[1.15] tracking-tight4 mb-3 [text-wrap:balance]">
              {f.title}
            </h3>
            <p className="font-sans text-[15px] leading-relaxed text-ink2 tracking-tight7 [text-wrap:pretty] m-0">
              {f.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
