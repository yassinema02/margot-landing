# Margot landing — screenshots

The landing currently renders **SVG mock screens** (`components/PhoneScreen.tsx`) inside every `<PhoneMockup>` — they scale crisply at every size and don't need any assets.

If you ever want to swap in real iOS screenshots, the cleanest path is to extend `PhoneMockup` with an optional `src?: string` prop and short-circuit `<PhoneScreen>` when provided. The hooks are already there in the call sites (`Hero`, `Features`, `HowItWorks`).

Recommended export specs:
- Size: 1170×2532 (iPhone 15 Pro)
- No device frame — the mockup adds its own bezel + notch
- PNG (lossless)
