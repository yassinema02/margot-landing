import type { Metadata } from "next";
import { RootShell } from "@/components/RootShell";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.margotwardrobe.com"),
  applicationName: "Margot",
  authors: [{ name: "Margot" }],
  robots: { index: true, follow: true },
  verification: { other: { "p:domain_verify": "057ec41d4b52055b45f12b1a360e087c" } },
  itunes: { appId: "6766047882" },
  twitter: { card: "summary_large_image", site: "@margotwardrobe", creator: "@margotwardrobe" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <RootShell lang="en">{children}</RootShell>;
}
