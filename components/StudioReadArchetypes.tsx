import { ARCHETYPES } from "@/lib/studioRead/archetypes";
import type { Locale } from "@/lib/studioRead/types";

const COPY = {
  en: {
    title: "Which styles can Margot recognise?",
    intro: "From one outfit photo, Margot matches your look to the closest of eight style families, then suggests a palette and the pieces that anchor it.",
    kit: "Pieces that anchor it:",
  },
  fr: {
    title: "Quels styles Margot sait-elle reconnaître ?",
    intro: "À partir d'une seule photo de tenue, Margot rapproche ton look de la plus proche de ces huit familles de style, puis propose une palette et les pièces qui la structurent.",
    kit: "Les pièces qui la structurent :",
  },
} as const;

/**
 * Server-rendered description of the style families the tool can return, so
 * the page carries real, crawlable content even before the interactive tool
 * hydrates. Sourced from the same ARCHETYPES table the tool uses.
 */
export function StudioReadArchetypes({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  return (
    <section aria-labelledby="archetypes-title" className="mx-auto max-w-[1100px] px-6 pb-20 sm:px-14">
      <h2 id="archetypes-title" className="font-display font-normal text-ink opsz-96 text-[clamp(26px,3vw,36px)] leading-[1.15] tracking-tight4 m-0 [text-wrap:balance]">
        {t.title}
      </h2>
      <p className="mt-4 max-w-[640px] font-sans text-[16px] leading-[1.65] text-ink2 tracking-tight7 [text-wrap:pretty]">{t.intro}</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 list-none p-0">
        {Object.entries(ARCHETYPES).map(([id, a]) => (
          <li key={id} className="rounded-2xl border border-warm2 bg-surface p-5">
            <h3 className="m-0 font-display font-normal text-ink opsz-96 text-[20px] leading-[1.25] tracking-tight4">{a.label[locale]}</h3>
            <p className="mt-2 mb-3 font-sans text-[15px] leading-[1.55] text-ink2 [text-wrap:pretty]">{a.identity_line[locale]}</p>
            <p className="m-0 font-sans text-[13px] leading-[1.5] text-ink3 [text-wrap:pretty]">
              <span className="font-semibold text-ink">{t.kit}</span>{" "}
              {a.starter_kit.map((p) => p.piece[locale]).join(", ")}.
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
