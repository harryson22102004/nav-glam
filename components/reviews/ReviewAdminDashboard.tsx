"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { ProductReview } from "@/lib/reviews";

const filters = ["pending", "approved", "rejected", "all"] as const;
type ReviewFilter = (typeof filters)[number];

export function ReviewAdminDashboard() {
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [filter, setFilter] = useState<ReviewFilter>("pending");
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setEmail(data.user?.email ?? null);
      setAuthChecked(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null);
      setAuthChecked(true);
      setMessage("");
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!email) return;
    let active = true;
    fetch(`/api/admin/reviews?status=${filter}`, { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Could not load reviews.");
        return result.reviews as ProductReview[];
      })
      .then((data) => {
        if (active) setReviews(data);
      })
      .catch((error: unknown) => {
        if (active) setMessage(error instanceof Error ? error.message : "Could not load reviews.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [email, filter, refresh]);

  if (!supabase) {
    return (
      <div className="min-h-[70svh] bg-ivory px-5 pb-20 pt-28 md:px-10">
        <div className="mx-auto max-w-2xl">
          <p className="eyebrow text-bronze">Review moderation</p>
          <h1 className="mt-3 font-serif text-6xl">Admin sign in</h1>
          <p className="mt-5 text-sm leading-relaxed text-stone">Supabase is not configured. Add the project URL and publishable key to <code>.env.local</code>, then restart the development server.</p>
        </div>
      </div>
    );
  }

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setMessage("");
    const formData = new FormData(event.currentTarget);
    const adminEmail = String(formData.get("email") ?? "").trim();
    const { error } = await supabase.auth.signInWithPassword({ email: adminEmail, password });
    setMessage(error ? "Sign-in failed. Check the account and password." : "");
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setReviews([]);
  }

  async function moderate(review: ProductReview, status: "approved" | "rejected") {
    setBusyId(review.id);
    setMessage("");
    try {
      const response = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: review.id, status }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not update review.");
      setRefresh((value) => value + 1);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update review.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="min-h-[70svh] bg-ivory px-5 pb-20 pt-28 md:px-10">
      <div className="mx-auto max-w-[1100px]">
        <div className="flex flex-wrap items-end justify-between gap-5 border-b border-ink/15 pb-6">
          <div>
            <p className="eyebrow text-bronze">Private workspace</p>
            <h1 className="mt-3 font-serif text-6xl leading-none">Review approval</h1>
          </div>
          {email ? <button className="btn" onClick={signOut}>Sign out</button> : null}
        </div>

        {!authChecked ? <p className="py-10 text-sm text-stone">Checking admin session…</p> : null}
        {authChecked && !email ? (
          <form className="mt-8 grid max-w-md gap-4" onSubmit={signIn}>
            <p className="text-sm text-stone">Sign in with the Supabase Auth account added to the review admins list.</p>
            <label className="grid gap-1.5 text-sm">
              <span>Email</span>
              <input name="email" type="email" required autoComplete="username" className="min-h-11 border border-ink/20 bg-transparent px-3" />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span>Password</span>
              <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required autoComplete="current-password" className="min-h-11 border border-ink/20 bg-transparent px-3" />
            </label>
            <button className="btn btn-solid w-fit" type="submit">Sign in</button>
            {message ? <p role="status" className="text-sm text-stone">{message}</p> : null}
          </form>
        ) : null}

        {authChecked && email ? (
          <>
            <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-stone">Signed in as {email}</p>
              <div className="flex flex-wrap gap-2" role="tablist" aria-label="Review status">
                {filters.map((value) => (
                  <button key={value} type="button" role="tab" aria-selected={filter === value} onClick={() => setFilter(value)} className={`border px-3 py-2 text-xs uppercase tracking-[0.14em] ${filter === value ? "border-ink bg-ink text-ivory" : "border-ink/20"}`}>
                    {value === "all" ? "All" : value}
                  </button>
                ))}
              </div>
            </div>
            {message ? <p role="status" className="mt-4 text-sm text-stone">{message}</p> : null}
            {loading ? <p className="mt-8 text-sm text-stone">Loading reviews…</p> : null}
            {!loading && !reviews.length ? <p className="mt-8 border-t border-ink/10 py-8 font-serif text-3xl">No {filter === "all" ? "reviews" : `${filter} reviews`}.</p> : null}
            <ul className="mt-6 divide-y divide-ink/15">
              {reviews.map((review) => (
                <li key={review.id} className="py-6">
                  <div className="flex flex-wrap items-start justify-between gap-5">
                    <div className="max-w-2xl">
                      <p className="eyebrow text-bronze">{review.rating} / 5 · {review.status}</p>
                      <h2 className="mt-2 font-serif text-3xl">{review.title}</h2>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-stone">{review.body}</p>
                      <p className="mt-3 text-xs uppercase tracking-[0.14em]">{review.reviewer_name} · {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(review.created_at))}</p>
                      <Link className="mt-3 inline-block text-xs underline" href={`/product/${review.product_slug}`}>View product</Link>
                    </div>
                    {review.status === "pending" ? (
                      <div className="flex gap-2">
                        <button type="button" disabled={busyId === review.id} onClick={() => moderate(review, "rejected")} className="btn disabled:opacity-50">Reject</button>
                        <button type="button" disabled={busyId === review.id} onClick={() => moderate(review, "approved")} className="btn btn-solid disabled:opacity-50">Approve</button>
                      </div>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </div>
  );
}
