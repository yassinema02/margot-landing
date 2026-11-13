import { describe, expect, it, vi } from "vitest";
import { GET as android } from "../assetlinks.json/route";
import { GET } from "../apple-app-site-association/route";

// Le contenu de ce fichier est vérifié par Apple à l'installation de l'app :
// une faute de frappe dans le Team ID ou le bundle casse silencieusement les
// Universal Links, et on retombe sur le schéma `margot://` interceptable.
describe("apple-app-site-association", () => {
  it("sert du JSON, pas de l'octet-stream", async () => {
    const res = GET();
    expect(res.headers.get("content-type")).toContain("application/json");
  });

  it("déclare le bon appID (Team ID Yavren + bundle de production)", async () => {
    const body = await GET().json();
    expect(body.applinks.details[0].appIDs).toEqual([
      "H5H5T938YD.com.vestiaire.app",
    ]);
  });

  it("couvre les chemins d'auth, d'invitations et de votes, et eux seuls", async () => {
    const body = await GET().json();
    const paths = body.applinks.details[0].components.map(
      (c: Record<string, string>) => c["/"],
    );
    // Doit rester aligné sur les `pathPrefix` '/app/auth', '/i/' et '/v/' déclarés
    // côté Android dans apps/mobile/app.config.js : les deux plateformes
    // ouvrent les mêmes liens.
    expect(paths).toEqual(["/v/*", "/app/auth/*", "/i/*"]);
  });

  it("ouvre les invitations sociales dans l'app", async () => {
    const body = await GET().json();
    expect(body.applinks.details[0].components).toContainEqual({
      "/": "/i/*",
      comment: "Invitations sociales",
    });
  });

  it("ne capture pas la racine du site (sinon toute page ouvrirait l'app)", async () => {
    const body = await GET().json();
    const paths = body.applinks.details[0].components.map(
      (c: Record<string, string>) => c["/"],
    );
    expect(paths).not.toContain("*");
    expect(paths).not.toContain("/*");
  });
});


it("Android reste vide sans empreinte Play valide", async () => {
  vi.stubEnv("ANDROID_SHA256_CERT_FINGERPRINTS", "");
  try {
    expect(await android().json()).toEqual([]);
  } finally {
    vi.unstubAllEnvs();
  }
});
