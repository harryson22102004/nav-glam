"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { OverlayDialog } from "@/components/ui/OverlayDialog";
import { searchProducts } from "@/lib/catalog";
import { formatProductPrice } from "@/lib/format";
import { useStore } from "@/lib/store";

export function SearchDialog() {
  const { searchOpen, setSearchOpen } = useStore();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [tracked, setTracked] = useState("");
  const token = `${query}:${searchOpen}`;
  if (token !== tracked) {
    setTracked(token);
    setActive(0);
  }
  const results = useMemo(() => searchProducts(query).slice(0, 8), [query]);

  return (
    <OverlayDialog
      open={searchOpen}
      onOpenChange={setSearchOpen}
      title="Search the edit"
      description="Search names, categories, colors and moods"
      className="left-1/2 top-[10vh] w-[min(720px,calc(100%-1.5rem))] -translate-x-1/2"
    >
      <div className="flex items-center gap-3 border-b border-ink/10 px-5">
        <label className="sr-only" htmlFor="site-search">Search</label>
        <input
          id="site-search"
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setActive((value) => Math.min(value + 1, Math.max(results.length - 1, 0)));
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              setActive((value) => Math.max(value - 1, 0));
            }
            if (event.key === "Enter" && results[active]) {
              setSearchOpen(false);
              router.push(`/product/${results[active].slug}`);
            }
          }}
          placeholder="Search sets, blouses, color, mood"
          className="h-16 flex-1 bg-transparent font-serif text-2xl outline-none placeholder:text-ink/30"
        />
        <button aria-label="Close search" onClick={() => setSearchOpen(false)} className="p-2"><X size={18} strokeWidth={1.4} /></button>
      </div>
      <div className="max-h-[50vh] overflow-y-auto px-2 py-2">
        {query.trim() === "" ? (
          <div className="px-3 py-6 text-sm text-stone">
            Try “3-piece”, “free size”, “jacket”, “rani”, “mehfil”.
          </div>
        ) : results.length === 0 ? (
          <div className="px-3 py-6">
            <p className="font-serif text-2xl">Nothing under that name.</p>
            <Link href={`/search?q=${encodeURIComponent(query)}`} onClick={() => setSearchOpen(false)} className="mt-3 inline-block text-sm underline">
              Open full search
            </Link>
          </div>
        ) : (
          <ul>
            {results.map((product, index) => (
              <li key={product.slug}>
                <Link
                  href={`/product/${product.slug}`}
                  onClick={() => setSearchOpen(false)}
                  className={`flex items-baseline justify-between gap-4 px-3 py-3 ${index === active ? "bg-mist" : ""}`}
                >
                  <span>
                    <span className="font-serif text-2xl">{product.name}</span>
                    <span className="ml-3 text-xs uppercase tracking-[0.16em] text-stone">{product.categoryLabel}</span>
                  </span>
                  <span className="text-sm">{formatProductPrice(product.price, product.priceOnRequest, product.priceIsEstimate)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </OverlayDialog>
  );
}
