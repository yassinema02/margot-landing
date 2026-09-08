import type { Metadata } from "next";
import Link from "next/link";
import { safeJson } from "@/lib/jsonld";
import { AppStoreBadge } from "@/components/AppStoreBadge";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/launch";

const SITE_URL = "https://www.margotwardrobe.com";
const PATH = "/fr/garde-robe-digitale";
const URL = `${SITE_URL}${PATH}`;
const TITLE = "Garde-robe digitale & dressing virtuel : guide 2026 · Margot";
const DESCRIPTION =
  "Garde-robe digitale, virtuelle ou dressing virtuel : définition, méthode pour la créer en 45 minutes, comparatif de six applications en 2026 et FAQ.";
const HEADLINE = "Garde-robe digitale : le guide complet (et comment la faire vivre au quotidien)";
const PUBLISHED = "2026-09-08";
const CHECKED = "8 septembre 2026";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: PATH,
    languages: { fr: PATH, "x-default": PATH },
  },
  keywords: [
    "garde-robe digitale",
    "garde-robe virtuelle",
    "dressing virtuel",
    "application garde-robe",
    "garde-robe numérique",
    "appli dressing",
    "application pour organiser sa garde-robe",
    "application garde-robe virtuelle gratuite",
    "application dressing IA",
    "meilleure application garde-robe 2026",
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    type: "article",
    locale: "fr_FR",
    siteName: "Margot",
    publishedTime: `${PUBLISHED}T09:00:00+02:00`,
    modifiedTime: `${PUBLISHED}T09:00:00+02:00`,
    images: ["https://www.margotwardrobe.com/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@margotwardrobe",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

// The six FAQ entries. Rendered once in the visible page and once in the
// FAQPage JSON-LD from the same array, so the two can never drift apart.
const FAQ: { q: string; a: string }[] = [
  {
    q: "Quelle est la meilleure application de garde-robe virtuelle gratuite ?",
    a: "Il n'y a pas une seule réponse : ça dépend de ce que tu attends. Whering est la plus connue et la plus sociale. Acloset est traduite dans dix-huit langues. Margot est la plus sobre : une tenue chaque matin, un verdict avant d'acheter, une annonce Vinted prête pour ce que tu ne portes plus. Les six applications du tableau ci-dessus se téléchargent gratuitement, sauf Stylebook (5,99 € une fois).",
  },
  {
    q: "Combien de temps faut-il pour digitaliser sa garde-robe ?",
    a: "Compte 45 minutes pour les 30 à 50 pièces que tu portes vraiment, à raison d'une photo par pièce sur un fond uni. Le reste s'ajoute au fil des jours : tu photographies ce que tu portes, pas ce qui dort. Avec Margot, cinq pièces suffisent pour recevoir une première tenue, et la garde-robe se complète toute seule à mesure que tu notes tes tenues.",
  },
  {
    q: "Est-ce que mes photos restent privées ?",
    a: "Chez Margot, oui. Tes photos de vêtements t'appartiennent : elles sont stockées sur des serveurs en Europe, chiffrées en transit et au repos, jamais vendues ni utilisées pour de la publicité. Il n'y a pas de fil social, donc personne ne voit ton dressing. Chaque application a sa propre politique : avant d'en choisir une, lis la rubrique « confidentialité » de sa fiche sur l'App Store ou Google Play.",
  },
  {
    q: "Garde-robe digitale et dressing virtuel, c'est la même chose ?",
    a: "Oui, à un détail près. « Garde-robe digitale », « garde-robe virtuelle », « garde-robe numérique » et « dressing virtuel » désignent le même objet : l'inventaire photographié de tes vêtements dans une application. « Dressing virtuel » est parfois utilisé pour l'essayage en ligne sur un avatar, ce qui est autre chose. Sur cette page, les quatre expressions parlent bien de la garde-robe que tu possèdes.",
  },
  {
    q: "Faut-il photographier tous ses vêtements ?",
    a: "Non, et c'est même une mauvaise idée pour commencer. Une garde-robe digitale de plusieurs centaines de pièces, prise en un seul week-end, finit souvent abandonnée. Commence par ce que tu portes en ce moment, ajoute les pièces au fur et à mesure que tu les sors du placard, et laisse le reste attendre. Ce qui n'a pas été photographié au bout d'une saison mérite sans doute une annonce Vinted plutôt qu'une photo.",
  },
  {
    q: "Une application de garde-robe fonctionne-t-elle sur Android ?",
    a: "La plupart, oui. Au 8 septembre 2026, Margot, Whering, Indyx, Acloset et Klodsy sont disponibles sur iOS et sur Android. Stylebook reste réservée à l'iPhone et à l'iPad. Si tu changes de téléphone, vérifie aussi que tes données te suivent : sur Margot, ta garde-robe est liée à ton compte, pas à ton appareil.",
  },
];

type Row = {
  app: string;
  platforms: string;
  free: string;
  premium: string;
  daily: string;
  check: string;
  vinted: string;
  fr: string;
};

// Facts checked on the official App Store (France) and Google Play listings
// plus each vendor's site on 2026-09-08. Keep the date in CHECKED in sync.
const ROWS: Row[] = [
  {
    app: "Margot",
    platforms: "iOS · Android",
    free: "Oui",
    premium: "14,99 €/mois ou 59,99 €/an",
    daily: "Oui — une tenue chaque matin, selon la météo et l'agenda",
    check: "Oui — verdict acheter / réfléchir / passer",
    vinted: "Oui — brouillon d'annonce pour les pièces non portées",
    fr: "Oui",
  },
  {
    app: "Whering",
    platforms: "iOS · Android",
    free: "Oui",
    premium: "Crédits dès 2,99 € ; options payantes (ex. Créateur de tenues 4,99 €)",
    daily: "Oui — suggestions de tenues et météo",
    check: "Partiel — pas de verdict",
    vinted: "Non",
    fr: "Oui",
  },
  {
    app: "Indyx",
    platforms: "iOS · Android",
    free: "Oui",
    premium: "13,99 €/mois ou 84,99 €/an ; stylistes humains en supplément",
    daily: "Non — planches de tenues manuelles",
    check: "Non",
    vinted: "Non",
    fr: "Non — anglais uniquement",
  },
  {
    app: "Acloset",
    platforms: "iOS · Android",
    free: "Oui",
    premium: "9,99 €/mois ou 69,99 €/an (offre de base 3,99 €/mois)",
    daily: "Oui — idées de tenues quotidiennes",
    check: "Partiel — conseiller shopping, pas de verdict",
    vinted: "Non",
    fr: "Oui",
  },
  {
    app: "Stylebook",
    platforms: "iOS uniquement",
    free: "Non — 5,99 € une fois",
    premium: "Aucun abonnement",
    daily: "Non — tenues composées à la main",
    check: "Non",
    vinted: "Non",
    fr: "Oui",
  },
  {
    app: "Klodsy",
    platforms: "iOS · Android",
    free: "Oui",
    premium: "11,99 €/mois ou 3,99 €/semaine ; crédits dès 2,99 €",
    daily: "Sur demande — générateur de looks",
    check: "Non — essayage virtuel, pas de verdict",
    vinted: "Non",
    fr: "Oui",
  },
];

export default function GardeRobeDigitalePage() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Margot", item: `${SITE_URL}/fr` },
      { "@type": "ListItem", position: 2, name: "Garde-robe digitale", item: URL },
    ],
  };

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${URL}#article`,
    headline: HEADLINE,
    description: DESCRIPTION,
    url: URL,
    mainEntityOfPage: { "@type": "WebPage", "@id": URL },
    inLanguage: "fr-FR",
    datePublished: PUBLISHED,
    dateModified: PUBLISHED,
    author: { "@type": "Organization", name: "Margot", url: `${SITE_URL}/fr` },
    publisher: {
      "@type": "Organization",
      name: "Margot",
      url: `${SITE_URL}/`,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
    },
    image: [`${SITE_URL}/opengraph-image`],
    isPartOf: { "@type": "WebSite", name: "Margot", url: `${SITE_URL}/` },
    about: [
      { "@type": "Thing", name: "Garde-robe digitale" },
      { "@type": "Thing", name: "Garde-robe virtuelle" },
      { "@type": "Thing", name: "Dressing virtuel" },
    ],
    mentions: [
      {
        "@type": "SoftwareApplication",
        name: "Margot",
        url: SITE_URL,
        downloadUrl: [APP_STORE_URL, PLAY_STORE_URL],
        applicationCategory: "LifestyleApplication",
        operatingSystem: "iOS, Android",
      },
      { "@type": "SoftwareApplication", name: "Whering" },
      { "@type": "SoftwareApplication", name: "Indyx" },
      { "@type": "SoftwareApplication", name: "Acloset" },
      { "@type": "SoftwareApplication", name: "Stylebook" },
      { "@type": "SoftwareApplication", name: "Klodsy" },
    ],
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main className="bg-bg text-ink min-h-screen px-6 py-[clamp(48px,7vw,96px)]">
      <article className="max-w-[760px] mx-auto">
        <Link
          href="/fr"
          className="font-sans text-[12px] font-medium tracking-tight7 text-ink3 hover:text-ink no-underline"
        >
          ← Retour à Margot
        </Link>

        <header className="mt-8 mb-10">
          <div className="font-sans text-[11px] font-semibold tracking-wider2 uppercase text-peach mb-4">
            Guide · Garde-robe digitale
          </div>
          <h1 className="font-display font-normal text-ink opsz-144 m-0 text-[clamp(34px,4.6vw,56px)] leading-[1.05] tracking-tight2 [text-wrap:balance]">
            Garde-robe digitale : le guide complet <em>(et comment la faire vivre au quotidien)</em>
          </h1>
          <p className="mt-6 font-sans text-[17px] leading-[1.6] text-ink2 tracking-tight7 max-w-[640px] [text-wrap:pretty]">
            Une <Strong>garde-robe digitale</Strong> (ou garde-robe virtuelle, dressing virtuel) est l'inventaire photographié de tes vêtements, rangé dans une application qui te sert à composer des tenues avec ce que tu possèdes déjà, à savoir ce que tu portes vraiment et à décider si un achat vaut la peine. Une photo par pièce, une seule fois. Ensuite, c'est le dressing qui travaille pour toi.
          </p>
          <p className="mt-3 font-display italic text-ink3 opsz-96 text-[15px] leading-[1.45] tracking-tight5">
            Publié le 8 septembre 2026 · prix et disponibilités vérifiés le {CHECKED}.
          </p>
        </header>

        <div className="rounded-3xl border border-warm2 bg-surface px-[clamp(20px,3vw,32px)] py-[clamp(20px,3vw,28px)]">
          <div className="font-sans text-[11px] font-semibold tracking-wider2 uppercase text-peach mb-3">
            En bref
          </div>
          <ul className="font-sans text-[15px] leading-[1.6] text-ink2 tracking-tight7 list-disc ml-5 space-y-2 m-0">
            <Li>
              <Strong>C'est quoi :</Strong> ton dressing, photographié une fois, consultable partout, qui compose des tenues et garde la trace de ce que tu portes.
            </Li>
            <Li>
              <Strong>À quoi ça sert :</Strong> t'habiller plus vite le matin, porter ce qui dort au fond du placard, acheter moins et mieux, revendre ce qui ne sort plus.
            </Li>
            <Li>
              <Strong>Combien de temps :</Strong> environ 45 minutes pour les 30 à 50 pièces que tu portes vraiment ; le reste se complète au fil des jours.
            </Li>
            <Li>
              <Strong>Quelle application :</Strong> six applis comparées plus bas (Margot, Whering, Indyx, Acloset, Stylebook, Klodsy), toutes gratuites au départ sauf Stylebook. Données vérifiées le {CHECKED}.
            </Li>
          </ul>
        </div>

        <hr className="border-warm2 my-10" />

        <Section title="Garde-robe digitale, virtuelle, dressing virtuel : c'est la même chose ?">
          <P>
            Presque. Le vocabulaire n'est pas encore fixé en français, et selon la personne qui te parle, tu entendras l'un ou l'autre. Voici ce que chaque expression recouvre, pour que tu saches quoi chercher.
          </P>
          <P>
            <Strong>Garde-robe digitale.</Strong> C'est le terme le plus juste : ta garde-robe, telle qu'elle existe, passée en photos dans une application. Chaque pièce devient une fiche (catégorie, couleur, matière, saison) que tu peux retrouver, combiner et suivre. Le mot « digitale » insiste sur l'inventaire, pas sur l'écran.
          </P>
          <P>
            <Strong>Garde-robe virtuelle.</Strong> Même chose, avec un accent mis sur l'usage : composer des tenues à distance, sans ouvrir le placard. C'est l'expression que les boutiques d'applications ont popularisée (la fiche française de Whering s'appelle « Garde-robe Virtuel »), donc celle que beaucoup tapent dans un moteur de recherche.
          </P>
          <P>
            <Strong>Dressing virtuel.</Strong> Synonyme courant en France, où l'on dit plus volontiers « dressing » que « garde-robe ». Attention à un faux ami : « dressing virtuel » désigne parfois l'essayage en ligne sur un avatar, chez un e-commerçant. Ici, on parle bien de tes vêtements à toi.
          </P>
          <P>
            <Strong>Garde-robe numérique.</Strong> La version francisée de « digitale ». Elle est moins utilisée dans le langage courant mais tu la croiseras dans les articles de presse et les rapports. Le sens est identique.
          </P>
          <P>
            <Strong>Application garde-robe, appli dressing.</Strong> Là, on ne parle plus de l'objet mais de l'outil qui le rend possible : une application mobile, gratuite ou non, dans laquelle tu photographies tes pièces et qui te propose des tenues. C'est ce que compare le tableau un peu plus bas.
          </P>
        </Section>

        <Section title="À quoi ça sert, concrètement">
          <Ol>
            <Li>
              <Strong>Répondre à « je n'ai rien à me mettre » en une minute.</Strong> Le matin, tu n'ouvres pas le placard, tu ouvres l'application. Une bonne garde-robe digitale propose une tenue composée avec tes pièces, ajustée à la météo du jour et à ce que tu as prévu. Tu acceptes, tu ajustes, tu pars.
            </Li>
            <Li>
              <Strong>Porter enfin ce qui dort.</Strong> Selon l'Ademe et l'ObSoCo (étude publiée en 2025), plus de la moitié des vêtements rangés dans les placards des Français restent inutilisés. Une garde-robe digitale rend ces pièces visibles, et une styliste comme Margot les glisse dans tes tenues avant qu'elles ne soient oubliées pour de bon.
            </Li>
            <Li>
              <Strong>Acheter moins, mais mieux.</Strong> Toujours selon l'Ademe et l'ObSoCo (2025), chaque Français a fait entrer en moyenne 42 articles d'habillement neufs dans son placard en 2024. Avec ton inventaire sous la main, tu vérifies avant de payer si la pièce qui te tente s'associe à ce que tu as déjà. Margot rend un verdict simple : acheter, réfléchir ou passer.
            </Li>
            <Li>
              <Strong>Préparer une valise sans y passer la soirée.</Strong> Quatre jours à Lisbonne, une réunion le mardi, de la pluie annoncée : tu choisis tes tenues depuis l'application et tu ne plies que ce qui servira.
            </Li>
            <Li>
              <Strong>Vendre ce que tu ne portes plus.</Strong> Une pièce qui n'est pas sortie depuis des mois, l'application le sait. Margot prépare alors un brouillon d'annonce Vinted, titre, description et prix suggéré compris, prêt à publier.
            </Li>
          </Ol>
        </Section>

        <Section title="Comment créer sa garde-robe digitale en 45 minutes">
          <P>
            La méthode qui marche n'est pas « je photographie tout ce week-end ». C'est « je commence par ce que je porte, et je laisse l'application grandir avec moi ». Voici les étapes, chacune tient debout toute seule.
          </P>
          <Ol>
            <Li>
              <Strong>Choisis ton application (5 minutes).</Strong> Regarde le tableau plus bas, télécharge-en une, crée ton compte. Si tu hésites, prends celle dont tu aimes le ton : tu vas l'ouvrir tous les matins.
            </Li>
            <Li>
              <Strong>Sors les pièces que tu portes vraiment (10 minutes).</Strong> Pas le placard entier. Les 30 à 50 pièces de la saison en cours, celles que tu prends sans réfléchir. Pose-les sur le lit.
            </Li>
            <Li>
              <Strong>Photographie chaque pièce, une fois (15 minutes).</Strong> Fond uni, lumière du jour, vêtement à plat ou sur cintre. Une photo par pièce suffit ; l'application enlève le fond et range la fiche.
            </Li>
            <Li>
              <Strong>Laisse l'application trier (5 minutes).</Strong> Margot détecte la catégorie, la couleur et la matière de chaque photo. Tu relis, tu corriges les deux ou trois erreurs, c'est tout.
            </Li>
            <Li>
              <Strong>Demande une première tenue (5 minutes).</Strong> Avec cinq pièces, Margot propose déjà quelque chose. Accepte, rejette ou ajuste : c'est ainsi qu'elle apprend ton goût, pas celui d'un magazine.
            </Li>
            <Li>
              <Strong>Complète au fil des jours (0 minute de plus).</Strong> Chaque fois que tu sors une pièce qui n'est pas encore dans l'application, tu la photographies. En deux semaines, la garde-robe digitale reflète la vraie.
            </Li>
            <Li>
              <Strong>Note ce que tu portes.</Strong> Un geste par jour, celui qui donne sa valeur à tout le reste : l'application sait ce qui tourne, ce qui dort, et ce qui coûte cher à chaque port.
            </Li>
            <Li>
              <Strong>Fais le tri après une saison.</Strong> Ce qui n'a jamais été photographié ni porté en trois mois a répondu à ta place. Direction Vinted, le don ou l'atelier de retouche.
            </Li>
          </Ol>
          <P className="text-ink3 font-display italic">
            Tu veux voir à quoi ressemble la tenue du matin en pratique ? Lis <Link href="/fr/quoi-porter-aujourdhui" className="text-ink underline decoration-peach underline-offset-4">Quoi porter aujourd'hui</Link>.
          </P>
        </Section>

        <Section title="Les applications de garde-robe digitale en 2026">
          <P>
            Six applications reviennent dans les recherches en français. Le tableau compare ce qui compte au quotidien : sur quoi ça tourne, ce que ça coûte, et si l'application décide avec toi ou te laisse tout faire à la main. Margot y figure : on a pris soin d'être aussi justes avec les autres qu'avec nous.
          </P>
          <div className="overflow-x-auto my-6 -mx-6 px-6">
            <table className="w-full min-w-[880px] border-collapse text-left text-[13px]">
              <thead>
                <tr className="border-b border-warm2">
                  <Th>Application</Th>
                  <Th>Plateformes</Th>
                  <Th>Gratuit ?</Th>
                  <Th>Prix premium</Th>
                  <Th>Tenue du jour automatique</Th>
                  <Th>Vérifier avant d'acheter</Th>
                  <Th>Revente Vinted</Th>
                  <Th>Langue FR</Th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r.app} className="border-b border-warm2/60 last:border-b-0">
                    <Td strong>{r.app}</Td>
                    <Td>{r.platforms}</Td>
                    <Td>{r.free}</Td>
                    <Td>{r.premium}</Td>
                    <Td>{r.daily}</Td>
                    <Td>{r.check}</Td>
                    <Td>{r.vinted}</Td>
                    <Td>{r.fr}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <P className="text-ink3 text-[14px]">
            Données vérifiées le {CHECKED} sur les pages officielles (fiches App Store France et Google Play, sites des éditeurs). Les prix affichés sont ceux de l'App Store France ; ils peuvent varier selon le pays et le magasin d'applications.
          </P>
          <P>
            <Strong>Ce que dit le tableau, en deux phrases.</Strong> Whering reste l'application la plus répandue : sa fiche App Store revendique plus de 9 millions d'utilisatrices et un vrai réseau social du vêtement, avec une fiche traduite en français. Margot fait le pari inverse : pas de fil, une seule tenue chaque matin, un verdict avant d'acheter et une annonce Vinted prête pour ce qui dort. Le comparatif détaillé est ici : <Link href="/fr/vs/whering" className="text-ink underline decoration-peach underline-offset-4">Whering ou Margot ?</Link> (et <Link href="/vs/whering" className="text-ink underline decoration-peach underline-offset-4">en anglais</Link>).
          </P>
          <P>
            Indyx et Stylebook sont les deux applications les plus « manuelles » : très bien pour qui aime composer ses planches de tenues soi-même, moins pour qui veut une réponse le matin. Acloset et Klodsy proposent des tenues, mais sans verdict d'achat ni lien vers la revente.
          </P>
        </Section>

        <Section title="Ce qu'une garde-robe digitale ne fait pas">
          <Ul>
            <Li>
              <Strong>Elle ne se remplit pas toute seule.</Strong> Il faut prendre les photos, au moins une fois par pièce. Les applications aident (fond retiré, tri par couleur et catégorie), mais les quinze premières minutes sont pour toi.
            </Li>
            <Li>
              <Strong>Elle ne remplace pas la discipline.</Strong> Une garde-robe digitale que tu n'ouvres jamais est une galerie de photos. Le geste qui compte, c'est de noter ce que tu portes ; sans lui, personne ne saura que la veste bleue dort depuis mars.
            </Li>
            <Li>
              <Strong>Elle ne remplace pas ton goût.</Strong> Une styliste, même attentive, propose. Tu disposes. Si Margot te suggère une tenue que tu ne porterais jamais, dis-le-lui : elle s'ajuste, et c'est ton œil qui reste la référence.
            </Li>
            <Li>
              <Strong>Elle ne fait pas disparaître le placard.</Strong> Une application ne range pas, ne repasse pas, ne recoud pas. Elle t'évite d'acheter une cinquième chemise blanche, ce qui est déjà beaucoup.
            </Li>
            <Li>
              <Strong>Elle ne sera jamais parfaite le premier jour.</Strong> Les suggestions deviennent vraiment justes après une à deux semaines, une fois que l'application a vu ce que tu portes réellement, pas ce que tu aimerais porter.
            </Li>
          </Ul>
        </Section>

        <Section title="Questions fréquentes">
          <dl className="m-0">
            {FAQ.map((f) => (
              <div key={f.q} className="mb-6 max-w-[640px]">
                <dt className="font-sans text-[16px] font-semibold text-ink tracking-tight7 [text-wrap:balance]">
                  {f.q}
                </dt>
                <dd className="m-0 mt-2 font-sans text-[16px] leading-[1.65] text-ink2 tracking-tight7 [text-wrap:pretty]">
                  {f.a}
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        <aside className="mt-16 rounded-3xl border border-warm2 bg-surface px-[clamp(24px,4vw,40px)] py-[clamp(28px,4vw,40px)] flex flex-col items-center text-center">
          <div className="font-sans text-[11px] font-semibold tracking-wider2 uppercase text-peach mb-3">
            Essayer Margot
          </div>
          <p className="font-display italic text-ink opsz-96 text-[clamp(18px,2vw,22px)] leading-[1.4] tracking-tight5 max-w-[460px] mx-auto m-0 mb-5 [text-wrap:pretty]">
            Margot est disponible, gratuitement, sur l'App Store et Google Play. Une tenue chaque matin, avec ce que tu as déjà.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <AppStoreBadge lang="FR" size="lg" />
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Télécharger Margot sur Google Play"
              data-cta="play-store"
              className="inline-flex items-center rounded-xl border border-ink/30 px-5 py-3 font-sans text-[15px] font-semibold text-ink tracking-tight7 no-underline hover:bg-ink/5 transition-colors"
            >
              Disponible sur Google Play
            </a>
          </div>
          <p className="mt-4 m-0 font-sans text-[12px] text-ink3 tracking-tight7">
            Gratuit pour commencer. Premium à 14,99 €/mois ou 59,99 €/an, résiliable à tout moment.
          </p>
        </aside>

        <div className="mt-12 font-display italic text-ink3 text-[13px] [text-wrap:pretty]">
          À lire ensuite : <Link href="/fr/vs/whering" className="text-ink underline decoration-peach underline-offset-4">Whering ou Margot ? Comparatif honnête</Link> · <Link href="/fr/quoi-porter-aujourdhui" className="text-ink underline decoration-peach underline-offset-4">Quoi porter aujourd'hui</Link> · <Link href="/blog/alternative-to-whering" className="text-ink underline decoration-peach underline-offset-4">An honest alternative to Whering</Link> (en anglais) · <Link href="/fr" className="text-ink underline decoration-peach underline-offset-4">Retour à l'accueil</Link>.
        </div>
      </article>

      <script type="application/ld+json" suppressHydrationWarning>
        {safeJson(breadcrumb)}
      </script>
      <script type="application/ld+json" suppressHydrationWarning>
        {safeJson(article)}
      </script>
      <script type="application/ld+json" suppressHydrationWarning>
        {safeJson(faqPage)}
      </script>
    </main>
  );
}

// --- layout helpers, local to this page (same look as /vs/whering) ---

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-display font-normal text-ink opsz-96 text-[clamp(22px,2.4vw,28px)] leading-[1.2] tracking-tight4 mt-10 mb-4 [text-wrap:balance]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function P({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={`font-sans text-[16px] leading-[1.65] text-ink2 tracking-tight7 [text-wrap:pretty] my-4 max-w-[640px] ${className ?? ""}`}
    >
      {children}
    </p>
  );
}

function Ul({ children }: { children: React.ReactNode }) {
  return (
    <ul className="font-sans text-[16px] leading-[1.65] text-ink2 tracking-tight7 list-disc ml-6 mb-5 space-y-2 max-w-[640px]">
      {children}
    </ul>
  );
}

function Ol({ children }: { children: React.ReactNode }) {
  return (
    <ol className="font-sans text-[16px] leading-[1.65] text-ink2 tracking-tight7 list-decimal ml-6 mb-5 space-y-3 max-w-[640px]">
      {children}
    </ol>
  );
}

function Li({ children }: { children: React.ReactNode }) {
  return <li className="[text-wrap:pretty]">{children}</li>;
}

function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-ink">{children}</strong>;
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="py-3 pr-4 font-sans text-[11px] font-semibold tracking-wider2 uppercase text-ink3 align-bottom">
      {children}
    </th>
  );
}

function Td({ children, strong }: { children: React.ReactNode; strong?: boolean }) {
  return (
    <td
      className={`py-3 pr-4 font-sans text-[13px] tracking-tight7 align-top ${
        strong ? "font-medium text-ink whitespace-nowrap" : "text-ink2"
      }`}
    >
      {children}
    </td>
  );
}
