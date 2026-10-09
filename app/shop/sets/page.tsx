import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopExperience } from "@/components/shop/ShopExperience";

export const metadata: Metadata = {
  title: "Sets",
  description: "3-piece lehenga sets and 2-piece coordinated sets from the नव GLAM catalog.",
};

export default function SetsPage() {
  return (
    <Suspense fallback={null}>
      <ShopExperience title="Sets" intro="Browse the 3-piece modelled lehenga sets and 2-piece sets, each in its own shop filter." categories={["3-piece", "2-piece"]} />
    </Suspense>
  );
}
