import type { Metadata } from "next";
import Link from "next/link";
import { safeJson } from "@/lib/jsonld";
import { AppStoreBadge } from "@/components/AppStoreBadge";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/launch";

const SITE_URL = "https://www.margotwardrobe.com";
const URL = `${SITE_URL}/fr/quoi-porter-aujourdhui`;
const TITLE = "Quoi porter aujourd'hui ? Méthode + tenue du jour · Margot";
const DESCRIPTION =
  "Quoi porter aujourd'hui ? Trois questions (météo ressentie, agenda, ce que tu as déjà porté), un tableau par température et la tenue du jour préparée par Margot.";
const PUBLISHED = "2026-09-08";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/fr/quoi-porter-aujourdhui",
    languages: {
      fr: "/fr/quoi-porter-aujourdhui",
      en: "/blog/what-to-wear-today",
      "x-default": "/blog/what-to-wear-today",
    },
  },
  keywords: [
    "quoi porter aujourd'hui",
    "comment m'habiller aujourd'hui",
    "tenue du jour",
    "application tenue météo",
    "je ne sais pas quoi mettre",
    "comment s'habiller quand il fait 15 degrés",
    "application tenue du jour IA",
  ],
  openGraph: {
    title: "Quoi porter aujourd'hui ? La méthode en 3 questions",
    description: DESCRIPTION,
    url: URL,
    siteName: "Margot",
    type: "article",
    locale: "fr_FR",
    alternateLocale: ["en_GB"],
    publishedTime: `${PUBLISHED}T08:00:00+02:00`,
    authors: ["Margot"],
    images: ["https://www.margotwardrobe.com/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@margotwardrobe",
    title: "Quoi porter aujourd'hui ? La méthode en 3 questions",
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

// The three-question method. Rendered as the numbered steps AND used for
// the HowTo JSON-LD so both stay identical.
const STEPS: { name: string; text: string; detail: string }[] = [
  {
    name: "Quelle météo, ressentie, entre ton départ et ton retour ?",
    text: "Regarde la température ressentie à l'heure où tu sors et à celle où tu rentres, pas la maximale de la journée. Habille-toi pour la plus basse des deux, avec une couche que tu pourras enlever.",
    detail:
      "Le chiffre qui compte n'est pas celui de midi. C'est celui de 8 h 15 sur le quai, et celui de 19 h quand tu ressors. Le vent et l'humidité pèsent plus que deux degrés d'écart : 12 °C sous un ciel gris et humide se portent comme 8, 12 °C au soleil sans vent se portent comme 15. Une fois la fourchette connue, la règle tient en une phrase : une couche pour la température la plus basse que tu vas croiser, et cette couche doit pouvoir se retirer sans que la tenue s'effondre.",
  },
  {
    name: "Que dit ton agenda ?",
    text: "Repère l'événement le plus contraignant de la journée (réunion, déjeuner, trajet à vélo, dîner) et choisis d'abord la pièce qu'il impose. Le reste de la tenue se construit autour.",
    detail:
      "Le dress code n'est pas une affaire de mode, c'est une affaire de contexte. Une journée sans rendez-vous et une journée avec un entretien à 14 h ne demandent pas le même effort, et il est inutile de le fournir les deux fois. Prends la contrainte la plus forte de ta journée : la veste pour la présentation, les chaussures pour les trois kilomètres à pied, le pantalon confortable pour le train. Cette pièce est ton point d'ancrage. Tout ce que tu ajoutes ensuite doit aller avec elle, pas l'inverse.",
  },
  {
    name: "Qu'as-tu déjà porté cette semaine ?",
    text: "Écarte ce que tu as mis lundi et mardi, puis pars d'une pièce que tu n'as pas portée depuis trois semaines. C'est elle qui donne la tenue, et c'est là que le « rien à me mettre » disparaît.",
    detail:
      "La mémoire est le maillon faible. On remet les mêmes cinq tenues parce qu'elles sont devant, pas parce qu'elles sont les meilleures. Une fois par semaine, ou chaque matin si tu as le réflexe, cherche une pièce que tu aimes et que tu n'as pas touchée depuis un mois. Fais-en le point de départ, ajoute deux pièces neutres qui vont avec, une seule qui contraste. La tenue existait déjà dans ton placard ; il fallait juste qu'on te la rappelle.",
  },
];

const TEMPERATURES: { range: string; layers: string; fabrics: string; example: string }[] = [
  {
    range: "5 °C et moins",
    layers: "Trois couches et un manteau : sous-couche fine, pull épais, manteau long qui ferme jusqu'au col.",
    fabrics: "Laine, mérinos, cachemire, laine bouillie, duvet.",
    example:
      "Col roulé fin en mérinos, pull en grosse maille, jean brut ou pantalon en laine, manteau long en laine, bottines doublées, écharpe et gants. Chaussettes en laine : c'est par les pieds que le froid rentre.",
  },
  {
    range: "5 à 12 °C",
    layers: "Deux couches et une veste chaude. Le manteau long devient optionnel, le col reste couvert.",
    fabrics: "Laine fine, flanelle, coton épais, cuir, gabardine doublée.",
    example:
      "Chemise en flanelle ou pull fin, trench doublé ou veste en cuir, jean droit, derbies ou baskets en cuir, écharpe légère. Si tu marches beaucoup, la veste en cuir bat le trench.",
  },
  {
    range: "12 à 18 °C",
    layers: "Une couche, et une à enlever. C'est la zone piège : 12 °C au départ, 18 °C au retour.",
    fabrics: "Coton, maille fine, denim, laine légère, toile.",
    example:
      "T-shirt en coton et cardigan, ou chemise et blazer non doublé, pantalon en toile ou jean, mocassins ou baskets. La couche du dessus doit tenir sur un bras ou dans un sac sans faire de plis irrécupérables.",
  },
  {
    range: "18 à 24 °C",
    layers: "Une couche, et une veste légère glissée dans le sac pour le soir ou les intérieurs climatisés.",
    fabrics: "Lin, coton, viscose, soie, chambray.",
    example:
      "Robe midi en viscose, ou chemise en lin et pantalon fluide, sandales fermées ou baskets en toile, surchemise légère pour le retour. Les manches longues retroussées se portent mieux que les manches courtes à 18 °C.",
  },
  {
    range: "25 °C et plus",
    layers: "Une seule couche, la plus respirante que tu aies. Coupes amples, couleurs claires.",
    fabrics: "Lin, coton léger, seersucker, jersey fin, rien de synthétique contre la peau.",
    example:
      "Robe en lin, ou short en coton et chemise ample à manches courtes, sandales, chapeau. Le tissu compte plus que la longueur : un pantalon en lin ample tient mieux la chaleur qu'un short en polyester.",
  },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "Comment s'habiller quand il fait 15 degrés ?",
    a: "Quinze degrés, c'est la température des couches qui s'enlèvent. Pars sur une base en coton ou en maille fine, ajoute un blazer non doublé, une surchemise ou un trench léger, et un pantalon en toile ou un jean. Regarde surtout le vent et l'humidité : 15 degrés sous la pluie demandent une veste imperméable, 15 degrés au soleil se portent en manches longues, sans rien par-dessus.",
  },
  {
    q: "Quelle appli dit quoi porter aujourd'hui ?",
    a: "Margot. Chaque matin, elle prépare une tenue composée uniquement de vêtements que tu possèdes, selon la météo réelle de l'endroit où tu es, les titres de ton agenda et ce que tu n'as pas porté récemment. Elle est disponible sur iOS et Android, gratuite pour commencer. Whering propose aussi, depuis août 2026, des suggestions selon la météo dans son planificateur ; nous comparons les deux dans un article dédié.",
  },
  {
    q: "Comment faire une tenue avec ce que j'ai ?",
    a: "Commence par une pièce, pas par une idée. Prends celle que tu n'as pas mise depuis longtemps, ajoute deux pièces neutres qui vont avec, puis une seule qui contraste. Vérifie ensuite la formalité (ta journée) et la température (les couches). Si tu bloques, photographie ton placard dans Margot : elle compose la tenue à partir de tes pièces, en respectant les couleurs qui te vont vraiment.",
  },
  {
    q: "Est-ce que Margot fonctionne avec ma météo locale ?",
    a: "Oui. Margot lit la météo du jour pour l'endroit où tu es, telle que ton téléphone la fournit : température prévue à l'heure de ton départ et de ton retour, pluie ou vent annoncés. Si tu te déplaces, la tenue suit. La tenue du jour est préparée avant ton réveil avec la prévision de la nuit, puis mise à jour si la prévision change nettement dans la journée.",
  },
  {
    q: "Que faire si je n'aime pas la tenue proposée ?",
    a: "Passe-la. Margot en propose une autre, et retient pourquoi la première n'allait pas : trop habillée, une couleur que tu évites, une pièce que tu n'aimes plus. Tu peux aussi remplacer une seule pièce et garder le reste. Chaque refus affine les suivantes ; après une ou deux semaines, les propositions ressemblent à ce que tu aurais choisi toi-même, un peu plus tôt le matin.",
  },
];

export default function QuoiPorterAujourdhuiPage() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Margot", item: `${SITE_URL}/fr` },
      { "@type": "ListItem", position: 2, name: "Quoi porter aujourd'hui ?", item: URL },
    ],
  };

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Quoi porter aujourd'hui ? La méthode en 3 questions (et l'appli qui y répond chaque matin)",
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
    about: {
      "@type": "SoftwareApplication",
      name: "Margot",
      url: SITE_URL,
      downloadUrl: APP_STORE_URL,
      applicationCategory: "LifestyleApplication",
      operatingSystem: "iOS, Android",
    },
  };

  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Savoir quoi porter aujourd'hui : la méthode en 3 questions",
    description:
      "Trois questions à se poser chaque matin pour choisir une tenue depuis son placard : la météo ressentie, l'agenda du jour, et ce qui a déjà été porté cette semaine.",
    inLanguage: "fr-FR",
    totalTime: "PT3M",
    step: STEPS.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      url: `${URL}#etape-${i + 1}`,
    })),
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
            Tenue du jour · Méthode
          </div>
          <h1 className="font-display font-normal text-ink opsz-144 m-0 text-[clamp(34px,4.6vw,56px)] leading-[1.05] tracking-tight2 [text-wrap:balance]">
            Quoi porter aujourd'hui ? La méthode en 3 questions <em>(et l'appli qui y répond chaque matin)</em>
          </h1>
          <p className="mt-5 font-sans text-[17px] leading-[1.6] text-ink2 tracking-tight7 max-w-[640px] [text-wrap:pretty]">
            Pour savoir quoi porter aujourd'hui, réponds à trois questions : quelle météo il fera vraiment entre ton départ et ton retour, ce que ton agenda impose, et ce que tu as déjà porté cette semaine. Trois réponses, une tenue. Et si tu préfères que quelqu'un s'en charge, Margot te la prépare chaque matin depuis ton placard réel.
          </p>
        </header>

        <hr className="border-warm2 my-10" />

        <Section title="La méthode en 3 questions">
          <P>
            La question du matin n'est pas une question de goût. Ton goût va très bien. C'est une question de contraintes, et ton placard n'en dit aucune : il range les vêtements par ce à quoi ils ressemblent sur un cintre, pas par ce qu'ils vaudront à 9 h 14 sous une pluie fine, avec un déjeuner client et un dîner que tu avais oublié. Les trois questions ci-dessous remettent les contraintes dans l'ordre. Chacune se suffit à elle-même.
          </P>
          <ol className="list-none p-0 m-0 max-w-[640px] space-y-8">
            {STEPS.map((s, i) => (
              <li key={s.name} id={`etape-${i + 1}`} className="grid grid-cols-[auto_1fr] gap-x-4">
                <span className="font-display italic text-peach opsz-96 text-[28px] leading-none pt-1">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-sans text-[17px] font-semibold text-ink tracking-tight7 m-0 mb-2 [text-wrap:balance]">
                    {s.name}
                  </h3>
                  <p className="font-sans text-[16px] leading-[1.65] text-ink tracking-tight7 m-0 mb-3 [text-wrap:pretty]">
                    {s.text}
                  </p>
                  <p className="font-sans text-[15px] leading-[1.65] text-ink2 tracking-tight7 m-0 [text-wrap:pretty]">
                    {s.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <P className="mt-8">
            Trois réponses, une tenue, en moins de trois minutes une fois que le réflexe est pris. Si tu veux passer directement à la réponse, c'est exactement ce que fait <Link href="/fr" className="text-ink underline decoration-peach underline-offset-4">Margot</Link> pendant que tu dors.
          </P>
        </Section>

        <Section title="Quoi porter selon la température">
          <P>
            Le tableau ci-dessous part de la température ressentie, pas de celle du bulletin. Les exemples sont volontairement précis : une tenue vague ne s'enfile pas. Adapte les pièces à ce que tu possèdes ; la logique des couches et des matières, elle, ne change pas.
          </P>
          <div className="overflow-x-auto my-6">
            <table className="w-full border-collapse text-left text-[14px] min-w-[640px]">
              <thead>
                <tr className="border-b border-warm2">
                  <Th>Ressenti</Th>
                  <Th>Couches</Th>
                  <Th>Matières</Th>
                  <Th>Exemple de tenue</Th>
                </tr>
              </thead>
              <tbody>
                {TEMPERATURES.map((t) => (
                  <tr key={t.range} className="border-b border-warm2/60 last:border-b-0">
                    <td className="py-3 pr-4 font-sans text-[14px] font-medium text-ink tracking-tight7 align-top whitespace-nowrap">
                      {t.range}
                    </td>
                    <td className="py-3 pr-4 font-sans text-[14px] text-ink2 tracking-tight7 align-top">
                      {t.layers}
                    </td>
                    <td className="py-3 pr-4 font-sans text-[14px] text-ink2 tracking-tight7 align-top">
                      {t.fabrics}
                    </td>
                    <td className="py-3 font-sans text-[14px] text-ink2 tracking-tight7 align-top">
                      {t.example}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <P className="text-ink3 text-[14px]">
            Deux corrections utiles : retire un palier si le vent souffle ou s'il pleut, ajoute-en un si tu restes assise dehors. Et pour une journée qui traverse deux paliers, habille-toi pour le plus froid avec une couche qui s'enlève.
          </P>
        </Section>

        <Section title="Pourquoi on n'a jamais rien à se mettre">
          <P>
            Ce n'est pas une impression. Selon l'étude publiée par l'ADEME avec l'Obsoco en juin 2025, une personne en France déclare posséder 79 vêtements en moyenne, alors qu'un comptage réel en trouve 175, et plus de la moitié restent au placard sans être portés. Le problème n'est donc pas le manque. C'est l'inverse : trop de pièces, mal indexées, et aucune mémoire de ce qui va avec quoi au moment précis où on en a besoin.
          </P>
          <P>
            Le matin, on regarde les cintres, on voit des vêtements. On ne voit pas les tenues, encore moins celles qui conviennent à 11 degrés, à une réunion à 10 h et à l'envie de ne pas remettre le même pull que mardi. Le cerveau fait ce calcul en quelques secondes pour cinq tenues familières, puis abandonne. C'est ce qui donne la phrase « je n'ai rien à me mettre » devant cent soixante-dix pièces.
          </P>
          <P>
            La solution n'est pas d'acheter une pièce de plus. C'est de retrouver, ce matin précis, celles que tu as déjà. Une garde-robe qui se souvient pour toi, qui sait ce qui a été porté et ce qui dort, résout la moitié du problème. La météo et l'agenda résolvent l'autre moitié. Le guide de la <Link href="/fr/garde-robe-digitale" className="text-ink underline decoration-peach underline-offset-4">garde-robe digitale</Link> détaille comment on construit cette mémoire en une soirée.
          </P>
        </Section>

        <Section title="Comment Margot choisit ta tenue du jour">
          <P>
            Margot est une styliste qui vit dans ton téléphone et qui a lu ton placard une fois pour toutes. Chaque matin, elle répond aux trois questions à ta place, avec trois sources que tu lui as ouvertes.
          </P>
          <Ul>
            <Li>
              <Strong>La météo réelle.</Strong> Pas la saison, pas la moyenne : la prévision pour ta position, entre l'heure où tu sors et celle où tu rentres, pluie et vent compris.
            </Li>
            <Li>
              <Strong>Ton agenda.</Strong> Margot lit les titres de tes événements, jamais leur contenu. « Point équipe 9 h » et « Dîner chez Léa » ne donnent pas la même veste, et elle le sait avant toi.
            </Li>
            <Li>
              <Strong>Ce que tu n'as pas porté.</Strong> Elle tient le compte, discrètement, de ce qui a été mis et quand. La tenue du jour penche vers ce qui dort depuis des semaines. Ce n'est pas une leçon de morale, c'est un aide-mémoire.
            </Li>
          </Ul>
          <P>
            Avec ces trois entrées, elle compose une tenue depuis tes pièces, en la passant au crible d'un moteur de 49 règles de style, harmonie des couleurs, matières et saison, silhouette, formalité, et de ta colorimétrie personnelle en 12 saisons, établie depuis une photo à l'inscription. Le résultat est une seule proposition, pas un fil à faire défiler.
          </P>
          <P>
            Le détail qui change le matin : la tenue est <Strong>préparée à l'avance</Strong>, pendant la nuit, avec la prévision de la veille. Quand tu ouvres l'application, elle est déjà là, sans attente. Un rappel arrive à ton heure, celle que tu as choisie, pas à sept heures pour tout le monde. Tu acceptes, tu passes, ou tu remplaces une pièce ; elle retient ton choix et fait un peu mieux le lendemain. Le tout tient dans le temps d'un café.
          </P>
          <P className="text-ink3 font-display italic">
            Margot ne t'inventera pas un style. Elle travaille avec le tien, celui qui est déjà sur les cintres.
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
            La tenue du jour, chaque matin
          </div>
          <p className="font-display italic text-ink opsz-96 text-[clamp(18px,2vw,22px)] leading-[1.4] tracking-tight5 max-w-[460px] mx-auto m-0 mb-5 [text-wrap:pretty]">
            Margot est gratuite sur l'App Store et Google Play. Photographie cinq pièces ce soir, elle t'habille demain matin.
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
          À lire aussi : <Link href="/fr/garde-robe-digitale" className="text-ink underline decoration-peach underline-offset-4">le guide de la garde-robe digitale</Link> · <Link href="/fr/vs/whering" className="text-ink underline decoration-peach underline-offset-4">Whering ou Margot, le comparatif honnête</Link> · <Link href="/blog/what-to-wear-today" className="text-ink underline decoration-peach underline-offset-4">version anglaise de cet article</Link>.
        </div>
      </article>

      <script type="application/ld+json" suppressHydrationWarning>
        {safeJson(article)}
      </script>
      <script type="application/ld+json" suppressHydrationWarning>
        {safeJson(breadcrumb)}
      </script>
      <script type="application/ld+json" suppressHydrationWarning>
        {safeJson(howTo)}
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
