import type { MetadataRoute } from "next";
import { products } from "@/lib/catalog";
import { collections } from "@/lib/collections";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/shop",
    "/shop/sets",
    "/shop/blouses",
    "/shop/jackets",
    "/shop/skirts",
    "/collections",
    "/lookbook",
    "/about",
    "/story",
    "/contact",
    "/cart",
    "/payment",
    "/wishlist",
    "/search",
    "/shipping",
    "/returns",
    "/size-guide",
    "/care",
    "/faqs",
    "/privacy",
    "/terms",
    "/refund",
  ];
  return [
    ...staticRoutes.map((route) => ({ url: `${siteUrl}${route || "/"}`, changeFrequency: "weekly" as const, priority: route === "" ? 1 : 0.6 })),
    ...products.map((product) => ({ url: `${siteUrl}/product/${product.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...collections.map((collection) => ({ url: `${siteUrl}/collections/${collection.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
