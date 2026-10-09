"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import type { ProductReview } from "@/lib/reviews";

export function ProductReviews({ productSlug }: { productSlug: string }) {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [rating, setRating] = useState(5);
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    fetch(`/api/reviews?productSlug=${encodeURIComponent(productSlug)}`, { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Reviews could not be loaded.");
        return result.reviews as ProductReview[];
      })
      .then((data) => {
        if (active) setReviews(data);
      })
      .catch((error: unknown) => {
        if (active) setLoadError(error instanceof Error ? error.message : "Reviews could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [productSlug]);

  const average = reviews.length
    ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
    : 0;

  async function submitReview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug, reviewerName: name, rating, title, body, website }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Review could not be submitted.");
      setName("");
      setTitle("");
      setBody("");
      setRating(5);
      setWebsite("");
      setMessage("Thanks. Your review is awaiting approval.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Review could not be submitted.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-[1500px] px-5 py-14 md:px-10" aria-labelledby="product-reviews-title">
      <div className="grid gap-10 border-t border-ink/15 pt-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="eyebrow text-bronze">Customer notes</p>
          <h2 id="product-reviews-title" className="mt-2 font-serif text-4xl md:text-5xl">Reviews</h2>
          {reviews.length ? (
            <div className="mt-4 flex items-center gap-2 text-sm" aria-label={`${average.toFixed(1)} out of 5 stars from ${reviews.length} reviews`}>
              <span className="flex text-gold" aria-hidden="true">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={15} fill={index < Math.round(average) ? "currentColor" : "none"} />)}</span>
              <span>{average.toFixed(1)} · {reviews.length} {reviews.length === 1 ? "review" : "reviews"}</span>
            </div>
          ) : <p className="mt-3 text-sm text-stone">{loading ? "Loading reviews…" : "No approved reviews yet."}</p>}
          {loadError ? <p role="status" className="mt-3 text-sm text-stone">{loadError}</p> : null}
          <p className="mt-5 max-w-sm text-xs leading-relaxed text-stone">Reviews are checked by the Nav Glam team before they appear here.</p>
        </div>

        <div>
          <h3 className="font-serif text-3xl">Leave a review</h3>
          <form className="mt-5 grid gap-4" onSubmit={submitReview}>
            <label className="grid gap-1.5 text-sm">
              <span>Your name</span>
              <input value={name} onChange={(event) => setName(event.target.value)} required minLength={2} maxLength={60} autoComplete="name" className="min-h-11 border border-ink/20 bg-transparent px-3" />
            </label>
            <fieldset>
              <legend className="mb-2 text-sm">Your rating</legend>
              <div className="flex gap-1">
                {Array.from({ length: 5 }, (_, index) => {
                  const value = index + 1;
                  return (
                    <button key={value} type="button" aria-label={`${value} ${value === 1 ? "star" : "stars"}`} aria-pressed={rating === value} onClick={() => setRating(value)} className="grid h-10 w-10 place-items-center text-gold" title={`${value} stars`}>
                      <Star size={20} fill={value <= rating ? "currentColor" : "none"} />
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <label className="grid gap-1.5 text-sm">
              <span>Review title</span>
              <input value={title} onChange={(event) => setTitle(event.target.value)} required minLength={3} maxLength={100} className="min-h-11 border border-ink/20 bg-transparent px-3" />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span>Your review</span>
              <textarea value={body} onChange={(event) => setBody(event.target.value)} required minLength={10} maxLength={1200} rows={5} className="resize-y border border-ink/20 bg-transparent px-3 py-2" />
            </label>
            <label aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
              Website
              <input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
            </label>
            <div className="flex flex-wrap items-center gap-4">
              <button type="submit" disabled={submitting} className="btn btn-solid disabled:opacity-50">
                {submitting ? "Submitting…" : "Submit review"}
              </button>
              {message ? <p role="status" className="text-sm text-stone">{message}</p> : null}
            </div>
          </form>
        </div>
      </div>

      {reviews.length ? (
        <ul className="mt-10 grid gap-px bg-ink/10 md:grid-cols-2">
          {reviews.map((review) => (
            <li key={review.id} className="bg-ivory p-5 md:p-7">
              <div className="flex items-center justify-between gap-3">
                <span className="flex text-gold" aria-label={`${review.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }, (_, index) => <Star key={index} size={14} fill={index < review.rating ? "currentColor" : "none"} aria-hidden="true" />)}
                </span>
                <time className="text-xs text-stone" dateTime={review.created_at}>{new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(review.created_at))}</time>
              </div>
              <h3 className="mt-3 font-serif text-2xl">{review.title}</h3>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-stone">{review.body}</p>
              <p className="mt-4 text-xs uppercase tracking-[0.16em]">{review.reviewer_name}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
