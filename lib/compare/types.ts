// Shapes for the comparison pages (/vs/[slug], /fr/vs/[slug]) and the
// alternatives hubs (/alternatives, /fr/alternatives). Every competitor fact
// lives once in lib/compare/competitors.ts with its sources and check date, so
// a price change is edited in one place and reaches every page that shows it.

import type { PriceKey, RowKey } from "./margot";

export type Lang = "en" | "fr";
export type Localized<T> = Record<Lang, T>;

export type Source = { label: string; url: string };

/** A bold lead-in followed by a sentence or two. */
export type Point = { title: string; body: string };

export type FaqItem = { q: string; a: string };

export type ComparisonCopy = {
  metaTitle: string;
  metaDescription: string;
  /** Visible H1, e.g. "Margot vs Acloset" / "Acloset ou Margot ?". */
  h1: string;
  /** First paragraph: a self-contained answer an assistant can quote as is. */
  lede: string;
  /** The verdict sentence, one line, starting with the decision. */
  bottomLine: string;
  /** The competitor's column. A row left out is not shown (nothing verified to say). */
  rows: Partial<Record<RowKey, string>>;
  prices: Record<PriceKey, string>;
  /** Where and when the competitor's prices were read; Margot's note is appended. */
  priceNote: string;
  theyDoWell: Point[];
  margotDifferent: Point[];
  chooseThem: string;
  chooseMargot: string;
  switching: string;
  faq: FaqItem[];
};

export type Competitor = {
  slug: string;
  name: string;
  url: string;
  /** schema.org operatingSystem, e.g. "iOS, Android". */
  operatingSystem: string;
  /** ISO date the page was first published. */
  published: string;
  /** ISO date every competitor fact on the page was last checked. */
  checked: string;
  sources: Source[];
  copy: Localized<ComparisonCopy>;
};

/** One line per app in the alternatives hubs. */
export type AltEntry = {
  slug: string;
  name: string;
  url: string;
  bestFor: string;
  platforms: string;
  french: string;
  price: string;
  summary: string;
  /** Link to the head-to-head page, when one exists. */
  vsPath?: string;
};
