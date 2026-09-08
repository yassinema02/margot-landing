import type { Metadata } from "next";
import Link from "next/link";

const DEEP_LINK = "margot://weekly-recap";

export const metadata: Metadata = {
  title: "Open your weekly recap · Margot",
  description: "Open your weekly wardrobe recap in the Margot app.",
  alternates: { canonical: "/weekly-recap" },
  robots: { index: false, follow: false },
};

export default function WeeklyRecapRedirectPage() {
  return (
    <main className="bg-bg text-ink min-h-screen px-6 py-[clamp(48px,7vw,96px)]">
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace(${JSON.stringify(DEEP_LINK)});`,
        }}
      />
      <article className="max-w-[620px] mx-auto">
        <Link
          href="/"
          className="font-sans text-[12px] font-medium tracking-tight7 text-ink3 hover:text-ink no-underline"
        >
          ← Back to Margot
        </Link>

        <header className="mt-8 mb-8">
          <div className="font-sans text-[11px] font-semibold tracking-wider2 uppercase text-peach mb-4">
            Weekly recap
          </div>
          <h1 className="font-display font-normal text-ink opsz-144 m-0 text-[clamp(40px,5.5vw,68px)] leading-[1.02] tracking-tight2 [text-wrap:balance]">
            Opening <em>Margot</em>.
          </h1>
          <p className="mt-5 font-display italic text-ink3 opsz-96 text-[clamp(16px,1.7vw,19px)] leading-[1.45] tracking-tight5 [text-wrap:pretty]">
            If the app did not open automatically, tap below to open your weekly recap.
          </p>
        </header>

        <a
          href={DEEP_LINK}
          className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 font-sans text-[14px] font-semibold text-white no-underline hover:opacity-90"
        >
          Open in Margot
        </a>
      </article>
    </main>
  );
}
