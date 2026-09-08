import { Fraunces, Montserrat } from "next/font/google";

// next/font must be called at module scope; both root layouts (EN and FR
// route groups) share these instances so the CSS variables stay identical.

export const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  // Drop the SOFT axis to shrink the variable woff2 — opsz stays because it's
  // what makes Fraunces look right at 100px+ display sizes. SOFT only softens
  // corners slightly; not worth the LCP cost on the hero H1.
  axes: ["opsz"],
  display: "swap",
  variable: "--font-fraunces",
});

// Montserrat remplace Inter Tight (fondateur 2026-08-24). Géométrique et plus
// large qu'Inter Tight — les tokens tracking-tight* de tailwind.config.ts
// compensent déjà, mais garder un œil sur les boutons étroits en mobile.
export const montserrat = Montserrat({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-montserrat",
});
