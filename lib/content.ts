export type MargotState = "considering" | "pleased" | "skeptical";

export interface FeatureItem {
  title: string;
  body: string;
  state: MargotState;
}

export interface FaqEntry {
  q: string;
  a: string;
}

export interface FooterLink {
  label: string;
  href: string;
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
  };
  success: {
    eyebrow: string;
    headline: string;
    body: string;
    cta: string;
    hint: string;
  };
  problem: string;
  features: FeatureItem[];
  meet: { eyebrow: string; headline: string; body: string };
  pricing: string[];
  faqHeading: string;
  faq: FaqEntry[];
  footer: {
    madeIn: string;
    tagline: string;
    links: FooterLink[];
    legal: string;
  };
}

export const LANDING_CONTENT: Record<"en" | "fr", LangContent> = {
  en: {
    lang: "EN",
    toggle: "FR",
    hero: {
      eyebrow: "pre-launch · testflight beta",
      headline: ["Your wardrobe,", "observed."],
      subline: "Daily outfit suggestions from what you already own.",
      placeholder: "your.email@example.com",
      button: "Get early access",
      micro: "No spam. One email when Margot opens her doors.",
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
    features: [
      { title: "A wardrobe she knows by heart", body: "Upload your clothes once. Margot remembers everything — what's hanging, what's neglected, what pairs with what.", state: "considering" },
      { title: "Daily looks, composed", body: "Each morning, an outfit suggestion based on the weather, your calendar, and the pieces that haven’t been worn lately.", state: "pleased" },
      { title: "Check before you buy", body: "Found something you want? Margot tells you whether it actually works with what you have — before you spend.", state: "skeptical" },
    ],
    meet: {
      eyebrow: "meet margot",
      headline: "She is the magpie.",
      body: "In French folklore, Margot is the name of the magpie — the bird that collects everything that shines. She remembers where she put it. She returns to it when the season turns. Now, she keeps your closet.",
    },
    pricing: [
      "Margot will be free for the essentials.",
      "Premium, with daily AI outfits and unlimited shopping checks, will be £4.99 a month — with a 7-day free trial.",
      "Early waitlist members get an extra month.",
    ],
    faqHeading: "Questions, briefly.",
    faq: [
      { q: "When can I actually use Margot?", a: "Margot is in private TestFlight now. Waitlist members will receive an invite during the public launch in the coming weeks." },
      { q: "Do I need to upload every single piece of clothing?", a: "No. Margot starts working with five items. She learns the rest of your wardrobe as you log what you wear each day." },
      { q: "Will Margot try to sell me things?", a: "No. Margot is built to help you wear what you already own. The 'Check Before You Buy' feature is designed to help you buy less, not more." },
      { q: "What about my privacy?", a: "Your wardrobe photos stay yours. Margot uses anonymised summaries for the AI suggestions — never images or identity. Full policy in the footer." },
    ],
    footer: {
      madeIn: "Made with care in London / Paris",
      tagline: "the magpie who reads your closet.",
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
      eyebrow: "avant-première · bêta testflight",
      headline: ["Votre garde-robe,", "observée."],
      subline: "Des tenues quotidiennes, composées de ce que vous possédez déjà.",
      placeholder: "votre.email@exemple.com",
      button: "Réserver ma place",
      micro: "Pas de spam. Un seul email à l'ouverture.",
    },
    success: {
      eyebrow: "inscrite.",
      headline: "Vous êtes n°2 847.",
      body: "Passez devant — invitez trois amies, et nous vous remontons dans la file.",
      cta: "Copier votre lien",
      hint: "Ou partager directement →",
    },
    problem:
      "Vous possédez cent vêtements. Vous en portez trente. Chaque matin, vous restez devant votre dressing en pensant que vous n'avez rien à mettre. Margot règle ça — sans vous demander d'acheter quoi que ce soit de nouveau.",
    features: [
      { title: "Une garde-robe qu’elle connaît par cœur", body: "Photographiez vos vêtements une fois. Margot retient tout — ce qui pend, ce qui dort, ce qui va avec quoi.", state: "considering" },
      { title: "Une tenue, chaque matin", body: "Chaque jour, une suggestion d’outfit pensée selon la météo, votre agenda, et les pièces que vous délaissez.", state: "pleased" },
      { title: "Avant d’acheter, demandez à Margot", body: "Une pièce vous tente ? Margot vous dit si elle complète vraiment votre garde-robe — avant que vous ne sortiez la carte.", state: "skeptical" },
    ],
    meet: {
      eyebrow: "rencontrez margot",
      headline: "Elle, c’est la pie.",
      body: "Dans la tradition française, Margot est le nom de la pie — l'oiseau qui collectionne tout ce qui brille. Elle se souvient d'où elle l'a posé. Elle y revient à chaque changement de saison. Aujourd'hui, elle s'occupe de votre garde-robe.",
    },
    pricing: [
      "Margot sera gratuite pour l’essentiel.",
      "Premium — les suggestions quotidiennes et les vérifications d’achat illimitées — sera à 4,99 £ par mois, après un essai gratuit de 7 jours.",
      "Les premières inscrites reçoivent un mois supplémentaire.",
    ],
    faqHeading: "Questions, en bref.",
    faq: [
      { q: "Quand est-ce que je pourrai utiliser Margot ?", a: "Margot est en TestFlight privé. Les inscrites recevront une invitation lors de l'ouverture publique dans les semaines qui viennent." },
      { q: "Dois-je photographier toute ma garde-robe d'un coup ?", a: "Non. Margot démarre avec cinq pièces. Elle apprend le reste au fur et à mesure que vous notez ce que vous portez." },
      { q: "Margot va-t-elle me pousser à acheter ?", a: "Non. Margot existe pour vous aider à mieux porter ce que vous avez déjà. Le 'Check Before You Buy' est fait pour vous aider à acheter moins, pas plus." },
      { q: "Et ma vie privée ?", a: "Vos photos de vêtements vous appartiennent. Margot n'envoie que des résumés anonymisés à l'IA — jamais les images ni votre identité. Politique complète en bas de page." },
    ],
    footer: {
      madeIn: "Fait avec soin à Londres / Paris",
      tagline: "la pie qui lit votre garde-robe.",
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
