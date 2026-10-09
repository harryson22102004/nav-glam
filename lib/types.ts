import type { Silhouette, StudyKey } from "./studies";

/** Merchandising moods. These are styled edits, not catalog categories. */
export type Mood =
  | "wedding-guest"
  | "festive"
  | "party"
  | "day-out"
  | "statement"
  | "everyday"
  | "mehfil"
  | "rang"
  | "midnight"
  | "after-dark";

export type Category =
  | "3-piece"
  | "2-piece"
  | "blouse"
  | "padded-blouse"
  | "jacket"
  | "skirt"
  | "skirt-only"
  | "flare-skirt";

export type Product = {
  id: string;
  name: string;
  nameIsPlaceholder: boolean;
  slug: string;
  category: Category;
  /** Factual label from the supplied catalog structure. */
  categoryLabel: string;
  /** Price taken from the supplied catalog price list. */
  price: number;
  priceOnRequest?: boolean;
  priceIsEstimate?: boolean;
  /**
  * Real photography lives here, e.g. ["/products/lehenga-01.png"].
   * Empty array renders the editorial color study.
   */
  images: string[];
  study: StudyKey;
  silhouette: Silhouette;
  description: string;
  /** Facts taken from the supplied catalog structure. */
  catalogNotes: string[];
  sizes: string[];
  colorName: string;
  /** True only when the swatch is an editorial stand-in rather than the cloth in the photograph. */
  colorIsEditorial: boolean;
  tags: Array<"NEW" | "EDITED">;
  keywords: string[];
  collection: string;
  moods: Mood[];
  featured: boolean;
  pieces: Array<"blouse" | "skirt" | "jacket">;
};
