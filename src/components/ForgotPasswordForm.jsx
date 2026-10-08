"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSent(false);

    if (!authClient) {
      setError("Supabase config নেই। .env.local ফাইলে NEXT_PUBLIC_SUPABASE_URL এবং NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY বসিয়ে dev server আবার চালু করুন।");
      return;
    }

    setLoading(true);
    try {
      const { error: requestError } = await authClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });

      if (requestError) {
        setError(requestError.message);
      } else {
        setSent(true);
      }
    } catch {
      setError("রিকভারি ইমেইল পাঠানো যায়নি। সংযোগ দেখে আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[65vh] bg-[#f7f7f5] px-4 py-12 sm:py-16">
      <section className="mx-auto max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-9">
        <Link href="/" className="text-lg font-black">বাজার <span className="text-[#047857]">দর</span></Link>
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-[#047857]">অ্যাকাউন্ট রিকভারি</p>
        <h1 className="mt-2 text-3xl font-black">পাসওয়ার্ড ভুলে গেছেন?</h1>
        <p className="mt-2 text-sm leading-6 text-black/55">আপনার অ্যাকাউন্টের ইমেইল দিন। পাসওয়ার্ড বদলানোর জন্য একটি নিরাপদ লিংক পাঠানো হবে।</p>

        {error && <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {sent && <p role="status" className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">ইমেইলটি থাকলে পাসওয়ার্ড রিসেটের নির্দেশনা পাঠানো হয়েছে। আপনার ইনবক্স দেখুন।</p>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-bold">ইমেইল</label>
            <input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" className="w-full rounded-xl border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/15" disabled={loading} />
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#047857] px-4 py-3.5 text-sm font-bold text-white hover:bg-[#065f46] disabled:opacity-60">{loading ? "ইমেইল পাঠানো হচ্ছে..." : "রিসেট লিংক পাঠান"}</button>
        </form>

        <p className="mt-6 text-center text-sm text-black/55"><Link href="/sign-in" className="font-bold text-[#047857]">সাইন ইন-এ ফিরে যান</Link></p>
      </section>
    </main>
  );
}
