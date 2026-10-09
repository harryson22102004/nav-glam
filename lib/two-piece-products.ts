import type { Product } from "./types";
import type { StudyKey } from "./studies";

type TwoPieceDescription = {
  colorName: string;
  study: StudyKey;
  description: string;
};

const twoPieceDescriptions: TwoPieceDescription[] = [
  { colorName: "Black", study: "ink", description: "A black lehenga set with a coordinating sleeveless blouse, displayed together with a richly patterned border." },
  { colorName: "Multicolour", study: "saffron", description: "A bright pink, saffron and blue lehenga set with a matching blouse and a colourful folk-art hem." },
  { colorName: "Black", study: "ink", description: "A black and rust lehenga set with a matching blouse and repeating ornamental bands." },
  { colorName: "Ivory", study: "cream", description: "An ivory floral lehenga set with a matching blouse, shown as a coordinated two-piece outfit." },
  { colorName: "Multicolour", study: "saffron", description: "A multicolour panelled lehenga set with a coordinating blouse and broad patterned border." },
  { colorName: "Pink", study: "magenta", description: "A vivid pink lehenga set with a matching blouse and densely patterned skirt border." },
  { colorName: "Multicolour", study: "saffron", description: "A bright folk-print lehenga set with colourful vertical panels and a coordinated blouse." },
  { colorName: "Navy", study: "royal", description: "A navy lehenga set with contrasting square motifs, colourful trim and a matching blouse." },
  { colorName: "Multicolour", study: "saffron", description: "A multicolour lehenga set with a richly ornamented hem and matching blouse, photographed on its packaging." },
  { colorName: "Black", study: "ink", description: "A black and red lehenga set with a coordinated blouse and detailed ornamental print." },
  { colorName: "Blue", study: "royal", description: "A blue-toned lehenga set with multicolour detailing and a matching blouse, photographed laid out." },
  { colorName: "Maroon", study: "maroon", description: "A maroon and black lehenga set with a matching blouse, shown as a coordinated pair." },
  { colorName: "Ivory", study: "cream", description: "An ivory lehenga set with a dark ornamental border and coordinating blouse." },
];

export const twoPieceProducts: Product[] = twoPieceDescriptions.map((item, index) => {
  const number = index + 1;
  const label = String(number).padStart(2, "0");
  return {
    id: `ng-two-piece-${label}`,
    name: `2-Piece Set ${label}`,
    nameIsPlaceholder: true,
    slug: `2-piece-set-${label}`,
    category: "2-piece",
    categoryLabel: "2-piece set",
    price: 3200 + (index % 5) * 150,
    priceIsEstimate: true,
    images: [`/products/2piece-${number}.png`],
    study: item.study,
    silhouette: "set2",
    description: `${item.description} Estimated price; fabric and sizing details are to be confirmed.`,
    catalogNotes: ["Coordinated two-piece set", "Estimated price", "Specifications to be confirmed"],
    sizes: ["Catalog size unspecified"],
    colorName: item.colorName,
    colorIsEditorial: false,
    tags: number <= 4 ? ["NEW"] : [],
    keywords: ["2-piece", "lehenga", "blouse", item.colorName.toLowerCase()],
    collection: "The Nav Edit",
    moods: ["festive", "wedding-guest"],
    featured: number <= 4,
    pieces: ["blouse", "skirt"],
  };
});
