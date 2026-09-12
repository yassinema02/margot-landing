import { ImageResponse } from "next/og";
import { loadFraunces } from "@/lib/og-fonts";
import { HOME, type HomeLocale } from "@/lib/home";

export async function homeSocialImage(lang: HomeLocale) {
  const font = await loadFraunces(false, 400);
  const t = HOME[lang];
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#dce8ef", color: "#2d3a33", padding: "60px 72px", flexDirection: "column", justifyContent: "space-between", fontFamily: "Fraunces" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 50, letterSpacing: "-3px" }}>Margot.</span><span style={{ fontFamily: "sans-serif", fontSize: 21 }}>{t.category}</span></div>
      <div style={{ display: "flex", maxWidth: 950, fontSize: lang === "fr" ? 105 : 122, lineHeight: 1.02, letterSpacing: "-5px" }}>{t.headline}</div>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "sans-serif", fontSize: 20 }}><span>margotwardrobe.com</span><span style={{ color: "#682c3d" }}>iPhone & Android</span></div>
    </div>,
    { width: 1200, height: 630, fonts: [{ name: "Fraunces", data: font, style: "normal", weight: 400 }] },
  );
}
