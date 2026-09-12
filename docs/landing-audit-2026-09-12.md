# Refonte de la landing Margot — 12 septembre 2026

## Cadrage avant implémentation

- Objectif : faire comprendre et désirer l'usage quotidien de Margot, puis faciliter le téléchargement iOS/Android. Donner au référencement une base éditoriale et technique vérifiable.
- Périmètre : accueil anglais et français, navigation, contenu, visuels, conversion, métadonnées, données structurées et liens vers les guides existants. Audit du site public et contrôle de la version locale.
- Hors périmètre : application mobile, onboarding, paiement, campagnes d'acquisition, modification des politiques juridiques, fonctionnalités du masterplan non débloquées. La demande explicite de refonte autorise ce chantier web ; elle ne relance pas l'acquisition payante.
- Acceptation : promesse et visuel visibles dès le premier écran, contenu bilingue rendu serveur, parcours utilisable à 375/768/1440 px et au clavier, deux boutiques accessibles, FAQ sans dépendance JavaScript, métadonnées et hreflang cohérents, liens internes valides, build/typecheck/tests ciblés et crawl SEO terminés.

## Diagnostic initial

L'identité possède déjà deux actifs : la signature Margot et l'idée d'utiliser ce que l'on possède. Mais le site public commence par une abstraction (« Your wardrobe, observed. »), sans vêtement ni démonstration du produit dans le premier écran. La répétition des sections et de la même composition typographique rend l'expérience générique. Le contenu s'adresse parfois à une équipe technique (« vision pipeline », « 49-rule engine »), parfois à une cliente, sans hiérarchie.

| Constat vérifié | Conséquence | Décision |
|---|---|---|
| Hero centré, très vide, sans produit ni vêtement | Compréhension retardée | Composition asymétrique avec photographie éditoriale et bénéfice concret |
| Douze sections, plusieurs arguments répétés | Longueur sans progression | Regrouper en promesse, fonctionnement, produit, offre, guides, FAQ, téléchargement |
| Google Play annoncé, CTA uniquement Apple | Parcours Android incomplet | Deux liens directs et suivi distinct des boutiques |
| Témoignages sans source vérifiable dans le dépôt | Preuve non contrôlable | Retirer ces témoignages de la landing ; chiffres seulement si le serveur les fournit |
| Promesses absolues sur mémoire, photos et calendrier | Risque d'écart produit | Décrire les actions disponibles et renvoyer à la politique de confidentialité |
| Pas de liens depuis l'accueil vers les nouveaux guides français | Pages difficiles à découvrir | Relier chaque intention de recherche à une ressource précise |
| Accueil entièrement sous une frontière client, animations de chaque section | JavaScript et dépendance aux effets inutiles | Structure serveur, interactions limitées à leurs composants |

Le crawl public du 12/09 couvre 22 routes (16 dans le sitemap) et retourne **7 erreurs et 60 avertissements**, avec trois routes FR en 404 : `/fr/garde-robe-digitale`, `/fr/quoi-porter-aujourdhui`, `/fr/vs/whering`. Ces pages existent déjà dans la branche locale héritée `seo/audit-2026-09-08` ; leur absence publique est un écart de déploiement, pas du contenu à recréer. La version publique contient aussi une FAQ EN répétée sur des pages sans cette FAQ, des descriptions trop longues et des aperçus sociaux absents. Plusieurs corrections sont déjà présentes dans la base locale : les distinguer des changements de cette refonte.

## Direction retenue

Palette : blanc papier `#FCFCFA`, bleu chemise `#DCE8EF`, vin `#682C3D`, vert Margot `#2D3A33`, gris texte `#56615D`, rose pâle `#F2E6E7`.

Typographie : Fraunces normal pour les grands titres et la signature, Montserrat pour la lecture et les contrôles (préférence de marque existante). Pas de multiplication des capitales, de labels décoratifs, d'italiques ni de chiffres sans rôle.

Composition : texte aligné à gauche et photo pleine hauteur au premier écran ; respiration centrale pour la promesse ; trois étapes réellement séquentielles ; démonstration produit interactive ; offre compacte ; guides avec titres descriptifs ; FAQ native et conclusion photo/texte.

