// landing.jsx — Margot pre-launch landing page.
// Single-scroll, mobile-first, EN/FR toggle, two waitlist forms,
// FAQ accordion. Uses our existing visual system + Margot SVG.

const content = {
  en: {
    lang: 'EN',
    toggle: 'FR',
    nav: { wordmark: 'Margot' },
    hero: {
      eyebrow: 'pre-launch · testflight beta',
      headline: ['Your wardrobe,', 'observed.'],
      subline: 'Daily outfit suggestions from what you already own.',
      placeholder: 'your.email@example.com',
      button: 'Get early access',
      micro: "No spam. One email when Margot opens her doors.",
    },
    success: {
      eyebrow: "you're in.",
      headline: "You're #2,847.",
      body: "Skip the line — invite three friends and we'll move you up the list.",
      cta: 'Copy your invite link',
      hint: 'Or share directly →',
    },
    problem:
      "You own a hundred pieces of clothing. You wear thirty. Every morning, you stand in front of your closet and feel like you have nothing. Margot fixes that — without asking you to buy a single new thing.",
    features: [
      { title: 'A wardrobe she knows by heart', body: "Upload your clothes once. Margot remembers everything — what's hanging, what's neglected, what pairs with what.", state: 'considering' },
      { title: 'Daily looks, composed', body: 'Each morning, an outfit suggestion based on the weather, your calendar, and the pieces that haven\u2019t been worn lately.', state: 'pleased' },
      { title: 'Check before you buy', body: 'Found something you want? Margot tells you whether it actually works with what you have — before you spend.', state: 'skeptical' },
    ],
    meet: {
      eyebrow: 'meet margot',
      headline: 'She is the magpie.',
      body: 'In French folklore, Margot is the name of the magpie — the bird that collects everything that shines. She remembers where she put it. She returns to it when the season turns. Now, she keeps your closet.',
    },
    pricing: [
      'Margot will be free for the essentials.',
      'Premium is $9.99 a month or $39.99 a year, with a 7-day free trial.',
      'Early waitlist members get an extra month.',
    ],
    faqHeading: 'Questions, briefly.',
    faq: [
      {
        q: 'When can I actually use Margot?',
        a: 'Margot is in private TestFlight now. Waitlist members will receive an invite during the public launch in the coming weeks.',
      },
      {
        q: 'Do I need to upload every single piece of clothing?',
        a: 'No. Margot starts working with five items. She learns the rest of your wardrobe as you log what you wear each day.',
      },
      {
        q: 'Will Margot try to sell me things?',
        a: "No. Margot is built to help you wear what you already own. The 'Check Before You Buy' feature is designed to help you buy less, not more.",
      },
      {
        q: 'What about my privacy?',
        a: "Your wardrobe photos stay yours. Photos you submit may be processed to power Margot's image features, but we do not send your identity or payment details to model providers. Full policy in the footer.",
      },
    ],
    footer: {
      madeIn: 'Made with care in London / Paris',
      tagline: 'the magpie who reads your closet.',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Contact',        href: 'mailto:hello@margotwardrobe.com' },
        { label: 'Instagram',      href: 'https://instagram.com/margotwardrobe' },
        { label: 'TikTok',         href: 'https://tiktok.com/@margotwardrobe' },
        { label: 'X',              href: 'https://x.com/margotwardrobe' },
      ],
      legal: '© 2026 Margot',
    },
  },
  fr: {
    lang: 'FR',
    toggle: 'EN',
    nav: { wordmark: 'Margot' },
    hero: {
      eyebrow: 'avant-premi\u00e8re · b\u00eata testflight',
      headline: ['Votre garde-robe,', 'observ\u00e9e.'],
      subline: 'Des tenues quotidiennes, compos\u00e9es de ce que vous poss\u00e9dez d\u00e9j\u00e0.',
      placeholder: 'votre.email@exemple.com',
      button: 'R\u00e9server ma place',
      micro: "Pas de spam. Un seul email \u00e0 l'ouverture.",
    },
    success: {
      eyebrow: 'inscrite.',
      headline: "Vous \u00eates n\u00b02\u00a0847.",
      body: 'Passez devant — invitez trois amies, et nous vous remontons dans la file.',
      cta: 'Copier votre lien',
      hint: 'Ou partager directement →',
    },
    problem:
      "Vous poss\u00e9dez cent v\u00eatements. Vous en portez trente. Chaque matin, vous restez devant votre dressing en pensant que vous n'avez rien \u00e0 mettre. Margot r\u00e8gle \u00e7a — sans vous demander d'acheter quoi que ce soit de nouveau.",
    featuresHeading: 'Trois choses, sans bruit.',
    features: [
      { title: 'Une garde-robe qu\u2019elle conna\u00eet par c\u0153ur', body: "Photographiez vos v\u00eatements une fois. Margot retient tout — ce qui pend, ce qui dort, ce qui va avec quoi.", state: 'considering' },
      { title: 'Une tenue, chaque matin', body: 'Chaque jour, une suggestion d\u2019outfit pens\u00e9e selon la m\u00e9t\u00e9o, votre agenda, et les pi\u00e8ces que vous d\u00e9laissez.', state: 'pleased' },
      { title: 'Avant d\u2019acheter, demandez \u00e0 Margot', body: 'Une pi\u00e8ce vous tente\u00a0? Margot vous dit si elle compl\u00e8te vraiment votre garde-robe — avant que vous ne sortiez la carte.', state: 'skeptical' },
    ],
    meet: {
      eyebrow: 'rencontrez margot',
      headline: 'Elle, c\u2019est la pie.',
      body: "Dans la tradition fran\u00e7aise, Margot est le nom de la pie — l'oiseau qui collectionne tout ce qui brille. Elle se souvient d'o\u00f9 elle l'a pos\u00e9. Elle y revient \u00e0 chaque changement de saison. Aujourd'hui, elle s'occupe de votre garde-robe.",
    },
    pricing: [
      'Margot sera gratuite pour l\u2019essentiel.',
      'Premium sera \u00e0 9,99 $ par mois ou 39,99 $ par an, avec un essai gratuit de 7 jours.',
      'Les premi\u00e8res inscrites re\u00e7oivent un mois suppl\u00e9mentaire.',
    ],
    faqHeading: 'Questions, en bref.',
    faq: [
      {
        q: 'Quand est-ce que je pourrai utiliser Margot\u00a0?',
        a: "Margot est en TestFlight priv\u00e9. Les inscrites recevront une invitation lors de l'ouverture publique dans les semaines qui viennent.",
      },
      {
        q: "Dois-je photographier toute ma garde-robe d'un coup\u00a0?",
        a: 'Non. Margot d\u00e9marre avec cinq pi\u00e8ces. Elle apprend le reste au fur et \u00e0 mesure que vous notez ce que vous portez.',
      },
      {
        q: 'Margot va-t-elle me pousser \u00e0 acheter\u00a0?',
        a: "Non. Margot existe pour vous aider \u00e0 mieux porter ce que vous avez d\u00e9j\u00e0. Le 'Check Before You Buy' est fait pour vous aider \u00e0 acheter moins, pas plus.",
      },
      {
        q: 'Et ma vie priv\u00e9e\u00a0?',
        a: "Vos photos de v\u00eatements vous appartiennent. Les photos que vous envoyez peuvent \u00eatre trait\u00e9es pour les fonctionnalit\u00e9s visuelles de Margot, mais nous n'envoyons pas votre identit\u00e9 ni vos informations de paiement aux fournisseurs de mod\u00e8les. Politique compl\u00e8te en bas de page.",
      },
    ],
    footer: {
      madeIn: 'Fait avec soin \u00e0 Londres / Paris',
      tagline: 'la pie qui lit votre garde-robe.',
      links: [
        { label: 'Confidentialit\u00e9', href: '/privacy' },
        { label: 'Contact',          href: 'mailto:hello@margotwardrobe.com' },
        { label: 'Instagram',        href: 'https://instagram.com/margotwardrobe' },
        { label: 'TikTok',           href: 'https://tiktok.com/@margotwardrobe' },
        { label: 'X',                href: 'https://x.com/margotwardrobe' },
      ],
      legal: '© 2026 Margot',
    },
  },
};

