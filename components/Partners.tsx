import Link from "next/link";

// Page destinee aux annonceurs et aux reseaux d'affiliation (Awin, Kwanko,
// Tradedoubler). Elle repond a une seule question, celle que pose un
// responsable affiliation quand il ouvre notre dossier : "ou et comment mes
// produits apparaissent-ils dans cette app ?". Le refus Hugo Boss du 28/08/26
// ("le site web n'est pas en affinite avec la marque") venait de la : la
// landing ne montrait aucun mecanisme shopping.
//
// La fiche produit ci-dessous est un rendu HTML fidele du composant in-app,
// pas une capture. A remplacer par de vraies captures quand le catalogue
// affilie sera branche.

type Lang = "EN" | "FR";

const COPY = {
  EN: {
    back: "← Back to Margot",
    eyebrow: "For brands and affiliate networks",
    h1: ["Where your products ", "appear", "."],
    lede:
      "Margot is a personal stylist app. She reads someone's real wardrobe, dresses them from it, and points to a product only when something is genuinely missing. This page shows exactly where that product shows up.",
    s1: {
      title: "What Margot is",
      p1: "Margot is an iOS and Android app, live on the App Store and Google Play, published by Yavren (Paris). Users photograph the clothes they already own. Margot categorises each piece, builds outfits from them every morning, and learns their taste from what they wear and save.",
      p2: "The audience is over 90% French-speaking: France first, then Belgium, Switzerland and Morocco. Margot carries no display advertising. Product recommendations are editorial, personalised, and disclosed as affiliate links.",
    },
    s2: {
      title: "How a recommendation happens",
      steps: [
        ["The wardrobe is read", "Each item is categorised by type, colour, material, formality and season. Nothing is recommended before Margot knows what someone already owns."],
        ["A gap is identified", "A deterministic styling engine of 49 rules compares the wardrobe against the outfits the user actually needs. It surfaces real gaps: no mid-season jacket, no shoe that works with the two dresses she wears most."],
        ["A product fills that gap", "The gap becomes a precise product brief: category, colour range, formality, price band, size. Margot matches it against the merchant catalogue and picks what fits both the gap and the user's taste profile."],
        ["The user sees a product card", "Brand, photo, price and a link to your site. The card says which gap the piece fills. Nothing is bundled, nothing is auto-added, nothing is incentivised."],
      ],
      also: "Two other surfaces work the same way: the stylist chat, where a user asks for a specific piece and Margot answers with three to five real products, and Check Before You Buy, where the user pastes a product URL and Margot gives a verdict against the wardrobe they already own.",
    },
    s3: {
      title: "The product card",
      note: "This is the placement, rendered exactly as it appears in the app.",
      card: {
        gap: "Fills a gap · mid-season jacket",
        brand: "YOUR BRAND",
        name: "Cotton-twill overshirt, ecru",
        price: "€129",
        cta: "View at your store",
        why: "Works with 7 pieces you already own · matches your neutral palette",
        disclosure: "Affiliate link. Margot may earn a commission. It changes nothing for you and nothing in the recommendation.",
      },
    },
    s4: {
      title: "Why this traffic is worth having",
      points: [
        ["Intent comes before the product", "The gap is identified first, from a real wardrobe. The user is not browsing, she is filling a hole she has just had explained to her."],
        ["The match is filtered", "Colour palette, price band and brand affinity come from her own profile. She is not shown a €400 coat if she has never bought above €120."],
        ["Fewer returns", "The piece is checked against what she already owns before she ever sees it. She knows what she will wear it with."],
        ["We tell people to buy less", "That is the honest trade. Margot's job is to make an existing wardrobe work harder, so she recommends rarely. When she does, it has been considered."],
      ],
    },
    s5: {
      title: "How we work with advertisers",
      yes: [
        "We ingest your product feed daily: deep link, licensed images, price, stock, EAN. Links and prices shown in the app come from your feed, never from a scrape.",
        "Traffic is in-app and editorial. One user, one wardrobe, one recommendation at a time.",
        "Affiliate relationships are disclosed on every product card.",
      ],
      no: [
        "No PPC on your brand terms.",
        "No toolbar, no browser extension, no cashback, no incentivised clicks.",
        "No coupon or voucher-code site behaviour.",
        "No scraping of your site, ever. Feeds only.",
      ],
    },
    s6: {
      title: "Working with us",
      p: "We are live on Awin as publisher Yavren, ID 3048471, primary region France. We are opening Kwanko, Effinity and Tradedoubler alongside it. If you run a fashion, footwear or accessories programme in France and want to see the app before approving, write to us and we will send a build and a walkthrough.",
      contact: "margot@margotwardrobe.com",
    },
    status:
      "Status, kept honest: Margot already recommends real products to users today. The affiliate catalogue is being connected now, advertiser by advertiser, which is why you are reading this page.",
  },
  FR: {
    back: "← Retour à Margot",
    eyebrow: "Pour les marques et les réseaux d'affiliation",
    h1: ["Où vos produits ", "apparaissent", "."],
    lede:
      "Margot est une application de styliste personnel. Elle lit la vraie garde-robe de quelqu'un, l'habille avec, et ne montre un produit que lorsqu'il manque réellement quelque chose. Cette page montre exactement où ce produit apparaît.",
    s1: {
      title: "Ce qu'est Margot",
      p1: "Margot est une application iOS et Android, disponible sur l'App Store et Google Play, éditée par Yavren (Paris). Les utilisatrices photographient les vêtements qu'elles possèdent déjà. Margot catégorise chaque pièce, compose des tenues chaque matin, et apprend leur goût à partir de ce qu'elles portent et sauvegardent.",
      p2: "L'audience est francophone à plus de 90% : la France d'abord, puis la Belgique, la Suisse et le Maroc. Margot ne diffuse aucune publicité display. Les recommandations produit sont éditoriales, personnalisées, et signalées comme liens d'affiliation.",
    },
    s2: {
      title: "Comment naît une recommandation",
      steps: [
        ["La garde-robe est lue", "Chaque pièce est catégorisée par type, couleur, matière, formalité et saison. Rien n'est recommandé avant que Margot sache ce que la personne possède déjà."],
        ["Un manque est identifié", "Un moteur de stylisme déterministe de 49 règles compare la garde-robe aux tenues dont l'utilisatrice a réellement besoin. Il fait apparaître de vrais manques : aucune veste de mi-saison, aucune chaussure qui fonctionne avec les deux robes qu'elle porte le plus."],
        ["Un produit comble ce manque", "Le manque devient un brief produit précis : catégorie, gamme de couleurs, formalité, budget, taille. Margot le confronte au catalogue marchand et retient ce qui correspond au manque comme au profil de goût."],
        ["L'utilisatrice voit une fiche produit", "Marque, photo, prix, et un lien vers votre site. La fiche indique quel manque la pièce comble. Rien n'est groupé, rien n'est ajouté automatiquement, rien n'est incité."],
      ],
      also: "Deux autres surfaces fonctionnent de la même façon : le chat styliste, où l'utilisatrice demande une pièce précise et Margot répond avec trois à cinq produits réels, et Check Before You Buy, où elle colle l'URL d'un produit et Margot rend un verdict au regard de la garde-robe qu'elle possède déjà.",
    },
    s3: {
      title: "La fiche produit",
      note: "Voici l'emplacement, rendu tel qu'il apparaît dans l'application.",
      card: {
        gap: "Comble un manque · veste de mi-saison",
        brand: "VOTRE MARQUE",
        name: "Surchemise en twill de coton, écru",
        price: "129 €",
        cta: "Voir sur votre site",
        why: "Se porte avec 7 pièces que vous avez déjà · s'accorde à votre palette neutre",
        disclosure: "Lien d'affiliation. Margot peut percevoir une commission. Cela ne change rien pour vous, ni rien à la recommandation.",
      },
    },
    s4: {
      title: "Pourquoi ce trafic vaut la peine",
      points: [
        ["L'intention précède le produit", "Le manque est identifié en premier, à partir d'une vraie garde-robe. L'utilisatrice ne navigue pas, elle comble un trou qu'on vient de lui expliquer."],
        ["Le matching est filtré", "Palette de couleurs, budget et affinité de marque viennent de son propre profil. On ne lui montre pas un manteau à 400 € si elle n'a jamais acheté au-dessus de 120 €."],
        ["Moins de retours", "La pièce est confrontée à ce qu'elle possède déjà avant même qu'elle la voie. Elle sait avec quoi elle va la porter."],
        ["Nous disons aux gens d'acheter moins", "C'est l'échange honnête. Le métier de Margot est de faire mieux travailler une garde-robe existante, donc elle recommande rarement. Quand elle le fait, c'est réfléchi."],
      ],
    },
    s5: {
      title: "Notre façon de travailler avec les annonceurs",
      yes: [
        "Nous intégrons votre flux produit quotidiennement : deep link, images licenciées, prix, stock, EAN. Les liens et les prix affichés dans l'app viennent de votre flux, jamais d'un scraping.",
        "Le trafic est in-app et éditorial. Une utilisatrice, une garde-robe, une recommandation à la fois.",
        "La relation d'affiliation est signalée sur chaque fiche produit.",
      ],
      no: [
        "Pas de PPC sur vos termes de marque.",
        "Pas de toolbar, pas d'extension navigateur, pas de cashback, pas de clic incité.",
        "Aucun comportement de site à codes promo.",
        "Aucun scraping de votre site, jamais. Uniquement des flux.",
      ],
    },
    s6: {
      title: "Travailler ensemble",
      p: "Nous sommes sur Awin sous l'éditeur Yavren, ID 3048471, région principale France. Nous ouvrons Kwanko, Effinity et Tradedoubler en parallèle. Si vous gérez un programme mode, chaussures ou accessoires en France et souhaitez voir l'application avant de valider, écrivez-nous : nous envoyons un build et une démo.",
      contact: "margot@margotwardrobe.com",
    },
    status:
      "Le statut, dit honnêtement : Margot recommande déjà de vrais produits à ses utilisatrices aujourd'hui. Le catalogue affilié est en cours de branchement, annonceur par annonceur, et c'est la raison de cette page.",
  },
} as const;

