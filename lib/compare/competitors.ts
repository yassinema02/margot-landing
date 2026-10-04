import type { Competitor } from "./types";

// Competitor facts for the comparison pages. Every value comes from the
// competitor's official site, help centre or store listing, read on the date in
// `checked`; the URLs are listed in `sources` and shown on the page. User counts
// are what each publisher claims, never audited figures. When a fact could not
// be verified, the row is left out instead of guessed. Re-check every quarter.

const CHECKED = "2026-10-04";

const whering: Competitor = {
  slug: "whering",
  name: "Whering",
  url: "https://www.whering.co",
  operatingSystem: "iOS, Android, Web",
  published: "2026-09-08",
  checked: CHECKED,
  sources: [
    { label: "Whering, site officiel / official site", url: "https://www.whering.co/" },
    { label: "Whering on the App Store (France)", url: "https://apps.apple.com/fr/app/whering-garde-robe-virtuel/id1519461680" },
    { label: "Whering on the App Store (US)", url: "https://apps.apple.com/us/app/whering-your-digital-closet/id1519461680" },
    { label: "Whering help: daily W Pick suggestions", url: "https://whering.zendesk.com/hc/en-gb/articles/5477573485727-How-many-daily-outfit-suggestions-can-I-get-from-W-Pick" },
    { label: "Whering help: weather in the Planner", url: "https://whering.zendesk.com/hc/en-gb/articles/5800209259551-How-does-weather-work-in-the-Planner" },
    { label: "Whering help: Virtual Try On cost", url: "https://whering.zendesk.com/hc/en-gb/articles/5800046039327-How-much-does-each-Virtual-Try-On-cost" },
    { label: "Whering help: exporting items", url: "https://whering.zendesk.com/hc/en-gb/articles/5473175648031-Is-it-possible-to-export-the-data-from-items-I-ve-uploaded" },
    { label: "Whering help: desktop version", url: "https://whering.zendesk.com/hc/en-gb/articles/5446347364639-Is-there-a-desktop-version-of-Whering" },
    { label: "Whering privacy policy", url: "https://www.whering.co/privacy-policy" },
  ],
  copy: {
    fr: {
      metaTitle: "Whering ou Margot ? Comparatif 2026, prix et avis · Margot",
      metaDescription:
        "Whering ou Margot : tenues, essayage, revente, prix en euros et données comparés à partir des sources officielles, vérifiés le 4 octobre 2026.",
      h1: "Whering ou Margot ?",
      lede: "Whering et Margot rangent ton dressing dans ton téléphone et te proposent des tenues avec ce que tu possèdes. Whering est gratuite, très large et sociale, avec plus de 9 millions d'utilisateurs selon sa fiche App Store. Margot est plus resserrée : une tenue prête chaque matin avant ton heure d'habillage, un avis avant d'acheter, une annonce Vinted rédigée à la demande, et aucun fil social.",
      bottomLine:
        "choisis Whering si tu veux une application gratuite, une immense base d'articles et une communauté ; choisis Margot si tu veux qu'une tenue t'attende chaque matin et que ton dressing reste privé.",
      rows: {
        daily: "W Pick : jusqu'à 6 idées par jour ; suggestions du Planner (en bêta)",
        weather: "Oui, dans le Planner, y compris la météo du lieu d'un événement",
        calendar: "Planner de tenues dans l'app ; lecture de l'agenda du téléphone non mentionnée dans son aide",
        tryon: "Oui, payé en crédits (1 crédit par essayage)",
        buy: "Wishlist et Canvas pour associer une pièce à ta garde-robe ; verdict non mentionné",
        adding: "Photo détourée, base de plus de 100 millions d'articles, extension Chrome, scan de la galerie (1 crédit par pièce)",
        stats: "Oui, dont le coût par port",
        packing: "Oui",
        social: "Oui : dressings d'amis, profil public ou privé",
        resale: "Non mentionnée ; suivi des achats seconde main",
        platforms: "iPhone et Android ; site web pour consulter (création de looks sur mobile)",
        languages: "Français, anglais, allemand, italien, espagnol, portugais",
        export: "Non, selon son aide",
      },
      prices: {
        free: "Gratuit, sans abonnement",
        subscription: "Aucun",
        oneOff: "Crédits : 10 pour 2,99 €, 50 pour 6,99 €, 100 pour 11,99 € ; « Créateur de Tenues » 4,99 €",
        trial: "Sans objet",
      },
      priceNote: "Prix de Whering relevés sur l'App Store France le 4 octobre 2026.",
      theyDoWell: [
        { title: "Une communauté.", body: "Dressings d'amis, inspirations, profil public ou privé : Whering est pensée pour partager." },
        { title: "Une version gratuite généreuse.", body: "Pas d'abonnement. Les fonctions de base sont gratuites ; seules les fonctions d'image (essayage, retouche, scan de la galerie) se paient en crédits." },
        { title: "Une base d'articles immense.", body: "Plus de 100 millions d'articles et une extension Chrome pour ajouter une pièce vue en ligne sans la photographier." },
        { title: "Des outils complets.", body: "Planner avec la météo, statistiques détaillées dont le coût par port, listes de valise et essayage virtuel." },
      ],
      margotDifferent: [
        { title: "Une tenue qui t'attend.", body: "Margot prépare ta tenue juste avant ton heure d'habillage et te prévient à ce moment-là, pas à 7 h pour tout le monde. Si elle ne te va pas, tu en demandes une autre." },
        { title: "Un avis avant d'acheter.", body: "Colle le lien d'une pièce : Margot répond « vaut le coup », « à réfléchir » ou « passe ton tour », selon les tenues qu'elle permet avec ce que tu as, les doublons et les manques qu'elle comble." },
        { title: "La revente sans page blanche.", body: "Depuis la fiche d'une pièce, Margot rédige une annonce Vinted : titre, description, hashtags et fourchette de prix. Tu copies, tu colles dans Vinted." },
        { title: "Pas de fil social.", body: "Ni abonnés ni profil public. Tu peux partager un look en image, rien de plus." },
      ],
      chooseThem:
        "tu aimes voir les dressings de tes amies et partager tes looks, tu veux une application entièrement gratuite et tu ajoutes souvent des pièces vues en ligne.",
      chooseMargot:
        "tu veux une tenue prête le matin sans rien faire défiler, un avis franc avant un achat et un dressing qui reste privé. La version gratuite s'arrête à 15 pièces : au-delà, il faut Premium.",
      switching:
        "Il n'y a pas de passerelle. L'aide de Whering indique qu'il n'est pas possible d'exporter ses pièces, et Margot n'a pas d'import depuis une autre application. Le plus simple : photographie d'abord les pièces que tu portes le plus, ou ajoute plusieurs photos d'un coup. Margot propose une première tenue dès trois pièces, avec un haut et un bas ou une robe.",
      faq: [
        { q: "Whering est-elle gratuite ?", a: "Oui. Whering n'a pas d'abonnement : ses fonctions de base sont gratuites. Les fonctions d'image se paient en crédits, par exemple 10 crédits pour 2,99 € sur l'App Store France au 4 octobre 2026, et un « Créateur de Tenues » est proposé à 4,99 €. Margot est gratuite jusqu'à 15 pièces ; Premium coûte ensuite 14,90 € par mois ou 59,99 € par an." },
        { q: "Margot est-elle une alternative à Whering ?", a: "Oui, si tu cherches surtout une garde-robe digitale qui te propose une tenue chaque matin, sans réseau social. Les deux applications photographient ton placard et composent des tenues. Margot ajoute un avis avant achat et une annonce Vinted rédigée à la demande ; Whering ajoute une communauté et une base de plus de 100 millions d'articles." },
        { q: "Whering a-t-elle un essayage virtuel ?", a: "Oui. Whering propose un essayage sur un avatar créé à partir d'une photo en pied, payé en crédits (un crédit par essayage). Margot propose aussi un essayage sur avatar : un par semaine en gratuit, quinze par jour avec Premium." },
        { q: "Peut-on importer sa garde-robe Whering dans Margot ?", a: "Non. Whering ne permet pas d'exporter ses pièces et Margot n'a pas d'import depuis une autre application. Il faut re-photographier ses vêtements, en commençant par ceux que tu portes le plus." },
        { q: "Où sont stockées les données ?", a: "Whering indique stocker les données sur Google Cloud au Royaume-Uni, en Belgique, aux Pays-Bas et en Finlande. Margot les stocke sur des serveurs à Londres, et les photos sont analysées par Google Gemini, comme le précise sa politique de confidentialité." },
      ],
    },
    en: {
      metaTitle: "Margot vs Whering: features, prices and data compared",
      metaDescription:
        "Margot vs Whering: daily outfits, try-on, resale, prices and data compared from official sources, checked on 4 October 2026.",
      h1: "Margot vs Whering",
      lede: "Whering and Margot both put your wardrobe on your phone and suggest outfits from clothes you own. Whering is free, broad and social, with over 9 million users according to its App Store listing. Margot is narrower: an outfit ready each morning before you get dressed, advice before you buy, a Vinted listing written on request, and no social feed.",
      bottomLine:
        "choose Whering for a free app, a huge item database and a community; choose Margot if you want an outfit waiting every morning and a wardrobe that stays private.",
      rows: {
        daily: "W Pick: up to 6 ideas a day; Planner suggestions (in beta)",
        weather: "Yes, in the Planner, including the weather where an event takes place",
        calendar: "Outfit planner in the app; reading your phone's calendar is not mentioned in its help centre",
        tryon: "Yes, paid with credits (1 credit per try-on)",
        buy: "Wishlist and Canvas to pair a piece with your wardrobe; no verdict mentioned",
        adding: "Photo with background removed, a database of over 100 million items, Chrome extension, gallery scan (1 credit per item)",
        stats: "Yes, including cost per wear",
        packing: "Yes",
        social: "Yes: friends' wardrobes, public or private profile",
        resale: "Not mentioned; tracks second-hand purchases",
        platforms: "iPhone and Android; website to browse (creating looks is mobile only)",
        languages: "English, French, German, Italian, Spanish, Portuguese",
        export: "No, according to its help centre",
      },
      prices: {
        free: "Free, no subscription",
        subscription: "None",
        oneOff: "Credits: 10 for $2.99, 50 for $7.99, 100 for $12.99; Outfit Maker $4.99",
        trial: "Not applicable",
      },
      priceNote: "Whering prices from the US App Store on 4 October 2026 (in the UK, 10 credits cost £1.99).",
      theyDoWell: [
        { title: "Community.", body: "Friends' wardrobes, style inspiration and a public or private profile: Whering is built for sharing." },
        { title: "A generous free app.", body: "There is no subscription. The core features are free; image features such as try-on, enhancement and gallery scanning are paid with credits." },
        { title: "A huge item database.", body: "Over 100 million items and a Chrome extension let you add a piece you saw online without photographing it." },
        { title: "Broad tools.", body: "A weather-aware planner, detailed stats including cost per wear, packing lists and virtual try-on." },
      ],
      margotDifferent: [
        { title: "An outfit waiting for you.", body: "Margot prepares your outfit just before the time you get dressed and notifies you then, not at 7am for everyone. Ask for another if it is not right." },
        { title: "Advice before you buy.", body: "Paste a product link and Margot answers buy, consider or skip, based on the outfits the piece makes with what you own, near-duplicates and the gaps it fills." },
        { title: "Resale without the blank page.", body: "From any piece's page, Margot writes a Vinted listing: title, description, hashtags and a price range. You copy it and paste it into Vinted." },
        { title: "No social feed.", body: "No followers, no public profile. You can share a look as an image, nothing more." },
      ],
      chooseThem:
        "you enjoy seeing friends' wardrobes and sharing looks, you want a completely free app, and you often add pieces you find online.",
      chooseMargot:
        "you want an outfit ready in the morning without scrolling, an honest answer before a purchase, and a wardrobe that stays private. The free plan stops at 15 pieces; beyond that you need Premium.",
      switching:
        "There is no bridge between the two. Whering's help centre says items cannot be exported, and Margot has no import from other apps. Start by photographing the pieces you wear most, or add several photos at once. Margot suggests a first outfit from three pieces, with a top and a bottom or a dress.",
      faq: [
        { q: "Is Whering free?", a: "Yes. Whering has no subscription and its core features are free. Image features are paid with credits, for example 10 credits for $2.99 on the US App Store on 4 October 2026. Margot is free up to 15 pieces; Premium costs $14.99 a month or $59.99 a year on the US App Store." },
        { q: "Is Margot a good Whering alternative?", a: "Yes, if what you want is a digital wardrobe with an outfit ready each morning, without a social network. Both apps catalogue your clothes and build outfits. Margot adds advice before you buy and Vinted listings written on request; Whering adds a community and a database of over 100 million items." },
        { q: "Does Whering have virtual try-on?", a: "Yes. Whering lets you try outfits on an avatar made from a full-length photo, paid with credits (one credit per try-on). Margot also has avatar try-on: one a week on the free plan, 15 a day with Premium." },
        { q: "Can I import my Whering wardrobe into Margot?", a: "No. Whering does not let you export your items and Margot has no import from other apps, so you photograph your clothes again, starting with the ones you wear most." },
        { q: "Where is my data stored?", a: "Whering says it stores data on Google Cloud in the UK, Belgium, the Netherlands and Finland. Margot stores data on servers in London, and photos are analysed by Google Gemini, as its privacy policy explains." },
      ],
    },
  },
};

