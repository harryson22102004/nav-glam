"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { OverlayDialog } from "@/components/ui/OverlayDialog";
import { ProductVisual } from "@/components/visual/ProductVisual";
import { getProduct } from "@/lib/catalog";
import { WaitlistButton } from "@/components/waitlist/WaitlistButton";
import { formatProductPrice } from "@/lib/format";
import { useStore } from "@/lib/store";

export function QuickView() {
  const { quickView, setQuickView, toggleWish, wished } = useStore();
  const product = quickView ? getProduct(quickView) : undefined;
  return (
    <OverlayDialog
      open={Boolean(product)}
      onOpenChange={(open) => { if (!open) setQuickView(null); }}
      title={product ? product.name : "Quick view"}
      description="Quick view of a catalog piece"
      className="left-1/2 top-1/2 grid max-h-[90vh] w-[min(920px,calc(100%-1.5rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto md:grid-cols-2"
    >
      {product ? (
        <>
          <ProductVisual product={product} className="h-80 w-full object-cover md:h-full" />
          <div className="relative p-6 md:p-8">
            <button aria-label="Close quick view" className="absolute right-4 top-4 p-2" onClick={() => setQuickView(null)}>
              <X size={18} strokeWidth={1.4} />
            </button>
            <p className="eyebrow text-bronze">{product.categoryLabel}</p>
            <h2 className="mt-3 font-serif text-5xl leading-none">{product.name}</h2>
            <p className="mt-4 text-lg">{formatProductPrice(product.price, product.priceOnRequest, product.priceIsEstimate)}</p>
            <p className="mt-4 text-sm leading-relaxed text-stone">{product.description}</p>
            <ul className="mt-4 space-y-1 text-sm">
              {product.catalogNotes.map((note) => <li key={note}>{note}</li>)}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <WaitlistButton label="Join the Waitlist" productName={product.name} />
              <Link href={`/product/${product.slug}`} onClick={() => setQuickView(null)} className="btn">View details</Link>
              <button className="btn" onClick={() => toggleWish(product.slug)}>{wished(product.slug) ? "Wishlisted" : "Wishlist"}</button>
            </div>
          </div>
        </>
      ) : null}
    </OverlayDialog>
  );
}
