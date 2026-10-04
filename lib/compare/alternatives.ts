import type { AlternativesCopy } from "@/components/compare/AlternativesArticle";
import type { AltEntry, Lang, Source } from "./types";
import { COMPETITORS } from "./competitors";
import { margotSources } from "./margot";

// The alternatives hubs (/alternatives, /fr/alternatives). Facts are the same
// ones as the comparison pages (lib/compare/competitors.ts, lib/compare/margot.ts),
// summarised per app. Keep both in step when a price or limit changes.

export const ALTERNATIVES_PUBLISHED = "2026-10-04";
export const ALTERNATIVES_CHECKED = "2026-10-04";

export const ALTERNATIVES_COPY: Record<Lang, AlternativesCopy> = {
  fr: {
    path: "/fr/alternatives",
    metaTitle: "Alternatives à Whering : 6 applis de dressing comparées",
    metaDescription:
      "Margot, Whering, Acloset, Alta Daily, Fits et Stylebook comparées : version gratuite, prix en euros, français et plateformes. Sources officielles au 4 octobre 2026.",
    eyebrow: "Comparatifs",
    h1: "Alternatives à Whering : quelle application de dressing choisir ?",
    lede: "Six applications rangent ton dressing et t'aident à t'habiller avec ce que tu possèdes : Margot, Whering, Acloset, Alta Daily, Fits et Stylebook. Elles se ressemblent sur l'essentiel et se distinguent sur quatre points : ce que permet la version gratuite, la langue, les plateformes, et le fait que les tenues te soient proposées ou que tu les composes toi-même. Voici ce qu'en disent leurs pages officielles au 4 octobre 2026.",
    bottomLine:
      "En bref : Whering pour une application gratuite et sociale ; Acloset ou Fits pour un grand dressing gratuit ; Alta Daily si tu résides aux États-Unis et lis l'anglais ; Stylebook pour payer une seule fois sur iPhone ; Margot pour une tenue prête chaque matin, un avis avant d'acheter et des annonces Vinted, sans fil social.",
    criteriaTitle: "Que regarder avant de choisir une application de dressing ?",
    criteria: [
      { title: "Des tenues composées pour toi.", body: "Certaines applications assemblent une tenue avec tes vêtements, d'autres mélangent tes pièces au hasard ou te laissent composer tes looks à la main." },
      { title: "La version gratuite.", body: "Les limites vont de 15 pièces (Margot) à 100 (Acloset), et Fits n'en fixe aucune." },
      { title: "Ta langue et ton téléphone.", body: "Alta Daily n'existe qu'en anglais ; Stylebook seulement sur iPhone et iPad." },
      { title: "Tes données.", body: "Regarde où elles sont stockées et si tu peux les récupérer : Whering indique que l'export n'est pas possible, et Margot n'a pas d'export non plus." },
    ],
    tableTitle: "Comment se comparent les six applications ?",
    tableHead: ["Application", "Idéale pour", "Plateformes", "En français", "Prix"],
    appsTitle: "À quoi ressemble chaque application ?",
    labels: {
      bestFor: "Idéale pour :",
      platforms: "Plateformes :",
      french: "En français :",
      price: "Prix :",
      compare: "{name} ou Margot : le comparatif détaillé",
      site: "Site officiel de {name}",
    },
    byNeedTitle: "Quelle application selon ce que tu cherches ?",
    byNeed: [
      { title: "Une tenue prête chaque matin, sans réseau social :", body: "Margot prépare une tenue avant ton heure d'habillage, en français, et ton dressing reste privé." },
      { title: "Un grand dressing sans payer :", body: "Fits (pièces illimitées) ou Acloset (jusqu'à 100 pièces)." },
      { title: "Des amies et de l'inspiration :", body: "Whering, gratuite, avec dressings d'amis et une base de plus de 100 millions d'articles." },
      { title: "Pas d'abonnement, sur iPhone :", body: "Stylebook, achat unique de 5,99 €." },
      { title: "Une application gratuite, si tu résides aux États-Unis :", body: "Alta Daily, en anglais, avec un avatar réaliste." },
    ],
    faqTitle: "Questions fréquentes",
    faq: [
      { q: "Quelle est la meilleure alternative à Whering ?", a: "Ça dépend de ce que tu attends de Whering. Pour un grand dressing gratuit : Fits (pièces illimitées) ou Acloset (jusqu'à 100 pièces). Pour une tenue prête chaque matin, un avis avant d'acheter et pas de fil social : Margot. Pour un achat unique sur iPhone : Stylebook." },
      { q: "Existe-t-il une application de dressing gratuite en français ?", a: "Oui. Whering, Acloset, Fits et Margot sont gratuites pour commencer et disponibles en français. Leurs limites diffèrent : Whering n'a pas d'abonnement, Fits ne limite pas les pièces, Acloset est gratuite jusqu'à 100 pièces et Margot jusqu'à 15." },
      { q: "Quelles applications de dressing fonctionnent sur Android ?", a: "Margot, Whering, Acloset, Alta Daily et Fits. Stylebook n'existe que sur iPhone et iPad." },
      { q: "Peut-on transférer sa garde-robe d'une application à une autre ?", a: "Rarement. Whering indique que l'export de tes pièces n'est pas possible et Margot n'a pas d'import depuis une autre application : changer d'application veut souvent dire re-photographier tes vêtements. Commence par ceux que tu portes le plus." },
    ],
    sourcesTitle: "Sources",
    sourcesIntro: "Faits vérifiés le 4 octobre 2026 sur les pages officielles des applications ; le détail des sources figure sur chaque comparatif.",
    relatedTitle: "À lire aussi",
    cta: "Margot est gratuite sur iPhone et Android. Une tenue t'attend demain matin.",
  },
  en: {
    path: "/alternatives",
    metaTitle: "Wardrobe app alternatives compared (2026) · Margot",
    metaDescription:
      "Margot, Whering, Acloset, Alta Daily, Fits and Stylebook compared: free plans, prices, languages and platforms, from official sources checked on 4 October 2026.",
    eyebrow: "Comparisons",
    h1: "Which wardrobe app should you choose in 2026?",
    lede: "Six apps organise your wardrobe and help you get dressed from what you own: Margot, Whering, Acloset, Alta Daily, Fits and Stylebook. They are alike on the basics and differ on four things: what the free plan allows, languages, platforms, and whether outfits are suggested for you or put together by you. Here is how they compare, from their official pages on 4 October 2026.",
    bottomLine:
      "In short: Whering for a free, social app; Acloset or Fits for a big free wardrobe; Alta Daily if you live in the US and want a free app; Stylebook to pay once on iPhone; Margot for an outfit ready every morning, advice before you buy and Vinted listings, without a social feed.",
    criteriaTitle: "What should you look for in a wardrobe app?",
    criteria: [
      { title: "Outfits made for you.", body: "Some apps build outfits from your clothes; others shuffle pieces at random or leave you to put looks together by hand." },
      { title: "The free plan.", body: "Limits range from 15 pieces (Margot) to 100 (Acloset), and Fits sets none." },
      { title: "Your language and your phone.", body: "Alta Daily is English-only; Stylebook is iPhone and iPad only." },
      { title: "Your data.", body: "Check where it is stored and whether you can get it back: Whering says export is not possible, and Margot has no export either." },
    ],
    tableTitle: "How do the six apps compare?",
    tableHead: ["App", "Best for", "Platforms", "Languages", "Price"],
    appsTitle: "What is each app like?",
    labels: {
      bestFor: "Best for:",
      platforms: "Platforms:",
      french: "Languages:",
      price: "Price:",
      compare: "Margot vs {name}, in detail",
      site: "{name} official site",
    },
    byNeedTitle: "Which app fits what you need?",
    byNeed: [
      { title: "An outfit ready every morning, without a social network:", body: "Margot has an outfit ready before you get dressed, and your wardrobe stays private." },
      { title: "A big wardrobe without paying:", body: "Fits (unlimited items) or Acloset (up to 100 items)." },
      { title: "Friends and inspiration:", body: "Whering, free, with friends' wardrobes and a database of over 100 million items." },
      { title: "No subscription, on iPhone:", body: "Stylebook, a one-off $4.99 purchase." },
      { title: "A free app, if you live in the US:", body: "Alta Daily, with a realistic avatar and a web version." },
    ],
    faqTitle: "Questions people ask",
    faq: [
      { q: "What is the best alternative to Whering?", a: "It depends on what you use Whering for. For a big free wardrobe: Fits (unlimited items) or Acloset (up to 100 items). For an outfit ready every morning, advice before you buy and no social feed: Margot. To pay once on iPhone: Stylebook." },
      { q: "Is there a free wardrobe app?", a: "Yes. Whering has no subscription, Fits is free with unlimited items, Acloset is free up to 100 items, Alta Daily is free during its beta and Margot is free up to 15 pieces. Stylebook is a one-off $4.99 purchase." },
      { q: "Which wardrobe apps work on Android?", a: "Margot, Whering, Acloset, Alta Daily and Fits. Stylebook is iPhone and iPad only." },
      { q: "Can I move my wardrobe from one app to another?", a: "Rarely. Whering says items cannot be exported and Margot has no import from other apps, so switching usually means photographing your clothes again. Start with the pieces you wear most." },
    ],
    sourcesTitle: "Sources",
    sourcesIntro: "Facts checked on 4 October 2026 on each app's official pages; every comparison page lists its sources in full.",
    relatedTitle: "Keep reading",
    cta: "Margot is free on iPhone and Android. An outfit will be waiting tomorrow morning.",
  },
};

