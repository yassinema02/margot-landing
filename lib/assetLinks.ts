// Digital Asset Links for Android App Links: lets the Margot app open
// https://www.margotwardrobe.com/i/… (and the other paths its intent filters
// declare) without the browser. Served by app/.well-known/assetlinks.json.
//
// The fingerprint is the SHA-256 of the Play App Signing key (Play Console,
// Test and release > App integrity > App signing), not of the upload key.
// It is not a secret, but it is not in the repo either: set
// ANDROID_SHA256_CERT_FINGERPRINTS in Vercel (comma-separated, AA:BB:… form)
// and redeploy. Without it the file is `[]` and Android opens the browser.

export const ANDROID_PACKAGE = "com.vestiaire.app";

const FINGERPRINT = /^[0-9A-F]{2}(:[0-9A-F]{2}){31}$/;

export type AssetLink = {
  relation: string[];
  target: { namespace: "android_app"; package_name: string; sha256_cert_fingerprints: string[] };
};

/** Valid fingerprints from the env value, upper case, each once. */
export function parseFingerprints(raw: string | undefined): string[] {
  if (!raw) return [];
  const valid = raw
    .split(",")
    .map((entry) => entry.trim().toUpperCase())
    .filter((entry) => FINGERPRINT.test(entry));
  return Array.from(new Set(valid));
}

export function buildAssetLinks(raw: string | undefined): AssetLink[] {
  const fingerprints = parseFingerprints(raw);
  if (fingerprints.length === 0) return [];
  return [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: { namespace: "android_app", package_name: ANDROID_PACKAGE, sha256_cert_fingerprints: fingerprints },
    },
  ];
}