const acloset: Competitor = {
  slug: "acloset",
  name: "Acloset",
  url: "https://www.acloset.app",
  operatingSystem: "iOS, Android",
  published: CHECKED,
  checked: CHECKED,
  sources: [
    { label: "Acloset, official site", url: "https://www.acloset.app/" },
    { label: "Acloset support and FAQ", url: "https://www.acloset.app/support" },
    { label: "Acloset on the App Store (France)", url: "https://apps.apple.com/fr/app/acloset-assistante-mode-ia/id1542311809" },
    { label: "Acloset on the App Store (US)", url: "https://apps.apple.com/us/app/acloset-ai-fashion-assistant/id1542311809" },
    { label: "Acloset on Google Play", url: "https://play.google.com/store/apps/details?id=com.looko.acloset" },
    { label: "Acloset terms of service", url: "https://www.acloset.app/terms" },
  ],
  copy: {
    fr: {
      metaTitle: "Acloset ou Margot ? Comparatif 2026, prix et avis · Margot",
      metaDescription:
        "Acloset ou Margot : tenues, essayage, limite gratuite, prix en euros et revente comparés à partir des sources officielles, vérifiés le 4 octobre 2026.",
      h1: "Acloset ou Margot ?",
      lede: "Acloset et Margot proposent des tenues à partir de tes propres vêtements, selon la météo, avec un essayage sur avatar. Acloset, éditée en Corée du Sud, est gratuite jusqu'à 100 pièces et très complète : styliste en chat, import depuis les boutiques en ligne et Gmail, communauté. Margot prépare une tenue chaque matin avant ton heure d'habillage, donne un avis avant d'acheter, rédige tes annonces Vinted et n'a pas de fil social.",
      bottomLine:
        "choisis Acloset pour un grand dressing gratuit (100 pièces) et l'import de tes commandes en ligne ; choisis Margot pour une tenue prête chaque matin, un avis avant achat et la revente sur Vinted, sans réseau social.",
      rows: {
        daily: "Oui, selon la météo et l'occasion, avec un styliste en chat",
        weather: "Oui",
        calendar: "Calendrier de tenues ; suggestions selon ton emploi du temps d'après sa fiche App Store",
        tryon: "Oui, avatar créé depuis ta photo (nombre d'essais variable)",
        buy: "Question au styliste dans le chat ; verdict non mentionné",
        adding: "Photo détourée, pièces détectées sur un selfie, import des commandes en ligne et des e-mails Gmail",
        stats: "Oui, dont le coût par port et les dépenses",
        packing: "Oui, avec la météo du voyage",
        social: "Oui : communauté, garde-robes à explorer",
        resale: "Non mentionnée sur sa fiche ni dans sa FAQ",
        platforms: "iPhone et Android ; extension Chrome pour consulter",
        languages: "18 langues, dont le français",
        export: "Non mentionné dans sa FAQ",
      },
      prices: {
        free: "Gratuit jusqu'à 100 pièces ; publicités sur Android",
        subscription: "Base : 3,99 € / mois ou 29,99 € / an ; Premium : 9,99 € / mois ou 69,99 € / an",
        oneOff: "Monnaie « Beans » de 1,99 € à 22,99 €",
        trial: "Non indiqué sur sa fiche",
      },
      priceNote: "Prix d'Acloset relevés sur l'App Store France le 4 octobre 2026.",
      theyDoWell: [
        { title: "Un grand dressing gratuit.", body: "Jusqu'à 100 pièces sans payer ; l'abonnement sert surtout à aller au-delà." },
        { title: "L'ajout sans photo.", body: "Acloset récupère tes commandes passées dans des boutiques en ligne ou dans tes e-mails Gmail, et détecte les pièces sur un selfie." },
        { title: "Un styliste en chat.", body: "Tu poses tes questions de style, il propose des tenues selon la météo et l'occasion." },
        { title: "Une large audience.", body: "18 langues, dont le français ; 4 millions d'utilisateurs selon ses fiches des stores, 8 millions selon son site." },
      ],
      margotDifferent: [
        { title: "Une tenue qui t'attend.", body: "Margot prépare ta tenue juste avant ton heure d'habillage et te prévient à ce moment-là. Pas besoin de la demander." },
        { title: "Un verdict avant d'acheter.", body: "Colle le lien d'une pièce : Margot répond « vaut le coup », « à réfléchir » ou « passe ton tour », selon ce qu'elle apporte à ton dressing." },
        { title: "La revente sur Vinted.", body: "Depuis la fiche d'une pièce, Margot rédige l'annonce : titre, description, hashtags et fourchette de prix." },
        { title: "Pas de fil social.", body: "Ni abonnés ni profil public. Margot est éditée à Paris, par YAVREN." },
      ],
      chooseThem:
        "ton dressing dépasse largement 15 pièces et tu ne veux pas payer, tu veux importer tes achats en ligne sans les photographier, ou tu aimes discuter style avec un assistant.",
      chooseMargot:
        "tu veux une tenue prête le matin sans rien demander, un avis avant d'acheter et une annonce Vinted en quelques minutes. La version gratuite de Margot s'arrête à 15 pièces : au-delà, Premium coûte 14,90 € par mois ou 59,99 € par an.",
      switching:
        "Aucun transfert automatique n'existe : la FAQ d'Acloset ne décrit pas d'export et Margot n'a pas d'import depuis une autre application. Re-photographie d'abord ce que tu portes le plus, ou ajoute plusieurs photos d'un coup. Margot propose une première tenue dès trois pièces, avec un haut et un bas ou une robe.",
      faq: [
        { q: "Acloset est-elle gratuite ?", a: "Oui, jusqu'à 100 pièces. Au-delà, il faut un abonnement : 3,99 € par mois pour l'offre de base ou 9,99 € par mois pour Premium sur l'App Store France au 4 octobre 2026. Sur Android, la fiche Google Play indique la présence de publicités. Margot est gratuite jusqu'à 15 pièces." },
        { q: "Acloset est-elle en français ?", a: "Oui, Acloset est traduite en 18 langues, dont le français. Margot est disponible en français, en anglais et en espagnol." },
        { q: "Quelle est la différence entre Acloset et Margot ?", a: "Les deux proposent des tenues avec tes vêtements, selon la météo, et un essayage sur avatar. Acloset mise sur un grand dressing gratuit, l'import de tes commandes et un styliste en chat. Margot mise sur une tenue prête chaque matin, un verdict avant achat et la revente sur Vinted." },
        { q: "Acloset ou Margot : laquelle coûte le moins cher ?", a: "Pour un petit dressing, les deux sont gratuites. Entre 16 et 100 pièces, Acloset reste gratuite alors que Margot demande Premium. Au-delà de 100 pièces, l'offre de base d'Acloset (3,99 € par mois) coûte moins que Margot Premium (14,90 € par mois ou 59,99 € par an)." },
        { q: "Peut-on passer d'Acloset à Margot ?", a: "Oui, mais sans transfert automatique : il faut re-photographier ses pièces. Margot propose une première tenue dès trois pièces, avec un haut et un bas ou une robe." },
      ],
    },
    en: {
      metaTitle: "Margot vs Acloset: features, prices and free limits",
      metaDescription:
        "Margot vs Acloset: daily outfits, try-on, free-plan limits, prices and resale compared from official sources, checked on 4 October 2026.",
      h1: "Margot vs Acloset",
      lede: "Acloset and Margot both suggest outfits from your own clothes with the weather in mind, and both offer try-on on an avatar. Acloset, made in South Korea, is free up to 100 items and very complete: a chat stylist, imports from online shops and Gmail, and a community. Margot has an outfit ready every morning before you get dressed, gives advice before you buy, writes Vinted listings and has no social feed.",
      bottomLine:
        "choose Acloset for a large free wardrobe (100 items) and imports from your online orders; choose Margot for an outfit ready every morning, advice before you buy and Vinted resale, without a social network.",
      rows: {
        daily: "Yes, for the weather and the occasion, with a chat stylist",
        weather: "Yes",
        calendar: "Outfit calendar; suggestions for your schedule according to its App Store listing",
        tryon: "Yes, an avatar made from your photo (number of tries varies)",
        buy: "Ask the chat stylist; no verdict mentioned",
        adding: "Photo with background removed, pieces detected in a selfie, imports from online orders and Gmail",
        stats: "Yes, including cost per wear and spending",
        packing: "Yes, with the trip's weather",
        social: "Yes: community, wardrobes to explore",
        resale: "Not mentioned on its listing or FAQ",
        platforms: "iPhone and Android; Chrome extension to browse",
        languages: "18 languages, including French",
        export: "Not mentioned in its FAQ",
      },
      prices: {
        free: "Free up to 100 items; ads on Android",
        subscription: "Basic: $3.99 a month or $27.99 a year; Premium: $9.99 a month or $59.99 a year; Expert: $24.99 a month or $147.99 a year",
        oneOff: "Beans, an in-app currency, for extra features",
        trial: "Not stated on its listing",
      },
      priceNote: "Acloset prices from the US App Store on 4 October 2026.",
      theyDoWell: [
        { title: "A large free wardrobe.", body: "Up to 100 items without paying; the subscription is mostly for going beyond that." },
        { title: "Adding without photos.", body: "Acloset imports past orders from online shops or your Gmail receipts, and detects pieces in a selfie." },
        { title: "A chat stylist.", body: "Ask style questions and get outfits for the weather and the occasion." },
        { title: "A wide audience.", body: "18 languages; 4 million users according to its store listings, 8 million according to its website." },
      ],
      margotDifferent: [
        { title: "An outfit waiting for you.", body: "Margot prepares your outfit just before the time you get dressed and notifies you then. You do not have to ask." },
        { title: "A verdict before you buy.", body: "Paste a product link and Margot answers buy, consider or skip, based on what the piece adds to your wardrobe." },
        { title: "Resale on Vinted.", body: "From any piece's page, Margot writes the listing: title, description, hashtags and a price range." },
        { title: "No social feed.", body: "No followers, no public profile. Margot is made in Paris by YAVREN." },
      ],
      chooseThem:
        "your wardrobe is well over 15 pieces and you do not want to pay, you want to import online purchases without photographing them, or you like talking style with an assistant.",
      chooseMargot:
        "you want an outfit ready in the morning without asking, advice before you buy and a Vinted listing in minutes. Margot's free plan stops at 15 pieces; Premium costs $14.99 a month or $59.99 a year on the US App Store.",
      switching:
        "There is no automatic transfer: Acloset's FAQ describes no export and Margot has no import from other apps. Photograph the pieces you wear most first, or add several photos at once. Margot suggests a first outfit from three pieces, with a top and a bottom or a dress.",
      faq: [
        { q: "Is Acloset free?", a: "Yes, up to 100 items. Beyond that you need a subscription: $3.99 a month for Basic or $9.99 a month for Premium on the US App Store on 4 October 2026. Its Google Play listing says the app contains ads. Margot is free up to 15 pieces." },
        { q: "What is the difference between Acloset and Margot?", a: "Both suggest outfits from your clothes for the weather and offer avatar try-on. Acloset focuses on a large free wardrobe, imports from your orders and a chat stylist. Margot focuses on an outfit ready every morning, a verdict before you buy and Vinted resale." },
        { q: "Which is cheaper, Acloset or Margot?", a: "For a small wardrobe, both are free. Between 16 and 100 items, Acloset stays free while Margot needs Premium. Beyond 100 items, Acloset Basic ($3.99 a month) costs less than Margot Premium ($14.99 a month or $59.99 a year on the US App Store)." },
        { q: "Can I switch from Acloset to Margot?", a: "Yes, but there is no automatic transfer, so you photograph your pieces again. Margot suggests a first outfit from three pieces, with a top and a bottom or a dress." },
      ],
    },
  },
};

