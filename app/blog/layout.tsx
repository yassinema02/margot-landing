import Link from "next/link";
import { LANDING_CONTENT } from "@/lib/content";
import { Footer } from "@/components/Footer";

// EN-only for now. /fr/blog ships in the localization PR.
const t = LANDING_CONTENT.en;

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* TODO: consolidate with components/Header.tsx once we have a shared
          SiteHeader that handles both the EN/FR-toggled hero context and the
          static blog context. */}
      <header className="sticky top-0 z-50 bg-bg/85 backdrop-blur-md backdrop-saturate-150 border-b border-warm2 px-6 py-3.5 flex justify-between items-center">
        <Link href="/" className="no-underline">
          <div className="font-display italic font-normal text-2xl tracking-tight3 text-ink opsz-96">
            Margot<span className="text-peach not-italic">.</span>
          </div>
        </Link>
        <Link
          href="/"
          className="font-sans text-[11px] font-semibold tracking-wider2 uppercase px-3 py-1.5 rounded-full border border-ink text-ink no-underline hover:opacity-80"
        >
          ← Back to Margot
        </Link>
      </header>

      {children}

      <Footer t={t} />
    </>
  );
}
