import { NextResponse } from "next/server";
import { hasSupabaseConfig } from "@/lib/reviews";
import { getReviewAdminClient } from "@/lib/supabase/admin";

const reviewFields = "id, product_slug, reviewer_name, rating, title, body, status, created_at";

export async function GET(request: Request) {
  if (!hasSupabaseConfig()) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  const supabase = await getReviewAdminClient();
  if (!supabase) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const requestedStatus = new URL(request.url).searchParams.get("status") ?? "pending";
  if (!(["pending", "approved", "rejected", "all"] as const).includes(requestedStatus as "pending" | "approved" | "rejected" | "all")) {
    return NextResponse.json({ error: "Invalid review status." }, { status: 400 });
  }

  let query = supabase.from("product_reviews").select(reviewFields).order("created_at", { ascending: true }).limit(200);
  if (requestedStatus !== "all") query = query.eq("status", requestedStatus);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "Could not load review queue." }, { status: 502 });
  return NextResponse.json({ reviews: data }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function PATCH(request: Request) {
  if (!hasSupabaseConfig()) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  const supabase = await getReviewAdminClient();
  if (!supabase) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  let input: Record<string, unknown>;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid moderation request." }, { status: 400 });
  }

  if (typeof input.id !== "string" || !/^[\da-f-]{36}$/i.test(input.id)) {
    return NextResponse.json({ error: "A valid review ID is required." }, { status: 400 });
  }
  if (input.status !== "approved" && input.status !== "rejected") {
    return NextResponse.json({ error: "Choose approved or rejected." }, { status: 400 });
  }

  const { error } = await supabase
    .from("product_reviews")
    .update({ status: input.status })
    .eq("id", input.id);

  if (error) return NextResponse.json({ error: "Could not update review." }, { status: 502 });
  return NextResponse.json({ updated: true });
}