const altaDaily: Competitor = {
  slug: "alta-daily",
  name: "Alta Daily",
  url: "https://www.altadaily.com",
  operatingSystem: "iOS, Android, Web",
  published: CHECKED,
  checked: CHECKED,
  sources: [
    { label: "Alta Daily, official site", url: "https://www.altadaily.com/" },
    { label: "Alta Daily on the App Store (US)", url: "https://apps.apple.com/us/app/alta-daily-digital-ai-closet/id6481705400" },
    { label: "Alta Daily on the App Store (France)", url: "https://apps.apple.com/fr/app/alta-daily-digital-ai-closet/id6481705400" },
    { label: "Alta Daily on Google Play", url: "https://play.google.com/store/apps/details?id=com.alta" },
    { label: "Alta Daily terms and conditions", url: "https://www.altadaily.com/terms-conditions" },
    { label: "Alta Daily privacy policy", url: "https://www.altadaily.com/privacy" },
    { label: "TIME Best Inventions 2025: Special Mentions", url: "https://time.com/collections/best-inventions-special-mentions/7320827/alta/" },
  ],
  copy: {
    fr: {
      metaTitle: "Alta Daily ou Margot ? Comparatif 2026 · Margot",
      metaDescription:
        "Alta Daily ou Margot : tenues, avatar, langue, prix et conditions d'utilisation comparés à partir des sources officielles, vérifiés le 4 octobre 2026.",
      h1: "Alta Daily ou Margot ?",
      lede: "Alta Daily et Margot composent des tenues avec tes propres vêtements, selon la météo, et te montrent le résultat sur un avatar. Alta, éditée aux États-Unis, est gratuite et très bien notée, mais elle n'existe qu'en anglais et sa politique de confidentialité demande de déclarer résider aux États-Unis. Margot est disponible en français, prépare une tenue chaque matin avant ton heure d'habillage et propose un abonnement Premium.",
      bottomLine:
        "choisis Alta si tu lis l'anglais, résides aux États-Unis et veux une application gratuite ; choisis Margot pour une application en français, éditée à Paris, avec une tenue prête chaque matin.",
      rows: {
        daily: "Oui, selon ton placard, ton mode de vie, ton budget et la météo",
        weather: "Oui",
        calendar: "Calendrier de style ; suggestions selon ton emploi du temps d'après sa fiche App Store",
        tryon: "Oui, sur un avatar à ton image",
        buy: "Pièces manquantes, wishlist avec alerte de baisse de prix",
        adding: "Photo détourée, reçus d'achat transférés par e-mail, base d'articles d'Alta",
        stats: "Oui : pièces les plus et les moins portées, coût par port",
        packing: "Oui, pour plusieurs villes, partageable par lien",
        social: "Looks de la communauté",
        resale: "Non mentionnée",
        platforms: "iPhone, Android et web",
        languages: "Anglais seulement",
      },
      prices: {
        free: "Gratuit : bêta gratuite « pour le moment » selon ses conditions",
        subscription: "Aucun",
        oneOff: "Aucun",
        trial: "Sans objet",
      },
      priceNote: "Aucun achat intégré sur les fiches App Store d'Alta en France, aux États-Unis et au Royaume-Uni au 4 octobre 2026.",
      theyDoWell: [
        { title: "Gratuite.", body: "Aucun achat intégré sur ses fiches App Store. Ses conditions précisent que la bêta est gratuite « pour le moment » et que des fonctions pourraient devenir payantes." },
        { title: "Un avatar à ton image.", body: "Alta génère la tenue sur un avatar qui te ressemble." },
        { title: "Très bien notée.", body: "4,9 sur 5 sur l'App Store américain, avec plus de 15 000 notes au 4 octobre 2026, et une mention spéciale dans les Best Inventions 2025 du magazine TIME." },
        { title: "Des voyages bien gérés.", body: "Listes de valise pour plusieurs villes, partageables par lien, et une version web." },
      ],
      margotDifferent: [
        { title: "En français.", body: "Margot est disponible en français, en anglais et en espagnol ; Alta seulement en anglais." },
        { title: "Éditée à Paris.", body: "Margot est publiée par YAVREN, une société parisienne, sur l'App Store et Google Play." },
        { title: "Une tenue qui t'attend.", body: "Margot prépare ta tenue juste avant ton heure d'habillage et te prévient à ce moment-là." },
        { title: "Un avis avant d'acheter et la revente.", body: "Un verdict « vaut le coup », « à réfléchir » ou « passe ton tour » sur une pièce, et une annonce Vinted rédigée à la demande." },
      ],
      chooseThem:
        "tu es à l'aise en anglais, tu résides aux États-Unis et tu veux une application gratuite, avec un avatar réaliste et une version web.",
      chooseMargot:
        "tu veux une application en français, une tenue prête chaque matin, un avis avant achat et des annonces Vinted. Margot est gratuite jusqu'à 15 pièces ; Premium coûte ensuite 14,90 € par mois ou 59,99 € par an.",
      switching:
        "Il n'y a pas de transfert automatique entre Alta et Margot, qui n'a pas d'import depuis une autre application. Re-photographie d'abord les pièces que tu portes le plus. Margot propose une première tenue dès trois pièces, avec un haut et un bas ou une robe.",
      faq: [
        { q: "Alta Daily est-elle disponible en France ?", a: "L'application est sur l'App Store France, mais elle n'existe qu'en anglais, et sa politique de confidentialité demande à l'utilisateur de déclarer qu'il réside aux États-Unis." },
        { q: "Alta Daily est-elle gratuite ?", a: "Oui, au 4 octobre 2026 : aucun achat intégré sur ses fiches App Store. Ses conditions parlent d'une bêta gratuite « pour le moment » et n'excluent pas des fonctions payantes plus tard." },
        { q: "Existe-t-il une alternative à Alta en français ?", a: "Oui. Margot est disponible en français et propose aussi des tenues avec tes vêtements selon la météo, ainsi qu'un essayage sur avatar. Acloset et Fits sont également traduites en français." },
        { q: "Alta ou Margot pour l'essayage virtuel ?", a: "Les deux proposent un essayage sur un avatar à ton image. Sur Alta, il est gratuit au 4 octobre 2026. Sur Margot, c'est un essayage par semaine en gratuit et quinze par jour avec Premium." },
      ],
    },
    en: {
      metaTitle: "Margot vs Alta Daily: features, prices and terms",
      metaDescription:
        "Margot vs Alta Daily: outfits, avatar try-on, languages, prices and terms of use compared from official sources, checked on 4 October 2026.",
      h1: "Margot vs Alta Daily",
      lede: "Alta Daily and Margot both build outfits from your own clothes with the weather in mind and show them on an avatar. Alta, made in the US, is free and very highly rated, but it is English-only and its privacy policy asks users to confirm they live in the United States. Margot is available in English, French and Spanish, has an outfit ready every morning before you get dressed, and offers a Premium subscription.",
      bottomLine:
        "choose Alta if you live in the US and want a free app with a realistic avatar and a web version; choose Margot if you live outside the US or want the app in French or Spanish, and if advice before you buy and Vinted listings matter to you.",
      rows: {
        daily: "Yes, based on your closet, lifestyle, budget and the weather",
        weather: "Yes",
        calendar: "Style calendar; suggestions for your schedule according to its App Store listing",
        tryon: "Yes, on an avatar that looks like you",
        buy: "Missing pieces, wishlist with price-drop alerts",
        adding: "Photo with background removed, forwarded email receipts, Alta's item database",
        stats: "Yes: most and least worn pieces, cost per wear",
        packing: "Yes, for several cities, shareable by link",
        social: "Looks from the community",
        resale: "Not mentioned",
        platforms: "iPhone, Android and web",
        languages: "English only",
      },
      prices: {
        free: "Free: a free beta \"at this time\", according to its terms",
        subscription: "None",
        oneOff: "None",
        trial: "Not applicable",
      },
      priceNote: "No in-app purchases on Alta's App Store listings in the US, the UK or France on 4 October 2026.",
      theyDoWell: [
        { title: "Free.", body: "No in-app purchases on its App Store listings. Its terms say the beta is free \"at this time\" and that some features may become paid upgrades." },
        { title: "An avatar that looks like you.", body: "Alta generates the outfit on an avatar made in your likeness." },
        { title: "Very highly rated.", body: "4.9 out of 5 on the US App Store from more than 15,000 ratings on 4 October 2026, and a Special Mention in TIME's Best Inventions of 2025." },
        { title: "Good for travel.", body: "Packing lists for several cities, shareable by link, plus a web version." },
      ],
      margotDifferent: [
        { title: "Three languages.", body: "Margot is available in English, French and Spanish; Alta in English only." },
        { title: "Made in Paris.", body: "Margot is published by YAVREN, a Paris company, on the App Store and Google Play." },
        { title: "An outfit waiting for you.", body: "Margot prepares your outfit just before the time you get dressed and notifies you then." },
        { title: "Advice before you buy, and resale.", body: "A buy, consider or skip verdict on a piece, and a Vinted listing written on request." },
      ],
      chooseThem:
        "you live in the US, read English comfortably and want a free app with a realistic avatar and a web version.",
      chooseMargot:
        "you live outside the US or want the app in French or Spanish, and you want an outfit ready each morning, advice before you buy and Vinted listings. Margot is free up to 15 pieces; Premium costs $14.99 a month or $59.99 a year on the US App Store.",
      switching:
        "There is no automatic transfer between Alta and Margot, which has no import from other apps. Photograph the pieces you wear most first. Margot suggests a first outfit from three pieces, with a top and a bottom or a dress.",
      faq: [
        { q: "Is Alta Daily free?", a: "Yes, on 4 October 2026: there are no in-app purchases on its App Store listings. Its terms describe a free beta \"at this time\" and do not rule out paid features later." },
        { q: "Can I use Alta Daily outside the US?", a: "The app is listed on other App Stores, including France, but it is English-only and its privacy policy asks users to confirm they are US residents." },
        { q: "What is a good Alta Daily alternative in French or Spanish?", a: "Margot is available in English, French and Spanish and also builds outfits from your clothes for the weather, with avatar try-on. Acloset and Fits are translated into French too." },
        { q: "Alta or Margot for virtual try-on?", a: "Both let you try outfits on an avatar that looks like you. On Alta it is free on 4 October 2026. On Margot it is one try-on a week on the free plan and 15 a day with Premium." },
      ],
    },
  },
};

