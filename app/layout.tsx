import type { Metadata } from "next";
import { Fraunces, Inter_Tight } from "next/font/google";
import { headers } from "next/headers";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { StructuredData } from "@/components/StructuredData";
import "./globals.css";

const META_PIXEL_ID = "2371377616601057";

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
  "Margot turns your closet into daily outfits, shopping verdicts, packing lists, and wardrobe insights from what you already own. Join the private beta.";

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
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        {children}
        <StructuredData />
        <Analytics />
      </body>
    </html>
  );
}
