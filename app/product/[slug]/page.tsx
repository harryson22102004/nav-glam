import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/ProductDetail";
import { getProduct, getRelated, products } from "@/lib/catalog";
import { formatProductPrice } from "@/lib/format";
import { siteUrl } from "@/lib/site";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Piece" };
  return {
    title: product.name,
    description: `${product.categoryLabel}. ${product.description}`,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const related = getRelated(product);
  const json = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images[0] ? `${siteUrl}${product.images[0]}` : undefined,
    category: product.categoryLabel,
    sku: product.id,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      ...(product.priceOnRequest || product.priceIsEstimate ? {} : { price: product.price }),
      availability: "https://schema.org/PreOrder",
      url: `${siteUrl}/product/${product.slug}`,
    },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
      {!product.priceOnRequest ? <p className="sr-only">{formatProductPrice(product.price, false, product.priceIsEstimate)}</p> : null}
      <ProductDetail product={product} related={related} />
    </>
  );
}
