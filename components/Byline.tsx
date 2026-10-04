import Link from "next/link";
import { AUTHOR } from "@/lib/author";

type Props = {
  lang: "en" | "fr";
  /** ISO date (YYYY-MM-DD) of first publication. */
  published: string;
  /** ISO date of the last substantive edit, shown when it differs from `published`. */
  updated?: string;
  /** Label for `updated`: comparison pages say "checked", articles say "updated". */
  updatedLabel?: "updated" | "checked";
  readingTime?: number;
};

function formatDate(iso: string, lang: "en" | "fr") {
  // Noon UTC keeps the calendar day stable whatever the build machine's zone.
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

const COPY = {
  en: { by: "By", published: "Published", updated: "Updated", checked: "Facts checked", read: "min read" },
  fr: { by: "Par", published: "Publié le", updated: "Mis à jour le", checked: "Faits vérifiés le", read: "min de lecture" },
} as const;

/** Visible author + dates line. Pair it with authorJsonLd() and the same dates in the page's JSON-LD. */
export function Byline({ lang, published, updated, updatedLabel = "updated", readingTime }: Props) {
  const t = COPY[lang];
  const showUpdated = updated && updated !== published;
  return (
    <p className="mt-5 font-sans text-[12px] tracking-wider2 uppercase text-ink3 [text-wrap:pretty]">
      {t.by}{" "}
      <Link href={AUTHOR.url} className="text-ink no-underline border-b border-peach/60 hover:border-peach">
        {AUTHOR.name}
      </Link>
      , {AUTHOR.role[lang]} <span aria-hidden="true">·</span> {t.published}{" "}
      <time dateTime={published}>{formatDate(published, lang)}</time>
      {showUpdated && (
        <>
          {" "}
          <span aria-hidden="true">·</span> {t[updatedLabel]}{" "}
          <time dateTime={updated}>{formatDate(updated, lang)}</time>
        </>
      )}
      {readingTime ? (
        <>
          {" "}
          <span aria-hidden="true">·</span> {readingTime} {t.read}
        </>
      ) : null}
    </p>
  );
}