export function Partners({ lang = "EN" }: { lang?: Lang }) {
  const c = COPY[lang];
  const home = lang === "FR" ? "/fr" : "/";

  return (
    <main className="bg-bg text-ink min-h-screen px-6 py-[clamp(48px,7vw,96px)]">
      <article className="max-w-[760px] mx-auto">
        <Link
          href={home}
          className="font-sans text-[12px] font-medium tracking-tight7 text-ink3 hover:text-ink no-underline"
        >
          {c.back}
        </Link>

        <header className="mt-8 mb-12">
          <div className="font-sans text-[11px] font-semibold tracking-wider2 uppercase text-peach mb-4">
            {c.eyebrow}
          </div>
          <h1 className="font-display font-normal text-ink opsz-144 m-0 text-[clamp(40px,5.5vw,68px)] leading-[1.02] tracking-tight2 [text-wrap:balance]">
            {c.h1[0]}
            <em>{c.h1[1]}</em>
            {c.h1[2]}
          </h1>
          <p className="mt-5 font-display italic text-ink3 opsz-96 text-[clamp(16px,1.7vw,19px)] leading-[1.45] tracking-tight5 max-w-[620px] [text-wrap:pretty]">
            {c.lede}
          </p>
        </header>

        <Section title={c.s1.title}>
          <P>{c.s1.p1}</P>
          <P>{c.s1.p2}</P>
        </Section>

        <Section title={c.s2.title}>
          <ol className="list-none p-0 m-0 flex flex-col gap-7">
            {c.s2.steps.map(([title, body], i) => (
              <li key={title} className="grid grid-cols-[auto_1fr] gap-4 items-start">
                <span className="font-sans text-[11px] font-semibold tracking-wider2 text-peach mt-[5px] tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="font-sans text-[15px] font-semibold text-ink tracking-tight6">{title}</div>
                  <p className="mt-1.5 mb-0 font-sans text-[15px] leading-[1.6] text-ink2 tracking-tight7">{body}</p>
                </div>
              </li>
            ))}
          </ol>
          <P className="mt-7">{c.s2.also}</P>
        </Section>

        <Section title={c.s3.title}>
          <P>{c.s3.note}</P>

          <div className="mt-6 rounded-[22px] border border-warm2 bg-surface p-5 sm:p-6 shadow-[0_24px_60px_-42px_rgba(45,58,51,0.55)]">
            <div className="font-sans text-[10px] font-semibold tracking-wider2 uppercase text-peach">
              {c.s3.card.gap}
            </div>

            <div className="mt-4 grid grid-cols-[92px_1fr] sm:grid-cols-[112px_1fr] gap-4 sm:gap-5 items-start">
              <div
                className="aspect-[3/4] rounded-[14px] border border-warm2 bg-warm flex items-center justify-center"
                aria-hidden="true"
              >
                <span className="font-sans text-[9px] tracking-wider2 uppercase text-ink4 text-center px-2">
                  {lang === "FR" ? "Photo de votre flux" : "Photo from your feed"}
                </span>
              </div>

              <div className="min-w-0">
                <div className="font-sans text-[10px] font-semibold tracking-wider2 uppercase text-ink3">
                  {c.s3.card.brand}
                </div>
                <div className="mt-1.5 font-display text-[19px] leading-[1.25] text-ink opsz-96 tracking-tight5">
                  {c.s3.card.name}
                </div>
                <div className="mt-2 font-sans text-[15px] font-semibold text-ink tracking-tight6">
                  {c.s3.card.price}
                </div>
                <div className="mt-4 inline-flex items-center rounded-full bg-ink px-4 py-2 font-sans text-[12px] font-semibold tracking-tight7 text-bg">
                  {c.s3.card.cta}
                </div>
              </div>
            </div>

            <p className="mt-5 mb-0 font-display italic text-[14px] leading-[1.5] text-ink2 opsz-96 tracking-tight6">
              {c.s3.card.why}
            </p>
            <p className="mt-3 mb-0 font-sans text-[11px] leading-[1.5] text-ink3 tracking-tight7">
              {c.s3.card.disclosure}
            </p>
          </div>
        </Section>

        <Section title={c.s4.title}>
          <div className="flex flex-col gap-6">
            {c.s4.points.map(([title, body]) => (
              <div key={title}>
                <div className="font-sans text-[15px] font-semibold text-ink tracking-tight6">{title}</div>
                <p className="mt-1.5 mb-0 font-sans text-[15px] leading-[1.6] text-ink2 tracking-tight7">{body}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title={c.s5.title}>
          <ul className="list-none p-0 m-0 flex flex-col gap-3">
            {c.s5.yes.map((line) => (
              <li key={line} className="grid grid-cols-[auto_1fr] gap-3 items-start">
                <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-sage" aria-hidden="true" />
                <span className="font-sans text-[15px] leading-[1.6] text-ink2 tracking-tight7">{line}</span>
              </li>
            ))}
          </ul>
          <ul className="list-none p-0 mt-5 mb-0 flex flex-col gap-3">
            {c.s5.no.map((line) => (
              <li key={line} className="grid grid-cols-[auto_1fr] gap-3 items-start">
                <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-peach" aria-hidden="true" />
                <span className="font-sans text-[15px] leading-[1.6] text-ink2 tracking-tight7">{line}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title={c.s6.title}>
          <P>{c.s6.p}</P>
          <p className="mt-4 mb-0">
            <a
              href={`mailto:${c.s6.contact}`}
              className="font-sans text-[15px] font-semibold text-ink tracking-tight6 no-underline border-b border-peach hover:text-peach transition-colors"
            >
              {c.s6.contact}
            </a>
          </p>
        </Section>

        <p className="mt-14 pt-6 border-t border-warm2 font-sans text-[13px] leading-[1.6] text-ink3 tracking-tight7">
          {c.status}
        </p>
      </article>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="font-display font-normal text-ink opsz-96 m-0 mb-5 text-[clamp(24px,3vw,32px)] leading-[1.15] tracking-tight4">
        {title}
      </h2>
      {children}
    </section>
  );
}

function P({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`mt-0 mb-4 font-sans text-[15px] leading-[1.65] text-ink2 tracking-tight7 last:mb-0 ${className}`}>
      {children}
    </p>
  );
}
