// Shared Fraunces font loader for opengraph-image routes.
//
// Satori (the engine behind next/og's ImageResponse) accepts TTF / OTF / WOFF
// but NOT WOFF2. Google Fonts only serves WOFF2 today, so we pull TTF from
// fontsource via jsdelivr instead — same glyphs, no decompressor dep.

export async function loadFraunces(
  italic: boolean,
  weight: number,
): Promise<ArrayBuffer> {
  const style = italic ? "italic" : "normal";
  const url = `https://cdn.jsdelivr.net/fontsource/fonts/fraunces@latest/latin-${weight}-${style}.ttf`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Fraunces TTF ${weight}/${style} fetch failed: ${res.status}`);
  }
  return res.arrayBuffer();
}
