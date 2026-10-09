"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { AddToBagButton } from "@/components/cart/AddToBagButton";
import { formatProductPrice } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const { toggleWish, wished, setQuickView } = useStore();
  const saved = wished(product.slug);
  const photo = product.images[0];
  const hover = product.images[1];

  return (
    <article className="group">
      <div className="relative overflow-hidden bg-mist">
        <Link href={`/product/${product.slug}`} className="block aspect-[3/4]">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt={product.name} className="study-zoom h-full w-full object-cover" />
          ) : null}
          {hover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={hover} alt="" className="absolute inset-0 hidden h-full w-full object-cover group-hover:block" />
          ) : null}
        </Link>
        {product.tags[0] ? (
          <span className="absolute left-3 top-3 bg-ivory/90 px-2 py-1 text-[0.58rem] tracking-[0.18em]">{product.tags[0]}</span>
        ) : null}
        <button
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name}`}
          aria-pressed={saved}
          onClick={() => toggleWish(product.slug)}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center bg-ivory/90"
        >
          <Heart size={16} strokeWidth={1.5} fill={saved ? "currentColor" : "none"} />
        </button>
        <div className="absolute inset-x-0 bottom-0 flex gap-2 p-3 opacity-100 md:translate-y-2 md:opacity-0 md:transition md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
          <AddToBagButton slug={product.slug} className="btn btn-solid min-w-0 flex-1 px-2 text-center leading-tight" />
          <button className="btn bg-ivory/90" onClick={() => setQuickView(product.slug)}>View</button>
        </div>
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-2xl leading-none">
            <Link href={`/product/${product.slug}`}>{product.name}</Link>
          </h3>
          <p className="mt-1 text-[0.68rem] uppercase tracking-[0.16em] text-stone">{product.categoryLabel}</p>
          {product.sizes.includes("Free size") ? <p className="mt-1 text-xs text-stone">Free size</p> : null}
        </div>
        <p className="pt-1 text-sm">{formatProductPrice(product.price, product.priceOnRequest, product.priceIsEstimate)}</p>
      </div>
    </article>
  );
}
