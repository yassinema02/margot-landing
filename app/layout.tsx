import type { Metadata } from "next";
import { Fraunces, Inter_Tight } from "next/font/google";
import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import { StructuredData } from "@/components/StructuredData";
import "./globals.css";

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

// EN metadata only — /fr ships its own metadata override via app/fr/layout.tsx.
// alternates.languages adds the hreflang annotations that point Google at the
// FR equivalent of every EN page.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Margot · AI wardrobe app — daily outfits from what you own",
  description: DESCRIPTION,
  applicationName: "Margot",
  authors: [{ name: "Margot" }],
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      fr: "/fr",
      "x-default": "/",
    },
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // middleware.ts sets x-locale from the pathname (en for /, fr for /fr*).
  // Falling back to en covers any request that bypasses the middleware
  // (e.g. /api routes, though those don't render this layout anyway).
  const h = await headers();
  const lang = h.get("x-locale") ?? "en";

  return (
    <html lang={lang} className={`${fraunces.variable} ${interTight.variable}`}>
      <body className="font-sans bg-bg text-ink">
        {children}
        <StructuredData />
        <Analytics />
      </body>
    </html>
  );
}
