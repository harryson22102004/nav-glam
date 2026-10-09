import type { Product } from "./types";
import type { StudyKey } from "./studies";

type LehengaDescription = {
  colorName: string;
  study: StudyKey;
  description: string;
  view: "On-model view" | "Product view";
};

const lehengaDescriptions: LehengaDescription[] = [
  { colorName: "Red", study: "rani", description: "A red lehenga with multicolour panels and a densely patterned hem.", view: "On-model view" },
  { colorName: "Navy", study: "royal", description: "A navy lehenga with large circular folk motifs and a contrasting border.", view: "On-model view" },
  { colorName: "Dusty rose", study: "magenta", description: "A dusty-rose lehenga with dark floral and ornamental panels.", view: "On-model view" },
  { colorName: "Fuchsia", study: "magenta", description: "A fuchsia lehenga with bold white geometric bands and a pointed panel border.", view: "On-model view" },
  { colorName: "Lime", study: "emerald", description: "A lime-green lehenga with illustrated figures and a blue-green border.", view: "On-model view" },
  { colorName: "Ivory", study: "ivory", description: "An ivory lehenga with colourful illustrated panels around the flare.", view: "On-model view" },
  { colorName: "Ivory", study: "cream", description: "An ivory lehenga with figure-print panels and a richly patterned hem.", view: "On-model view" },
  { colorName: "Navy", study: "royal", description: "A navy lehenga with blue ornamental border work, shown with a coordinating drape.", view: "On-model view" },
  { colorName: "Blue", study: "royal", description: "A deep-blue lehenga with dense floral motifs and a detailed lower border.", view: "On-model view" },
  { colorName: "White", study: "ivory", description: "A white lehenga with black geometric panels and a sharp, contrasting hem.", view: "On-model view" },
  { colorName: "White", study: "ivory", description: "A white lehenga with black and red illustrated panels around the skirt.", view: "On-model view" },
  { colorName: "Black", study: "ink", description: "A black-and-white lehenga with bold illustrated panels and a red accent.", view: "On-model view" },
  { colorName: "Black", study: "ink", description: "A black lehenga with graphic white panels and a high-contrast border.", view: "On-model view" },
  { colorName: "Black", study: "ink", description: "A dark lehenga with white and red folk-inspired print panels.", view: "On-model view" },
  { colorName: "Black", study: "ink", description: "A black lehenga with golden-yellow motifs and an ornate border.", view: "On-model view" },
  { colorName: "Charcoal", study: "midnight", description: "A charcoal lehenga with fine linear patterning and a broad, detailed border.", view: "On-model view" },
  { colorName: "Ivory", study: "cream", description: "An ivory lehenga with colourful folk-print bands and a contrasting hem.", view: "On-model view" },
  { colorName: "Multicolour", study: "saffron", description: "A multicolour lehenga built from vivid vertical panels and patterned borders.", view: "On-model view" },
  { colorName: "Black", study: "ink", description: "A black lehenga shown with a matching embroidered blouse piece.", view: "Product view" },
  { colorName: "Pink", study: "magenta", description: "A bright-pink lehenga skirt with a richly decorated matching blouse piece.", view: "Product view" },
  { colorName: "Blue", study: "royal", description: "A blue lehenga skirt with a yellow contrasting border and blouse piece.", view: "Product view" },
  { colorName: "Red", study: "maroon", description: "A red lehenga with a dark patterned border, shown on a model.", view: "On-model view" },
  { colorName: "Black", study: "ink", description: "A dark lehenga skirt with red and ivory patterned panels.", view: "Product view" },
  { colorName: "Ivory", study: "cream", description: "An ivory-and-dark lehenga skirt with an all-over ornamental pattern.", view: "Product view" },
  { colorName: "Multicolour", study: "saffron", description: "A yellow and pink lehenga skirt with bright contrasting panels.", view: "Product view" },
  { colorName: "Multicolour", study: "ink", description: "A dark-ground lehenga skirt with colourful patterned panels.", view: "Product view" },
  { colorName: "Pink", study: "magenta", description: "A pink lehenga skirt with dense multicolour ornamental detailing.", view: "Product view" },
  { colorName: "Multicolour", study: "saffron", description: "A multicolour lehenga skirt with bright bands and an ornate flare.", view: "Product view" },
  { colorName: "Navy", study: "royal", description: "A navy lehenga skirt with a colourful patterned hem and matching blouse piece.", view: "Product view" },
  { colorName: "Red", study: "maroon", description: "A red lehenga skirt with dark ornamental panels and a matching blouse piece.", view: "Product view" },
  { colorName: "Multicolour", study: "saffron", description: "A multicolour lehenga skirt arranged in clean vertical colour panels.", view: "Product view" },
  { colorName: "Navy", study: "royal", description: "A navy lehenga skirt with fine gold-coloured linear detailing.", view: "Product view" },
  { colorName: "Ivory", study: "cream", description: "An ivory lehenga skirt with a wide red patterned border.", view: "Product view" },
  { colorName: "Black", study: "ink", description: "A black lehenga skirt with a multicolour patterned edge.", view: "Product view" },
  { colorName: "Black", study: "ink", description: "A black lehenga skirt with a rose-pink and ivory border.", view: "Product view" },
  { colorName: "Navy", study: "midnight", description: "A dark-blue lehenga skirt with a colourful, densely patterned border.", view: "Product view" },
  { colorName: "Brown", study: "maroon", description: "A deep-brown lehenga skirt with red and cream ornamental panels.", view: "Product view" },
  { colorName: "Ivory", study: "cream", description: "An ivory lehenga skirt with a colourful illustrated border.", view: "Product view" },
  { colorName: "Red", study: "maroon", description: "A red lehenga skirt with a dark, densely patterned border.", view: "Product view" },
];

const threePieceImageNumbers = [
  ...Array.from({ length: 18 }, (_, index) => index + 1),
  20,
  21,
  22,
];

export const threePieceProducts: Product[] = threePieceImageNumbers.map((imageNumber, index) => {
  const item = lehengaDescriptions[imageNumber - 1];
  const number = String(index + 1).padStart(2, "0");
  const price = item.view === "On-model view"
    ? 3400 + (index % 6) * 150
    : 2600 + (index % 5) * 150;
  return {
    id: `ng-three-piece-${number}`,
    name: `3-Piece Set ${number}`,
    nameIsPlaceholder: true,
    slug: `3-piece-set-${number}`,
    category: "3-piece",
    categoryLabel: "3-piece set",
    price,
    priceIsEstimate: true,
    images: [`/products/lehenga-${String(imageNumber).padStart(2, "0")}.png`],
    study: item.study,
    silhouette: "skirt",
    description: `${item.description} Fabric, included pieces and sizing are to be confirmed.`,
    catalogNotes: [item.view, "Specifications to be confirmed", "Estimated price"],
    sizes: ["Catalog size unspecified"],
    colorName: item.colorName,
    colorIsEditorial: false,
    tags: [],
    keywords: ["3-piece", "lehenga", "choli", "dupatta", item.colorName.toLowerCase()],
    collection: "Lehenga Edit",
    moods: ["festive"],
    featured: false,
    pieces: ["skirt"],
  };
});