const fits: Competitor = {
  slug: "fits",
  name: "Fits",
  url: "https://www.fits-app.com",
  operatingSystem: "iOS, Android",
  published: CHECKED,
  checked: CHECKED,
  sources: [
    { label: "Fits, official site", url: "https://www.fits-app.com/" },
    { label: "Fits help: free and paid features", url: "https://www.fits-app.com/knowledge/free-vs-paid-features" },
    { label: "Fits help: what Fits Pro includes", url: "https://www.fits-app.com/knowledge/what-is-included-in-fits-pro" },
    { label: "Fits help: where you can use Fits", url: "https://www.fits-app.com/knowledge/where-can-i-use-fits" },
    { label: "Fits help: supported languages", url: "https://www.fits-app.com/knowledge/what-languages-does-fits-support" },
    { label: "Fits help: virtual try-on", url: "https://www.fits-app.com/knowledge/how-to-try-on-clothes-virtually-with-ai" },
    { label: "Fits on the App Store (France)", url: "https://apps.apple.com/fr/app/fits-closet-outfit-maker/id6447482321" },
    { label: "Fits on the App Store (US)", url: "https://apps.apple.com/us/app/fits-outfit-planner-closet/id6447482321" },
  ],
  copy: {
    fr: {
      metaTitle: "Fits ou Margot ? Comparatif 2026, prix et avis · Margot",
      metaDescription:
        "Fits ou Margot : tenues, essayage, pièces illimitées, prix de Fits Pro et revente comparés à partir des sources officielles, vérifiés le 4 octobre 2026.",
      h1: "Fits ou Margot ?",
      lede: "Fits et Margot te proposent des tenues avec tes propres vêtements, selon la météo, et un essayage sur avatar. Fits, éditée en Allemagne, est gratuite avec des pièces illimitées, traduite en 24 langues, et son abonnement Fits Pro débloque les fonctions avancées. Margot prépare une tenue chaque matin avant ton heure d'habillage, donne un avis avant d'acheter et rédige tes annonces Vinted, sans fil social.",
      bottomLine:
        "choisis Fits pour un dressing gratuit sans limite de pièces et une touche sociale ; choisis Margot pour une tenue prête chaque matin, un verdict avant achat et la revente sur Vinted.",
      rows: {
        daily: "Oui : styliste en chat et « Make an outfit » dès 5 pièces, illimités avec Fits Pro",
        weather: "Oui",
        calendar: "Planner de tenues ; lecture de l'agenda du téléphone non mentionnée dans son aide",
        tryon: "Oui, 1 crédit par essayage (30 crédits par mois avec Fits Pro)",
        buy: "Repérage des manques, essayage des pièces de ta wishlist",
        adding: "Photo détourée avec catégorie, couleur, saison et marque détectées, recherche en ligne, e-mails de commande",
        stats: "Oui, dont le coût par port (statistiques avancées avec Fits Pro)",
        packing: "Oui, manuelle ou générée",
        social: "Profil public ou privé, stories, amis qui composent des tenues pour toi",
        resale: "Non mentionnée",
        platforms: "iPhone, iPad et Android ; pas de version web",
        languages: "24 langues, dont le français",
      },
      prices: {
        free: "Gratuit, pièces illimitées et détourage inclus",
        subscription: "Fits Pro, mensuel ou annuel : achats affichés à 9,99 €, 24,99 € et 39,99 €, durées non précisées sur la fiche",
        oneOff: "Crédits de 1,99 € (5) à 79,99 € (500)",
        trial: "7 jours pour Fits Pro, nouveaux utilisateurs",
      },
      priceNote: "Prix de Fits relevés sur l'App Store France le 4 octobre 2026 ; la fiche n'affiche pas la durée de chaque formule.",
      theyDoWell: [
        { title: "Pièces illimitées en gratuit.", body: "Fits ne limite pas le nombre de pièces et inclut le détourage sans payer." },
        { title: "Un ajout rapide.", body: "Catégorie, couleur, saison et marque détectées sur la photo, recherche en ligne et import des e-mails de commande." },
        { title: "Très traduite.", body: "24 langues, dont le français, sur iPhone, iPad et Android." },
        { title: "Une touche sociale.", body: "Profil public ou privé, stories de tenues, et des amis qui peuvent composer des looks pour toi." },
      ],
      margotDifferent: [
        { title: "Une tenue qui t'attend.", body: "Margot prépare ta tenue juste avant ton heure d'habillage et te prévient à ce moment-là." },
        { title: "Un verdict sur une pièce précise.", body: "Fits repère les manques de ta garde-robe ; Margot répond sur la pièce que tu hésites à acheter : « vaut le coup », « à réfléchir » ou « passe ton tour »." },
        { title: "La revente sur Vinted.", body: "Depuis la fiche d'une pièce, Margot rédige l'annonce : titre, description, hashtags et fourchette de prix." },
        { title: "Pas de fil social.", body: "Ni abonnés ni profil public ; tu peux partager un look en image." },
      ],
      chooseThem:
        "tu as beaucoup de pièces et ne veux pas payer, tu utilises un iPad, ou tu aimes que tes amis composent des tenues pour toi.",
      chooseMargot:
        "tu veux une tenue prête le matin, un verdict avant achat et une annonce Vinted rédigée pour toi. La version gratuite de Margot s'arrête à 15 pièces ; Premium coûte ensuite 14,90 € par mois ou 59,99 € par an.",
      switching:
        "Aucun transfert automatique n'existe vers Margot, qui n'a pas d'import depuis une autre application. Re-photographie d'abord ce que tu portes le plus, ou ajoute plusieurs photos d'un coup. Margot propose une première tenue dès trois pièces, avec un haut et un bas ou une robe.",
      faq: [
        { q: "Fits est-elle gratuite ?", a: "Oui, avec des pièces illimitées et le détourage inclus. L'abonnement facultatif Fits Pro, mensuel ou annuel, débloque les suggestions et le chat illimités, 30 crédits par mois pour l'essayage et les statistiques avancées, avec 7 jours d'essai pour les nouveaux utilisateurs." },
        { q: "Fits est-elle en français ?", a: "Oui, Fits est traduite en 24 langues, dont le français. Margot est disponible en français, en anglais et en espagnol." },
        { q: "Quelle est la différence entre Fits et Margot ?", a: "Les deux proposent des tenues avec tes vêtements, selon la météo, et un essayage sur avatar. Fits mise sur un dressing gratuit sans limite et une touche sociale. Margot mise sur une tenue prête chaque matin, un verdict avant achat et la revente sur Vinted." },
        { q: "Fits fonctionne-t-elle sur ordinateur ?", a: "Pas en version web. Selon son aide, l'application iPad peut s'installer sur un Mac. Margot n'a pas non plus de version web : elle fonctionne sur iPhone et Android." },
      ],
    },
    en: {
      metaTitle: "Margot vs Fits: features, prices and free limits",
      metaDescription:
        "Margot vs Fits: daily outfits, try-on, unlimited free items, Fits Pro prices and resale compared from official sources, checked on 4 October 2026.",
      h1: "Margot vs Fits",
      lede: "Fits and Margot both suggest outfits from your own clothes with the weather in mind, and both offer try-on on an avatar. Fits, made in Germany, is free with unlimited items, translated into 24 languages, and its Fits Pro subscription unlocks advanced features. Margot has an outfit ready every morning before you get dressed, gives advice before you buy and writes your Vinted listings, without a social feed.",
      bottomLine:
        "choose Fits for a free wardrobe with no item limit and a social touch; choose Margot for an outfit ready every morning, a verdict before you buy and Vinted resale.",
      rows: {
        daily: "Yes: a chat stylist and \"Make an outfit\" from 5 items, unlimited with Fits Pro",
        weather: "Yes",
        calendar: "Outfit planner; reading your phone's calendar is not mentioned in its help centre",
        tryon: "Yes, 1 credit per try-on (30 credits a month with Fits Pro)",
        buy: "Wardrobe gap finder, try-on for wishlist items",
        adding: "Photo with background removed and category, colour, season and brand detected; online search; order emails",
        stats: "Yes, including cost per wear (advanced stats with Fits Pro)",
        packing: "Yes, manual or generated",
        social: "Public or private profile, stories, friends who style outfits for you",
        resale: "Not mentioned",
        platforms: "iPhone, iPad and Android; no web version",
        languages: "24 languages",
      },
      prices: {
        free: "Free, unlimited items and background removal included",
        subscription: "Fits Pro, monthly or yearly: listed at $9.99, $29.99 and $59.99, durations not shown on the listing",
        oneOff: "Credits from $1.99 (5) to $79.99 (500)",
        trial: "7 days of Fits Pro for new users",
      },
      priceNote: "Fits prices from the US App Store on 4 October 2026; the listing does not show the duration of each plan.",
      theyDoWell: [
        { title: "Unlimited items for free.", body: "Fits does not cap the number of items and includes background removal without paying." },
        { title: "Quick to fill.", body: "Category, colour, season and brand are detected from the photo, and you can search online or import order emails." },
        { title: "Widely translated.", body: "24 languages, on iPhone, iPad and Android." },
        { title: "A social touch.", body: "Public or private profile, outfit stories, and friends who can put looks together for you." },
      ],
      margotDifferent: [
        { title: "An outfit waiting for you.", body: "Margot prepares your outfit just before the time you get dressed and notifies you then." },
        { title: "A verdict on one piece.", body: "Fits finds gaps in your wardrobe; Margot answers about the piece you are hesitating over: buy, consider or skip." },
        { title: "Resale on Vinted.", body: "From any piece's page, Margot writes the listing: title, description, hashtags and a price range." },
        { title: "No social feed.", body: "No followers, no public profile; you can share a look as an image." },
      ],
      chooseThem:
        "you own a lot of pieces and do not want to pay, you use an iPad, or you like friends styling outfits for you.",
      chooseMargot:
        "you want an outfit ready in the morning, a verdict before you buy and a Vinted listing written for you. Margot's free plan stops at 15 pieces; Premium costs $14.99 a month or $59.99 a year on the US App Store.",
      switching:
        "There is no automatic transfer to Margot, which has no import from other apps. Photograph the pieces you wear most first, or add several photos at once. Margot suggests a first outfit from three pieces, with a top and a bottom or a dress.",
      faq: [
        { q: "Is Fits free?", a: "Yes, with unlimited items and background removal included. The optional Fits Pro subscription, monthly or yearly, unlocks unlimited suggestions and chat, 30 credits a month for try-on and advanced stats, with a 7-day trial for new users." },
        { q: "What is the difference between Fits and Margot?", a: "Both suggest outfits from your clothes for the weather and offer avatar try-on. Fits focuses on an unlimited free wardrobe and a social touch. Margot focuses on an outfit ready every morning, a verdict before you buy and Vinted resale." },
        { q: "Does Fits work on a computer?", a: "Not on the web. According to its help centre, the iPad app can be installed on a Mac. Margot has no web version either: it runs on iPhone and Android." },
      ],
    },
  },
};

