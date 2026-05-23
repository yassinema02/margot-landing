"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Locale toggle is now URL-based, not in-page state. When on /, link to /fr
// for the SEO-indexable French route; when on /fr, link back to /. Sub-routes
// (/privacy, /press, /vs/whering, /blog) don't render this header — they use
// their own layouts — so we don't have to map every sub-page here.

export function Header() {
  const pathname = usePathname() ?? "/";
  const isFr = pathname === "/fr" || pathname.startsWith("/fr/");

  const homeHref = isFr ? "/fr" : "/";
  const switchHref = isFr ? "/" : "/fr";
  const current = isFr ? "FR" : "EN";
  const other = isFr ? "EN" : "FR";

  return (
    <header className="sticky top-0 z-50 bg-bg/85 backdrop-blur-md backdrop-saturate-150 border-b border-warm2 px-6 py-3.5 flex justify-between items-center">
      <Link href={homeHref} className="no-underline">
        <div className="font-display italic font-normal text-2xl tracking-tight3 text-ink opsz-96">
          Margot<span className="text-peach not-italic">.</span>
        </div>
      </Link>
      <Link
        href={switchHref}
        className="font-sans text-[11px] font-semibold tracking-wider2 uppercase px-3 py-1.5 rounded-full border border-ink text-ink no-underline cursor-pointer flex items-center gap-1.5 hover:opacity-80 transition-opacity"
      >
        {current}
        <span className="text-ink3">·</span>
        {other}
        <span className="sr-only"> — switch language</span>
      </Link>
    </header>
  );
}
