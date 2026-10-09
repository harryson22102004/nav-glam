"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type CustomerProfile = {
  full_name: string;
  phone: string;
  campus_delivery_point: string;
};

const emptyProfile: CustomerProfile = {
  full_name: "",
  phone: "",
  campus_delivery_point: "",
};

export function CustomerAccount() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<CustomerProfile>(emptyProfile);
  const [profileUserId, setProfileUserId] = useState<string | null>(null);
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setUserId(data.user?.id ?? null);
      setUserEmail(data.user?.email ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id ?? null);
      setUserEmail(session?.user.email ?? null);
      setMessage("");
      if (!session) {
        setProfile(emptyProfile);
        setProfileUserId(null);
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
      .then(({ data, error }) => {
        if (!active) return;
        setProfile(data ?? emptyProfile);
        setProfileUserId(userId);
        if (error) setMessage("Could not load your saved delivery details.");
      });

    return () => { active = false; };
  }, [supabase, userId]);

  const profileLoaded = !userId || profileUserId === userId;

  function continueAfterLogin() {
    const next = new URLSearchParams(window.location.search).get("next");
    router.push(next?.startsWith("/") && !next.startsWith("//") ? next : "/account");
  }

  async function authenticate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setMessage("");
    setSaving(true);

    try {
      if (mode === "sign-up") {
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
        if (error) throw error;
        if (data.session && data.user) {
          setUserId(data.user.id);
          setUserEmail(data.user.email ?? email.trim());
          setMessage("Account created. Add your delivery details below.");
        } else {
          setMessage("Check your email to confirm your account, then sign in here.");
          setMode("sign-in");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        setUserId(data.user.id);
        setUserEmail(data.user.email ?? email.trim());
        continueAfterLogin();
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not authenticate your account.");
    } finally {
      setSaving(false);
    }
  }

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !userId) return;
    setSaving(true);
    setMessage("");

    const { error } = await supabase.from("customer_profiles").upsert({
      user_id: userId,
      full_name: profile.full_name.trim(),
      phone: profile.phone.trim(),
      campus_delivery_point: profile.campus_delivery_point.trim(),
      updated_at: new Date().toISOString(),
    });

    setSaving(false);
    if (error) {
      setMessage("Could not save your details. Please check the fields and try again.");
      return;
    }

    setMessage("Delivery details saved.");
    continueAfterLogin();
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setMessage("You have signed out.");
  }

  if (!supabase) {
    return (
      <div className="mt-6 border-t border-ink/15 pt-6">
        <p className="text-sm leading-relaxed text-stone">Customer accounts are not configured yet. Supabase settings are required to sign in and save delivery details.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 border-t border-ink/15 pt-7">
      {!userId ? (
        <>
          <div className="flex gap-2" role="tablist" aria-label="Account access">
            <button type="button" role="tab" aria-selected={mode === "sign-in"} onClick={() => { setMode("sign-in"); setMessage(""); }} className={`border px-3 py-2 text-xs uppercase tracking-[0.14em] ${mode === "sign-in" ? "border-ink bg-ink text-ivory" : "border-ink/20"}`}>Sign in</button>
            <button type="button" role="tab" aria-selected={mode === "sign-up"} onClick={() => { setMode("sign-up"); setMessage(""); }} className={`border px-3 py-2 text-xs uppercase tracking-[0.14em] ${mode === "sign-up" ? "border-ink bg-ink text-ivory" : "border-ink/20"}`}>Create account</button>
          </div>
          <form className="mt-5 grid max-w-lg gap-4" onSubmit={authenticate}>
            <label className="grid gap-1.5 text-sm">
              <span>Email</span>
              <input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="min-h-11 border border-ink/20 bg-transparent px-3" />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span>Password</span>
              <input type="password" required minLength={8} autoComplete={mode === "sign-in" ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} className="min-h-11 border border-ink/20 bg-transparent px-3" />
            </label>
            <button type="submit" disabled={saving} className="btn btn-solid w-fit disabled:opacity-50">{saving ? "Please wait…" : mode === "sign-in" ? "Sign in" : "Create account"}</button>
          </form>
        </>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="eyebrow text-bronze">Signed in</p>
              <p className="mt-1 text-sm">{userEmail}</p>
            </div>
            <button type="button" className="text-sm underline" onClick={signOut}>Sign out</button>
          </div>
          {!profileLoaded ? <p className="mt-5 text-sm text-stone">Loading saved details…</p> : (
            <form className="mt-5 grid max-w-lg gap-4" onSubmit={saveProfile}>
              <label className="grid gap-1.5 text-sm">
                <span>Purchaser name</span>
                <input required minLength={2} maxLength={100} autoComplete="name" value={profile.full_name} onChange={(event) => setProfile((current) => ({ ...current, full_name: event.target.value }))} className="min-h-11 border border-ink/20 bg-transparent px-3" />
              </label>
              <label className="grid gap-1.5 text-sm">
                <span>WhatsApp contact number</span>
                <input required type="tel" minLength={8} maxLength={20} autoComplete="tel" value={profile.phone} onChange={(event) => setProfile((current) => ({ ...current, phone: event.target.value }))} className="min-h-11 border border-ink/20 bg-transparent px-3" />
              </label>
              <label className="grid gap-1.5 text-sm">
                <span>Delivery point inside KIIT campus</span>
                <input required minLength={3} maxLength={160} autoComplete="street-address" placeholder="Hostel, block, or campus landmark" value={profile.campus_delivery_point} onChange={(event) => setProfile((current) => ({ ...current, campus_delivery_point: event.target.value }))} className="min-h-11 border border-ink/20 bg-transparent px-3" />
              </label>
              <p className="text-xs leading-relaxed text-stone">Delivery is available only within KIIT campus premises. Do not enter an off-campus address.</p>
              <div className="flex flex-wrap items-center gap-4">
                <button type="submit" disabled={saving} className="btn btn-solid disabled:opacity-50">{saving ? "Saving…" : "Save delivery details"}</button>
                {message ? <p role="status" className="text-sm text-stone">{message}</p> : null}
              </div>
            </form>
          )}
        </>
      )}
      {!userId && message ? <p role="status" className="mt-4 text-sm text-stone">{message}</p> : null}
    </div>
  );
}