const ENTRIES: Record<Lang, Omit<AltEntry, "vsPath">[]> = {
  fr: [
    { slug: "margot", name: "Margot", url: "https://www.margotwardrobe.com/fr", bestFor: "une tenue prête chaque matin, un avis avant d'acheter, les annonces Vinted", platforms: "iPhone, Android", french: "Oui", price: "Gratuit jusqu'à 15 pièces ; Premium 14,90 € / mois ou 59,99 € / an", summary: "Margot prépare une tenue avec tes vêtements avant ton heure d'habillage, selon la météo et, avec Premium, ton agenda. Elle répond « vaut le coup », « à réfléchir » ou « passe ton tour » avant un achat et rédige tes annonces Vinted à la demande. Pas de fil social. Nouvelle : lancée en juin 2026." },
    { slug: "whering", name: "Whering", url: "https://www.whering.co", bestFor: "une application gratuite et sociale", platforms: "iPhone, Android, web (consultation)", french: "Oui", price: "Gratuit ; crédits pour les fonctions d'image", summary: "L'application de dressing la plus connue, avec plus de 9 millions d'utilisateurs selon sa fiche App Store. Idées de tenues, Planner avec la météo, statistiques, valise, essayage payé en crédits et communauté." },
    { slug: "acloset", name: "Acloset", url: "https://www.acloset.app", bestFor: "un grand dressing gratuit et l'import des commandes en ligne", platforms: "iPhone, Android", french: "Oui", price: "Gratuit jusqu'à 100 pièces ; dès 3,99 € / mois", summary: "Éditée en Corée du Sud, traduite en 18 langues. Tenues selon la météo et l'occasion, styliste en chat, essayage sur avatar, import depuis les boutiques en ligne et Gmail. Publicités sur Android." },
    { slug: "alta-daily", name: "Alta Daily", url: "https://www.altadaily.com", bestFor: "les résidents des États-Unis qui veulent une application gratuite", platforms: "iPhone, Android, web", french: "Non (anglais seulement)", price: "Gratuit (bêta)", summary: "Éditée aux États-Unis, très bien notée. Tenues selon la météo, avatar à ton image, valise pour plusieurs villes. Sa politique de confidentialité demande de déclarer résider aux États-Unis." },
    { slug: "fits", name: "Fits", url: "https://www.fits-app.com", bestFor: "des pièces illimitées en gratuit et une touche sociale", platforms: "iPhone, iPad, Android", french: "Oui", price: "Gratuit ; Fits Pro facultatif", summary: "Éditée en Allemagne, traduite en 24 langues. Pièces illimitées et détourage gratuits, styliste en chat, essayage en crédits, amis qui composent des tenues pour toi." },
    { slug: "stylebook", name: "Stylebook", url: "https://www.stylebookapp.com", bestFor: "payer une seule fois sur iPhone", platforms: "iPhone, iPad", french: "Oui", price: "5,99 € une fois", summary: "L'application historique de l'iPhone, lancée en 2009. Plus de 90 fonctions, calendrier, statistiques et valise, mais des tenues mélangées au hasard plutôt que proposées." },
  ],
  en: [
    { slug: "margot", name: "Margot", url: "https://www.margotwardrobe.com/", bestFor: "an outfit ready every morning, advice before you buy, Vinted listings", platforms: "iPhone, Android", french: "English, French, Spanish", price: "Free up to 15 pieces; Premium $14.99 a month or $59.99 a year (US)", summary: "Margot prepares an outfit from your own clothes before the time you get dressed, with the weather in mind and, with Premium, your calendar. It answers buy, consider or skip before a purchase and writes Vinted listings on request. No social feed. New: launched in June 2026." },
    { slug: "whering", name: "Whering", url: "https://www.whering.co", bestFor: "a free, social wardrobe", platforms: "iPhone, Android, web (browse)", french: "6 languages", price: "Free; credits for image features", summary: "The best known wardrobe app, with over 9 million users according to its App Store listing. Outfit ideas, a weather-aware planner, stats, packing lists, try-on paid with credits, and a community." },
    { slug: "acloset", name: "Acloset", url: "https://www.acloset.app", bestFor: "a big free wardrobe and imports from online orders", platforms: "iPhone, Android", french: "18 languages", price: "Free up to 100 items; from $3.99 a month", summary: "Made in South Korea, translated into 18 languages. Outfits for the weather and the occasion, a chat stylist, avatar try-on, imports from online shops and Gmail. Ads on Android." },
    { slug: "alta-daily", name: "Alta Daily", url: "https://www.altadaily.com", bestFor: "US residents who want a free app", platforms: "iPhone, Android, web", french: "English only", price: "Free (beta)", summary: "Made in the US and very highly rated. Outfits for the weather, an avatar that looks like you, packing for several cities. Its privacy policy asks users to confirm they live in the United States." },
    { slug: "fits", name: "Fits", url: "https://www.fits-app.com", bestFor: "unlimited free items and a social touch", platforms: "iPhone, iPad, Android", french: "24 languages", price: "Free; optional Fits Pro", summary: "Made in Germany, translated into 24 languages. Unlimited items and background removal for free, a chat stylist, try-on with credits, friends who style outfits for you." },
    { slug: "stylebook", name: "Stylebook", url: "https://www.stylebookapp.com", bestFor: "paying once on iPhone", platforms: "iPhone, iPad", french: "6 languages", price: "$4.99 one-time", summary: "The long-standing iPhone wardrobe app, launched in 2009. Over 90 features, a calendar, stats and packing lists, but outfits shuffled at random rather than suggested." },
  ],
};

export function alternativesEntries(lang: Lang): AltEntry[] {
  const vs = new Set(COMPETITORS.map((c) => c.slug));
  return ENTRIES[lang].map((e) => ({ ...e, vsPath: vs.has(e.slug) ? `${lang === "fr" ? "/fr" : ""}/vs/${e.slug}` : undefined }));
}

/** Official home pages of every app, plus Margot's own sources. Each comparison page lists the detailed ones. */
export function alternativesSources(lang: Lang): Source[] {
  return [
    ...COMPETITORS.map((c) => ({ label: lang === "fr" ? `${c.name}, site officiel` : `${c.name}, official site`, url: `${c.url.replace(/\/$/, "")}/` })),
    ...margotSources(lang),
  ];
}
