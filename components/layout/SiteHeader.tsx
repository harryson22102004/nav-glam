"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { collections, navMoods } from "@/lib/collections";
import { cn } from "@/lib/format";
import { useStore } from "@/lib/store";

function subscribeScroll(onStoreChange: () => void) {
  window.addEventListener("scroll", onStoreChange, { passive: true });
  return () => window.removeEventListener("scroll", onStoreChange);
}

function getScrolled() {
  return window.scrollY > 8;
}

const shopLinks = [
  { href: "/shop/lehengas", label: "Lehengas" },
  { href: "/shop?sort=new", label: "New arrivals" },
  { href: "/shop/sets?piece=3", label: "3-piece sets" },
  { href: "/shop/sets?piece=2", label: "2-piece sets" },
  { href: "/shop/blouses", label: "Blouses" },
  { href: "/shop/jackets", label: "Jackets" },
  { href: "/shop/skirts", label: "Skirts" },
  { href: "/lookbook", label: "Edited looks" },
];

export function SiteHeader({ logoSrc }: { logoSrc: string | null }) {
  const pathname = usePathname();
  const { count, ready, setCartOpen, setSearchOpen, wishlist } = useStore();
  const scrolled = useSyncExternalStore(subscribeScroll, getScrolled, () => false);
  const [menu, setMenu] = useState<null | "shop" | "collections">(null);
  const [mobile, setMobile] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);

  if (pathname !== menuPath) {
    setMenuPath(pathname);
    setMenu(null);
    setMobile(false);
  }

  const tone = "ivory";
  const bar = scrolled
    ? "bg-ink/92 text-ivory shadow-[0_1px_0_rgba(244,239,230,0.08)] backdrop-blur-md"
    : "bg-ink/80 text-ivory backdrop-blur-md";

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-[background,height,box-shadow] duration-300", bar)}>
      <div className={cn("mx-auto flex max-w-[1500px] items-center px-4 md:px-8", scrolled ? "h-14" : "h-[4.5rem]")}>
        <nav className="hidden flex-1 items-center gap-7 lg:flex" aria-label="Primary">
          <MenuButton label="Shop" open={menu === "shop"} onOpen={() => setMenu("shop")} onClose={() => setMenu(null)} />
          <MenuButton label="Collections" open={menu === "collections"} onOpen={() => setMenu("collections")} onClose={() => setMenu(null)} />
          <Link href="/lookbook" className="eyebrow text-[0.62rem] opacity-90 hover:text-gold">Lookbook</Link>
        </nav>

        <div className="flex flex-1 lg:flex-none lg:justify-center">
          <Logo src={logoSrc} tone={tone} compact={scrolled} priority />
        </div>

        <div className="flex flex-1 items-center justify-end gap-1 md:gap-2">
          <IconButton label="Search" onClick={() => setSearchOpen(true)}>
            <Search size={18} strokeWidth={1.4} />
          </IconButton>
          <Link href="/wishlist" className="relative hidden p-2 sm:inline-flex" aria-label="Wishlist">
            <Heart size={18} strokeWidth={1.4} />
            {ready && wishlist.length > 0 ? <Count n={wishlist.length} /> : null}
          </Link>
          <Link href="/account" className="hidden p-2 md:inline-flex" aria-label="Account">
            <User size={18} strokeWidth={1.4} />
          </Link>
          <IconButton label="Bag" onClick={() => setCartOpen(true)}>
            <ShoppingBag size={18} strokeWidth={1.4} />
            {ready && count > 0 ? <Count n={count} /> : null}
          </IconButton>
          <button className="p-2 lg:hidden" aria-label={mobile ? "Close menu" : "Open menu"} onClick={() => setMobile((value) => !value)}>
            {mobile ? <X size={18} strokeWidth={1.4} /> : <Menu size={18} strokeWidth={1.4} />}
          </button>
        </div>
      </div>

      {menu ? (
        <div className="hidden border-t border-white/10 bg-ink/95 text-ivory backdrop-blur-md lg:block" onMouseLeave={() => setMenu(null)}>
          <div className="mx-auto grid max-w-[1500px] gap-10 px-8 py-10 md:grid-cols-12">
            {menu === "shop" ? (
              <>
                <div className="md:col-span-4">
                  <p className="eyebrow text-gold">Shop</p>
                  <ul className="mt-5 space-y-3">
                    {shopLinks.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="font-serif text-3xl hover:text-gold">{link.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="md:col-span-4">
                  <p className="eyebrow text-gold">Shop by mood</p>
                  <p className="mt-3 max-w-xs text-sm text-ivory/70">Styled edits. Not separate catalog categories.</p>
                  <ul className="mt-5 grid grid-cols-2 gap-y-3">
                    {navMoods.map((slug) => {
                      const item = collections.find((collection) => collection.slug === slug);
                      if (!item) return null;
                      return (
                        <li key={slug}>
                          <Link href={`/collections/${slug}`} className="text-sm tracking-wide hover:text-gold">{item.title}</Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <Link href="/collections/the-nav-edit" className="group relative block min-h-56 overflow-hidden bg-[#3C0E1C] md:col-span-4">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#A84562,transparent_55%)]" />
                  <div className="relative flex h-full flex-col justify-end p-6">
                    <p className="eyebrow text-gold">Now</p>
                    <p className="mt-2 font-serif text-4xl">The Nav Edit</p>
                  </div>
                </Link>
              </>
            ) : (
              <div className="md:col-span-12">
                <p className="eyebrow text-gold">Collections</p>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {collections.slice(0, 8).map((collection) => (
                    <li key={collection.slug}>
                      <Link href={`/collections/${collection.slug}`} className="block border-t border-white/15 py-3 hover:text-gold">
                        <span className="eyebrow text-[0.58rem] text-ivory/60">{collection.kicker}</span>
                        <span className="mt-1 block font-serif text-3xl">{collection.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {mobile ? (
        <div className="max-h-[calc(100svh-4.5rem)] overflow-y-auto border-t border-white/10 bg-ink px-5 py-6 text-ivory lg:hidden">
          <p className="eyebrow text-gold">Shop</p>
          <ul className="mt-4 space-y-3">
            {shopLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="font-serif text-3xl">{link.label}</Link>
              </li>
            ))}
          </ul>
          <p className="eyebrow mt-8 text-gold">Mood</p>
          <ul className="mt-4 grid grid-cols-2 gap-3">
            {navMoods.map((slug) => {
              const item = collections.find((collection) => collection.slug === slug);
              if (!item) return null;
              return (
                <li key={slug}>
                  <Link href={`/collections/${slug}`}>{item.title}</Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5">
            <Link href="/collections">Collections</Link>
            <Link href="/lookbook">Lookbook</Link>
            <Link href="/story">Story</Link>
            <Link href="/wishlist">Wishlist</Link>
            <Link href="/account">Account</Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function MenuButton({
  label,
  open,
  onOpen,
  onClose,
}: {
  label: string;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  return (
    <button
      className="eyebrow text-[0.62rem] opacity-90 hover:text-gold"
      aria-expanded={open}
      onMouseEnter={onOpen}
      onFocus={onOpen}
      onClick={() => (open ? onClose() : onOpen())}
    >
      {label}
    </button>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button className="relative p-2" aria-label={label} onClick={onClick}>
      {children}
    </button>
  );
}

function Count({ n }: { n: number }) {
  return (
    <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center bg-gold px-1 text-[0.6rem] text-ink">
      {n}
    </span>
  );
}
