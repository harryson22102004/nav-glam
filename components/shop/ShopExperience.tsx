"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { OverlayDialog } from "@/components/ui/OverlayDialog";
import { products as allProducts } from "@/lib/catalog";
import { studies, type StudyKey } from "@/lib/studies";
import type { Category, Mood, Product } from "@/lib/types";

const sorts = [
  { id: "featured", label: "Featured" },
  { id: "new", label: "New arrivals" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
] as const;

const priceBands = [
  { id: "under-1500", label: "Under ₹1,500", test: (price: number) => price < 1500 },
  { id: "1500-3000", label: "₹1,500 – ₹3,000", test: (price: number) => price >= 1500 && price <= 3000 },
  { id: "3000-4000", label: "₹3,000 – ₹4,000", test: (price: number) => price > 3000 && price <= 4000 },
  { id: "4000-plus", label: "₹4,000 and above", test: (price: number) => price >= 4000 },
];

const occasions = [
  ["festive", "Festive"],
  ["wedding-guest", "Wedding guest"],
  ["party", "Party"],
  ["day-out", "Day out"],
  ["statement", "Statement"],
  ["everyday", "Everyday glam"],
  ["mehfil", "Mehfil"],
  ["after-dark", "After dark"],
] as const;

export function ShopExperience({
  title,
  intro,
  categories,
}: {
  title: string;
  intro: string;
  categories?: Category[];
}) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const piece = params.get("piece");
  const sort = params.get("sort") ?? "featured";
  const prices = params.getAll("price");
  const colors = params.getAll("color");
  const sizes = params.getAll("size");
  const moods = params.getAll("mood");
  const selectedCategories = params.getAll("category");

  const base = useMemo(() => {
    let list = categories ? allProducts.filter((product) => categories.includes(product.category)) : [...allProducts];
    if (piece === "3") list = list.filter((product) => product.category === "3-piece");
    if (piece === "2") list = list.filter((product) => product.category === "2-piece");
    return list;
  }, [categories, piece]);

  const colorOptions = useMemo(() => {
    const names = new Map<string, StudyKey>();
    base.forEach((product) => names.set(product.colorName, product.study));
    return [...names.entries()];
  }, [base]);

  const categoryOptions = useMemo(() => {
    const map = new Map<string, string>();
    base.forEach((product) => map.set(product.category, product.categoryLabel));
    return [...map.entries()];
  }, [base]);

  const filtered = useMemo(() => {
    let list = base.filter((product) => {
      if (selectedCategories.length && !selectedCategories.includes(product.category)) return false;
      if (prices.length && (product.priceOnRequest || !prices.some((band) => priceBands.find((item) => item.id === band)?.test(product.price)))) return false;
      if (colors.length && !colors.includes(product.colorName)) return false;
      if (sizes.length && !sizes.some((size) => product.sizes.includes(size))) return false;
      if (moods.length && !moods.some((mood) => product.moods.includes(mood as Mood))) return false;
      return true;
    });
    list = sortProducts(list, sort);
    return list;
  }, [base, selectedCategories, prices, colors, sizes, moods, sort]);

  function toggle(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    const current = next.getAll(key);
    next.delete(key);
    const updated = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
    updated.forEach((item) => next.append(key, item));
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  function setSort(value: string) {
    const next = new URLSearchParams(params.toString());
    next.set("sort", value);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  function clear() {
    router.replace(pathname, { scroll: false });
  }

  const filterBody = (
    <FilterGroups
      categoryOptions={categoryOptions}
      colorOptions={colorOptions}
      selectedCategories={selectedCategories}
      prices={prices}
      colors={colors}
      sizes={sizes}
      moods={moods}
      onToggle={toggle}
    />
  );

  return (
    <div className="bg-ivory pt-24">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <p className="eyebrow text-bronze">नव GLAM</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-serif text-6xl leading-none md:text-8xl">{title}</h1>
          <p className="max-w-sm text-sm text-stone">{intro}</p>
        </div>
        <div className="mt-8 flex gap-2 overflow-x-auto hide-scroll text-[0.68rem] tracking-[0.18em] uppercase">
          {[
            ["/shop", "All"],
            ["/shop/lehengas", "Lehengas"],
            ["/shop/sets", "Sets"],
            ["/shop/blouses", "Blouses"],
            ["/shop/jackets", "Jackets"],
            ["/shop/skirts", "Skirts"],
          ].map(([href, label]) => (
            <a key={href} href={href} className={`shrink-0 border px-3 py-2 ${pathname === href ? "border-ink bg-ink text-ivory" : "border-ink/15"}`}>{label}</a>
          ))}
        </div>
      </div>

      <div className="sticky top-14 z-30 mt-6 flex items-center justify-between border-y border-ink/10 bg-ivory/95 px-5 py-3 backdrop-blur md:px-10 lg:hidden">
        <button className="inline-flex items-center gap-2 text-xs tracking-[0.18em] uppercase" onClick={() => setFiltersOpen(true)}>
          <SlidersHorizontal size={14} /> Filters
        </button>
        <label className="text-xs tracking-[0.18em] uppercase">
          <span className="sr-only">Sort</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)} className="bg-transparent">
            {sorts.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </label>
      </div>

      <div className="mx-auto grid max-w-[1500px] gap-8 px-5 py-8 md:px-10 lg:grid-cols-[240px_1fr]">
        <aside className="sticky top-24 hidden h-fit lg:block">
          <div className="flex items-center justify-between">
            <p className="eyebrow">Filters</p>
            <button className="text-xs underline" onClick={clear}>Clear</button>
          </div>
          {filterBody}
          <label className="mt-8 block">
            <span className="eyebrow">Sort</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)} className="mt-3 w-full border border-ink/15 bg-transparent px-3 py-2 text-sm">
              {sorts.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </label>
        </aside>
        <div>
          <p className="mb-4 text-xs tracking-[0.16em] uppercase text-stone">{filtered.length} pieces</p>
          {filtered.length === 0 ? (
            <div className="border border-ink/10 px-6 py-16">
              <p className="font-serif text-4xl">No pieces in this cut.</p>
              <button className="btn mt-6" onClick={clear}>Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 xl:grid-cols-3">
              {filtered.map((product) => <ProductCard key={product.slug} product={product} />)}
            </div>
          )}
        </div>
      </div>

      <OverlayDialog open={filtersOpen} onOpenChange={setFiltersOpen} title="Filters" className="inset-x-0 bottom-0 max-h-[86vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <p className="eyebrow">Filters</p>
          <button aria-label="Close filters" onClick={() => setFiltersOpen(false)}><X size={18} /></button>
        </div>
        <div className="px-5 py-4">
          {filterBody}
          <div className="mt-6 flex gap-3">
            <button className="btn flex-1" onClick={clear}>Clear</button>
            <button className="btn btn-solid flex-1" onClick={() => setFiltersOpen(false)}>Show {filtered.length}</button>
          </div>
        </div>
      </OverlayDialog>
    </div>
  );
}

