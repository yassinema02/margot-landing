import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/launch";
import type { Lang, Localized } from "./types";

// Margot's side of every comparison, checked against the production app and
// the store listings on 2026-10-04. Re-check and update here whenever prices,
// free-plan limits, Premium-only features or data hosting change.

const SITE_URL = "https://www.margotwardrobe.com";

export const MARGOT_CHECKED = "2026-10-04";

/** schema.org description of Margot, embedded in comparison pages. */
export const MARGOT_SCHEMA = {
  "@type": "SoftwareApplication",
  "@id": `${SITE_URL}/#app`,
  name: "Margot",
  url: `${SITE_URL}/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "iOS, Android",
  downloadUrl: [APP_STORE_URL, PLAY_STORE_URL],
};

/** Rows shared by every comparison table, in display order. */
export const ROW_KEYS = [
  "daily",
  "weather",
  "calendar",
  "tryon",
  "buy",
  "adding",
  "stats",
  "packing",
  "social",
  "resale",
  "platforms",
  "languages",
  "export",
] as const;
export type RowKey = (typeof ROW_KEYS)[number];

export const ROW_LABELS: Record<RowKey, Localized<string>> = {
  daily: { fr: "Tenues avec tes vêtements", en: "Outfits from your own clothes" },
  weather: { fr: "Météo", en: "Weather" },
  calendar: { fr: "Agenda et événements", en: "Calendar and events" },
  tryon: { fr: "Essayage sur avatar", en: "Try-on on an avatar" },
  buy: { fr: "Avis avant d'acheter", en: "Advice before you buy" },
  adding: { fr: "Ajout des vêtements", en: "Adding clothes" },
  stats: { fr: "Statistiques", en: "Stats" },
  packing: { fr: "Valise", en: "Packing" },
  social: { fr: "Social", en: "Social" },
  resale: { fr: "Revente", en: "Resale" },
  platforms: { fr: "Plateformes", en: "Platforms" },
  languages: { fr: "Langues", en: "Languages" },
  export: { fr: "Export des données", en: "Data export" },
};

export const MARGOT_ROWS: Record<RowKey, Localized<string>> = {
  daily: {
    fr: "Oui : une tenue prête avant ton heure d'habillage, d'autres sur demande",
    en: "Yes: one outfit ready before the time you get dressed, more on request",
  },
  weather: {
    fr: "Oui, pour ta position ou la ville choisie",
    en: "Yes, for your location or the city you choose",
  },
  calendar: {
    fr: "Avec Premium : titre, horaire et lieu de tes événements, jamais les notes",
    en: "With Premium: title, time and place of your events, never your notes",
  },
  tryon: {
    fr: "Oui : 1 par semaine en gratuit, 15 par jour avec Premium",
    en: "Yes: 1 a week free, 15 a day with Premium",
  },
  buy: {
    fr: "Oui : verdict « vaut le coup », « à réfléchir » ou « passe ton tour »",
    en: "Yes: a buy, consider or skip verdict",
  },
  adding: {
    fr: "Photo avec reconnaissance de la pièce, plusieurs photos d'un coup, lien d'un article",
    en: "Photo with the piece recognised, several photos at once, or a product link",
  },
  stats: { fr: "Oui, dont le coût par port", en: "Yes, including cost per wear" },
  packing: { fr: "Oui, premier voyage offert", en: "Yes, first trip free" },
  social: {
    fr: "Pas de fil ni d'abonnés ; partage d'un look en image",
    en: "No feed, no followers; share a look as an image",
  },
  resale: { fr: "Annonce Vinted rédigée à la demande", en: "Vinted listing written on request" },
  platforms: { fr: "iPhone et Android", en: "iPhone and Android" },
  languages: { fr: "Français, anglais, espagnol", en: "English, French, Spanish" },
  export: { fr: "Non", en: "No" },
};

export const PRICE_KEYS = ["free", "subscription", "oneOff", "trial"] as const;
export type PriceKey = (typeof PRICE_KEYS)[number];

export const PRICE_LABELS: Record<PriceKey, Localized<string>> = {
  free: { fr: "Gratuit", en: "Free plan" },
  subscription: { fr: "Abonnement", en: "Subscription" },
  oneOff: { fr: "Achats à l'unité", en: "One-off purchases" },
  trial: { fr: "Essai gratuit", en: "Free trial" },
};

// EN pages quote the US App Store and give the UK and French prices in the
// note, because prices differ by country and store (never one price for all).
export const MARGOT_PRICES: Record<PriceKey, Localized<string>> = {
  free: {
    fr: "0 € : jusqu'à 15 pièces, 5 générations de tenues par jour",
    en: "$0: up to 15 pieces, 5 outfit generations a day",
  },
  subscription: {
    fr: "Premium : 9,90 € / semaine, 14,90 € / mois ou 59,99 € / an",
    en: "Premium: $8.99 a week, $14.99 a month or $59.99 a year",
  },
  oneOff: { fr: "Aucun", en: "None" },
  trial: { fr: "Aucun", en: "None" },
};

export const MARGOT_PRICE_NOTE: Localized<string> = {
  fr: "Prix de Margot relevés sur l'App Store France le 4 octobre 2026 (identiques sur Google Play en France). Ils varient selon le pays et la boutique.",
  en: "Margot prices from the US App Store on 4 October 2026. They vary by country and store: £12.90 a month, £59.99 a year or £8.90 a week in the UK; €14.90, €59.99 or €9.90 in France.",
};

/** What Premium adds, in one sentence, for FAQ answers. */
export const MARGOT_PREMIUM_SUMMARY: Localized<string> = {
  fr: "Margot Premium lève la limite de 15 pièces, passe de 5 à 20 générations de tenues par jour et d'un essayage par semaine à 15 par jour, et ajoute les tenues pour tes événements.",
  en: "Margot Premium removes the 15-piece limit, raises outfit generations from 5 to 20 a day and try-ons from one a week to 15 a day, and adds outfits for your events.",
};

export function margotSources(lang: Lang) {
  return [
    {
      label: lang === "fr" ? "Margot sur l'App Store France" : "Margot on the App Store",
      url: lang === "fr" ? "https://apps.apple.com/fr/app/id6766047882" : "https://apps.apple.com/us/app/id6766047882",
    },
    { label: lang === "fr" ? "Margot sur Google Play" : "Margot on Google Play", url: PLAY_STORE_URL },
    {
      label: lang === "fr" ? "Politique de confidentialité de Margot" : "Margot privacy policy",
      url: `${SITE_URL}${lang === "fr" ? "/fr/confidentialite" : "/privacy"}`,
    },
  ];
}
