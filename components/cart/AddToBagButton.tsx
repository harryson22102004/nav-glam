"use client";

import { ShoppingBag } from "lucide-react";
import { useStore } from "@/lib/store";

export function AddToBagButton({
  slug,
  label = "Add to bag",
  className,
}: {
  slug: string;
  label?: string;
  className?: string;
}) {
  const { add } = useStore();
  return (
    <button type="button" className={className ?? "btn btn-solid"} onClick={() => add(slug)}>
      <ShoppingBag size={14} strokeWidth={1.6} />
      {label}
    </button>
  );
}
