import Link from "next/link";
import { Footer } from "@/components/Footer";

/**
 * Header + footer for editorial pages (journal, guides, comparisons). Gives
 * every article the same way back home and the footer's links to the other
 * guides and comparisons, so no content page is a dead end.
 */
export function ArticleShell({ lang, children }: { lang: "en" | "fr"; children: React.ReactNode }) {
  const fr = lang === "fr";
  const home = fr ? "/fr" : "/";
  return (
    <>
      <header className="sticky top-0 z-50 bg-bg/85 backdrop-blur-md backdrop-saturate-150 border-b border-warm2 px-6 py-3.5 flex justify-between items-center">
        <Link href={home} className="no-underline" aria-label={fr ? "Accueil Margot" : "Margot home"}>
          <div className="font-display italic font-normal text-2xl tracking-tight3 text-ink opsz-96">
            Margot<span className="text-peach not-italic">.</span>
          </div>
        </Link>
        <Link
          href={home}
          className="font-sans text-[11px] font-semibold tracking-wider2 uppercase px-3 py-1.5 rounded-full border border-ink text-ink no-underline hover:opacity-80"
        >
          {fr ? "← Retour à Margot" : "← Back to Margot"}
        </Link>
      </header>

      {children}

      <Footer lang={lang} />
    </>
  );
}
