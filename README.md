# Margot Landing — Next.js + Tailwind

Production rewrite of the Claude Design prototype (preserved in `_legacy/`).

## Stack
- Next.js 15 (App Router) + TypeScript
- Tailwind v3 with design tokens from the Ash & Moss system
- `next/font` for Fraunces (variable, opsz + SOFT) and Inter Tight

## Run
```bash
npm install
npm run dev
```

## Structure
- `app/` — layout (fonts, metadata), root page (state + composition)
- `components/` — Header, Hero, Problem, Features, MeetMargot, Pricing, SecondCapture, Faq, Footer, FadeIn, WaitlistForm, MargotSVG
- `lib/content.ts` — EN/FR copy
- `_legacy/` — original HTML/JSX prototype, kept for reference

## TODO
- Wire `WaitlistForm` `onSubmit` to the real Beehiiv endpoint (currently a 700ms stub).
- Replace placeholder waitlist count in `success.headline` with a live value.
