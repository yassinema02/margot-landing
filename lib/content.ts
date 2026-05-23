export type MargotState = "considering" | "pleased" | "skeptical";

export interface FeatureItem {
  title: string;
  body: string;
  state: MargotState;
  label: string;
  epigraph: string;
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
  stamp: string;
}

export interface DiffCard {
  label: string;
  headline: string;
  body: string;
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
    seoLine: string;
  };
  success: {
    eyebrow: string;
    headline: string; // contains "{N}" — replaced with position at render time
    body: string;
    cta: string;
    copied: string;
    hint: string;
    shareText: string;
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
    lead: string;
    cards: DiffCard[];
  };
  pricing: {
    eyebrow: string;
    headline: string;
    prices: { gbp: string; eur: string; usd: string };
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
      seoLine: "AI wardrobe app · daily outfits · for what you already own.",
    },
    success: {
      eyebrow: "you're in.",
      headline: "You're #{N}.",
      body: "Invite 5 friends to unlock 7 days of Margot premium, on the house.",
      cta: "Copy your invite link",
      copied: "Copied ✓",
      hint: "Or share directly →",
      shareText: "I just joined the Margot waitlist — daily outfit suggestions from what you already own.",
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
          stamp: "One photo, one piece, one memory.",
        },
        {
          num: "02",
          title: "Let her learn",
          body: "She builds a memory of every piece — what's hanging, what's neglected, what pairs with what.",
          stamp: "She watches more than she speaks.",
        },
        {
          num: "03",
          title: "Get dressed",
          body: "Each morning, an outfit suggestion based on weather, your calendar, and what you haven't worn lately.",
          stamp: "By the time the kettle whistles.",
        },
      ],
    },
    features: [
      {
        title: "A wardrobe she knows by heart",
        body: "Upload your clothes once. Margot remembers everything — what's hanging, what's neglected, what pairs with what.",
        state: "considering",
        label: "Memory",
        epigraph: "hung",
      },
      {
        title: "Daily looks, composed",
        body: "Each morning, an outfit suggestion based on the weather, your calendar, and the pieces that haven’t been worn lately.",
        state: "pleased",
        label: "Morning",
        epigraph: "poured",
      },
      {
        title: "Check before you buy",
        body: "Found something you want? Margot tells you whether it actually works with what you have — before you spend.",
        state: "skeptical",
        label: "Check",
        epigraph: "weighed",
      },
    ],
    meet: {
      eyebrow: "meet margot",
      headline: "She is the magpie.",
      body: "In French folklore, Margot is the name of the magpie — the bird that collects everything that shines. She remembers where she put it. She returns to it when the season turns. Now, she keeps your closet.",
    },
    whyMargot: {
      eyebrow: "Built different",
      headline: "Built different.",
      lead: "Three things Margot does that other wardrobe apps don't.",
      cards: [
        {
          label: "Context",
          headline: "She reads your day, not just your closet.",
          body: "Margot pulls your weather and calendar each morning to pick outfits that match your actual life — the meeting, the rain, the dinner you forgot you had.",
        },
        {
          label: "Restraint",
          headline: "She tells you when not to buy.",
          body: "Found a piece you love? Margot checks if it pairs with three things you already own before you swipe. If not, she'll say so.",
        },
        {
          label: "Recirculation",
          headline: "She helps you sell what's collecting dust.",
          body: "Items you haven't worn in months get auto-generated Vinted listings — title, description, suggested price — ready to publish in one tap.",
        },
      ],
    },
    pricing: {
      eyebrow: "Pricing",
      headline: "Free to start. Premium when you're ready.",
      prices: {
        gbp: "£4.99 / month",
        eur: "€5.99 / month",
        usd: "$5.99 / month",
      },
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
        {
          quote:
            "I'm the kind of person who texts photos to friends asking 'is this okay?'. Margot just answers.",
          name: "Aya",
          role: "Beta tester · Paris",
        },
        {
          quote:
            "I bought one jumper in March. Margot showed me the fourteen I'd forgotten I owned.",
          name: "Inès",
          role: "Stylist · London",
        },
        {
          quote:
            "Used to take me twenty minutes to get dressed. Now it's four — and I look less like I gave up.",
          name: "Camille",
          role: "Architect · Lyon",
        },
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
        { label: "Notes", href: "/blog" },
        { label: "Press", href: "/press" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Contact", href: "mailto:yassine@benlahmr.com" },
        { label: "Instagram", href: "https://instagram.com/margotwardrobe" },
        { label: "TikTok", href: "https://tiktok.com/@margotwardrobe" },
        { label: "X", href: "https://x.com/margotwardrobe" },
        { label: "llms.txt", href: "/llms.txt" },
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
      seoLine: "Application garde-robe IA · tenues quotidiennes · à partir de ce que vous avez déjà.",
    },
    success: {
      eyebrow: "inscrite.",
      headline: "Vous êtes n°{N}.",
      body: "Invitez 5 amies pour débloquer 7 jours de Margot premium, offerts.",
      cta: "Copier votre lien",
      copied: "Copié ✓",
      hint: "Ou partager directement →",
      shareText: "Je viens de rejoindre la liste d'attente de Margot — une tenue chaque matin, à partir de ce que vous avez déjà.",
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
          stamp: "Une à une, elle les retient.",
        },
        {
          num: "02",
          title: "Laissez-la apprendre",
          body: "Elle construit la mémoire de votre dressing — ce qui pend, ce qui dort, ce qui va avec quoi.",
          stamp: "Elle observe avant de parler.",
        },
        {
          num: "03",
          title: "Habillez-vous",
          body: "Chaque matin, une tenue suggérée selon la météo, votre agenda et les pièces que vous délaissez.",
          stamp: "Le temps d'un café.",
        },
      ],
    },
    features: [
      {
        title: "Une garde-robe qu’elle connaît par cœur",
        body: "Photographiez vos vêtements une fois. Margot retient tout — ce qui pend, ce qui dort, ce qui va avec quoi.",
        state: "considering",
        label: "Mémoire",
        epigraph: "suspendu",
      },
      {
        title: "Une tenue, chaque matin",
        body: "Chaque jour, une suggestion d’outfit pensée selon la météo, votre agenda, et les pièces que vous délaissez.",
        state: "pleased",
        label: "Matin",
        epigraph: "versé",
      },
      {
        title: "Avant d’acheter, demandez à Margot",
        body: "Une pièce vous tente ? Margot vous dit si elle complète vraiment votre garde-robe — avant que vous ne sortiez la carte.",
        state: "skeptical",
        label: "Doute",
        epigraph: "pesé",
      },
    ],
    meet: {
      eyebrow: "rencontrez margot",
      headline: "Elle, c’est la pie.",
      body: "Dans la tradition française, Margot est le nom de la pie — l'oiseau qui collectionne tout ce qui brille. Elle se souvient d'où elle l'a posé. Elle y revient à chaque changement de saison. Aujourd'hui, elle s'occupe de votre garde-robe.",
    },
    whyMargot: {
      eyebrow: "Pensée autrement",
      headline: "Pensée autrement.",
      lead: "Trois choses que Margot fait, et que les autres apps ne font pas.",
      cards: [
        {
          label: "Contexte",
          headline: "Elle lit votre journée, pas seulement votre dressing.",
          body: "Chaque matin, Margot lit votre météo et votre agenda pour proposer une tenue adaptée à votre vraie journée — la réunion, la pluie, le dîner que vous aviez oublié.",
        },
        {
          label: "Retenue",
          headline: "Elle vous dit quand ne pas acheter.",
          body: "Une pièce qui vous plaît ? Margot vérifie si elle s'associe avec au moins trois choses que vous avez déjà avant de valider. Sinon, elle vous le dit.",
        },
        {
          label: "Circulation",
          headline: "Elle vous aide à vendre ce qui prend la poussière.",
          body: "Les pièces que vous n'avez pas portées depuis des mois génèrent automatiquement une annonce Vinted — titre, description, prix suggéré — prête à publier en un clic.",
        },
      ],
    },
    pricing: {
      eyebrow: "Tarifs",
      headline: "Gratuit pour commencer. Premium quand vous êtes prêt·e.",
      prices: {
        gbp: "4,99 £ / mois",
        eur: "5,99 € / mois",
        usd: "5,99 $ / mois",
      },
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
        {
          quote:
            "Je suis du genre à envoyer des photos aux copines en mode 'ça va ?'. Margot, elle, répond.",
          name: "Aya",
          role: "Bêta-testeuse · Paris",
        },
        {
          quote:
            "J'ai acheté un pull en mars. Margot m'a montré les quatorze que j'avais oubliés.",
          name: "Inès",
          role: "Styliste · Londres",
        },
        {
          quote:
            "Vingt minutes pour m'habiller avant. Quatre maintenant — et j'ai moins l'air d'avoir abandonné.",
          name: "Camille",
          role: "Architecte · Lyon",
        },
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
        { label: "Notes", href: "/blog" },
        { label: "Presse", href: "/press" },
        { label: "Confidentialité", href: "/privacy" },
        { label: "Contact", href: "mailto:yassine@benlahmr.com" },
        { label: "Instagram", href: "https://instagram.com/margotwardrobe" },
        { label: "TikTok", href: "https://tiktok.com/@margotwardrobe" },
        { label: "X", href: "https://x.com/margotwardrobe" },
        { label: "llms.txt", href: "/llms.txt" },
      ],
      legal: "© 2026 Margot",
    },
  },
};
