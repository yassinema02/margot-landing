import type { Metadata } from "next";
import Link from "next/link";
import { RootShell } from "@/components/RootShell";

// Global 404. With two root layouts (route groups (en) and (fr)) Next has no
// single root layout to wrap this in, so it renders its own <html>/<body>
// through RootShell. Bilingual on purpose: the URL alone doesn't tell us the
// visitor's language. Never indexed (Next adds noindex to 404s itself).
export const metadata: Metadata = {
  title: "Page introuvable · Page not found · Margot",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <RootShell lang="en">
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-bg text-ink">
        <Link href="/" className="no-underline mb-10">
          <span className="font-display italic text-3xl tracking-tight3 opsz-96">
            Margot<span className="text-peach not-italic">.</span>
          </span>
        </Link>
        <h1 className="font-display text-4xl md:text-5xl tracking-tight3 mb-4">Cette page n&apos;existe pas.</h1>
        <p className="font-sans text-base text-ink/70 max-w-md mb-2">
          Elle a peut-être été déplacée. Votre garde-robe, elle, est toujours là.
        </p>
        <p className="font-sans text-sm text-ink/50 max-w-md mb-10" lang="en">
          This page doesn&apos;t exist — it may have moved. Your wardrobe is still here.
        </p>
        <nav className="flex flex-wrap gap-3 justify-center font-sans text-[12px] font-semibold tracking-wider2 uppercase">
          <Link href="/fr" className="px-4 py-2 rounded-full bg-ink text-bg no-underline hover:opacity-85">
            Accueil (FR)
          </Link>
          <Link href="/" className="px-4 py-2 rounded-full border border-ink text-ink no-underline hover:opacity-80">
            Home (EN)
          </Link>
          <Link href="/blog" className="px-4 py-2 rounded-full border border-ink text-ink no-underline hover:opacity-80">
            Blog
          </Link>
        </nav>
      </main>
    </RootShell>
  );
}
