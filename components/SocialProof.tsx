import type { LangContent } from "@/lib/content";

export function SocialProof({ t }: { t: LangContent }) {
  const items = t.socialProof.items;
  if (!items || items.length === 0) return null;

  return (
    <section className="max-w-[1080px] mx-auto px-6 py-[clamp(56px,7vw,104px)]">
      <div className="mb-[clamp(24px,3vw,40px)] text-center">
        <div className="font-sans text-[11px] font-semibold tracking-wider2 uppercase text-peach">
          {t.socialProof.eyebrow}
        </div>
      </div>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => {
          const initial = (item.name?.trim()?.[0] ?? "M").toUpperCase();
          return (
            <figure
              key={i}
              className="rounded-2xl border border-warm2 bg-surface px-6 py-7 flex flex-col gap-5"
            >
              <blockquote className="font-display italic text-[clamp(17px,2vw,20px)] leading-[1.4] text-ink tracking-tight5 [text-wrap:pretty] m-0">
                “{item.quote}”
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warm text-ink font-display italic text-[16px]">
                  {initial}
                </div>
                <div className="leading-tight">
                  <div className="font-sans text-[14px] font-medium text-ink tracking-tight7">{item.name}</div>
                  <div className="font-sans text-[12px] text-ink3">{item.role}</div>
                </div>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
