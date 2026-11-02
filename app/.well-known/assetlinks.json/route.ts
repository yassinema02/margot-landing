import { NextResponse } from "next/server";
import { buildAssetLinks } from "@/lib/assetLinks";

/**
 * Digital Asset Links (Android App Links), pendant Android de
 * apple-app-site-association. Google le récupère sur
 * https://www.margotwardrobe.com/.well-known/assetlinks.json pour vérifier
 * les intent filters `autoVerify` de l'app (host www.margotwardrobe.com).
 *
 * ⚠️ Comme Apple, Google NE SUIT PAS les redirections : l'apex redirige en
 * 307 vers `www`, donc les intent filters doivent déclarer `www`.
 *
 * Empreintes lues dans ANDROID_SHA256_CERT_FINGERPRINTS au build (route
 * statique) : après avoir réglé la variable dans Vercel, redéployer. Sans
 * elle, `[]` (aucune vérification, Android ouvre le navigateur).
 */
export const dynamic = "force-static";

export function GET() {
  return NextResponse.json(buildAssetLinks(process.env.ANDROID_SHA256_CERT_FINGERPRINTS), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
