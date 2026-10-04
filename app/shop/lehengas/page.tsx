import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopExperience } from "@/components/shop/ShopExperience";

export const metadata: Metadata = {
  title: "Lehengas",
  description: "Explore the current lehenga edit from नव GLAM.",
};

export default function LehengasPage() {
  return (
    <Suspense fallback={null}>
      <ShopExperience
        title="Lehengas"
        intro="A visual edit of 39 lehenga pieces. Prices shown are estimates; fabric, included pieces and sizing are to be confirmed."
        categories={["lehenga"]}
      />
    </Suspense>
  );
}