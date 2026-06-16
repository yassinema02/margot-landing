import type { Locale } from "./types";

// UI chrome for the archetype tool. The route is internal-only `/studio-read`;
// these user-facing strings deliberately NEVER say "Studio Read" (HueAI's term
// + the dead colour concept) and NEVER say "AI" (brand voice = personal stylist).
// The result-card content (label / why / starter kit / palette) is already
// localized by the engine from the taxonomy — this only covers the surrounding
// chrome.

export type StudioReadCopy = {
  metaTitle: string;
  metaDescription: string;
  kicker: string;
  title: string;
  nudge: string;
  choosePhoto: string;
  changePhoto: string;
  cta: string;
  loading: string;
  errorGeneric: string;
  tryAnother: string;
  closestLean: string;
  paletteLabel: string;
  starterKitLabel: string;
  bridgeTitle: (label: string) => string;
  bridgeBody: (count: number) => string;
  emailHeading: string;
  emailPlaceholder: string;
  emailCta: string;
  emailSending: string;
  emailConsent: string;
  privacyHref: string;
  privacyLinkText: string;
  emailSuccess: string;
  share: string;
  copyLink: string;
  copied: string;
  download: string;
  cardCtaTitle: string;
  cardCtaBody: string;
  cardCta: string;
};

export const STUDIO_READ_COPY: Record<Locale, StudioReadCopy> = {
  en: {
    metaTitle: "Read your style — Margot",
    metaDescription:
      "Post your favourite fit and get your style archetype in seconds — your palette, your key pieces, and how to own it. From Margot, your personal stylist.",
    kicker: "Margot",
    title: "What's your style, really?",
    nudge: "Post your most-you outfit — your favourite fit. Mirror selfies welcome.",
    choosePhoto: "Choose a photo",
    changePhoto: "Change photo",
    cta: "Read my style",
    loading: "Reading your fit…",
    errorGeneric: "Something went off. Try another photo.",
    tryAnother: "Read another fit",
    closestLean: "Closest lean",
    paletteLabel: "Your palette",
    starterKitLabel: "Your starter kit",
    bridgeTitle: (label) => `You're ${label}.`,
    bridgeBody: (count) =>
      `Here are your ${count} key pieces. Upload your wardrobe in Margot to see your score + exactly what's missing.`,
    emailHeading: "Get your card + see it in the app",
    emailPlaceholder: "you@email.com",
    emailCta: "Send my card",
    emailSending: "Sending…",
    emailConsent:
      "By entering your email you agree to receive your card and news from Margot.",
    privacyHref: "/privacy",
    privacyLinkText: "Privacy",
    emailSuccess: "Done — check your inbox. Now make it real in the app.",
    share: "Share",
    copyLink: "Copy link",
    copied: "Copied",
    download: "Download",
    cardCtaTitle: "Read your own style",
    cardCtaBody: "Post your favourite fit and get your archetype in seconds.",
    cardCta: "Read my style",
  },
  fr: {
    metaTitle: "Lis ton style — Margot",
    metaDescription:
      "Poste ta tenue préférée et obtiens ton archétype de style en quelques secondes — ta palette, tes pièces clés, et comment l'assumer. Par Margot, ton styliste perso.",
    kicker: "Margot",
    title: "C'est quoi ton style, vraiment ?",
    nudge: "Poste ta tenue la plus toi — ta préférée. Les mirror selfies sont les bienvenus.",
    choosePhoto: "Choisir une photo",
    changePhoto: "Changer de photo",
    cta: "Lis mon style",
    loading: "Lecture de ta tenue…",
    errorGeneric: "Un souci est survenu. Essaie une autre photo.",
    tryAnother: "Lire une autre tenue",
    closestLean: "Tendance la plus proche",
    paletteLabel: "Ta palette",
    starterKitLabel: "Ton kit de départ",
    bridgeTitle: (label) => `Tu es ${label}.`,
    bridgeBody: (count) =>
      `Voilà tes ${count} pièces clés. Upload ton dressing dans Margot pour voir ton score + ce qui te manque exactement.`,
    emailHeading: "Reçois ta carte + vois-la dans l'app",
    emailPlaceholder: "toi@email.com",
    emailCta: "Envoyer ma carte",
    emailSending: "Envoi…",
    emailConsent:
      "En entrant ton email, tu acceptes de recevoir ta carte et des nouvelles de Margot.",
    privacyHref: "/privacy",
    privacyLinkText: "Confidentialité",
    emailSuccess: "C'est fait — regarde ta boîte mail. Maintenant, concrétise dans l'app.",
    share: "Partager",
    copyLink: "Copier le lien",
    copied: "Copié",
    download: "Télécharger",
    cardCtaTitle: "Lis ton propre style",
    cardCtaBody: "Poste ta tenue préférée et obtiens ton archétype en quelques secondes.",
    cardCta: "Lis mon style",
  },
};
