import { describe, expect, it } from "vitest";
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

  it("couvre les chemins d'auth, et eux seuls", async () => {
    const body = await GET().json();
    const paths = body.applinks.details[0].components.map(
      (c: Record<string, string>) => c["/"],
    );
    // Doit rester aligné sur le `pathPrefix: '/app/auth'` déclaré côté Android
    // dans apps/mobile/app.config.js — les deux plateformes ouvrent les mêmes
    // liens.
    expect(paths).toEqual(["/app/auth/*"]);
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
