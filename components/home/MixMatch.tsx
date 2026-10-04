"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductVisual } from "@/components/visual/ProductVisual";
import { getByPiece } from "@/lib/catalog";
import { WaitlistButton } from "@/components/waitlist/WaitlistButton";
import { formatProductPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

const groups = [
  { key: "blouse" as const, label: "Blouse" },
  { key: "skirt" as const, label: "Skirt" },
  { key: "jacket" as const, label: "Jacket" },
];

export function MixMatch() {
  const pool = useMemo(() => ({
    blouse: getByPiece("blouse"),
    skirt: getByPiece("skirt"),
    jacket: getByPiece("jacket"),
  }), []);
  const [index, setIndex] = useState({ blouse: 0, skirt: 0, jacket: 0 });
  const chosen = {
    blouse: pool.blouse[index.blouse],
    skirt: pool.skirt[index.skirt],
    jacket: pool.jacket[index.jacket],
  };
  const total = chosen.blouse.price + chosen.skirt.price + chosen.jacket.price;

  function step(key: keyof typeof index, direction: 1 | -1) {
    const list = pool[key];
    setIndex((current) => ({
      ...current,
      [key]: (current[key] + direction + list.length) % list.length,
    }));
  }

  function shuffle() {
    setIndex({
      blouse: Math.floor(Math.random() * pool.blouse.length),
      skirt: Math.floor(Math.random() * pool.skirt.length),
      jacket: Math.floor(Math.random() * pool.jacket.length),
    });
  }

  return (
    <section className="bg-paper py-12 md:py-16">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <p className="eyebrow text-bronze">Style it your way</p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <h2 className="max-w-3xl font-serif text-5xl leading-[0.9] md:text-7xl">Choose the blouse, the skirt, the jacket.</h2>
          <button className="btn" onClick={shuffle}>Another combination</button>
        </div>
        <div className="mt-12 grid items-center gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
          {groups.map((group, groupIndex) => (
            <div key={group.key} className="contents">
              <PiecePicker
                label={group.label}
                product={chosen[group.key]}
                onPrev={() => step(group.key, -1)}
                onNext={() => step(group.key, 1)}
              />
              {groupIndex < groups.length - 1 ? (
                <span className="hidden text-center font-serif text-4xl text-bronze lg:block">+</span>
              ) : null}
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-6 border-t border-ink/10 pt-6 md:flex-row md:items-center">
          <div>
            <p className="eyebrow">Look total</p>
            <p className="mt-2 font-serif text-5xl">{formatProductPrice(total, false, Object.values(chosen).some((product) => product.priceIsEstimate))}</p>
            <p className="mt-2 max-w-md text-sm text-stone">Three separate catalog pieces. Sets are listed on their own and are not broken into these parts.</p>
          </div>
          <WaitlistButton
            label="Pre-Order Now"
            productName={`${chosen.blouse.name}, ${chosen.skirt.name}, ${chosen.jacket.name}`}
          />
        </div>
      </div>
    </section>
  );
}

function PiecePicker({
  label,
  product,
  onPrev,
  onNext,
}: {
  label: string;
  product: Product;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="bg-ivory">
      <div className="overflow-hidden">
        <ProductVisual product={product} className="aspect-[3/4] w-full object-cover" />
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-4">
        <button aria-label={`Previous ${label}`} onClick={onPrev} className="grid h-9 w-9 place-items-center border border-ink/15"><ChevronLeft size={16} /></button>
        <div className="text-center">
          <p className="eyebrow text-[0.58rem] text-bronze">{label}</p>
          <p className="font-serif text-2xl leading-none">{product.name}</p>
          <p className="mt-1 text-sm">{formatProductPrice(product.price, product.priceOnRequest, product.priceIsEstimate)}</p>
        </div>
        <button aria-label={`Next ${label}`} onClick={onNext} className="grid h-9 w-9 place-items-center border border-ink/15"><ChevronRight size={16} /></button>
      </div>
    </div>
  );
}
