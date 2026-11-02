import { afterEach, describe, expect, it } from "vitest";
import { GET } from "../assetlinks.json/route";
import { buildAssetLinks } from "@/lib/assetLinks";

// Android 12+ only opens https://www.margotwardrobe.com/i/… in the app when
// this file names the package and the SHA-256 of the Play signing key. A typo
// silently sends every invitation to the browser instead.
const A = Array.from({ length: 32 }, (_, i) => i.toString(16).padStart(2, "0").toUpperCase()).join(":");
const B = Array.from({ length: 32 }, () => "AB").join(":");

afterEach(() => {
  delete process.env.ANDROID_SHA256_CERT_FINGERPRINTS;
});

describe("buildAssetLinks", () => {
  it("is an empty list when no fingerprint is configured", () => {
    expect(buildAssetLinks(undefined)).toEqual([]);
    expect(buildAssetLinks("")).toEqual([]);
    expect(buildAssetLinks(" , ")).toEqual([]);
  });

  it("declares the production package for every valid fingerprint", () => {
    expect(buildAssetLinks(`${A}, ${B}`)).toEqual([
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: { namespace: "android_app", package_name: "com.vestiaire.app", sha256_cert_fingerprints: [A, B] },
      },
    ]);
  });

  it("drops malformed entries and keeps the rest", () => {
    const short = A.slice(0, -3);
    const noColons = A.replace(/:/g, "");
    const sha1 = Array.from({ length: 20 }, () => "AB").join(":");
    const links = buildAssetLinks([short, noColons, sha1, "ZZ".repeat(32), "<script>", A].join(","));
    expect(links[0].target.sha256_cert_fingerprints).toEqual([A]);
  });

  it("accepts a fingerprint pasted in lower case, written in upper case", () => {
    expect(buildAssetLinks(A.toLowerCase())[0].target.sha256_cert_fingerprints).toEqual([A]);
  });

  it("lists each fingerprint once", () => {
    expect(buildAssetLinks(`${A},${A.toLowerCase()},${B}`)[0].target.sha256_cert_fingerprints).toEqual([A, B]);
  });

  it("is an empty list when every entry is malformed", () => {
    expect(buildAssetLinks("nope,also-nope")).toEqual([]);
  });
});

describe("GET /.well-known/assetlinks.json", () => {
  it("serves JSON", () => {
    expect(GET().headers.get("content-type")).toContain("application/json");
  });

  it("reads the fingerprints from ANDROID_SHA256_CERT_FINGERPRINTS", async () => {
    process.env.ANDROID_SHA256_CERT_FINGERPRINTS = B;
    const body = await GET().json();
    expect(body[0].target.package_name).toBe("com.vestiaire.app");
    expect(body[0].target.sha256_cert_fingerprints).toEqual([B]);
  });

  it("serves [] without the variable", async () => {
    expect(await GET().json()).toEqual([]);
  });
});
