import type { Metadata } from "next";
import { RootShell } from "@/components/RootShell";

// FR root layout. Pages under app/(fr)/fr/** own their full metadata
// (title, description, canonical, hreflang); this only sets what every FR
// page shares. Keeping <html lang="fr"> here, not from a request header,
// keeps the pages static.
export const metadata: Metadata = {
  metadataBase: new URL("https://www.margotwardrobe.com"),
  applicationName: "Margot",
  authors: [{ name: "Margot" }],
  robots: { index: true, follow: true },
  verification: { other: { "p:domain_verify": "057ec41d4b52055b45f12b1a360e087c" } },
  itunes: { appId: "6766047882" },
  twitter: { card: "summary_large_image", site: "@margotwardrobe", creator: "@margotwardrobe" },
};

export default function FrRootLayout({ children }: { children: React.ReactNode }) {
  return <RootShell lang="fr">{children}</RootShell>;
}
