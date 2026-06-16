import type { Metadata } from "next";
import Link from "next/link";
import { StudioReadClient } from "../../studio-read/StudioReadClient";
import { MargotMark } from "@/components/MargotMark";
import { STUDIO_READ_COPY } from "@/lib/studioRead/copy";

const SITE_URL = "https://www.margotwardrobe.com";
const t = STUDIO_READ_COPY.fr;

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.metaDescription,
  alternates: {
    canonical: "/fr/studio-read",
    languages: { en: "/studio-read", fr: "/fr/studio-read", "x-default": "/studio-read" },
  },
  openGraph: {
    title: t.metaTitle,
    description: t.metaDescription,
    url: `${SITE_URL}/fr/studio-read`,
    siteName: "Margot",
    type: "website",
    locale: "fr_FR",
    alternateLocale: ["en_GB"],
  },
  twitter: { card: "summary_large_image", site: "@margotwardrobe", title: t.metaTitle, description: t.metaDescription },
  robots: { index: true, follow: true },
};

export default function StudioReadPageFr() {
  return (
    <main className="min-h-screen bg-bg">
      <nav className="flex items-center justify-between border-b px-6 py-4 sm:px-14" style={{ borderColor: "#E0DDD6" }}>
        <Link href="/fr" className="no-underline">
          <MargotMark fontSize={24} />
        </Link>
        <Link href="/fr" className="flex h-[42px] items-center rounded-full border px-5 font-sans text-sm font-semibold text-ink no-underline transition-colors hover:bg-surface" style={{ borderColor: "#CFCBC3" }}>
          {t.bridgeBtn}
        </Link>
      </nav>
      <div className="mx-auto max-w-[1320px] px-6 py-12 sm:px-14 sm:py-16 lg:py-20">
        <StudioReadClient locale="fr" />
      </div>
    </main>
  );
}
