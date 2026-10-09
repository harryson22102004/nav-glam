import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getProduct } from "@/lib/catalog";
import { getSupabaseConfig } from "@/lib/reviews";

const reviewFields = "id, product_slug, reviewer_name, rating, title, body, status, created_at";

export async function GET(request: Request) {
  const config = getSupabaseConfig();
  if (!config) return NextResponse.json({ error: "Reviews are not configured yet." }, { status: 503 });

  const productSlug = new URL(request.url).searchParams.get("productSlug")?.trim();
  if (!productSlug || !getProduct(productSlug)) {
    return NextResponse.json({ error: "A valid product is required." }, { status: 400 });
  }

  const supabase = createSupabaseClient(config.url, config.key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase
    .from("product_reviews")
    .select(reviewFields)
    .eq("product_slug", productSlug)
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: "Could not load reviews." }, { status: 502 });
  return NextResponse.json({ reviews: data }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const config = getSupabaseConfig();
  if (!config) return NextResponse.json({ error: "Reviews are not configured yet." }, { status: 503 });

  let input: Record<string, unknown>;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid review submission." }, { status: 400 });
  }

  if (typeof input.website === "string" && input.website.trim()) {
    return NextResponse.json({ submitted: true }, { status: 202 });
  }

  const productSlug = typeof input.productSlug === "string" ? input.productSlug.trim() : "";
  const reviewerName = typeof input.reviewerName === "string" ? input.reviewerName.trim() : "";
  const title = typeof input.title === "string" ? input.title.trim() : "";
  const body = typeof input.body === "string" ? input.body.trim() : "";
  const rating = input.rating;

  if (!getProduct(productSlug)) return NextResponse.json({ error: "A valid product is required." }, { status: 400 });
  if (reviewerName.length < 2 || reviewerName.length > 60) {
    return NextResponse.json({ error: "Name must be between 2 and 60 characters." }, { status: 400 });
  }
  if (typeof rating !== "number" || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Choose a rating from 1 to 5 stars." }, { status: 400 });
  }
  if (title.length < 3 || title.length > 100) {
    return NextResponse.json({ error: "Title must be between 3 and 100 characters." }, { status: 400 });
  }
  if (body.length < 10 || body.length > 1200) {
    return NextResponse.json({ error: "Review must be between 10 and 1,200 characters." }, { status: 400 });
  }

  const supabase = createSupabaseClient(config.url, config.key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error } = await supabase.from("product_reviews").insert({
    product_slug: productSlug,
    reviewer_name: reviewerName,
    rating,
    title,
    body,
    status: "pending",
  });

  if (error) return NextResponse.json({ error: "Could not submit review." }, { status: 502 });
  return NextResponse.json({ submitted: true }, { status: 201 });
}