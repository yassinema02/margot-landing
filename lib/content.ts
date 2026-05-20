export type MargotState = "considering" | "pleased" | "skeptical";

export interface FeatureItem {
  title: string;
  body: string;
  state: MargotState;
  img: string;
  imgAlt: string;
}

export interface FaqEntry {
  q: string;
  a: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface HowItWorksStep {
  num: string;
  title: string;
  body: string;
  img: string;
  imgAlt: string;
}

export interface ComparisonRow {
  feature: string;
  margot: boolean;
  whering: boolean;
  aesty: boolean;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export interface LangContent {
  lang: "EN" | "FR";
  toggle: "EN" | "FR";
  hero: {
    eyebrow: string;
    headline: [string, string];
    subline: string;
    placeholder: string;
    button: string;
    micro: string;
    counterFallback: string;
    counterTemplate: string; // e.g. "Join {n} others on the waitlist."
    phoneAlt: string;
  };
  success: {
    eyebrow: string;
    headline: string;
    body: string;
    cta: string;
    hint: string;
  };
  problem: string;
  howItWorks: {
    eyebrow: string;
    headline: string;
    steps: HowItWorksStep[];
  };
  features: FeatureItem[];
  meet: { eyebrow: string; headline: string; body: string };
  whyMargot: {
    eyebrow: string;
    headline: string;
    headers: { feature: string; margot: string; whering: string; aesty: string };
    rows: ComparisonRow[];
  };
  pricing: {
    eyebrow: string;
    headline: string;
    price: string;
    priceSub: string;
    trial: string;
    bullets: string[];
    note: string;
    cta: string;
  };
  socialProof: {
    eyebrow: string;
    items: Testimonial[];
  };
  faqHeading: string;
  faq: FaqEntry[];
  footer: {
    madeIn: string;
    tagline: string;
    newsletterLabel: string;
    newsletterButton: string;
    links: FooterLink[];
    legal: string;
  };
}

export const LANDING_CONTENT: Record<"en" | "fr", LangContent> = {
  en: {
    lang: "EN",
    toggle: "FR",
    hero: {
      eyebrow: "Now in private beta. Reserve your spot.",
      headline: ["Your wardrobe,", "observed."],
      subline:
        "So apparently we all have ‘nothing to wear’… with full wardrobes. Makes total sense. Anyway, Margot just fixes that little illusion for you.",
      placeholder: "your.email@example.com",
      button: "Reserve my spot",
      micro: "No spam. One email when Margot opens her doors.",
      counterFallback: "Join the waitlist.",
      counterTemplate: "Join {n} others on the waitlist.",
      phoneAlt: "Margot's daily look screen showing today's suggested outfit",
    },
    success: {
      eyebrow: "you're in.",
      headline: "You're #2,847.",
      body: "Skip the line — invite three friends and we'll move you up the list.",
      cta: "Copy your invite link",
      hint: "Or share directly →",
    },
    problem:
      "You own a hundred pieces of clothing. You wear thirty. Every morning, you stand in front of your closet and feel like you have nothing. Margot fixes that — without asking you to buy a single new thing.",
    howItWorks: {
      eyebrow: "How it works · 3 steps",
      headline: "From closet to outfit in 60 seconds",
      steps: [
        {
          num: "01",
          title: "Snap your closet",
          body: "Take photos of your clothes once. Margot's vision pipeline tags fabric, color, and category.",
          img: "/screenshots/step-1-snap.png",
          imgAlt: "Margot capture screen showing a clothing item being added to the wardrobe",
        },
        {
          num: "02",
          title: "Let her learn",
          body: "She builds a memory of every piece — what's hanging, what's neglected, what pairs with what.",
          img: "/screenshots/step-2-grid.png",
          imgAlt: "Wardrobe grid view in Margot showing tagged clothing items",
        },
        {
          num: "03",
          title: "Get dressed",
          body: "Each morning, an outfit suggestion based on weather, your calendar, and what you haven't worn lately.",
          img: "/screenshots/step-3-today.png",
          imgAlt: "Today's outfit suggestion screen in Margot",
        },
      ],
    },
    features: [
      {
        title: "A wardrobe she knows by heart",
        body: "Upload your clothes once. Margot remembers everything — what's hanging, what's neglected, what pairs with what.",
        state: "considering",
        img: "/screenshots/feat-wardrobe.png",
        imgAlt: "Margot wardrobe grid view",
      },
      {
        title: "Daily looks, composed",
        body: "Each morning, an outfit suggestion based on the weather, your calendar, and the pieces that haven’t been worn lately.",
        state: "pleased",
        img: "/screenshots/feat-daily.png",
        imgAlt: "Margot daily outfit detail screen",
      },
      {
        title: "Check before you buy",
        body: "Found something you want? Margot tells you whether it actually works with what you have — before you spend.",
        state: "skeptical",
        img: "/screenshots/feat-check.png",
        imgAlt: "Margot check-before-you-buy comparison dialog",
      },
    ],
    meet: {
      eyebrow: "meet margot",
      headline: "She is the magpie.",
      body: "In French folklore, Margot is the name of the magpie — the bird that collects everything that shines. She remembers where she put it. She returns to it when the season turns. Now, she keeps your closet.",
    },
    whyMargot: {
      eyebrow: "Why Margot",
      headline: "Other wardrobe apps stop at the closet. Margot dresses you.",
      headers: { feature: "Feature", margot: "Margot", whering: "Whering", aesty: "Aesty" },
      rows: [
        { feature: "Daily AI outfit", margot: true, whering: false, aesty: false },
        { feature: "Calendar-aware", margot: true, whering: false, aesty: false },
        { feature: "Check-before-you-buy", margot: true, whering: false, aesty: true },
        { feature: "7-day free trial", margot: true, whering: true, aesty: false },
      ],
    },
    pricing: {
      eyebrow: "Pricing",
      headline: "Free to start. Premium when you're ready.",
      price: "£4.99 / month",
      priceSub: "€5.99 · $5.99 · available worldwide",
      trial: "7-day free trial",
      bullets: [
        "Unlimited daily outfit suggestions",
        "Unlimited shopping checks",
        "Calendar & weather context",
        "Vinted listing assistant",
      ],
      note: "Early waitlist members get an extra month free.",
      cta: "Reserve my spot",
    },
    socialProof: {
      eyebrow: "Early voices",
      items: [
        { quote: "[TESTIMONIAL_1 — Yassine to fill]", name: "[Name]", role: "[Role]" },
        { quote: "[TESTIMONIAL_2 — Yassine to fill]", name: "[Name]", role: "[Role]" },
      ],
    },
    faqHeading: "Questions, briefly.",
    faq: [
      { q: "When can I actually use Margot?", a: "Margot is in private TestFlight now. Waitlist members will receive an invite during the public launch in the coming weeks." },
      { q: "Do I need to upload every single piece of clothing?", a: "No. Margot starts working with five items. She learns the rest of your wardrobe as you log what you wear each day." },
      { q: "Will Margot try to sell me things?", a: "No. Margot is built to help you wear what you already own. The 'Check Before You Buy' feature is designed to help you buy less, not more." },
      { q: "What about my privacy?", a: "Your wardrobe photos stay yours. Margot uses anonymised summaries for the AI suggestions — never images or identity. Full policy in the footer." },
      { q: "Where is my data stored?", a: "Your wardrobe lives on Supabase EU servers, encrypted in transit and at rest. We never sell or share it. Read the full Privacy Policy linked in the footer." },
      { q: "What if Margot suggests something weird?", a: "She learns from your feedback. Love it, save it, or dismiss it — she adjusts. Your taste is the model." },
    ],
    footer: {
      madeIn: "Crafted from Casablanca · for Paris and London",
      tagline: "the magpie who reads your closet.",
      newsletterLabel: "Subscribe to the magpie's notes",
      newsletterButton: "Subscribe",
      links: [
        { label: "Privacy Policy", href: "https://yasine123456.github.io/margot-privacy-policy/" },
        { label: "Contact", href: "mailto:yassine@benlahmr.com" },
        { label: "Instagram", href: "https://instagram.com/margotwardrobe" },
        { label: "TikTok", href: "https://tiktok.com/@margotwardrobe" },
        { label: "X", href: "https://x.com/margotwardrobe" },
      ],
      legal: "© 2026 Margot",
    },
  },
  fr: {
    lang: "FR",
    toggle: "EN",
    hero: {
      eyebrow: "En bêta privée. Réservez votre place.",
      headline: ["Votre garde-robe,", "observée."],
      subline:
        "Apparemment, on a toutes « rien à se mettre »… avec un dressing plein. Logique. Bref, Margot règle cette petite illusion pour vous.",
      placeholder: "votre.email@exemple.com",
      button: "Réserver ma place",
      micro: "Pas de spam. Un seul email à l'ouverture.",
      counterFallback: "Rejoignez la liste d'attente.",
      counterTemplate: "Rejoignez {n} autres sur la liste d'attente.",
      phoneAlt: "Écran de la tenue du jour dans Margot",
    },
    success: {
      eyebrow: "inscrite.",
      headline: "Vous êtes n°2 847.",
      body: "Passez devant — invitez trois amies, et nous vous remontons dans la file.",
      cta: "Copier votre lien",
      hint: "Ou partager directement →",
    },
    problem:
      "Vous possédez cent vêtements. Vous en portez trente. Chaque matin, vous restez devant votre dressing en pensant que vous n'avez rien à mettre. Margot règle ça — sans vous demander d'acheter quoi que ce soit de nouveau.",
    howItWorks: {
      eyebrow: "Comment ça marche · 3 étapes",
      headline: "Du dressing à la tenue en 60 secondes",
      steps: [
        {
          num: "01",
          title: "Photographiez vos vêtements",
          body: "Photographiez chaque pièce une fois. Margot détecte la matière, la couleur et la catégorie.",
          img: "/screenshots/step-1-snap.png",
          imgAlt: "Écran de capture d'une pièce dans Margot",
        },
        {
          num: "02",
          title: "Laissez-la apprendre",
          body: "Elle construit la mémoire de votre dressing — ce qui pend, ce qui dort, ce qui va avec quoi.",
          img: "/screenshots/step-2-grid.png",
          imgAlt: "Vue grille du dressing dans Margot",
        },
        {
          num: "03",
          title: "Habillez-vous",
          body: "Chaque matin, une tenue suggérée selon la météo, votre agenda et les pièces que vous délaissez.",
          img: "/screenshots/step-3-today.png",
          imgAlt: "Écran de la tenue du jour dans Margot",
        },
      ],
    },
    features: [
      {
        title: "Une garde-robe qu’elle connaît par cœur",
        body: "Photographiez vos vêtements une fois. Margot retient tout — ce qui pend, ce qui dort, ce qui va avec quoi.",
        state: "considering",
        img: "/screenshots/feat-wardrobe.png",
        imgAlt: "Vue grille du dressing dans Margot",
      },
      {
        title: "Une tenue, chaque matin",
        body: "Chaque jour, une suggestion d’outfit pensée selon la météo, votre agenda, et les pièces que vous délaissez.",
        state: "pleased",
        img: "/screenshots/feat-daily.png",
        imgAlt: "Détail d'une tenue quotidienne dans Margot",
      },
      {
        title: "Avant d’acheter, demandez à Margot",
        body: "Une pièce vous tente ? Margot vous dit si elle complète vraiment votre garde-robe — avant que vous ne sortiez la carte.",
        state: "skeptical",
        img: "/screenshots/feat-check.png",
        imgAlt: "Écran 'avant d'acheter' dans Margot",
      },
    ],
    meet: {
      eyebrow: "rencontrez margot",
      headline: "Elle, c’est la pie.",
      body: "Dans la tradition française, Margot est le nom de la pie — l'oiseau qui collectionne tout ce qui brille. Elle se souvient d'où elle l'a posé. Elle y revient à chaque changement de saison. Aujourd'hui, elle s'occupe de votre garde-robe.",
    },
    whyMargot: {
      eyebrow: "Pourquoi Margot",
      headline: "Les autres apps s'arrêtent au dressing. Margot vous habille.",
      headers: { feature: "Fonctionnalité", margot: "Margot", whering: "Whering", aesty: "Aesty" },
      rows: [
        { feature: "Tenue IA quotidienne", margot: true, whering: false, aesty: false },
        { feature: "Agenda intégré", margot: true, whering: false, aesty: false },
        { feature: "Avant d'acheter", margot: true, whering: false, aesty: true },
        { feature: "7 jours d'essai gratuit", margot: true, whering: true, aesty: false },
      ],
    },
    pricing: {
      eyebrow: "Tarifs",
      headline: "Gratuit pour commencer. Premium quand vous êtes prêt·e.",
      price: "4,99 £ / mois",
      priceSub: "5,99 € · 5,99 $ · disponible dans le monde entier",
      trial: "7 jours d'essai gratuit",
      bullets: [
        "Suggestions de tenues illimitées",
        "Vérifications d'achat illimitées",
        "Météo et agenda intégrés",
        "Assistant de revente Vinted",
      ],
      note: "Les membres de la liste d'attente reçoivent un mois supplémentaire gratuit.",
      cta: "Réserver ma place",
    },
    socialProof: {
      eyebrow: "Premières voix",
      items: [
        { quote: "[TESTIMONIAL_1 — Yassine to fill]", name: "[Name]", role: "[Role]" },
        { quote: "[TESTIMONIAL_2 — Yassine to fill]", name: "[Name]", role: "[Role]" },
      ],
    },
    faqHeading: "Questions, en bref.",
    faq: [
      { q: "Quand est-ce que je pourrai utiliser Margot ?", a: "Margot est en TestFlight privé. Les inscrites recevront une invitation lors de l'ouverture publique dans les semaines qui viennent." },
      { q: "Dois-je photographier toute ma garde-robe d'un coup ?", a: "Non. Margot démarre avec cinq pièces. Elle apprend le reste au fur et à mesure que vous notez ce que vous portez." },
      { q: "Margot va-t-elle me pousser à acheter ?", a: "Non. Margot existe pour vous aider à mieux porter ce que vous avez déjà. Le 'Check Before You Buy' est fait pour vous aider à acheter moins, pas plus." },
      { q: "Et ma vie privée ?", a: "Vos photos de vêtements vous appartiennent. Margot n'envoie que des résumés anonymisés à l'IA — jamais les images ni votre identité. Politique complète en bas de page." },
      { q: "Où sont stockées mes données ?", a: "Votre garde-robe vit sur des serveurs Supabase en Europe, chiffrée en transit et au repos. Nous ne vendons ni ne partageons rien. Politique complète en bas de page." },
      { q: "Et si Margot propose une tenue bizarre ?", a: "Elle apprend de vos retours. Aimez, sauvegardez, ou rejetez — elle s'ajuste. Votre goût, c'est le modèle." },
    ],
    footer: {
      madeIn: "Imaginé à Casablanca · pour Paris et Londres",
      tagline: "la pie qui lit votre garde-robe.",
      newsletterLabel: "Recevez les carnets de la pie",
      newsletterButton: "S'inscrire",
      links: [
        { label: "Confidentialité", href: "https://yasine123456.github.io/margot-privacy-policy/" },
        { label: "Contact", href: "mailto:yassine@benlahmr.com" },
        { label: "Instagram", href: "https://instagram.com/margotwardrobe" },
        { label: "TikTok", href: "https://tiktok.com/@margotwardrobe" },
        { label: "X", href: "https://x.com/margotwardrobe" },
      ],
      legal: "© 2026 Margot",
    },
  },
};
