import { MARGOT_LIMITS as L } from "@/lib/compare/margot";
import type { ScreenName } from "@/lib/screens";

export type HomeLocale = "en" | "fr";

/** One app screen as shown on the homepage, with its description for screen readers. */
export type HomeScreen = { name: ScreenName; alt: string };
export type HomeCard = { title: string; body: string; screen: HomeScreen };
/** Hero before/after slider: the same morning, the same clothes. */
export type HomeComparison = {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  thought: string;
  today: string;
  label: string;
  hint: string;
  instruction: string;
  caption: string;
  note: string;
};
/** 15-second explainer at the top of "how it works". */
export type HomeVideo = { intro: string; label: string; transcript: string; play: string; pause: string; note: string };

export type HomeCopy = {
  /** <title>, meta description and JSON-LD app description: never rendered in the page body. */
  title: string;
  description: string;
  schemaDescription: string;
  category: string;
  headline: string;
  intro: string;
  comparison: HomeComparison;
  download: string;
  free: string;
  stats: readonly [string, string, string];
  statsNote: string;
  stepsTitle: string;
  video: HomeVideo;
  steps: readonly HomeCard[];
  featuresTitle: string;
  features: readonly HomeCard[];
  screensNote: string;
  offerTitle: string;
  offerFree: string;
  offerFreeItems: readonly string[];
  offerPremium: string;
  offerPremiumItems: readonly string[];
  offerNote: string;
  faqTitle: string;
  faqIntro: string;
  faq: readonly { q: string; a: string }[];
  privacy: string;
  readMoreTitle: string;
  guides: readonly { title: string; href: string }[];
  closing: string;
  closingBody: string;
  qr: string;
};

const count = (n: number, word: string) => `${n} ${word}${n > 1 ? "s" : ""}`;

