"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, X } from "lucide-react";
import { AddToBagButton } from "@/components/cart/AddToBagButton";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductReviews } from "@/components/reviews/ProductReviews";
import { OverlayDialog } from "@/components/ui/OverlayDialog";
import { WaitlistButton } from "@/components/waitlist/WaitlistButton";
import { formatProductPrice } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { Product } from "@/lib/types";

export function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const { toggleWish, wished } = useStore();
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [open, setOpen] = useState<"story" | "details" | "shipping" | "returns">("story");
  const photos = product.images;
  const photo = photos[active] ?? photos[0];

  return (
    <div className="bg-ivory pt-24">
      <div className="mx-auto grid max-w-[1500px] gap-8 px-5 py-6 md:px-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <button className="relative block w-full overflow-hidden bg-mist" onClick={() => setZoom(true)} aria-label={`Open a larger photograph of ${product.name}`}>
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt={product.name} className="aspect-[3/4] w-full object-cover" />
            ) : null}
          </button>
          {photos.length > 1 ? (
            <div className="mt-3 flex gap-2">
              {photos.map((src, index) => (
                <button
                  key={src}
                  onClick={() => setActive(index)}
                  aria-pressed={active === index}
                  className={`h-20 w-16 overflow-hidden border ${active === index ? "border-ink" : "border-transparent"}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div className="lg:pt-6">
          <p className="text-xs uppercase tracking-[0.18em] text-stone">
            <Link href="/shop">Shop</Link> / {product.categoryLabel}
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-none md:text-7xl">{product.name}</h1>
          <p className="mt-3 text-sm text-stone">{product.categoryLabel} · {product.colorName}</p>
          <p className="mt-6 text-2xl">{formatProductPrice(product.price, product.priceOnRequest, product.priceIsEstimate)}</p>
          <p className="mt-6 max-w-md text-sm leading-relaxed">{product.description}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {product.catalogNotes.map((note) => (
              <li key={note} className="border border-ink/15 px-2 py-1 text-[0.68rem] tracking-[0.14em] uppercase">{note}</li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <AddToBagButton slug={product.slug} />
            <WaitlistButton label="Join the Waitlist" productName={product.name} />
            <button className="btn" aria-pressed={wished(product.slug)} onClick={() => toggleWish(product.slug)}>
              <Heart size={14} fill={wished(product.slug) ? "currentColor" : "none"} />
              Wishlist
            </button>
          </div>
          <p className="mt-4 text-xs text-stone">
            {product.priceOnRequest || product.priceIsEstimate
              ? `Photographed in ${product.colorName}. Sizing and availability will be confirmed before ordering.`
              : `Photographed in ${product.colorName}. Size is confirmed when you join the waitlist.`}
          </p>
          <div className="mt-10 border-t border-ink/10">
            <Accordion id="story" title="The story" open={open} setOpen={setOpen}>
              <p>{product.description}</p>
            </Accordion>
            <Accordion id="details" title="Details" open={open} setOpen={setOpen}>
              <ul className="space-y-1">
                {product.catalogNotes.map((note) => <li key={note}>{note}</li>)}
                <li>Collection edit: {product.collection}</li>
                <li>{formatProductPrice(product.price, product.priceOnRequest, product.priceIsEstimate)}</li>
              </ul>
            </Accordion>
            <Accordion id="shipping" title="Shipping" open={open} setOpen={setOpen}>
              <p>The first batch ships to waitlist addresses. You will get the dispatch note before anything leaves the studio.</p>
            </Accordion>
            <Accordion id="returns" title="Returns" open={open} setOpen={setOpen}>
              <p>Return terms travel with the pre-order confirmation, before a piece is cut for you.</p>
            </Accordion>
          </div>
        </div>
      </div>
      <ProductReviews productSlug={product.slug} />
      <section className="mx-auto max-w-[1500px] px-5 py-16 md:px-10">
        <h2 className="font-serif text-4xl md:text-5xl">Style with it</h2>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {related.map((item) => <ProductCard key={item.slug} product={item} />)}
        </div>
      </section>
      <OverlayDialog open={zoom} onOpenChange={setZoom} title={product.name} className="inset-4 bg-ink">
        <button aria-label="Close photograph" className="absolute right-4 top-4 z-10 bg-ivory p-2" onClick={() => setZoom(false)}><X size={16} /></button>
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt={product.name} className="h-full w-full object-contain" />
        ) : null}
      </OverlayDialog>
    </div>
  );
}

function Accordion({
  id,
  title,
  open,
  setOpen,
  children,
}: {
  id: "story" | "details" | "shipping" | "returns";
  title: string;
  open: string;
  setOpen: (id: "story" | "details" | "shipping" | "returns") => void;
  children: React.ReactNode;
}) {
  const expanded = open === id;
  return (
    <div className="border-b border-ink/10">
      <button className="flex w-full items-center justify-between py-4 text-left" aria-expanded={expanded} onClick={() => setOpen(id)}>
        <span className="eyebrow">{title}</span>
        <span>{expanded ? "–" : "+"}</span>
      </button>
      {expanded ? <div className="pb-4 text-sm leading-relaxed text-stone">{children}</div> : null}
    </div>
  );
}
