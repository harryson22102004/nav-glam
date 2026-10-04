import type { Metadata } from "next";
import Link from "next/link";
import { collections } from "@/lib/collections";

export const metadata: Metadata = {
  title: "Collections",
  description: "Styled edits from नव GLAM. Moods are merchandising, not extra catalog categories.",
};

export default function CollectionsPage() {
  return (
    <div className="bg-ivory px-5 pb-20 pt-28 md:px-10">
      <div className="mx-auto max-w-[1500px]">
        <p className="eyebrow text-bronze">Collections</p>
        <h1 className="mt-3 max-w-3xl font-serif text-6xl leading-none md:text-8xl">Edits, not departments.</h1>
        <p className="mt-5 max-w-lg text-sm text-stone">Each edit is a way of styling the same catalog. A piece can sit in a mood without leaving its category.</p>
        <div className="mt-10 grid gap-0 md:grid-cols-2">
          {collections.map((collection) => {
            const cover = collection.products().find((product) => product.images[0])?.images[0] ?? "/products/lehenga-18.png";
            return (
            <Link key={collection.slug} href={`/collections/${collection.slug}`} className="group relative min-h-72 overflow-hidden bg-ink text-ivory">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cover} alt="" className="study-zoom absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
              <div className="relative flex h-full min-h-72 flex-col justify-end p-6">
                <p className="eyebrow text-gold">{collection.kicker}</p>
                <h2 className="mt-2 font-serif text-5xl">{collection.title}</h2>
                <span className="card-line mt-4 block h-px w-16 bg-gold" />
              </div>
            </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