// ─── Header ─────────────────────────────────────────────────────────────
function Header({ lang, setLang }) {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(236,234,229,0.86)',
      backdropFilter: 'saturate(140%) blur(14px)',
      WebkitBackdropFilter: 'saturate(140%) blur(14px)',
      borderBottom: `1px solid ${T.warm2}`,
      padding: '14px 24px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <a href="#top" style={{ textDecoration: 'none' }}>
        <div style={{
          fontFamily: '"Fraunces", serif', fontWeight: 400,
          fontStyle: 'italic', fontSize: 24, letterSpacing: '-0.03em',
          color: T.ink, fontVariationSettings: '"opsz" 96',
        }}>Margot<span style={{ color: T.peach, fontStyle: 'normal' }}>.</span></div>
      </a>
      <button onClick={() => setLang(lang === 'en' ? 'fr' : 'en')} style={{
        fontFamily: '"Inter Tight"', fontSize: 11, fontWeight: 600,
        letterSpacing: '0.16em', textTransform: 'uppercase',
        padding: '7px 12px', borderRadius: 999,
        background: 'transparent', color: T.ink,
        border: `1px solid ${T.ink}`,
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 6,
      }} aria-label="Switch language">
        {content[lang].lang} <span style={{ color: T.ink3 }}>·</span> <span style={{ color: T.ink3 }}>{content[lang].toggle}</span>
      </button>
    </header>
  );
}

window.LANDING_CONTENT = content;
window.LandingHeader = Header;
