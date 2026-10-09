import type { Metadata } from "next";
import { PaymentShowcase } from "@/components/cart/PaymentShowcase";

export const metadata: Metadata = {
  title: "UPI Payment",
  description: "Manual UPI QR payment showcase.",
};

export default function PaymentPage() {
  return <PaymentShowcase />;
}
