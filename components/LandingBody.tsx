"use client";

import { useEffect, useState } from "react";
import { LANDING_CONTENT } from "@/lib/content";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Features } from "@/components/Features";
import { WhyMargot } from "@/components/WhyMargot";
import { MeetMargot } from "@/components/MeetMargot";
import { Pricing } from "@/components/Pricing";
import { SocialProof } from "@/components/SocialProof";
import { SecondCapture } from "@/components/SecondCapture";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/FadeIn";

const REF_RE = /^[a-z0-9]{4,16}$/;

// Locale is now URL-derived. Each route (`/` or `/fr`) passes its locked
// locale as a prop. The EN/FR toggle in <Header> navigates between URLs
// rather than mutating in-page state.

export function LandingBody({ lang }: { lang: "en" | "fr" }) {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [refCode, setRefCode] = useState<string | null>(null);
  const [position, setPosition] = useState<number | null>(null);
  const t = LANDING_CONTENT[lang];

  // Capture incoming ?ref= once on mount and persist it. Survives across
  // form submit + page navigation so attribution holds even if the visitor
  // bounces and comes back.
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const raw = params.get("ref")?.trim().toLowerCase();
      if (raw && REF_RE.test(raw)) {
        localStorage.setItem("margot:incoming_ref", raw);
      }
    } catch {
      // localStorage / URLSearchParams unavailable — silently ignore
    }
  }, []);

  return (
    <>
      <Header />
      <main>
        <Hero
          t={t}
          lang={lang}
          submitted={submitted}
          setSubmitted={setSubmitted}
          email={email}
          setEmail={setEmail}
          refCode={refCode}
          setRefCode={setRefCode}
          position={position}
          setPosition={setPosition}
        />
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
          <SecondCapture
            t={t}
            lang={lang}
            submitted={submitted}
            setSubmitted={setSubmitted}
            email={email}
            setEmail={setEmail}
            refCode={refCode}
            setRefCode={setRefCode}
            position={position}
            setPosition={setPosition}
          />
        </FadeIn>
        <FadeIn>
          <Faq t={t} />
        </FadeIn>
      </main>
      <Footer t={t} lang={lang} />
    </>
  );
}
