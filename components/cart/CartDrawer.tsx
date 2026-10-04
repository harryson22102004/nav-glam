"use client";

import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { OverlayDialog } from "@/components/ui/OverlayDialog";
import { ProductVisual } from "@/components/visual/ProductVisual";
import { WaitlistButton } from "@/components/waitlist/WaitlistButton";
import { formatProductPrice } from "@/lib/format";
import { useStore } from "@/lib/store";

export function CartDrawer() {
  const { cartOpen, setCartOpen, detailed, subtotal, setQty, remove } = useStore();
  return (
    <OverlayDialog
      open={cartOpen}
      onOpenChange={setCartOpen}
      title="Bag"
      description="Pieces currently in your bag"
      className="inset-y-0 right-0 flex h-full w-full max-w-md flex-col"
    >
      <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
        <p className="eyebrow">Your bag</p>
        <button aria-label="Close bag" onClick={() => setCartOpen(false)} className="p-2">
          <X size={18} strokeWidth={1.4} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {detailed.length === 0 ? (
          <div className="flex h-full flex-col justify-center">
            <p className="font-serif text-4xl">The bag is empty.</p>
            <p className="mt-3 text-sm text-stone">Start with the edit, or build a look from a blouse, skirt and jacket.</p>
            <Link href="/shop" onClick={() => setCartOpen(false)} className="btn mt-8 w-fit">Shop the edit</Link>
          </div>
        ) : (
          <ul className="space-y-5">
            {detailed.map((line) => (
              <li key={line.slug} className="grid grid-cols-[88px_1fr] gap-3">
                <Link href={`/product/${line.slug}`} onClick={() => setCartOpen(false)} className="block overflow-hidden bg-mist">
                  <ProductVisual product={line.product} className="h-28 w-full object-cover" />
                </Link>
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link href={`/product/${line.slug}`} onClick={() => setCartOpen(false)} className="font-serif text-xl leading-none">{line.product.name}</Link>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-stone">{line.product.categoryLabel}</p>
                    </div>
                    <button aria-label={`Remove ${line.product.name}`} onClick={() => remove(line.slug)} className="text-stone">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="inline-flex items-center border border-ink/15">
                      <button aria-label="Decrease quantity" className="px-2 py-1" onClick={() => setQty(line.slug, line.qty - 1)}><Minus size={12} /></button>
                      <span className="min-w-6 text-center text-sm">{line.qty}</span>
                      <button aria-label="Increase quantity" className="px-2 py-1" onClick={() => setQty(line.slug, line.qty + 1)}><Plus size={12} /></button>
                    </div>
                    <p className="text-sm">{formatProductPrice(line.product.price * line.qty, line.product.priceOnRequest, line.product.priceIsEstimate)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {detailed.length > 0 ? (
        <div className="border-t border-ink/10 px-5 py-5">
          <div className="flex items-center justify-between">
            <span className="eyebrow">Subtotal</span>
            <span>{formatProductPrice(subtotal, false, detailed.some((line) => line.product.priceIsEstimate))}</span>
          </div>
          <WaitlistButton
            label="Pre-Order Now"
            productName={detailed.map((line) => line.product.name).join(", ")}
            className="btn btn-solid mt-4 w-full"
          />
        </div>
      ) : null}
    </OverlayDialog>
  );
}