function FilterGroups({
  categoryOptions,
  colorOptions,
  selectedCategories,
  prices,
  colors,
  sizes,
  moods,
  onToggle,
}: {
  categoryOptions: Array<[string, string]>;
  colorOptions: Array<[string, StudyKey]>;
  selectedCategories: string[];
  prices: string[];
  colors: string[];
  sizes: string[];
  moods: string[];
  onToggle: (key: string, value: string) => void;
}) {
  return (
    <div className="mt-6 space-y-7 text-sm">
      <fieldset>
        <legend className="eyebrow">Category</legend>
        <div className="mt-3 space-y-2">
          {categoryOptions.map(([id, label]) => (
            <label key={id} className="flex items-center gap-2">
              <input type="checkbox" checked={selectedCategories.includes(id)} onChange={() => onToggle("category", id)} />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="eyebrow">Price</legend>
        <div className="mt-3 space-y-2">
          {priceBands.map((band) => (
            <label key={band.id} className="flex items-center gap-2">
              <input type="checkbox" checked={prices.includes(band.id)} onChange={() => onToggle("price", band.id)} />
              {band.label}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="eyebrow">Color</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {colorOptions.map(([name, study]) => (
            <button
              key={name}
              aria-pressed={colors.includes(name)}
              onClick={() => onToggle("color", name)}
              className={`h-7 w-7 border ${colors.includes(name) ? "border-ink" : "border-transparent"}`}
              style={{ background: studies[study].ground }}
              title={name}
            >
              <span className="sr-only">{name}</span>
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="eyebrow">Size</legend>
        <div className="mt-3 space-y-2">
          {["Free size", "Catalog size unspecified"].map((size) => (
            <label key={size} className="flex items-center gap-2">
              <input type="checkbox" checked={sizes.includes(size)} onChange={() => onToggle("size", size)} />
              {size}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="eyebrow">Occasion</legend>
        <p className="mt-2 text-xs text-stone">Merchandising moods, not catalog categories.</p>
        <div className="mt-3 space-y-2">
          {occasions.map(([id, label]) => (
            <label key={id} className="flex items-center gap-2">
              <input type="checkbox" checked={moods.includes(id)} onChange={() => onToggle("mood", id)} />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="eyebrow">Availability</legend>
        <p className="mt-3 text-sm">Open for pre-order. The first batch is cut from the waitlist.</p>
      </fieldset>
    </div>
  );
}

function sortProducts(list: Product[], sort: string) {
  const next = [...list];
  if (sort === "price-asc") next.sort((a, b) => Number(Boolean(a.priceOnRequest)) - Number(Boolean(b.priceOnRequest)) || a.price - b.price);
  else if (sort === "price-desc") next.sort((a, b) => Number(Boolean(a.priceOnRequest)) - Number(Boolean(b.priceOnRequest)) || b.price - a.price);
  else if (sort === "new") next.sort((a, b) => Number(b.tags.includes("NEW")) - Number(a.tags.includes("NEW")));
  else next.sort((a, b) => Number(b.featured) - Number(a.featured));
  return next;
}
