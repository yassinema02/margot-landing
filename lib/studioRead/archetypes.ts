import type { ArchetypeId, Locale } from "./types";

type L = Record<Locale, string>;
type Piece = { piece: L; why: L };

export type ArchetypeMeta = {
  label: L;
  identity_line: L;
  palette_hexes: string[]; // 4 — aesthetic-derived, NEVER from the face
  one_liner: L; // shareable
  starter_kit: Piece[]; // 5-7
};

const p = (piece: L, why: L): Piece => ({ piece, why });

export const ARCHETYPES: Record<ArchetypeId, ArchetypeMeta> = {
  quiet_luxury: {
    label: { en: "Old Money", fr: "Old Money" },
    identity_line: {
      en: "Understated wealth — the quality is in the cut, never the logo.",
      fr: "Le luxe qui chuchote — la qualité est dans la coupe, jamais dans le logo.",
    },
    palette_hexes: ["#C8B49A", "#EFE7D8", "#8A7D6B", "#3B3730"],
    one_liner: { en: "Whispers, never shouts.", fr: "Ça chuchote, ça ne crie jamais." },
    starter_kit: [
      p({ en: "Camel tailored coat", fr: "Manteau camel tailoré" }, { en: "The anchor of the whole look", fr: "L'ancre de toute la silhouette" }),
      p({ en: "Cashmere knit", fr: "Maille cachemire" }, { en: "Quality you feel before you see", fr: "Une qualité qui se sent avant de se voir" }),
      p({ en: "White poplin shirt", fr: "Chemise popeline blanche" }, { en: "Crisp, endlessly versatile", fr: "Nette, infiniment polyvalente" }),
      p({ en: "Tailored trousers", fr: "Pantalon tailoré" }, { en: "Clean line head to toe", fr: "Une ligne nette de haut en bas" }),
      p({ en: "Leather loafers", fr: "Mocassins cuir" }, { en: "Quiet, considered footing", fr: "Une base discrète et soignée" }),
      p({ en: "Structured leather tote", fr: "Tote en cuir structuré" }, { en: "Function with restraint", fr: "Du fonctionnel sans esbroufe" }),
      p({ en: "Gold signet or watch", fr: "Chevalière ou montre or" }, { en: "One warm metal, repeated", fr: "Un métal chaud, répété" }),
    ],
  },
  minimalist: {
    label: { en: "Minimal", fr: "Minimal" },
    identity_line: {
      en: "Less, but better — every piece earns its place.",
      fr: "Moins, mais mieux — chaque pièce a gagné sa place.",
    },
    palette_hexes: ["#F4F4F2", "#111111", "#BFBFBF", "#6E6E6E"],
    one_liner: { en: "Nothing to add, nothing to remove.", fr: "Rien à ajouter, rien à enlever." },
    starter_kit: [
      p({ en: "Crisp white tee", fr: "Tee blanc net" }, { en: "The blank canvas", fr: "La toile vierge" }),
      p({ en: "Straight black trousers", fr: "Pantalon droit noir" }, { en: "Clean vertical line", fr: "Une verticale nette" }),
      p({ en: "Monochrome knit", fr: "Maille monochrome" }, { en: "Texture over print", fr: "La texture plutôt que l'imprimé" }),
      p({ en: "White leather sneakers", fr: "Sneakers cuir blanches" }, { en: "Quiet, clean footing", fr: "Une base propre et discrète" }),
      p({ en: "Tailored blazer", fr: "Blazer tailoré" }, { en: "Structure when you need it", fr: "De la structure quand il faut" }),
      p({ en: "Structured crossbody", fr: "Crossbody structuré" }, { en: "One considered shape", fr: "Une forme pensée" }),
    ],
  },
  bold_glam: {
    label: { en: "Glam", fr: "Glam" },
    identity_line: {
      en: "Dressed to be seen — shine, drama, intention.",
      fr: "Habillé·e pour être vu·e — éclat, drame, intention.",
    },
    palette_hexes: ["#0E0E10", "#C9A24B", "#9B1B2E", "#D9D9D9"],
    one_liner: { en: "You walk in, the room turns.", fr: "Tu entres, la pièce se retourne." },
    starter_kit: [
      p({ en: "Statement dress", fr: "Robe statement" }, { en: "The centrepiece", fr: "La pièce maîtresse" }),
      p({ en: "Strappy heels", fr: "Talons à brides" }, { en: "Length and lift", fr: "De la ligne et de la hauteur" }),
      p({ en: "Oversized earrings", fr: "Boucles oversize" }, { en: "Frame the face", fr: "Encadrer le visage" }),
      p({ en: "Satin slip", fr: "Nuisette satin" }, { en: "Effortless sheen", fr: "Un éclat sans effort" }),
      p({ en: "Sharp blazer", fr: "Blazer net" }, { en: "Power with the polish", fr: "De la prestance avec le poli" }),
      p({ en: "Mini clutch", fr: "Mini-pochette" }, { en: "Just enough, nothing more", fr: "Juste ce qu'il faut" }),
    ],
  },
  boho: {
    label: { en: "Boho", fr: "Boho" },
    identity_line: {
      en: "Earthy, layered, wandering — texture over polish.",
      fr: "Terreux, superposé, vagabond — la texture avant le poli.",
    },
    palette_hexes: ["#C08457", "#8B9A6B", "#EFE3CE", "#9A5B3B"],
    one_liner: { en: "Free spirit, fully styled.", fr: "Esprit libre, entièrement stylé." },
    starter_kit: [
      p({ en: "Flowy maxi dress", fr: "Maxi-robe fluide" }, { en: "Movement is the point", fr: "Le mouvement, c'est le sujet" }),
      p({ en: "Fringed suede jacket", fr: "Veste daim à franges" }, { en: "Texture and warmth", fr: "De la texture et de la chaleur" }),
      p({ en: "Wide-brim hat", fr: "Chapeau à large bord" }, { en: "The signature gesture", fr: "Le geste signature" }),
      p({ en: "Layered necklaces", fr: "Colliers superposés" }, { en: "Collected, not bought", fr: "Chiné, pas acheté" }),
      p({ en: "Ankle boots", fr: "Bottines" }, { en: "Grounded wandering", fr: "Vagabonder, les pieds sur terre" }),
      p({ en: "Crochet bag", fr: "Sac crochet" }, { en: "Handmade soul", fr: "Une âme artisanale" }),
      p({ en: "Printed scarf", fr: "Foulard imprimé" }, { en: "A wandering accent", fr: "Un accent nomade" }),
    ],
  },
  streetwear: {
    label: { en: "Street", fr: "Street" },
    identity_line: {
      en: "Comfort with attitude — culture you can wear.",
      fr: "Le confort avec de l'attitude — la culture qui se porte.",
    },
    palette_hexes: ["#1A1A1A", "#4A4A4A", "#E0532E", "#5A6650"],
    one_liner: { en: "Easy, but never basic.", fr: "Cool, mais jamais banal." },
    starter_kit: [
      p({ en: "Oversized hoodie", fr: "Hoodie oversize" }, { en: "The comfort base", fr: "La base confort" }),
      p({ en: "Graphic tee", fr: "Tee graphique" }, { en: "Wear your references", fr: "Porter ses références" }),
      p({ en: "Cargo pants", fr: "Cargo" }, { en: "Utility with volume", fr: "De l'utilitaire avec du volume" }),
      p({ en: "Statement sneakers", fr: "Sneakers statement" }, { en: "The whole look pivots here", fr: "Tout le look pivote ici" }),
      p({ en: "Cap or bucket hat", fr: "Casquette ou bob" }, { en: "Finish the silhouette", fr: "Finir la silhouette" }),
      p({ en: "Crossbody bag", fr: "Sac crossbody" }, { en: "Hands free, hood up", fr: "Mains libres, capuche relevée" }),
      p({ en: "Bomber or puffer", fr: "Bomber ou doudoune" }, { en: "Outer layer with weight", fr: "Une couche extérieure qui pèse" }),
    ],
  },
  dark_academia: {
    label: { en: "Dark Academia", fr: "Dark Academia" },
    identity_line: {
      en: "Bookish, moody, tailored — old libraries and autumn.",
      fr: "Studieux, sombre, taillé — vieilles bibliothèques et automne.",
    },
    palette_hexes: ["#5E4B3A", "#2F3A2F", "#EAE2CF", "#5A2A2A"],
    one_liner: { en: "Dressed for the library, ready for the rain.", fr: "Habillé·e pour la bibliothèque, prêt·e pour la pluie." },
    starter_kit: [
      p({ en: "Tweed blazer", fr: "Blazer tweed" }, { en: "The scholarly backbone", fr: "La colonne studieuse" }),
      p({ en: "Knit vest", fr: "Gilet maille" }, { en: "Layered intellect", fr: "L'intellect en couches" }),
      p({ en: "White collared shirt", fr: "Chemise col blanc" }, { en: "The crisp under-layer", fr: "La couche nette en dessous" }),
      p({ en: "Pleated trousers", fr: "Pantalon à pinces" }, { en: "Old-world line", fr: "Une ligne d'antan" }),
      p({ en: "Oxford shoes", fr: "Derbies / oxfords" }, { en: "Footsteps in a corridor", fr: "Des pas dans un couloir" }),
      p({ en: "Wool overcoat", fr: "Manteau laine" }, { en: "Autumn, always", fr: "L'automne, toujours" }),
      p({ en: "Leather satchel", fr: "Cartable cuir" }, { en: "Carries the story", fr: "Porte l'histoire" }),
    ],
  },
  romantic: {
    label: { en: "Romantic", fr: "Romantique" },
    identity_line: {
      en: "Soft, feminine, tender — lace, florals, flou.",
      fr: "Doux, tendre, féminin — dentelle, fleurs, flou.",
    },
    palette_hexes: ["#F3D9DD", "#FBF1E6", "#D9C6E0", "#C98BA0"],
    one_liner: { en: "Soft is its own kind of strength.", fr: "La douceur est une force." },
    starter_kit: [
      p({ en: "Floral midi dress", fr: "Robe midi fleurie" }, { en: "The heart of it", fr: "Le cœur du style" }),
      p({ en: "Lace or ruffle blouse", fr: "Blouse dentelle / volants" }, { en: "Detail close to the skin", fr: "Le détail près de la peau" }),
      p({ en: "Ballet flats", fr: "Ballerines" }, { en: "Light on the feet", fr: "Légère sur les pieds" }),
      p({ en: "Delicate jewelry", fr: "Bijoux délicats" }, { en: "Whispered, not loud", fr: "Murmuré, pas tapageur" }),
      p({ en: "Soft cardigan", fr: "Cardigan doux" }, { en: "Tender layering", fr: "Une superposition tendre" }),
      p({ en: "Pleated skirt", fr: "Jupe plissée" }, { en: "Movement and softness", fr: "Du mouvement et de la douceur" }),
    ],
  },
  edgy: {
    label: { en: "Edgy", fr: "Edgy" },
    identity_line: {
      en: "Sharp, rebellious, a little dangerous — leather and contrast.",
      fr: "Tranchant, rebelle, un soupçon de danger — cuir et contraste.",
    },
    palette_hexes: ["#0B0B0B", "#2A2A2E", "#B9B9C0", "#6E1414"],
    one_liner: { en: "A little danger, fully intentional.", fr: "Un soupçon de danger, totalement assumé." },
    starter_kit: [
      p({ en: "Leather biker jacket", fr: "Perfecto cuir" }, { en: "The armour", fr: "L'armure" }),
      p({ en: "Ripped black denim", fr: "Jean noir déchiré" }, { en: "Worn-in defiance", fr: "Une défiance rodée" }),
      p({ en: "Combat boots", fr: "Rangers / combat boots" }, { en: "Footing that means it", fr: "Une base qui ne plaisante pas" }),
      p({ en: "Band or graphic tee", fr: "Tee de groupe" }, { en: "The reference under the leather", fr: "La référence sous le cuir" }),
      p({ en: "Silver hardware jewelry", fr: "Bijoux argent" }, { en: "Cold metal, sharp lines", fr: "Métal froid, lignes nettes" }),
      p({ en: "Studded belt or bag", fr: "Ceinture / sac clouté" }, { en: "The bite in the detail", fr: "Le mordant dans le détail" }),
    ],
  },
};
