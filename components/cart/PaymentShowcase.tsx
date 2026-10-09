"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatProductPrice } from "@/lib/format";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useStore } from "@/lib/store";

const qrImage = "/payment/upi-qr.png";

export function PaymentShowcase() {
  const { detailed, subtotal } = useStore();
  const supabase = createSupabaseBrowserClient();
  const [qrLoaded, setQrLoaded] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<{ full_name: string; phone: string; campus_delivery_point: string } | null>(null);
  const [profileUserId, setProfileUserId] = useState<string | null>(null);
  const [campusConfirmed, setCampusConfirmed] = useState(false);
  const hasEstimatedPrice = detailed.some((line) => line.product.priceIsEstimate);
  const accountHref = "/account?next=%2Fpayment";
  const canShowQr = Boolean(userId && profile && campusConfirmed);

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (active) setUserId(data.user?.id ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id ?? null);
      if (!session) {
        setProfile(null);
        setProfileUserId(null);
        setCampusConfirmed(false);
      }
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!supabase || !userId) return;
    let active = true;
    supabase
      .from("customer_profiles")
      .select("full_name, phone, campus_delivery_point")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        setProfile(data);
        setProfileUserId(userId);
      });
    return () => { active = false; };
  }, [supabase, userId]);

  const profileLoaded = !userId || profileUserId === userId;

  return (
    <div className="min-h-[75svh] bg-ivory px-5 pb-20 pt-28 md:px-10">
      <div className="mx-auto max-w-[1100px]">
        <p className="eyebrow text-bronze">Manual UPI</p>
        <h1 className="mt-3 font-serif text-6xl leading-none md:text-8xl">Payment</h1>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-stone">Manual UPI payment for orders delivered within KIIT campus premises only.</p>

        {detailed.length === 0 ? (
          <div className="mt-10 border-t border-ink/15 py-8">
            <p className="font-serif text-3xl">Your bag is empty.</p>
            <Link href="/shop" className="btn btn-solid mt-5">Browse the shop</Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 border-t border-ink/15 pt-8 md:grid-cols-[1fr_340px]">
            <section>
              {!userId ? (
                <div className="mb-7 border border-ink/15 p-5">
                  <h2 className="font-serif text-3xl">Purchaser details required</h2>
                  <p className="mt-2 text-sm leading-relaxed text-stone">Sign in or create an account and save your name, WhatsApp number, and delivery point inside KIIT campus before continuing.</p>
                  <Link href={accountHref} className="btn btn-solid mt-4">Sign in or create account</Link>
                </div>
              ) : !profileLoaded ? (
                <p className="mb-7 text-sm text-stone">Loading your saved delivery details…</p>
              ) : !profile ? (
                <div className="mb-7 border border-ink/15 p-5">
                  <h2 className="font-serif text-3xl">Add delivery details</h2>
                  <p className="mt-2 text-sm text-stone">Save your purchaser and campus handoff details before continuing.</p>
                  <Link href={accountHref} className="btn btn-solid mt-4">Add account details</Link>
                </div>
              ) : (
                <div className="mb-7 border border-ink/15 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="eyebrow text-bronze">Delivery option</p>
                      <p className="mt-2 font-serif text-2xl">KIIT campus premises</p>
                    </div>
                    <Link href={accountHref} className="text-sm underline">Edit details</Link>
                  </div>
                  <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                    <div><dt className="text-xs uppercase tracking-wide text-stone">Purchaser</dt><dd>{profile.full_name}</dd></div>
                    <div><dt className="text-xs uppercase tracking-wide text-stone">WhatsApp</dt><dd>{profile.phone}</dd></div>
                    <div className="sm:col-span-2"><dt className="text-xs uppercase tracking-wide text-stone">Campus handoff point</dt><dd>{profile.campus_delivery_point}</dd></div>
                  </dl>
                  <p className="mt-4 border-t border-ink/10 pt-3 text-xs leading-relaxed text-stone">Delivery is limited to KIIT campus premises; off-campus addresses cannot be accepted. The purchaser will be acknowledged through WhatsApp.</p>
                  <label className="mt-4 flex items-start gap-2 text-sm">
                    <input type="checkbox" checked={campusConfirmed} onChange={(event) => setCampusConfirmed(event.target.checked)} className="mt-1 accent-ink" />
                    <span>I confirm this delivery point is inside KIIT campus premises.</span>
                  </label>
                </div>
              )}
              <h2 className="eyebrow">Order summary</h2>
              <ul className="mt-5 divide-y divide-ink/10">
                {detailed.map((line) => (
                  <li key={line.slug} className="flex justify-between gap-5 py-4 text-sm">
                    <span>{line.product.name} <span className="text-stone">× {line.qty}</span></span>
                    <span className="shrink-0">{formatProductPrice(line.product.price * line.qty, line.product.priceOnRequest, line.product.priceIsEstimate)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex justify-between border-t border-ink/15 pt-4 font-medium">
                <span>{hasEstimatedPrice ? "Estimated total" : "Total"}</span>
                <span>{formatProductPrice(subtotal, detailed.some((line) => line.product.priceOnRequest), hasEstimatedPrice)}</span>
              </div>
              <p className="mt-4 max-w-lg text-xs leading-relaxed text-stone">
                This is a visual payment demo. Prices marked “Est.” are estimates, and this site does not verify or record UPI payments.
              </p>
            </section>

            <section className="flex flex-col items-center border border-ink/15 p-5 text-center">
              <p className="eyebrow">{canShowQr ? "Scan to pay" : "UPI payment"}</p>
              {canShowQr ? <div className="mt-4 grid aspect-square w-full max-w-[260px] place-items-center bg-white p-3">
                {!qrLoaded ? (
                  <div className="flex aspect-square w-full flex-col items-center justify-center border border-dashed border-ink/20 px-4 text-center">
                    <p className="font-serif text-2xl">UPI QR</p>
                    <p className="mt-2 text-xs leading-relaxed text-stone">Place your QR image at <span className="whitespace-nowrap">public/payment/upi-qr.png</span>.</p>
                  </div>
                ) : null}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrImage}
                  alt="UPI payment QR code"
                  className={qrLoaded ? "block h-full w-full object-contain" : "hidden"}
                  onLoad={() => setQrLoaded(true)}
                  onError={() => setQrLoaded(false)}
                />
              </div> : <div className="mt-4 grid aspect-square w-full max-w-[260px] place-items-center border border-dashed border-ink/20 bg-white p-6 text-sm leading-relaxed text-stone">Sign in, save purchaser details, and confirm KIIT campus delivery to view the UPI QR.</div>}
              {canShowQr ? <p className="mt-4 text-xs text-stone">Use any UPI app that can scan a QR code.</p> : null}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
