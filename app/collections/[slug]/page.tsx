import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProductCard } from "@/components/product/ProductCard";
import { collections, getCollection } from "@/lib/collections";

export function generateStaticParams() {
  return collections.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return { title: "Collection" };
  return { title: collection.title, description: collection.copy };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();
  const items = collection.products();
  const cover = items.find((product) => product.images[0])?.images[0] ?? "/products/lehenga-18.png";
  return (
    <div className="bg-ivory">
      <section className="relative min-h-[70svh] bg-ink text-ivory">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cover} alt="" className="kenburns absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/20" />
        <div className="relative mx-auto flex min-h-[70svh] max-w-[1500px] flex-col justify-end px-5 pb-12 pt-32 md:px-10">
          <p className="eyebrow text-gold">{collection.kicker}</p>
          <h1 className="mt-3 font-serif text-6xl md:text-8xl">{collection.title}</h1>
          <p className="mt-4 max-w-xl font-serif text-2xl md:text-3xl">{collection.headline}</p>
        </div>
      </section>
      <div className="mx-auto max-w-[1500px] px-5 py-12 md:px-10">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/collections", label: "Collections" }, { label: collection.title }]} />
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-stone">{collection.copy}</p>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {items.map((product) => <ProductCard key={product.slug} product={product} />)}
        </div>
        {items.length === 0 ? <p className="mt-8 font-serif text-3xl">This edit is empty in the current catalog.</p> : null}
        <div className="mt-16 grid gap-8 border-t border-ink/10 pt-10 md:grid-cols-2">
          <div>
            <p className="eyebrow text-bronze">Lookbook</p>
            <h2 className="mt-3 font-serif text-4xl">See the attitude, then the pieces.</h2>
            <Link href="/lookbook" className="btn mt-6">Open the lookbook</Link>
          </div>
          <div>
            <p className="eyebrow text-bronze">Story</p>
            <p className="mt-3 text-sm leading-relaxed text-stone">India has never stood still. Neither should the way these clothes are worn. The edit is a suggestion. The catalog note on each piece is the fact.</p>
            <Link href="/story" className="mt-4 inline-block text-sm underline">Read the point of view</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
