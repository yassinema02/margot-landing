import type { Metadata } from "next";
import { Fraunces, Inter_Tight } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { StructuredData } from "@/components/StructuredData";
import "./globals.css";

// TODO: bind to active locale once /fr ships
const DEFAULT_LOCALE = "en";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  // Drop the SOFT axis to shrink the variable woff2 — opsz stays because it's
  // what makes Fraunces look right at 100px+ display sizes. SOFT only softens
  // corners slightly; not worth the LCP cost on the hero H1.
  axes: ["opsz"],
  display: "swap",
  variable: "--font-fraunces",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter-tight",
});

const SITE_URL = "https://www.margotwardrobe.com";
const DESCRIPTION =
  "Margot is the AI wardrobe app that styles you from what you already own — daily outfit suggestions, weather and calendar aware. Join the private beta.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Margot · AI wardrobe app — daily outfits from what you own",
  description: DESCRIPTION,
  applicationName: "Margot",
  authors: [{ name: "Margot" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Margot · AI wardrobe app",
    description: DESCRIPTION,
    url: `${SITE_URL}/`,
    siteName: "Margot",
    type: "website",
    locale: "en_GB",
    alternateLocale: ["fr_FR"],
    // og:image + twitter:image are auto-injected from app/opengraph-image.tsx.
  },
  twitter: {
    card: "summary_large_image",
    site: "@margotwardrobe",
    creator: "@margotwardrobe",
    title: "Margot · AI wardrobe app",
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={DEFAULT_LOCALE} className={`${fraunces.variable} ${interTight.variable}`}>
      <body className="font-sans bg-bg text-ink">
        {children}
        <StructuredData />
        <Analytics />
      </body>
    </html>
  );
}