export const HOME: Record<HomeLocale, HomeCopy> = {
  fr: {
    title: "Margot — Application dressing et idées de tenues du jour",
    description: "Redécouvre ton dressing avec Margot : des idées de tenues à partir de tes vêtements, adaptées à ta journée. À télécharger sur iPhone et Android.",
    schemaDescription: "Margot est une application de dressing et une styliste personnelle assistée par l’IA. Tu ajoutes tes vêtements et elle propose des idées de tenues à partir de ce que tu possèdes, en tenant compte de la météo (et, avec Premium, de l’occasion). Tu peux enregistrer tes looks et suivre ce que tu portes.",
    category: "Application dressing · Ta styliste personnelle",
    headline: "Tes vêtements. Tes nouveaux looks.",
    intro: "Margot compose tes tenues avec ce que tu possèdes déjà, pour la journée qui t’attend.",
    comparison: {
      before: "Sans Margot",
      after: "Avec Margot",
      beforeAlt: "Sans Margot : une femme en pyjama, la main sur le front, devant un lit couvert de vêtements en vrac",
      afterAlt: "Avec Margot : la même femme, souriante, en blazer noir, débardeur blanc, jean droit et baskets blanches, devant son lit rangé",
      thought: "Rien à me mettre…",
      today: "Ta tenue du jour",
      label: "Comparer la même matinée, sans Margot et avec Margot",
      hint: "Glisse",
      instruction: "Fais glisser pour voir la différence.",
      caption: "Les mêmes vêtements. Une vraie tenue.",
      note: "Mise en scène illustrative",
    },
    download: "Télécharger Margot",
    free: "Gratuite à télécharger. Premium en option.",
    stats: ["téléchargements", "vêtements ajoutés", "tenues composées"],
    statsNote: "Téléchargements cumulés sur iPhone et Android. Vêtements et tenues : compteurs de l’application.",
    stepsTitle: "Un petit début. Plein de possibilités.",
    video: {
      intro: "Regarde comment ça marche, en quinze secondes.",
      label: "Vidéo de 15 secondes : comment marche Margot",
      transcript: "Rien à te mettre ? Un : prends tes vêtements en photo. Deux : Margot compose ta tenue. Trois : vois-la sur toi. Margot, gratuite sur iPhone et Android.",
      play: "Lire la vidéo",
      pause: "Mettre la vidéo en pause",
      note: "Vidéo sans son. Mise en scène illustrative.",
    },
    steps: [
      { title: "Ajoute tes vêtements", body: "Prends en photo quelques hauts, bas et chaussures. Margot reconnaît chaque pièce et la range pour toi.", screen: { name: "add-photo", alt: "Écran « Ça convient ? » : la photo d’une chemise blanche détourée, prête à rejoindre le dressing" } },
      { title: "Margot compose tes tenues", body: "Des idées avec tes pièces, selon la météo. Garde tes préférées en favoris.", screen: { name: "outfit-collection", alt: "Écran des tenues : deux tenues favorites, « Une journée en ville » et « Douceur du week-end »" } },
      { title: "Vois-la sur toi", body: "Essaie une tenue sur ton avatar, ou importe un look repéré sur Instagram ou dans la rue.", screen: { name: "tryon-result", alt: "Écran « Voir sur moi » : une femme en veste camel, haut blanc et pantalon marron" } },
    ],
    featuresTitle: "Et aussi, dans ta poche.",
    features: [
      { title: "Ta styliste, à toute heure", body: "Demande « une tenue simple pour demain au bureau ? », Margot répond avec tes vêtements.", screen: { name: "chat-conversation", alt: "Conversation avec Margot : pour une tenue de bureau, elle propose une chemise Oxford, un jean droit et des mocassins" } },
      { title: "Du shopping pour ton dressing", body: "Des pièces qui vont avec ce que tu as déjà, et un avis franc avant d’acheter.", screen: { name: "shopping", alt: "Écran shopping : des pièces recommandées, un pull en cachemire et des baskets en cuir, à essayer sur soi" } },
      { title: "Ta valise, sans oubli", body: "Destination, dates, météo : Margot prépare quoi emporter. Ton premier voyage est offert.", screen: { name: "travel-packing", alt: "Écran de voyage à Lisbonne : la météo prévue et une valise où la marinière et le pull en mérinos sont cochés" } },
      { title: "Elle apprend tes goûts", body: "Glisse à droite les tenues que tu porterais, Margot en tient compte.", screen: { name: "styles", alt: "Écran « Tu porterais cette tenue ? » avec les boutons Pas pour moi et Je porterais" } },
    ],
    screensNote: "Écrans de l’application, avec des données de démonstration.",
    offerTitle: "Gratuite pour commencer. Premium pour aller plus loin.",
    offerFree: "Gratuit",
    offerFreeItems: [
      `Jusqu’à ${L.freePieces} pièces dans ton dressing`,
      `${L.freeOutfitsPerDay} tenues générées par jour`,
      `${count(L.freeTryOnsPerWeek, "essayage")} par semaine`,
      "Ton premier voyage offert",
    ],
    offerPremium: "Premium",
    offerPremiumItems: [
      "Pièces illimitées",
      `${L.premiumOutfitsPerDay} tenues générées par jour`,
      `${count(L.premiumTryOnsPerDay, "essayage")} par jour`,
      "Des tenues pour tes événements",
      "Toutes tes valises",
    ],
    offerNote: "Les tarifs, les quotas et les conditions sont affichés dans l’application avant tout achat.",
    faqTitle: "Avant de faire connaissance.",
    faqIntro: "Les réponses aux questions que tu te poses peut-être encore.",
    faq: [
      { q: "Qu’est-ce que l’application Margot ?", a: "Margot est une application de dressing et ta styliste personnelle. Tu ajoutes tes vêtements et elle propose des idées de tenues à partir de ce que tu possèdes, en tenant compte de la météo (et, avec Premium, de l’occasion). Tu peux enregistrer tes looks et suivre ce que tu portes." },
      { q: "Dois-je photographier tout mon dressing ?", a: "Non. Commence par quelques pièces que tu portes en ce moment, en incluant des hauts, des bas et des chaussures pour pouvoir composer une tenue complète. Ajoute le reste à ton rythme : tu n’as pas besoin de consacrer un week-end entier à ton placard." },
      { q: "Est-ce que Margot est gratuite ?", a: "Margot est gratuite à télécharger et propose une version gratuite avec des limites d’utilisation. Un abonnement Premium permet d’accéder à davantage de fonctions et de suggestions. Les tarifs et les conditions sont affichés dans l’application avant l’achat." },
      { q: "Margot existe-t-elle sur iPhone et Android ?", a: "Oui. Tu peux télécharger Margot sur l’App Store pour iPhone et sur Google Play pour Android. Les liens vers les deux boutiques sont disponibles sur cette page." },
      { q: "Est-ce que Margot m’oblige à acheter de nouveaux vêtements ?", a: "Non. Les idées de tenues partent des vêtements que tu ajoutes à ton dressing. L’objectif est de t’aider à utiliser ce que tu possèdes déjà. Si tu envisages un achat, la fonction Check Before You Buy peut aussi t’aider à voir comment la pièce s’associe à ton dressing." },
      { q: "Que deviennent mes photos et mes données ?", a: "Tu choisis les photos que tu ajoutes. Certaines fonctions nécessitent de traiter les images que tu envoies auprès de prestataires. La politique de confidentialité détaille le stockage, les traitements et tes droits, notamment la suppression de ton compte et de tes données." },
    ],
    privacy: "Lire la politique de confidentialité",
    readMoreTitle: "À lire",
    guides: [
      { title: "Créer une garde-robe digitale qui sert vraiment", href: "/fr/garde-robe-digitale" },
      { title: "Quoi porter aujourd’hui ?", href: "/fr/quoi-porter-aujourdhui" },
      { title: "Margot ou Whering : laquelle te correspond ?", href: "/fr/vs/whering" },
    ],
    closing: "Demain matin, ouvre ton dressing avec une idée.",
    closingBody: "Tes vêtements ont encore beaucoup à te raconter.",
    qr: "Scanne pour télécharger sur iPhone",
  },
  en: {
    title: "Margot — Wardrobe App & Daily Outfit Planner",
    description: "Rediscover your wardrobe with Margot. Get outfit ideas from clothes you already own, made for the day ahead. Download on iPhone and Android.",
    schemaDescription: "Margot is a wardrobe app and an AI-assisted personal stylist. Add your clothes and get outfit ideas from what you already own, with the weather in mind (and your chosen occasion with Premium). You can save looks and keep track of what you wear.",
    category: "Wardrobe app · Your personal stylist",
    headline: "Your clothes. Whole new outfits.",
    intro: "Margot styles outfits from what you already own, for the day ahead.",
    comparison: {
      before: "Without Margot",
      after: "With Margot",
      beforeAlt: "Without Margot: a woman in pyjamas, hand on her forehead, in front of a bed covered in a heap of clothes",
      afterAlt: "With Margot: the same woman, smiling, in a black blazer, white tank top, straight jeans and white trainers, in front of her tidy bed",
      thought: "Nothing to wear…",
      today: "Wear this today",
      label: "Compare the same morning, without and with Margot",
      hint: "Drag",
      instruction: "Drag to see the difference.",
      caption: "Same clothes. A real outfit.",
      note: "Illustrative scene",
    },
    download: "Download Margot",
    free: "Free to download. Optional Premium subscription.",
    stats: ["downloads", "pieces added", "outfits composed"],
    statsNote: "Total downloads on iPhone and Android. Pieces and outfits: the app’s counters.",
    stepsTitle: "Start small. Find a lot to wear.",
    video: {
      intro: "See how it works, in fifteen seconds.",
      label: "15-second video: how Margot works",
      transcript: "Nothing to wear? One: snap your clothes. Two: Margot styles your outfit. Three: see it on you. Margot, free on iPhone and Android.",
      play: "Play video",
      pause: "Pause video",
      note: "No sound. Illustrative scene.",
    },
    steps: [
      { title: "Add your clothes", body: "Snap a few tops, bottoms and shoes. Margot recognises each piece and files it for you.", screen: { name: "add-photo", alt: "“Looks good?” screen: a white shirt cut out from its photo, ready to join the wardrobe" } },
      { title: "Margot puts outfits together", body: "Ideas made from your pieces, with the weather in mind. Keep your favourites close.", screen: { name: "outfit-collection", alt: "Outfits screen: two favourite outfits, “A day in the city” and “An easy weekend”" } },
      { title: "See it on you", body: "Try an outfit on your avatar, or import a look you spotted online or out and about.", screen: { name: "tryon-result", alt: "“See it on me” screen: a woman in a camel blazer, white top and brown trousers" } },
    ],
    featuresTitle: "And there’s more.",
    features: [
      { title: "A stylist on call", body: "Ask for “an easy outfit for the office tomorrow” and Margot answers with your own clothes.", screen: { name: "chat-conversation", alt: "Chat with Margot: asked for an office outfit, she suggests an Oxford shirt, straight jeans and loafers" } },
      { title: "Shop for your wardrobe", body: "Pieces that work with what you own, and an honest verdict before you buy.", screen: { name: "shopping", alt: "Shopping screen: recommended pieces, a cashmere knit and leather trainers, to try on yourself" } },
      { title: "Pack with a plan", body: "Destination, dates, weather: Margot works out what to pack. Your first trip is free.", screen: { name: "travel-packing", alt: "Lisbon trip screen: the forecast and a suitcase with a Breton top and a merino sweater packed" } },
      { title: "She learns your taste", body: "Swipe right on outfits you’d wear and Margot takes note.", screen: { name: "styles", alt: "“Would you wear this outfit?” screen with Not for me and I’d wear it buttons" } },
    ],
    screensNote: "App screens shown with demo data.",
    offerTitle: "Free to start. Premium when you want more.",
    offerFree: "Free",
    offerFreeItems: [
      `Up to ${L.freePieces} pieces in your wardrobe`,
      `${L.freeOutfitsPerDay} outfit generations a day`,
      `${count(L.freeTryOnsPerWeek, "try-on")} a week`,
      "Your first trip free",
    ],
    offerPremium: "Premium",
    offerPremiumItems: [
      "Unlimited pieces",
      `${L.premiumOutfitsPerDay} outfit generations a day`,
      `${count(L.premiumTryOnsPerDay, "try-on")} a day`,
      "Outfits for your events",
      "Every trip you plan",
    ],
    offerNote: "Subscription prices, usage limits and terms are shown in the app before you make a purchase.",
    faqTitle: "Before we get acquainted.",
    faqIntro: "A few things you might still be wondering.",
    faq: [
      { q: "What is the Margot wardrobe app?", a: "Margot is a wardrobe app and your personal stylist. Add your clothes and get outfit ideas from what you already own, with the weather in mind (and your chosen occasion with Premium). You can save looks and keep track of what you wear." },
      { q: "Do I have to photograph my whole wardrobe?", a: "No. Start with a few pieces you wear regularly, including tops, bottoms and shoes so there’s enough to build a complete outfit. Add more as you go. You don’t need to spend an entire weekend cataloguing your closet." },
      { q: "Is Margot free?", a: "Margot is free to download and includes a free version with usage limits. An optional Premium subscription offers more features and suggestions. Prices and subscription terms are shown in the app before you buy." },
      { q: "Is Margot available on iPhone and Android?", a: "Yes. Download Margot from the App Store for iPhone or Google Play for Android. You’ll find links to both stores on this page." },
      { q: "Will I need to buy new clothes?", a: "No. Outfit suggestions start with the clothes you add to your wardrobe. The aim is to help you use what you already own. If you’re considering a purchase, Check Before You Buy can help you see how it fits with your wardrobe." },
      { q: "What happens to my photos and data?", a: "You choose the photos you add. Some features require the images you submit to be processed by service providers. Our privacy policy explains storage, processing and your rights, including how to delete your account and data." },
    ],
    privacy: "Read the privacy policy",
    readMoreTitle: "Further reading",
    guides: [
      { title: "What to wear today, finally answered", href: "/blog/what-to-wear-today" },
      { title: "Does an outfit planner actually work?", href: "/blog/ai-outfit-planner-does-it-work" },
      { title: "Margot or Whering: which suits you?", href: "/vs/whering" },
    ],
    closing: "Tomorrow morning, open your wardrobe with an idea.",
    closingBody: "There’s a lot of life left in your clothes.",
    qr: "Scan to download on iPhone",
  },
};
