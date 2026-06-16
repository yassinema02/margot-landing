import type { Metadata } from "next";
import Link from "next/link";
import { StudioReadClient } from "./StudioReadClient";
import { STUDIO_READ_COPY } from "@/lib/studioRead/copy";

const SITE_URL = "https://www.margotwardrobe.com";
const t = STUDIO_READ_COPY.en;

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.metaDescription,
  alternates: {
    canonical: "/studio-read",
    languages: { en: "/studio-read", fr: "/fr/studio-read", "x-default": "/studio-read" },
  },
  openGraph: {
    title: t.metaTitle,
    description: t.metaDescription,
    url: `${SITE_URL}/studio-read`,
    siteName: "Margot",
    type: "website",
    locale: "en_GB",
    alternateLocale: ["fr_FR"],
  },
  twitter: { card: "summary_large_image", site: "@margotwardrobe", title: t.metaTitle, description: t.metaDescription },
  robots: { index: true, follow: true },
};

export default function StudioReadPage() {
  return (
    <main className="min-h-screen bg-bg px-5 py-12 sm:py-20">
      <div className="mx-auto mb-10 max-w-lg text-center">
        <Link href="/" className="font-display italic text-xl text-ink no-underline">
          Margot<span className="text-peach not-italic">.</span>
        </Link>
      </div>
      <StudioReadClient locale="en" />
    </main>
  );
}