const stylebook: Competitor = {
  slug: "stylebook",
  name: "Stylebook",
  url: "https://www.stylebookapp.com",
  operatingSystem: "iOS",
  published: CHECKED,
  checked: CHECKED,
  sources: [
    { label: "Stylebook, official site", url: "https://www.stylebookapp.com/" },
    { label: "Stylebook FAQ", url: "https://www.stylebookapp.com/faq.html" },
    { label: "Stylebook features", url: "https://www.stylebookapp.com/features.html" },
    { label: "Stylebook on the App Store (France)", url: "https://apps.apple.com/fr/app/stylebook/id335709058" },
    { label: "Stylebook on the App Store (US)", url: "https://apps.apple.com/us/app/stylebook/id335709058" },
  ],
  copy: {
    fr: {
      metaTitle: "Stylebook ou Margot ? Comparatif 2026 · Margot",
      metaDescription:
        "Stylebook ou Margot : achat unique ou abonnement, iPhone ou Android, tenues mélangées ou proposées, comparés à partir des sources officielles au 4 octobre 2026.",
      h1: "Stylebook ou Margot ?",
      lede: "Stylebook est l'application de dressing historique de l'iPhone, lancée en 2009 : un achat unique, plus de 90 fonctions, mais pas de version Android ni de tenues composées pour toi. Margot fonctionne sur iPhone et Android, prépare une tenue chaque matin selon la météo et ton dressing, et propose un abonnement au-delà de sa version gratuite.",
      bottomLine:
        "choisis Stylebook si tu as un iPhone, veux payer une seule fois et composer tes tenues toi-même ; choisis Margot si tu veux qu'on te propose une tenue chaque matin, selon la météo, ou si tu es sur Android.",
      rows: {
        daily: "Non : « Outfit Shuffle » mélange tes pièces au hasard",
        weather: "Non mentionnée sur son site",
        calendar: "Oui : planifier tes tenues à l'avance",
        tryon: "Non mentionné",
        buy: "Oui : comparer un achat à ton placard (fonction Shopping)",
        adding: "Photo détourée, découpe depuis le web, import de plusieurs photos d'un album",
        stats: "Oui, dont le coût par port",
        packing: "Oui, à partir de tes tenues",
        social: "Pas de fil ; partage par e-mail, SMS ou réseaux",
        resale: "Non mentionnée",
        platforms: "iPhone et iPad seulement",
        languages: "Anglais, français, portugais, espagnol, japonais, chinois",
        export: "Données sur l'appareil et dans iCloud ; export de fichier non mentionné",
      },
      prices: {
        free: "Non",
        subscription: "Aucun",
        oneOff: "Achat de l'application : 5,99 €",
        trial: "Non",
      },
      priceNote: "Prix de Stylebook relevé sur l'App Store France le 4 octobre 2026 ; aucun achat intégré affiché.",
      theyDoWell: [
        { title: "Un seul paiement.", body: "5,99 € une fois sur l'App Store France, sans abonnement." },
        { title: "Une application mûre.", body: "Lancée en 2009, plus de 90 fonctions selon sa fiche, toujours mise à jour (version 10.1 de juin 2025)." },
        { title: "Tes données chez toi.", body: "Elles restent sur ton appareil, et dans iCloud si tu l'actives." },
        { title: "Le contrôle total.", body: "Tu composes tes tenues toi-même, avec un calendrier, des statistiques et des listes de valise." },
      ],
      margotDifferent: [
        { title: "Des tenues proposées, pas mélangées.", body: "Margot compose une tenue selon la météo et ce que tu portes vraiment, et la prépare avant ton heure d'habillage." },
        { title: "Sur Android aussi.", body: "Margot fonctionne sur iPhone et Android ; Stylebook seulement sur iPhone et iPad." },
        { title: "Un essayage sur avatar.", body: "Un par semaine en gratuit, quinze par jour avec Premium." },
        { title: "Un avis et la revente.", body: "Un verdict avant achat et une annonce Vinted rédigée à la demande." },
      ],
      chooseThem:
        "tu as un iPhone, tu préfères payer une seule fois et composer tes tenues toi-même, et tu veux que tes données restent sur ton appareil.",
      chooseMargot:
        "tu veux qu'on te propose une tenue chaque matin, selon la météo, sur iPhone ou sur Android. Margot est gratuite jusqu'à 15 pièces ; Premium coûte ensuite 14,90 € par mois ou 59,99 € par an.",
      switching:
        "Il n'y a pas de transfert automatique : Stylebook garde tes données sur ton appareil et dans iCloud, et Margot n'a pas d'import depuis une autre application. Re-photographie d'abord ce que tu portes le plus. Margot propose une première tenue dès trois pièces, avec un haut et un bas ou une robe.",
      faq: [
        { q: "Stylebook est-elle gratuite ?", a: "Non. Stylebook est un achat unique de 5,99 € sur l'App Store France (4,99 $ aux États-Unis), sans abonnement. Margot est gratuite jusqu'à 15 pièces, avec un abonnement Premium facultatif." },
        { q: "Stylebook existe-t-elle sur Android ?", a: "Non. Selon sa FAQ, Stylebook n'est disponible que sur iPhone et iPad. Margot fonctionne sur iPhone et Android." },
        { q: "Stylebook propose-t-elle des tenues automatiquement ?", a: "Elle propose « Outfit Shuffle », qui mélange tes pièces comme un jeu de cartes. Margot compose une tenue selon la météo et ton dressing, et la prépare chaque matin." },
        { q: "Quelle application de dressing sans abonnement choisir ?", a: "Stylebook se paie une fois. Whering est gratuite, sans abonnement, avec des crédits pour les fonctions d'image. Fits est gratuite, avec un abonnement facultatif." },
      ],
    },
    en: {
      metaTitle: "Margot vs Stylebook: one-off app or daily stylist?",
      metaDescription:
        "Margot vs Stylebook: one-off purchase or subscription, iPhone or Android, shuffled or suggested outfits, compared from official sources on 4 October 2026.",
      h1: "Margot vs Stylebook",
      lede: "Stylebook is the long-standing iPhone wardrobe app, launched in 2009: a one-off purchase and over 90 features, but no Android version and no outfits put together for you. Margot runs on iPhone and Android, has an outfit ready each morning based on the weather and your wardrobe, and offers a subscription beyond its free plan.",
      bottomLine:
        "choose Stylebook if you have an iPhone, want to pay once and build outfits yourself; choose Margot if you want an outfit suggested every morning for the weather, or if you use Android.",
      rows: {
        daily: "No: \"Outfit Shuffle\" mixes your pieces at random",
        weather: "Not mentioned on its site",
        calendar: "Yes: plan outfits in advance",
        tryon: "Not mentioned",
        buy: "Yes: compare a purchase with your closet (Shopping feature)",
        adding: "Photo with background removed, clip from the web, import several photos from an album",
        stats: "Yes, including cost per wear",
        packing: "Yes, built from your outfits",
        social: "No feed; share by email, text or social networks",
        resale: "Not mentioned",
        platforms: "iPhone and iPad only",
        languages: "English, French, Portuguese, Spanish, Japanese, Chinese",
        export: "Data on your device and in iCloud; file export not mentioned",
      },
      prices: {
        free: "No",
        subscription: "None",
        oneOff: "App purchase: $4.99 (£4.99 in the UK)",
        trial: "No",
      },
      priceNote: "Stylebook price from the US App Store on 4 October 2026; no in-app purchases listed.",
      theyDoWell: [
        { title: "Pay once.", body: "$4.99 once on the US App Store, no subscription." },
        { title: "A mature app.", body: "Launched in 2009, over 90 features according to its listing, still updated (version 10.1 from June 2025)." },
        { title: "Your data stays with you.", body: "It lives on your device, and in iCloud if you turn it on." },
        { title: "Full control.", body: "You build outfits yourself, with a calendar, stats and packing lists." },
      ],
      margotDifferent: [
        { title: "Outfits suggested, not shuffled.", body: "Margot builds an outfit for the weather and what you actually wear, and has it ready before you get dressed." },
        { title: "Android too.", body: "Margot runs on iPhone and Android; Stylebook only on iPhone and iPad." },
        { title: "Avatar try-on.", body: "One a week on the free plan, 15 a day with Premium." },
        { title: "Advice and resale.", body: "A verdict before you buy and a Vinted listing written on request." },
      ],
      chooseThem:
        "you have an iPhone, prefer paying once and building outfits yourself, and want your data to stay on your device.",
      chooseMargot:
        "you want an outfit suggested every morning for the weather, on iPhone or Android. Margot is free up to 15 pieces; Premium costs $14.99 a month or $59.99 a year on the US App Store.",
      switching:
        "There is no automatic transfer: Stylebook keeps your data on your device and in iCloud, and Margot has no import from other apps. Photograph the pieces you wear most first. Margot suggests a first outfit from three pieces, with a top and a bottom or a dress.",
      faq: [
        { q: "Is Stylebook free?", a: "No. Stylebook is a one-off purchase, $4.99 on the US App Store (£4.99 in the UK), with no subscription. Margot is free up to 15 pieces, with an optional Premium subscription." },
        { q: "Is Stylebook on Android?", a: "No. According to its FAQ, Stylebook is only available on iPhone and iPad. Margot runs on iPhone and Android." },
        { q: "Does Stylebook suggest outfits automatically?", a: "It offers Outfit Shuffle, which mixes your pieces like a deck of cards. Margot builds an outfit for the weather and your wardrobe, ready each morning." },
        { q: "Which wardrobe apps have no subscription?", a: "Stylebook is a one-off purchase. Whering is free with no subscription, with credits for image features. Fits is free, with an optional subscription." },
      ],
    },
  },
};

export const COMPETITORS: Competitor[] = [whering, acloset, altaDaily, fits, stylebook];

export function getCompetitor(slug: string) {
  return COMPETITORS.find((c) => c.slug === slug) ?? null;
}
