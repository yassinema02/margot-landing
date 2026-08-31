import { NextResponse } from "next/server";

/**
 * Apple App Site Association — Universal Links pour les liens d'auth Margot.
 *
 * Pourquoi ce fichier existe : les liens de récupération de mot de passe et de
 * confirmation d'email transportent `access_token` et `refresh_token` dans le
 * fragment d'URL. Tant qu'ils passent par le schéma `margot://`, non vérifié,
 * n'importe quelle autre app peut enregistrer le schéma et récupérer les
 * jetons — c'est une prise de compte. Les Universal Links lient ces chemins à
 * margotwardrobe.com, donc à cette app seule.
 *
 * Servi par un route handler et non depuis `public/` : le fichier n'a pas
 * d'extension, et Vercel le servirait alors en `application/octet-stream`.
 * Apple attend du JSON.
 *
 * ⚠️ Apple NE SUIT PAS les redirections en récupérant ce fichier. L'apex
 * `margotwardrobe.com` redirige en 307 vers `www` (réglage de domaine Vercel),
 * donc le domaine à déclarer côté app est bien `www.margotwardrobe.com` :
 *   associatedDomains: ['applinks:www.margotwardrobe.com']
 *
 * Team ID H5H5T938YD (Yavren SAS) · bundle com.vestiaire.app.
 * Le chemin correspond au `pathPrefix: '/app/auth'` déjà déclaré côté Android.
 */
const AASA = {
  applinks: {
    details: [
      {
        appIDs: ["H5H5T938YD.com.vestiaire.app"],
        components: [
          {
            "/": "/app/auth/*",
            comment:
              "Liens d'authentification (reset de mot de passe, confirmation d'email)",
          },
        ],
      },
    ],
  },
};

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json(AASA, {
    headers: {
      "Content-Type": "application/json",
      // Apple met le fichier en cache ; une journée laisse une correction se
      // propager sans marteler l'origine.
      "Cache-Control": "public, max-age=86400",
    },
  });
}
