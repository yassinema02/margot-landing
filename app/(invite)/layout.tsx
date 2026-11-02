import type { Metadata } from "next";
import { headers } from "next/headers";
import { PostHogProvider } from "@/components/PostHogProvider";
import { ConversionTracker } from "@/components/analytics/ConversionTracker";
import { fraunces, montserrat } from "@/lib/fonts";
import { pickInviteLocale } from "@/lib/socialInvite";
import "@/app/globals.css";

/**
 * Root layout of the invitation page (/i/<token>) alone, instead of RootShell.
 *
 * The URL carries a bearer token: whoever holds it can become friends with
 * the inviter (private accounts included) and take the paywall exemption.
 * So no tracker that ships the page URL to a third party: no GA4/gtag
 * (Consent Mode sends cookieless page_view pings with the URL even before
 * consent), no Meta Pixel, no Vercel Web Analytics, and therefore no cookie
 * banner. PostHog stays: every event goes through the /i/:token redaction
 * and the /flags request is turned off. Store taps go to PostHog only.
 *
 * <html lang> follows the visitor (fr, en, es), like the page copy, which
 * also puts the right language on store-tap events. Reading the request
 * headers is fine here: the page is dynamic anyway.
 *
 * Leaving this layout for another page is a full page load, so the site's
 * usual analytics start fresh there, without this URL.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://www.margotwardrobe.com"),
  applicationName: "Margot",
  itunes: { appId: "6766047882" },
  twitter: { card: "summary_large_image", site: "@margotwardrobe" },
};

export default async function InviteRootLayout({ children }: { children: React.ReactNode }) {
  const lang = pickInviteLocale((await headers()).get("accept-language"));
  return (
    <html lang={lang} className={`${fraunces.variable} ${montserrat.variable}`}>
      <body className="font-sans bg-bg text-ink">
        <PostHogProvider disableFlags>
          <ConversionTracker ga={false} />
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
