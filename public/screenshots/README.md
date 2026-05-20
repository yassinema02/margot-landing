# Margot landing — screenshots

Drop each placeholder file below in this folder. The page reads them via `<Image>` and `<PhoneMockup>` automatically — no code change needed. Until they exist, `<PhoneMockup>` shows a "Screenshot pending" fallback.

| Path | Used in | Suggested content |
|------|---------|-------------------|
| `hero-today.png` | Hero right column | "Today's look" screen with the full daily outfit card |
| `step-1-snap.png` | How It Works · 01 | Closet upload / photo capture screen |
| `step-2-grid.png` | How It Works · 02 | Wardrobe grid view showing items tagged |
| `step-3-today.png` | How It Works · 03 | Same as `hero-today.png` or a variant |
| `feat-wardrobe.png` | Features · "A wardrobe she knows by heart" | Grid view, cropped |
| `feat-daily.png` | Features · "Daily looks, composed" | Daily outfit detail |
| `feat-check.png` | Features · "Check before you buy" | Check-before-you-buy comparison dialog |

## Export tips

- Use the iOS simulator (Cmd+S on a running app) or device screenshot at **1170×2532** (iPhone 15 Pro).
- Do **not** include the device frame — `<PhoneMockup>` adds its own bezel + notch.
- Save as PNG (lossless) — Next.js will resize via the `sizes` attribute.
- Keep the status bar visible; it reads as more authentic in the mockup.
