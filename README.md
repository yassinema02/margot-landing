# Margot landing

Editorial website for Margot, built with Next.js 15, TypeScript, Tailwind and CSS Modules. The English homepage is `/`; the French homepage is `/fr`.

## Run and verify

```bash
npm install
npm run build
npm start
npm test
node scripts/seo/check.mjs --base http://localhost:3000
```

Use the production build for browser verification with the site's Content Security Policy.

## Structure

- `components/LandingBody.tsx` — shared server-rendered homepage.
- `components/Landing.module.css` — responsive landing design.
- `components/OutfitComparison.tsx` — accessible before/after styling slider.
- `components/ProductPreview.tsx` — application screenshots and feature selection.
- `lib/home.ts` — French and English homepage copy and FAQ.
- `app/(en)/` and `app/(fr)/` — localized pages and metadata.
- `lib/fonts.ts` — Fraunces and Montserrat through `next/font`.
- `docs/landing-audit-2026-09-12.md` — audit, SEO priorities and validation.

The previous landing components, copy and prototypes have been removed. Git history retains earlier versions for rollback. Shared components still used by guides, legal pages and Studio Read remain in place.

Production is served by the existing Vercel project `margot-landing`, connected to the `master` branch of `yassinema02/margot-landing`.
