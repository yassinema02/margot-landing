"use client";

import { useState } from "react";
import { LANDING_CONTENT } from "@/lib/content";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Problem } from "@/components/Problem";
import { Features } from "@/components/Features";
import { MeetMargot } from "@/components/MeetMargot";
import { Pricing } from "@/components/Pricing";
import { SecondCapture } from "@/components/SecondCapture";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/FadeIn";

export default function Page() {
  const [lang, setLang] = useState<"en" | "fr">("en");
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const t = LANDING_CONTENT[lang];

  return (
    <>
      <Header lang={lang} setLang={setLang} />
      <Hero t={t} submitted={submitted} setSubmitted={setSubmitted} email={email} setEmail={setEmail} />
      <FadeIn>
        <Problem t={t} />
      </FadeIn>
      <FadeIn>
        <Features t={t} />
      </FadeIn>
      <FadeIn>
        <MeetMargot t={t} />
      </FadeIn>
      <FadeIn>
        <Pricing t={t} />
      </FadeIn>
      <FadeIn>
        <SecondCapture t={t} submitted={submitted} setSubmitted={setSubmitted} email={email} setEmail={setEmail} />
      </FadeIn>
      <FadeIn>
        <Faq t={t} />
      </FadeIn>
      <Footer t={t} />
    </>
  );
}
