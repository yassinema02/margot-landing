import type { Metadata } from "next";
import Link from "next/link";
import { safeJson } from "@/lib/jsonld";
import { AppStoreBadge } from "@/components/AppStoreBadge";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/launch";

const SITE_URL = "https://www.margotwardrobe.com";
const URL = `${SITE_URL}/fr/vs/whering`;
const TITLE = "Whering ou Margot ? Comparatif honnête 2026 · Margot";
const DESCRIPTION =
  "Whering avis, prix en euros, alternative : le comparatif honnête entre Whering et Margot, vérifié le 8 septembre 2026. Laquelle choisir le matin ?";
const VERIFIED = "8 septembre 2026";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/fr/vs/whering",
    languages: { fr: "/fr/vs/whering", en: "/vs/whering", "x-default": "/vs/whering" },
  },
  keywords: [
    "whering avis",
    "alternative à whering",
    "whering ou margot",
    "whering gratuit",
    "whering prix",
    "garde-robe virtuelle",
    "application garde-robe IA",
  ],
  openGraph: {
    title: "Whering ou Margot ? Le comparatif honnête",
    description: DESCRIPTION,
    url: URL,
    siteName: "Margot",
    type: "article",
    locale: "fr_FR",
    alternateLocale: ["en_GB"],
    images: ["https://www.margotwardrobe.com/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@margotwardrobe",
    title: "Whering ou Margot ? Le comparatif honnête",
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

// FAQ copy lives in one place so the visible answers and the FAQPage
// JSON-LD are guaranteed to be identical.
const FAQ: { q: string; a: string }[] = [
  {
    q: "Whering est-il gratuit ?",
    a: "Oui. Au 8 septembre 2026, Whering est gratuit à l'usage, sans abonnement obligatoire. La fiche App Store française propose des achats intégrés optionnels : des packs de crédits de 2,99 € à 11,99 €, un « Créateur de Tenues » à 4,99 € et des contributions de soutien. Son Supporter Club, qui donnait un accès anticipé aux nouveautés, est fermé aux nouveaux membres. Margot est aussi gratuite pour commencer, avec un Premium optionnel.",
  },
  {
    q: "Margot est-elle une alternative à Whering ?",
    a: "Oui, si ce que tu cherchais dans Whering était la garde-robe digitale et pas le réseau social. Les deux applications photographient ton placard et proposent des tenues. Margot s'arrête là où Whering s'élargit : une seule tenue chaque matin, un verdict avant d'acheter, un brouillon Vinted pour ce que tu ne portes plus, et aucun fil social. Si tu aimes partager tes looks, reste sur Whering.",
  },
  {
    q: "Peut-on importer sa garde-robe Whering dans Margot ?",
    a: "Non, pas encore. Whering ne propose pas d'export de garde-robe et Margot n'a pas de passerelle d'import. Le plus simple si tu changes : photographie tes pièces au fil des jours, en commençant par celles que tu portes le plus. Margot démarre avec cinq vêtements et apprend le reste à mesure que tu notes ce que tu mets. En deux ou trois semaines, ton placard est là.",
  },
  {
    q: "Whering est-il disponible en français ?",
    a: "Oui. La fiche App Store française s'intitule « Whering : Garde-robe Virtuel » et l'application est traduite en français, anglais, allemand, italien, espagnol et portugais, vérifié le 8 septembre 2026. Le site et le blog de Whering restent en anglais. Margot est conçue en français depuis Paris : interface, tenues, verdicts et annonces Vinted sont rédigés dans ta langue, et tes données sont hébergées en Europe.",
  },
  {
    q: "Laquelle choisir pour vendre sur Vinted ?",
    a: "Margot. Elle repère les pièces que tu n'as pas portées depuis des mois et rédige pour chacune un brouillon d'annonce Vinted : titre au format que la recherche Vinted valorise, description, prix suggéré. Whering suit tes achats seconde main et ton coût par port, ce qui aide à décider quoi garder, mais ne prépare pas l'annonce. Si ton but est de faire circuler ce qui dort, Margot fait le trajet jusqu'au bout.",
  },
];

export default function VsWheringPageFr() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Margot", item: `${SITE_URL}/fr` },
      { "@type": "ListItem", position: 2, name: "Comparatifs", item: URL },
      { "@type": "ListItem", position: 3, name: "Whering ou Margot", item: URL },
    ],
  };

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: TITLE,
    description: DESCRIPTION,
    url: URL,
    inLanguage: "fr-FR",
    dateModified: "2026-09-08",
    isPartOf: { "@type": "WebSite", name: "Margot", url: `${SITE_URL}/` },
    primaryImageOfPage: { "@type": "ImageObject", url: `${SITE_URL}/opengraph-image` },
    about: [
      {
        "@type": "SoftwareApplication",
        name: "Margot",
        url: SITE_URL,
        downloadUrl: APP_STORE_URL,
        applicationCategory: "LifestyleApplication",
        operatingSystem: "iOS, Android",
        offers: [
          { "@type": "Offer", price: "0", priceCurrency: "EUR" },
          { "@type": "Offer", price: "14.99", priceCurrency: "EUR", name: "Margot Premium mensuel" },
          { "@type": "Offer", price: "59.99", priceCurrency: "EUR", name: "Margot Premium annuel" },
        ],
      },
      {
        "@type": "SoftwareApplication",
        name: "Whering",
        url: "https://whering.co.uk",
        applicationCategory: "LifestyleApplication",
        operatingSystem: "iOS, Android, Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      },
    ],
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "fr-FR",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const rows = [
    {
      feature: "Tenue du jour selon la météo",
      margot: "Oui — une seule proposition, préparée avant ton réveil",
      whering: "Oui — suggestions météo dans le Planificateur (depuis août 2026)",
    },
    {
      feature: "Lecture de ton agenda",
      margot: "Oui — titres des événements, jamais le contenu",
      whering: "Planner de looks pour tes événements, à remplir toi-même",
    },
    {
      feature: "Vérifier avant d'acheter",
      margot: "Oui — verdict acheter / réfléchir / passer",
      whering: "Wishlist et extension Chrome, sans verdict",
    },
    {
      feature: "Annonce Vinted pour les pièces non portées",
      margot: "Oui — brouillon rédigé, prix suggéré",
      whering: "Non — suivi des achats seconde main, pas d'annonce",
    },
    {
      feature: "Fil social et dressings d'amies",
      margot: "Non — par choix",
      whering: "Oui — c'est le cœur de l'application",
    },
    {
      feature: "Colorimétrie personnelle",
      margot: "Oui — 12 saisons, depuis une photo",
      whering: "Palette des teintes de ton dressing, pas de ta carnation",
    },
    {
      feature: "Ajout depuis les sites marchands",
      margot: "Non — tu photographies ton vrai placard",
      whering: "Oui — extension Chrome, base de 100 millions d'articles",
    },
    {
      feature: "Plateformes",
      margot: "iOS et Android",
      whering: "iOS, Android et version web",
    },
    {
      feature: "Interface en français",
      margot: "Oui — conçue en français",
      whering: "Oui — traduite en 6 langues dont le français",
    },
    {
      feature: "Hébergement des données",
      margot: "Serveurs en Europe, chiffrés",
      whering: "Whering Ltd, Londres — hébergement non précisé sur les fiches",
    },
  ];

  const prices = [
    { plan: "Gratuit", margot: "0 € — garde-robe illimitée, 2 tenues par jour", whering: "0 € — toutes les fonctions de base" },
    { plan: "Mensuel", margot: "14,99 € / mois (Margot Premium)", whering: "Pas d'abonnement" },
    { plan: "Annuel", margot: "59,99 € / an, soit 5,00 € / mois", whering: "Pas d'abonnement" },
    { plan: "Achats à l'unité", margot: "Aucun", whering: "Packs de crédits 2,99 € à 11,99 €, « Créateur de Tenues » 4,99 €" },
  ];

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
            Comparatif · Honnête
          </div>
          <h1 className="font-display font-normal text-ink opsz-144 m-0 text-[clamp(36px,5vw,60px)] leading-[1.05] tracking-tight2 [text-wrap:balance]">
            Margot ou <em>Whering</em> ? Le comparatif honnête.
          </h1>
          <p className="mt-5 font-display italic text-ink3 opsz-96 text-[clamp(16px,1.7vw,19px)] leading-[1.45] tracking-tight5 max-w-[620px] [text-wrap:pretty]">
            Whering est un dressing social, gratuit, utilisé par des millions de personnes. Margot est une styliste qui te propose une tenue par matin depuis ton placard réel, et te dit quand ne pas acheter. Voici comment choisir, sans mauvaise foi.
          </p>
        </header>

        <hr className="border-warm2 my-10" />

        <Section title="La réponse courte">
          <P>
            <Strong>Whering</Strong> est une garde-robe digitale sociale, née à Londres, qui revendique plus de 9 millions d'utilisateurs sur sa fiche App Store au {VERIFIED}. Tu photographies tes vêtements ou tu les importes depuis une base de 100 millions d'articles, tu composes des looks, tu suis tes amies et leurs dressings. C'est l'application la plus large de la catégorie, et elle est gratuite. <a href="https://whering.co.uk" target="_blank" rel="noopener noreferrer" className="text-ink underline decoration-peach underline-offset-4">whering.co.uk</a>.
          </P>
          <P>
            <Strong>Margot</Strong> fait une chose, et la fait bien : chaque matin, une tenue, choisie dans ce que tu possèdes vraiment, selon la météo du jour et ton agenda. Autour, quelques fonctions de retenue : un verdict avant d'acheter, un brouillon Vinted pour les pièces que tu ne portes plus, une colorimétrie en 12 saisons. Pas de fil social. Interface en français, données hébergées en Europe. Gratuite sur l'App Store et Google Play.
          </P>
          <P>
            <Strong>En résumé :</Strong> choisis Whering si tu aimes partager tes tenues, voir celles des autres et avoir une seule appli pour tout. Choisis Margot si tu veux que la question du matin soit réglée avant le café, et que ta garde-robe reste entre toi et toi.
          </P>
        </Section>

        <Section title="Ce que Whering fait bien">
          <Ul>
            <Li>
              <Strong>Une communauté réelle.</Strong> Des millions de dressings ouverts, des looks d'amies à enregistrer, des Style Submissions à partager. Si l'inspiration te vient des autres, c'est un vrai avantage, pas un argument marketing.
            </Li>
            <Li>
              <Strong>Gratuit, vraiment.</Strong> Whering est gratuit à l'usage, sans abonnement. Les achats intégrés (packs de crédits, « Créateur de Tenues ») sont optionnels, et son Supporter Club est fermé aux nouveaux membres au {VERIFIED}.
            </Li>
            <Li>
              <Strong>Disponible partout.</Strong> iOS, Android, une version web pour ton ordinateur, une extension Chrome, et six langues dont le français. Peu d'applications de la catégorie couvrent autant de terrain.
            </Li>
            <Li>
              <Strong>Des chiffres sérieux sur ton dressing.</Strong> Coût par port, taux de port, suivi neuf contre seconde main, palette des teintes de ta garde-robe. Si tu aimes mesurer, Whering mesure beaucoup.
            </Li>
          </Ul>
        </Section>

        <Section title="Ce que Margot fait autrement">
          <Ul>
            <Li>
              <Strong>Une seule tenue par matin, préparée à l'avance.</Strong> Pas de fil, pas de shuffle : tu ouvres, tu vois, tu t'habilles. La tenue est composée pendant la nuit et te parvient à ton heure, pas à sept heures pour tout le monde. Si tu trouves que faire défiler des tenues est une fatigue de plus, c'est ce point qui compte.
            </Li>
            <Li>
              <Strong>Elle lit ta journée, pas seulement ton placard.</Strong> La météo réelle de là où tu es, et les titres de ton agenda (jamais le contenu). La réunion de 9 h et le dîner de 20 h ne demandent pas la même tenue, et Margot le sait avant toi.
            </Li>
            <Li>
              <Strong>Un verdict avant d'acheter.</Strong> Une pièce te tente ? Margot répond <em>acheter</em>, <em>réfléchir</em> ou <em>passer</em>, selon qu'elle s'associe à au moins trois pièces que tu possèdes déjà. Une réponse franche, pas un score.
            </Li>
            <Li>
              <Strong>Une annonce Vinted rédigée pour toi.</Strong> Les pièces que tu n'as pas portées depuis des mois deviennent un brouillon d'annonce : titre, description, prix suggéré. Tu relis, tu publies.
            </Li>
            <Li>
              <Strong>Ta garde-robe reste privée.</Strong> Pas de partage, pas d'abonnés, pas de classement. Tes photos vivent sur des serveurs en Europe, chiffrées, et ne servent à rien d'autre qu'à t'habiller.
            </Li>
          </Ul>
        </Section>

        <Section title="Fonction par fonction">
          <P className="text-ink3 text-[14px]">
            Vérifié le {VERIFIED} sur whering.co.uk, la fiche App Store française et Google Play. Si quelque chose a changé depuis, écris-nous.
          </P>
          <div className="overflow-x-auto my-6">
            <table className="w-full border-collapse text-left text-[14px]">
              <thead>
                <tr className="border-b border-warm2">
                  <Th>Fonction</Th>
                  <Th>Margot</Th>
                  <Th>Whering</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.feature} className="border-b border-warm2/60 last:border-b-0">
                    <td className="py-3 pr-4 font-sans text-[14px] font-medium text-ink tracking-tight7 align-top">
                      {r.feature}
                    </td>
                    <td className="py-3 pr-4 font-sans text-[14px] text-ink2 tracking-tight7 align-top">
                      {r.margot}
                    </td>
                    <td className="py-3 font-sans text-[14px] text-ink2 tracking-tight7 align-top">
                      {r.whering}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Prix">
          <P>
            Les deux applications se téléchargent gratuitement. La différence est dans ce qui vient après : Margot propose un abonnement Premium, Whering des achats à l'unité. Prix constatés au {VERIFIED} sur l'App Store français.
          </P>
          <div className="overflow-x-auto my-6">
            <table className="w-full border-collapse text-left text-[14px]">
              <thead>
                <tr className="border-b border-warm2">
                  <Th>Formule</Th>
                  <Th>Margot</Th>
                  <Th>Whering</Th>
                </tr>
              </thead>
              <tbody>
                {prices.map((r) => (
                  <tr key={r.plan} className="border-b border-warm2/60 last:border-b-0">
                    <td className="py-3 pr-4 font-sans text-[14px] font-medium text-ink tracking-tight7 align-top">
                      {r.plan}
                    </td>
                    <td className="py-3 pr-4 font-sans text-[14px] text-ink2 tracking-tight7 align-top">
                      {r.margot}
                    </td>
                    <td className="py-3 font-sans text-[14px] text-ink2 tracking-tight7 align-top">
                      {r.whering}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <P className="text-ink3 text-[14px]">
            Margot Premium débloque les tenues illimitées, le verdict avant achat, les tenues d'événement depuis ton agenda et les annonces de revente illimitées. Partage familial pris en charge, résiliable à tout moment. Nous n'avons pas pu vérifier précisément ce que débloquent les crédits Whering ; leur fiche ne le détaille pas.
          </P>
        </Section>

        <Section title="Pour qui ?">
          <P>
            <Strong>Whering est faite pour toi si</Strong> tu aimes le côté social des vêtements. Tu veux voir ce que tes amies ont porté, partager tes looks, piocher dans le dressing des autres, et tu préfères une application large et gratuite, quitte à ce qu'elle soit plus dense.
          </P>
          <P>
            <Strong>Margot est faite pour toi si</Strong> tu veux la réponse du matin, et rien d'autre. Tu en as assez de faire défiler. Tu voudrais moins de choix, pas plus. Tu vends sur Vinted ce que tu ne portes plus, ou tu aimerais t'y mettre sans y passer tes dimanches. Et tu préfères que ton dressing reste une affaire privée, hébergée en Europe.
          </P>
          <P className="text-ink3 font-display italic">
            Les deux sont de bonnes réponses. La vraie question est de savoir si tu veux une communauté de garde-robes ou une styliste pour la tienne.
          </P>
        </Section>

        <Section title="Questions fréquentes">
          <dl className="max-w-[640px]">
            {FAQ.map((f) => (
              <div key={f.q} className="mb-6">
                <dt className="font-sans text-[16px] font-semibold text-ink tracking-tight7 mb-2">{f.q}</dt>
                <dd className="font-sans text-[16px] leading-[1.65] text-ink2 tracking-tight7 [text-wrap:pretty] m-0">{f.a}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <aside className="mt-16 rounded-3xl border border-warm2 bg-surface px-[clamp(24px,4vw,40px)] py-[clamp(28px,4vw,40px)] flex flex-col items-center text-center">
          <div className="font-sans text-[11px] font-semibold tracking-wider2 uppercase text-peach mb-3">
            Essayer Margot
          </div>
          <p className="font-display italic text-ink opsz-96 text-[clamp(18px,2vw,22px)] leading-[1.4] tracking-tight5 max-w-[460px] mx-auto m-0 mb-5 [text-wrap:pretty]">
            Margot est gratuite sur l'App Store et Google Play. Une tenue, chaque matin, depuis ton placard.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <AppStoreBadge lang="FR" size="lg" />
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-cta="google-play"
              className="font-sans text-[14px] font-medium text-ink underline decoration-peach underline-offset-4"
            >
              Disponible sur Google Play
            </a>
          </div>
        </aside>

        <div className="mt-12 font-display italic text-ink3 text-[13px] leading-[1.7]">
          À lire aussi : <Link href="/fr/garde-robe-digitale" className="text-ink underline decoration-peach underline-offset-4">le guide de la garde-robe digitale</Link> · <Link href="/fr/quoi-porter-aujourdhui" className="text-ink underline decoration-peach underline-offset-4">quoi porter aujourd'hui, la méthode</Link> · <Link href="/vs/whering" className="text-ink underline decoration-peach underline-offset-4">version anglaise de ce comparatif</Link>.
        </div>
      </article>

      <script type="application/ld+json" suppressHydrationWarning>
        {safeJson(webPage)}
      </script>
      <script type="application/ld+json" suppressHydrationWarning>
        {safeJson(breadcrumb)}
      </script>
      <script type="application/ld+json" suppressHydrationWarning>
        {safeJson(faqPage)}
      </script>
    </main>
  );
}

// --- layout helpers, local to this page (same shapes as /vs/whering) ---

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

function Li({ children }: { children: React.ReactNode }) {
  return <li className="[text-wrap:pretty]">{children}</li>;
}

function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-ink">{children}</strong>;
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="py-3 pr-4 font-sans text-[11px] font-semibold tracking-wider2 uppercase text-ink3">
      {children}
    </th>
  );
}
