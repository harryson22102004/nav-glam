import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MixMatch } from "@/components/home/MixMatch";
import { WhyNav } from "@/components/home/WhyNav";
import { ProductCard } from "@/components/product/ProductCard";
import { WaitlistButton } from "@/components/waitlist/WaitlistButton";
import { getFeatured, products } from "@/lib/catalog";
import { collections, homeMoods } from "@/lib/collections";
import { journal } from "@/lib/journal";

const heroShots = [
  { src: "/products/lehenga-01.png", alt: "Red lehenga styled on a model" },
  { src: "/products/lehenga-05.png", alt: "Lime lehenga styled on a model" },
  { src: "/products/lehenga-08.png", alt: "Navy lehenga styled on a model" },
  { src: "/products/lehenga-18.png", alt: "Multicolour lehenga styled on a model" },
];

const edits = [
  { href: "/shop/lehengas", title: "The lehenga edit", kicker: "Worn, then seen", image: "/products/lehenga-02.png" },
  { href: "/shop/blouses", title: "Blouse stories", kicker: "Print and mirrorwork", image: "/products/blouse-06.png" },
  { href: "/shop/jackets", title: "The jacket edit", kicker: "Sleeveless layers", image: "/products/jacket-01.png" },
  { href: "/shop/skirts", title: "Skirt culture", kicker: "Volume", image: "/products/lehenga-33.png" },
];

const moodShots: Record<string, string> = {
  mehfil: "/products/lehenga-02.png",
  rang: "/products/lehenga-18.png",
  midnight: "/products/blouse-03.png",
  festive: "/products/lehenga-12.png",
  "after-dark": "/products/lehenga-34.png",
  "everyday-glam": "/products/blouse-01.png",
};

export function HomePage() {
  const featured = getFeatured();
  const rail = [...products, ...products];

  return (
    <>
      <section className="bg-ink text-ivory">
        <div className="grid min-h-[100svh] lg:grid-cols-2">
          <div className="relative z-10 order-2 flex flex-col justify-end px-5 pb-8 pt-10 md:px-10 lg:order-1 lg:justify-center lg:pb-16 lg:pt-28">
            <p className="eyebrow text-gold">UH presents</p>
            <h1 className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="font-deva text-6xl md:text-8xl">नव</span>
              <span className="font-serif text-6xl tracking-[0.12em] md:text-8xl">GLAM</span>
            </h1>
            <p className="mt-5 max-w-md font-serif text-3xl leading-tight md:text-4xl">Heritage, reimagined.</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory/75">
              Lehengas, free-size blouses, a koti and skirts — the cloth in the photographs, cut for a wardrobe that also owns denim and a night out.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <WaitlistButton label="Pre-Order Now" className="btn" />
              <Link href="/shop" className="btn border-ivory/40">Shop the edit</Link>
            </div>
          </div>
          <div className="order-1 grid min-h-[52svh] grid-cols-2 grid-rows-2 lg:order-2 lg:min-h-[100svh]">
            {heroShots.map((shot, index) => (
              <div key={shot.src} className="relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={shot.src}
                  alt={shot.alt}
                  className="kenburns h-full w-full object-cover"
                  style={{ animationDelay: `${index * -4}s` }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <WhyNav />

      <section className="overflow-hidden bg-ink" aria-label="The collection, in motion">
        <div className="marquee-track">
          {rail.map((product, index) => (
            <Link
              key={`${product.slug}-${index}`}
              href={`/product/${product.slug}`}
              className="group relative block h-40 w-28 shrink-0 overflow-hidden sm:h-52 sm:w-36 md:h-64 md:w-44"
              aria-label={product.name}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.images[0]} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-ivory">
        <div className="grid md:grid-cols-2">
          {edits.map((edit) => (
            <Link key={edit.href} href={edit.href} className="group relative block min-h-[68vw] overflow-hidden bg-ink md:min-h-[28rem]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={edit.image} alt="" className="study-zoom absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-ivory md:p-8">
                <p className="eyebrow text-gold">{edit.kicker}</p>
                <div className="mt-2 flex items-end justify-between gap-4">
                  <h2 className="font-serif text-4xl md:text-6xl">{edit.title}</h2>
                  <ArrowUpRight className="mb-2 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
                <span className="card-line mt-4 block h-px w-24 bg-gold" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-ivory px-5 py-12 md:px-10 md:py-16">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="display max-w-3xl text-[clamp(2.8rem,7vw,5.6rem)]">
            Tradition
            <span className="mt-1 block">with an attitude.</span>
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-stone md:pb-2">
            A modern Indian wardrobe for the hours between a wedding and a weeknight. The silhouette is heritage. The wearing of it is yours.
          </p>
        </div>
      </section>

      <section className="bg-paper px-5 pb-14 md:px-10 md:pb-16">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-bronze">The cloth</p>
              <h2 className="mt-2 font-serif text-4xl md:text-6xl">From the edit</h2>
            </div>
            <Link href="/shop" className="eyebrow hover:text-bronze">Shop all</Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 lg:grid-cols-4">
            {featured.map((product) => <ProductCard key={product.slug} product={product} />)}
          </div>
        </div>
      </section>

      <section className="bg-ink text-ivory">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3">
          {homeMoods.map((slug) => {
            const mood = collections.find((item) => item.slug === slug);
            if (!mood) return null;
            return (
              <Link key={slug} href={`/collections/${slug}`} className="group relative flex min-h-64 items-end overflow-hidden p-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={moodShots[slug]} alt="" className="study-zoom absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-ink/10" />
                <div className="relative">
                  <p className="eyebrow text-gold">Shop by mood</p>
                  <h3 className="mt-2 font-serif text-5xl">{mood.title}</h3>
                  <span className="card-line mt-4 block h-px w-16 bg-gold" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-ivory px-5 py-12 md:px-10 md:py-16">
        <div className="mx-auto max-w-[1500px]">
          <p className="eyebrow text-bronze">The Nav Glam journal</p>
          <h2 className="mt-2 font-serif text-4xl md:text-6xl">Read the wardrobe.</h2>
          <div className="mt-8 grid gap-px bg-ink/10 md:grid-cols-2">
            {journal.map((entry) => (
              <Link key={entry.slug} href={entry.href} className="group bg-ivory p-6 md:p-8">
                <p className="eyebrow text-bronze">{entry.kicker}</p>
                <h3 className="mt-3 font-serif text-4xl leading-none group-hover:text-bronze md:text-5xl">{entry.title}</h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-stone">{entry.excerpt}</p>
                <span className="card-line mt-5 block h-px w-16 bg-gold" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <MixMatch />

      <section className="grid bg-ink text-ivory lg:grid-cols-2">
        <div className="relative min-h-[70vw] overflow-hidden lg:min-h-[36rem]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/products/lehenga-02.png" alt="Navy lehenga styled on a model" className="kenburns absolute inset-0 h-full w-full object-cover" />
        </div>
        <div className="flex flex-col justify-center px-5 py-14 md:px-12">
          <h2 className="display text-[clamp(3.4rem,8vw,6.4rem)]">
            Not old.
            <span className="block">Not new.</span>
            <span className="block text-gold">Nav.</span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-ivory/80">
            Indian silhouettes. A contemporary hand. Clothes for self-expression, not for a single kind of occasion or a single kind of woman.
          </p>
          <Link href="/story" className="btn mt-8 w-fit">Read the point of view</Link>
        </div>
      </section>
    </>
  );
}
