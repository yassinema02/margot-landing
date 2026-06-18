import type { Metadata } from "next";
import { Fraunces, Inter_Tight } from "next/font/google";
import { headers } from "next/headers";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { StructuredData } from "@/components/StructuredData";
import { PostHogProvider } from "@/components/PostHogProvider";
import { ConsentProvider } from "@/components/analytics/ConsentProvider";
import { ConsentBanner } from "@/components/analytics/ConsentBanner";
import { MetaPixel } from "@/components/analytics/MetaPixel";
import { ConversionTracker } from "@/components/analytics/ConversionTracker";
import "./globals.css";

// GA4 (Google Ads conversions + Search Console). Public Measurement ID, set in
// Vercel env. Dormant when unset. Consent-gated via Consent Mode v2 (below).
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

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
  "Margot is the AI wardrobe app that turns your closet into daily outfits, shopping verdicts and packing lists from what you already own. Now live on the App Store.";

// EN metadata only — /fr ships its own metadata override via app/fr/layout.tsx.
// alternates.languages adds the hreflang annotations that point Google at the
// FR equivalent of every EN page.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Margot · Wardrobe app — daily outfits from what you own",
  description: DESCRIPTION,
  applicationName: "Margot",
  authors: [{ name: "Margot" }],
  // Invisible SEO keywords — "AI wardrobe app" lives here (not in the visible
  // title) so the brand stays AI-free on screen while keeping the search anchor.
  keywords: [
    "AI wardrobe app",
    "wardrobe app",
    "outfit planner",
    "daily outfit ideas",
    "what to wear",
    "capsule wardrobe",
  ],
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      fr: "/fr",
      "x-default": "/",
    },
  },
  openGraph: {
    title: "Margot · Wardrobe app — daily outfits from what you own",
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
    title: "Margot · Wardrobe app — daily outfits from what you own",
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
  // Pinterest domain ownership verification.
  verification: { other: { "p:domain_verify": "057ec41d4b52055b45f12b1a360e087c" } },
  // iOS Smart App Banner — Safari on iPhone shows a native "Margot · Get" banner
  // that deep-links to the App Store listing.
  itunes: { appId: "6766047882" },
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
        {/* Consent Mode v2 — deny everything BEFORE gtag.js loads, so GA4 boots
            cookieless (modeled pings) until the visitor accepts. The banner then
            calls gtag('consent','update', ...granted). Must be beforeInteractive
            and live in the root layout. */}
        {GA_ID && (
          <Script id="ga-consent-default" strategy="beforeInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});`}
          </Script>
        )}

        <ConsentProvider>
          <PostHogProvider>
            <ConversionTracker />
            {children}
          </PostHogProvider>
          {/* Meta Pixel only loads once consent is granted. */}
          <MetaPixel />
          <ConsentBanner lang={lang === "fr" ? "fr" : "en"} />
        </ConsentProvider>

        <StructuredData />
        <Analytics />
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
      </body>
    </html>
  );
}
