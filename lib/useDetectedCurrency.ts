"use client";

import { useEffect, useState } from "react";

export type Currency = "gbp" | "eur" | "usd";

// SSR-safe default. We render EUR initially (brand is FR/EU-focused),
// then swap on mount if the visitor is in the UK or outside Europe.
const SSR_DEFAULT: Currency = "eur";

const UK_TIMEZONES = new Set([
  "Europe/London",
  "Europe/Belfast",
  "Europe/Isle_of_Man",
  "Europe/Jersey",
  "Europe/Guernsey",
]);

// Atlantic / African EU timezones that aren't under `Europe/*`.
const EXTRA_EU_TIMEZONES = new Set([
  "Africa/Ceuta",
  "Atlantic/Canary",
  "Atlantic/Madeira",
  "Atlantic/Azores",
]);

function detectFromTimezone(tz: string): Currency {
  if (UK_TIMEZONES.has(tz)) return "gbp";
  if (tz.startsWith("Europe/") || EXTRA_EU_TIMEZONES.has(tz)) return "eur";
  return "usd";
}

export function useDetectedCurrency(): Currency {
  const [currency, setCurrency] = useState<Currency>(SSR_DEFAULT);

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) setCurrency(detectFromTimezone(tz));
    } catch {
      // Some older browsers or restricted environments throw. Fall back to default.
    }
  }, []);

  return currency;
}
