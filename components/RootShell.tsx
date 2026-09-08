import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { StructuredData } from "@/components/StructuredData";
import { PostHogProvider } from "@/components/PostHogProvider";
import { ConsentProvider } from "@/components/analytics/ConsentProvider";
import { ConsentBanner } from "@/components/analytics/ConsentBanner";
import { MetaPixel } from "@/components/analytics/MetaPixel";
import { ConversionTracker } from "@/components/analytics/ConversionTracker";
import { fraunces, montserrat } from "@/lib/fonts";
import "@/app/globals.css";

// GA4 (Google Ads conversions + Search Console). Public Measurement ID, set in
// Vercel env. Dormant when unset. Consent-gated via Consent Mode v2 (below).
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Shared <html>/<body> for the two root layouts: app/(en)/layout.tsx and
 * app/(fr)/layout.tsx. Each route group owns its <html lang>, so no request
 * header is read here — that keeps every page statically renderable (ISR
 * works, TTFB is a CDN hit, and Next keeps <title>/canonical/hreflang in
 * <head> instead of streaming them into <body> for non-JS crawlers).
 */
export function RootShell({ lang, children }: { lang: "en" | "fr"; children: React.ReactNode }) {
  return (
    <html lang={lang} className={`${fraunces.variable} ${montserrat.variable}`}>
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
          <ConsentBanner lang={lang} />
        </ConsentProvider>

        <StructuredData />
        <Analytics />
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
      </body>
    </html>
  );
}
