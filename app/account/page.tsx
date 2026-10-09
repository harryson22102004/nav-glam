import type { Metadata } from "next";
import Link from "next/link";
import { CustomerAccount } from "@/components/account/CustomerAccount";

export const metadata: Metadata = {
  title: "Account",
  description: "Sign in and manage your KIIT campus delivery details.",
};

export default function AccountPage() {
  return (
    <div className="bg-ivory px-5 pb-20 pt-32 md:px-10">
      <div className="mx-auto max-w-xl">
        <p className="eyebrow text-bronze">Account</p>
        <h1 className="mt-4 font-serif text-6xl leading-none">Your details.</h1>
        <p className="mt-5 text-sm leading-relaxed text-stone">Sign in or create an account to save purchaser and KIIT campus delivery details.</p>
        <CustomerAccount />
        <div className="mt-8 flex gap-3">
          <Link href="/wishlist" className="btn">Wishlist</Link>
          <Link href="/cart" className="btn">Bag</Link>
        </div>
      </div>
    </div>
  );
}