```text
signature       navigation              langue / télécharger
promesse claire + deux boutiques | photographie de tenue
                  phrase de marque
ajouter                 découvrir                 porter
écran de l'app       | usages sélectionnables
gratuit             | Premium expliqué
guides utiles et liens de recherche
questions           | réponses dépliables
            invitation à télécharger
footer : produit, ressources, informations
```

Contre-vérification : une grille de cartes SaaS ou une mise en page beige/terracotta reproduirait le problème initial. L'identité repose ici sur une scène de dressing et la palette des vêtements, avec une seule grande composition photographique. Les captures de l'application servent de preuve distincte ; la photographie d'ambiance n'est pas présentée comme un résultat généré par l'app.

## Sources et limites

- [Google : versions linguistiques](https://developers.google.com/search/docs/specialty/international/localized-versions) et [canonicalisation](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).
- [Google : Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals) : cibles LCP ≤ 2,5 s, INP < 200 ms, CLS < 0,1. Les mesures de laboratoire ne remplacent pas les données terrain.
- [Google : mises à jour de la documentation](https://developers.google.com/search/updates) : les FAQ rich results ont été retirés en mai 2026 ; `llms.txt` n'améliore pas le classement Google. Une FAQ reste utile aux visiteurs, sans promesse de résultat enrichi.
- [Whering](https://whering.co.uk/) : territoire dressing et styling social. [Indyx](https://www.myindyx.com/) : inventaire et styling personnel. Observation de leur couverture éditoriale, pas mesure de leurs positions ni de leurs backlinks.

Aucun export Search Console, Ahrefs ou Semrush n'est disponible dans cette tâche. Volumes, positions, difficulté chiffrée, trafic organique et taux de conversion ne sont donc pas inventés. Les opportunités ci-dessous seront priorisées par proximité avec l'usage, puis validées sur les données de recherche réelles.

## Recherche et carte des intentions

Priorité = pertinence pour l'usage quotidien de Margot, pas estimation de volume. Volumes, difficulté et positions actuelles : non mesurés pour toutes les lignes. Les variantes proches sont regroupées sur une même page pour éviter des pages artificiellement multipliées.

| Requête ou groupe | Intention | Priorité | Page cible / action |
|---|---|---|---|
| application dressing | Commerciale | Haute | `/fr` : catégorie, description produit et FAQ |
| application garde-robe | Commerciale | Haute | `/fr` : même page, vocabulaire naturel |
| dressing virtuel | Information / comparaison | Haute | `/fr/garde-robe-digitale` : guide existant relié à l'accueil |
| garde-robe digitale | Information | Haute | Même guide pilier |
| application dressing gratuite | Commerciale | Haute | `/fr` : expliquer limites gratuites et Premium |
| quoi porter aujourd'hui | Information / usage | Haute | `/fr/quoi-porter-aujourdhui` |
| idée de tenue avec mes vêtements | Usage | Haute | `/fr` et guide quotidien, lien contextuel |
| application pour créer des tenues | Commerciale | Haute | `/fr` : démonstration du produit |
| Margot ou Whering | Comparaison | Haute | `/fr/vs/whering`, alternates réciproques |
| organiser son dressing sur téléphone | Information | Moyenne | Enrichir le guide garde-robe avec un exemple réel |
| wardrobe app | Commerciale | Haute | `/` : titre, description, aperçu et FAQ |
| daily outfit planner | Commerciale | Haute | `/` : promesse et titre |
| outfit ideas from my own clothes | Usage | Haute | `/` et `/blog/what-to-wear-today` |
| what to wear today | Information | Haute | `/blog/what-to-wear-today` |
| AI outfit planner | Commerciale / information | Haute | `/blog/ai-outfit-planner-does-it-work`, relié à l'accueil |
| Whering alternative | Comparaison | Haute | `/vs/whering` ; différencier clairement le rôle de l'ancien article `/blog/alternative-to-whering` |
| capsule wardrobe app | Commerciale | Moyenne | Futur guide à partir d'un dressing réel ; ne pas créer une page sans exemple utile |
| travel outfit planner / valise capsule | Information / commercial | Moyenne | Futur guide illustré, après données Search Console ; usage Premium contextualisé dans l'accueil |

## Comparaison éditoriale

| Dimension | Margot, avant | Whering | Indyx | Réponse de la refonte |
|---|---|---|---|---|
| Positionnement visible | Formulation abstraite, nombreux bénéfices | Dressing et styling social | Catalogue, tenues, styling personnel | Tenue quotidienne avec les vêtements déjà possédés |
| Preuve produit | Galerie sous le premier écran | Produit et communauté sur le site officiel | Catalogue et services détaillés | Photographie d'ambiance + vrais visuels de l'app clairement séparés |
| Découverte du contenu | Blog accessible, guides FR absents du site public | Contenu autour du dressing et du style | Rubriques détaillées et contenu de style | Liens descriptifs vers trois ressources par langue |
| Positions, trafic, backlinks | Non mesurés | Non mesurés | Non mesurés | Aucun « gagnant SEO » chiffré sans outil de mesure |

## Plan SEO exécutable

| Quand | Travail | Impact attendu | Effort / dépendance |
|---|---|---|---|
| Dans cette refonte | Titres et descriptions des accueils, sémantique, liens de boutiques, guides reliés, schema localisé, images sociales FR/EN | Compréhension, exploration et conversion | Implémenté dans la branche |
| Dans cette refonte | Rendu serveur, images Next optimisées et dimensionnées, priorité à l'image hero, suppression des révélations au scroll | Moins de JavaScript et meilleure stabilité | Implémenté ; confirmer les CWV terrain après mise en ligne |
| Dans cette refonte | Déplacer les métadonnées de l'accueil EN hors du layout partagé | Évite les canoniques / langues de l'accueil héritées par d'autres routes | Implémenté |
| Dans cette refonte | Réparer les contrôles canoniques de preview et le décodage des entités HTML dans le moniteur | Rapports reproductibles sans faux positifs | Tests ciblés ajoutés |
| À la mise en ligne | Publier la branche avec les trois guides FR déjà préparés, vérifier les URL et le sitemap publics | Rend le contenu réellement accessible | Revue de la refonte et déploiement |
| Après mise en ligne | Inspecter `/`, `/fr` et les trois guides FR dans Search Console ; envoyer le sitemap | Vérifie l'indexation réelle et les canoniques choisies par Google | Accès à la propriété Search Console |
| Chaque semaine, pendant 4 semaines | Export par page/requête/pays/appareil : impressions, clics, CTR, position ; séparer marque / hors marque | Priorité basée sur la demande observée | Export Search Console ; aucune automation créée ici |
| Après une première base de données | Relier les visites organiques aux événements `app_store_click` / `play_store_click`, par langue et emplacement | Mesure l'intention de téléchargement ; ce n'est pas une installation | PostHog/GA4 existants ; attribution install à traiter séparément |
| Selon les impressions | Améliorer d'abord une page entre les positions 5 et 20 avec un exemple original de dressing | Plus d'utilité et de pertinence | 0,5 à 1 jour par page ; donnée GSC nécessaire |
| Selon la demande | Un guide capsule ou valise avec photos, tenues concrètes, auteur et date de vérification | Contenu original et longue traîne | 1 à 2 jours ; ne pas lancer un blog de masse |

Risque de cannibalisation à surveiller : le comparatif `/vs/whering` et l'article `/blog/alternative-to-whering` se recouvrent. Ne pas rediriger aveuglément : identifier d'abord la page recevant impressions et liens, puis choisir une page de comparaison principale ou différencier les intentions.

Le fichier `llms.txt`, les balises keywords et le schema FAQ ne sont pas un substitut à ces actions. La FAQ reste dans le HTML et son schema décrit le même contenu, sans promesse d'affichage enrichi Google.

## Visuel et provenance

Premier visuel d'ambiance créé avec l'outil intégré imagegen, et copié dans `public/editorial/morning-outfit.png` (1024 × 1536). Il a ensuite été remplacé à la demande de l'utilisateur par le duo interactif décrit ci-dessous. Les captures de l'application proviennent de `public/screenshots/` et restent présentées comme des aperçus en anglais. Les photos d'ambiance ne sont ni des témoignages ni des preuves d'essayage virtuel.

Prompt de génération : « Use case: photorealistic-natural. Asset type: editorial hero photograph for Margot, a personal wardrobe / daily outfit app. Produce ONE vertical photograph, 1024 x 1536, full bleed. Authentic quiet French fashion campaign photography, rich natural texture, understated art direction. A stylish adult woman age around 30, brown softly tousled bob, warm olive skin, wearing a pale powder-blue cotton poplin shirt loosely tucked into deep indigo straight jeans, dark burgundy cardigan draped over her shoulders, burgundy leather loafers. Full body, relaxed standing pose leaning slightly on a pale blue painted doorframe, looking sideways with a natural half smile; one hand in pocket. Real airy Paris apartment dressing area, with a simple clothes rail on the left holding a few everyday garments: a cream knit, burgundy knit and blue shirt on wooden hangers, no clutter. Soft direct September morning sunlight from right, subtle shadows, pale cool grey walls, light oak floor. Subject placed at horizontal center-right, enough space around full body, shoes fully visible. Shot with medium-format fashion camera, restrained film grain, realistic skin and cotton folds, no glamour retouching. Dominant powder blue with deep wine red, off-white, indigo. Mood personal and lived-in, confident, not stock office photo. No text, no graphics, no watermarks, no logos, no phone, no UI, no collages, no borders. »

Les fichiers `llms.txt` et `llms-full.txt` ont aussi été alignés sur le produit décrit : retrait des affirmations non établies sur l'absence de stockage des photos, la région unique de tous les traitements, les prix identiques dans toutes les devises et l'exclusivité de fonctionnalités face aux concurrents. Ce travail porte sur l'exactitude de l'information, sans bénéfice de classement Google annoncé.

## Vérification finale

- `npm run build` : réussi ; accueils FR/EN prérendus, actualisation des compteurs une fois par heure. First Load JS annoncé par Next : 119 Ko pour chaque accueil. Ce n'est pas un score Lighthouse.
- `npx tsc --noEmit` : réussi.
- `npm test` : **44 tests réussis**, dont quatre nouveaux cas sur les canoniques des previews et le décodage HTML.
- `git diff --check` : réussi.
- Crawl du build de production local : **25 routes contrôlées, 22 dans le sitemap, 0 erreur et 2 avertissements**. Aucun avertissement sur `/`, `/fr` ou les guides. Les deux avertissements concernent le faible volume de texte des outils interactifs `/studio-read` et `/fr/studio-read` ; ce chantier n'ajoute pas du remplissage pour satisfaire un seuil automatique.
- Les **19 routes internes distinctes** liées depuis les accueils répondent 200. Les deux URL de boutiques proviennent des constantes de lancement existantes.
- Une FAQ de six questions dans le HTML et le même nombre dans les données structurées, pour chaque langue. La description de l'application n'est plus répétée sur les pages juridiques et tous les articles.
- Images sociales anglaise et française : HTTP 200, environ 45 Ko et 42 Ko. La version FR utilise l'URL générée par la convention Next, qui inclut un suffixe ; ne pas remplacer cette URL par `/fr/opengraph-image` en dur.
- Image hero optimisée par Next : **94 574 octets en WebP** pour la requête `w=1080&q=75`. Le fichier source PNG de 2,2 Mo n'est pas le poids transféré aux navigateurs compatibles avec cette réponse.
- Contrôle visuel à **320, 375, 768 et 1440 px** ; pas de débordement horizontal observé aux petites largeurs. Menu mobile (ouverture, fermeture par navigation, Échap), sélection d'aperçu, FAQ au clavier, réouverture puis refus des cookies vérifiés.
- La FAQ native et le contenu sont présents dans la réponse serveur ; aucun effet de révélation ne conditionne leur lecture. Les CTA sont des liens directs. La structure principale n'est plus un composant client.
- PageSpeed Insights public : requête effectuée, **HTTP 429 / quota journalier dépassé**. Aucun score de performance ou résultat Core Web Vitals annoncé. Confirmer LCP/INP/CLS sur les données terrain après déploiement.
- Avertissements Next préexistants : plusieurs lockfiles dans les dossiers parents et `metadataBase` sur certaines routes techniques hors des deux layouts. Les métadonnées et les images des deux accueils ont été contrôlées directement et pointent bien vers le domaine public.

Les résultats publics initiaux et locaux ne sont pas un avant/après de classement : la branche comprend trois commits SEO déjà préparés avant cette tâche, les périmètres de crawl diffèrent et le moniteur a été corrigé. Le snapshot public original est conservé dans `seo-public-before-2026-09-12.json`, le rapport final dans `seo-local-2026-09-12.md` et ses données dans `seo-local-2026-09-12.json`.

## Livraison et retour arrière

Branche : `design/landing-editorial-seo-20260912`, depuis `4ccbcd6`. Prévisualisation locale : `http://127.0.0.1:3210/fr` (français) et `http://127.0.0.1:3210/` (anglais). Cette tâche prépare la refonte ; elle ne modifie pas le déploiement public. La publication doit embarquer les pages SEO déjà présentes dans cette branche, puis être suivie d'un nouveau crawl public.

Aucune migration de données, modification mobile, modification des droits Premium ou nouvelle dépendance. Retour arrière : rétablir le déploiement précédent ou annuler le commit de cette refonte. Les compteurs sont optionnels : en cas d'indisponibilité du service, le reste de la landing reste lisible.

## Ajustement demandé : duo avant / avec Margot

Objectif : remplacer la photo de la femme seule par une comparaison interactive montrant le même homme et la même femme avant et après une proposition de style. Périmètre : visuel hero, curseur et légendes FR/EN. Hors périmètre : produit mobile, backend, publication. Critères : cadrages alignés, deux états entièrement accessibles, glissement et clavier, rendu mobile sans débordement, conservation du contenu et des métadonnées de la landing.

Les deux images `public/editorial/outfit-before.png` et `public/editorial/outfit-after.png` (1254 × 1254 chacune) ont été générées avec l'outil intégré imagegen. La version « avec Margot » a été créée puis recadrée par l'outil ; la version « avant » est une édition de cette référence, avec conservation des personnes et du décor. Les différences portent sur les associations de vêtements, les expressions et l'attitude. La légende indique « Mise en scène illustrative » / « Illustrative styling scene » ; ce ne sont pas des résultats clients. Le texte descriptif de `llms-full.txt` a été adapté.

Le composant `OutfitComparison` conserve deux images de même taille et découpe visuellement celle de gauche, sans étirer les personnes. Le curseur démarre à 50 %. Un champ range natif assure le clavier et la sémantique d'accessibilité ; les événements Pointer permettent le glissement sur toute l'image et la capture hors de la poignée. Un clic permet aussi de déplacer la séparation. `touch-action: pan-y` conserve le défilement vertical. Aucun mouvement automatique, aucune bibliothèque ajoutée.

Validation du suivi :

- Glissement dans les deux sens vérifié dans Chrome : 50 → 93 → 7 % à 1440 px, puis 50 → 12 % à 375 px. Clavier : Home = 0, End = 100, flèche gauche = 99. Les valeurs accessibles changent avec le visuel.
- Contrôle visuel à 375, 768 et 1440 px : les deux personnes restent visibles de la tête aux chaussures ; absence de débordement horizontal à 375 et 768 px. Le contrôle en largeur mobile utilise Chrome ; aucun test sur un téléphone physique n'est revendiqué.
- Alt et textes localisés ; les images et le curseur initial sont présents dans le HTML prérendu. Les deux images passent par Next Image avec chargement prioritaire et tailles adaptées au recadrage desktop/tablette.
- Réponses WebP `w=1080&q=75` : avant **49 370 octets**, après **48 150 octets**, soit **97 520 octets** au total. Cette mesure de transfert remplace celle de la photographie unique citée plus haut ; ce n'est pas une mesure Core Web Vitals.
- `npm test` : **44 tests réussis**. Build de production avec vérification TypeScript : réussi ; First Load JS des accueils désormais **120 Ko**. Les avertissements Next préexistants restent ceux décrits plus haut.
- Crawl final après ajout du comparateur : **25 routes, 0 erreur, 2 avertissements** sur les seules pages `studio-read`, comme avant. Aucun problème détecté sur les accueils FR/EN.

La prévisualisation locale reste disponible sur `/fr` et `/`. Aucun déploiement public effectué pour cet ajustement.
