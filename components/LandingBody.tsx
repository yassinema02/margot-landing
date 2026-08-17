"use client";

import { LANDING_CONTENT } from "@/lib/content";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Screenshots } from "@/components/Screenshots";
import { MobileCTA } from "@/components/MobileCTA";
import { HowItWorks } from "@/components/HowItWorks";
import { Features } from "@/components/Features";
import { WhyMargot } from "@/components/WhyMargot";
import { MeetMargot } from "@/components/MeetMargot";
import { Pricing } from "@/components/Pricing";
import { SocialProof } from "@/components/SocialProof";
import { Stats } from "@/components/Stats";
import { SecondCapture } from "@/components/SecondCapture";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/FadeIn";

// Locale is URL-derived. Each route (`/` or `/fr`) passes its locked locale
// as a prop. The EN/FR toggle in <Header> navigates between URLs.
//
// Email capture was removed at public launch — the hero, closing section and
// footer now drive straight to the App Store (see <AppStoreBadge>).

export function LandingBody({ lang }: { lang: "en" | "fr" }) {
  const t = LANDING_CONTENT[lang];

  return (
    <>
      <Header />
      <main>
        <Hero t={t} />
        <FadeIn>
          <Screenshots lang={t.lang} />
        </FadeIn>
        <FadeIn>
          <Stats t={t} />
        </FadeIn>
        <FadeIn>
          <HowItWorks t={t} />
        </FadeIn>
        <FadeIn>
          <Features t={t} />
        </FadeIn>
        <FadeIn>
          <WhyMargot t={t} />
        </FadeIn>
        <FadeIn>
          <MeetMargot t={t} />
        </FadeIn>
        <FadeIn>
          <Pricing t={t} />
        </FadeIn>
        <FadeIn>
          <SocialProof t={t} />
        </FadeIn>
        <FadeIn>
          <SecondCapture t={t} />
        </FadeIn>
        <FadeIn>
          <Faq t={t} />
        </FadeIn>
      </main>
      <Footer t={t} />
      <div className="h-[76px] md:hidden" aria-hidden="true" />
      <MobileCTA lang={t.lang} />
    </>
  );
}
