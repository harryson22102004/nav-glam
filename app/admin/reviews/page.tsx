import type { Metadata } from "next";
import { ReviewAdminDashboard } from "@/components/reviews/ReviewAdminDashboard";

export const metadata: Metadata = {
  title: "Review approval",
  robots: { index: false, follow: false },
};

export default function ReviewAdminPage() {
  return <ReviewAdminDashboard />;
}