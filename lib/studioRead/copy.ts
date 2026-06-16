import type { Locale } from "./types";

// UI chrome for the archetype tool, on the Margot brand. Two registers:
// Margot's VOICE (lowercase, italic in render, <9 words — loadingLine,
// bridgeTitle) and quiet UI copy (everything else, sentence/Title case).
// Never the word "AI"; never "Studio Read" as a visible name.

export type StudioReadCopy = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  navHow: string;
  navArchetypes: string;
  post: string;
  sub: string;
  dropHint: string;
  dropFoot: string;
  readBtn: string;
  sample: string;
  reassure: string[];
  changePhoto: string;
  loadingLine: string;
  loadingSub: string;
  whyLabel: string;
  kitLabel: string;
  paletteLabel: string;
  leanLabel: string;
  leanLabelNeutral: string;
  neutralUnlock: string;
  bridgeTitle: string;
  bridgeBody: string;
  bridgeBtn: string;
  shareBtn: string;
  copyBtn: string;
  copied: string;
  download: string;
  emailTitle: string;
  emailNote: string;
  emailPh: string;
  emailBtn: string;
  emailSending: string;
  emailSuccess: string;
  consent: string;
  privacyHref: string;
  privacyLinkText: string;
  retry: string;
  errorGeneric: string;
  cardCtaTitle: string;
  cardCtaBody: string;
  cardCta: string;
};

export const STUDIO_READ_COPY: Record<Locale, StudioReadCopy> = {
  en: {
    metaTitle: "Read your style — Margot",
    metaDescription:
      "Post your most-you fit and Margot reads your style — your aesthetic, your palette, the pieces that make it yours. From Margot, your personal stylist.",
    eyebrow: "A Margot read",
    navHow: "How it works",
    navArchetypes: "Archetypes",
    post: "Post your most-you fit",
    sub: "Your stylist reads the vibe — your aesthetic, your palette, the pieces that make it yours. No account, no catch.",
    dropHint: "Drag a full-length fit here, or click to upload",
    dropFoot: "A mirror selfie works best · JPG or PNG",
    readBtn: "Read my style",
    sample: "or read a sample fit",
    reassure: ["Free", "30 seconds", "No account"],
    changePhoto: "Change photo",
    loadingLine: "hold on. i'm reading you.",
    loadingSub: "The cut, the colour, the intent",
    whyLabel: "What I'm seeing",
    kitLabel: "Build the look",
    paletteLabel: "Your palette",
    leanLabel: "Closest lean",
    leanLabelNeutral: "Leaning",
    neutralUnlock: "Upload your wardrobe to unlock your full archetype",
    bridgeTitle: "this is only the cover.",
    bridgeBody: "Upload your wardrobe and I read the whole thing — what to wear, what to lose, what's actually worth it.",
    bridgeBtn: "Get Margot",
    shareBtn: "Share",
    copyBtn: "Copy link",
    copied: "Copied",
    download: "Download",
    emailTitle: "Get your read in your inbox",
    emailNote: "One email — your card, and an invite to Margot.",
    emailPh: "your@email.com",
    emailBtn: "Send it",
    emailSending: "Sending…",
    emailSuccess: "Done — check your inbox. Now make it real in the app.",
    consent: "By entering your email you agree to receive your card and news from Margot.",
    privacyHref: "/privacy",
    privacyLinkText: "Privacy",
    retry: "Try another photo",
    errorGeneric: "Something went off. Try another photo.",
    cardCtaTitle: "Read your own style",
    cardCtaBody: "Post your most-you fit and Margot reads it in seconds.",
    cardCta: "Read my style",
  },
  fr: {
    metaTitle: "Lis ton style — Margot",
    metaDescription:
      "Poste ton look le plus toi et Margot lit ton style — ton esthétique, ta palette, les pièces qui te ressemblent. Par Margot, ta styliste perso.",
    eyebrow: "Un portrait Margot",
    navHow: "Comment ça marche",
    navArchetypes: "Archétypes",
    post: "Poste ton look le plus toi",
    sub: "Ta styliste lit le vibe — ton esthétique, ta palette, les pièces qui te ressemblent. Sans compte, sans piège.",
    dropHint: "Glisse un look en pied ici, ou clique pour charger",
    dropFoot: "Un selfie miroir, c'est l'idéal · JPG ou PNG",
    readBtn: "Lis mon style",
    sample: "ou lis un look exemple",
    reassure: ["Gratuit", "30 secondes", "Sans compte"],
    changePhoto: "Changer de photo",
    loadingLine: "attends. je te lis.",
    loadingSub: "La coupe, la couleur, l'intention",
    whyLabel: "Ce que je vois",
    kitLabel: "Compose le look",
    paletteLabel: "Ta palette",
    leanLabel: "Tendance proche",
    leanLabelNeutral: "Tendance",
    neutralUnlock: "Charge ta garde-robe pour révéler ton archétype complet",
    bridgeTitle: "ça, c'est juste la couverture.",
    bridgeBody: "Charge ta garde-robe et je lis tout — quoi porter, quoi lâcher, ce qui vaut vraiment le coup.",
    bridgeBtn: "Obtenir Margot",
    shareBtn: "Partager",
    copyBtn: "Copier le lien",
    copied: "Copié",
    download: "Télécharger",
    emailTitle: "Reçois ton portrait par mail",
    emailNote: "Un seul mail — ta carte, et une invitation à Margot.",
    emailPh: "ton@email.com",
    emailBtn: "Envoyer",
    emailSending: "Envoi…",
    emailSuccess: "C'est fait — regarde ta boîte mail. Maintenant, concrétise dans l'app.",
    consent: "En entrant ton email, tu acceptes de recevoir ta carte et des nouvelles de Margot.",
    privacyHref: "/privacy",
    privacyLinkText: "Confidentialité",
    retry: "Essaie une autre photo",
    errorGeneric: "Un souci est survenu. Essaie une autre photo.",
    cardCtaTitle: "Lis ton propre style",
    cardCtaBody: "Poste ton look le plus toi et Margot le lit en quelques secondes.",
    cardCta: "Lis mon style",
  },
};
