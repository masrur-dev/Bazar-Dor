"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const inputClass = "w-full rounded-xl border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/15 disabled:opacity-60";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!authClient) {
      setError("Supabase config নেই। .env.local ফাইলে NEXT_PUBLIC_SUPABASE_URL এবং NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY বসিয়ে dev server আবার চালু করুন।");
      return;
    }
    if (password.length < 6) {
      setError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
      return;
    }
    if (password !== confirmPassword) {
      setError("দুটি পাসওয়ার্ড মিলছে না।");
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await authClient.auth.updateUser({ password });
      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }
      router.push("/profile");
      router.refresh();
    } catch {
      setError("পাসওয়ার্ড বদলানো যায়নি। রিসেট লিংকটি মেয়াদোত্তীর্ণ হতে পারে।");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[65vh] bg-[#f7f7f5] px-4 py-12 sm:py-16">
      <section className="mx-auto max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-9">
        <Link href="/" className="text-lg font-black">বাজার <span className="text-[#047857]">দর</span></Link>
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-[#047857]">অ্যাকাউন্ট রিকভারি</p>
        <h1 className="mt-2 text-3xl font-black">নতুন পাসওয়ার্ড দিন</h1>
        <p className="mt-2 text-sm leading-6 text-black/55">কমপক্ষে ৬ অক্ষরের নতুন পাসওয়ার্ড বেছে নিন।</p>

        {error && <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-bold">নতুন পাসওয়ার্ড</label>
            <input id="password" type="password" autoComplete="new-password" minLength={6} required value={password} onChange={(event) => setPassword(event.target.value)} className={inputClass} disabled={loading} />
          </div>
          <div>
            <label htmlFor="confirm-password" className="mb-2 block text-sm font-bold">পাসওয়ার্ড আবার লিখুন</label>
            <input id="confirm-password" type="password" autoComplete="new-password" minLength={6} required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className={inputClass} disabled={loading} />
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#047857] px-4 py-3.5 text-sm font-bold text-white hover:bg-[#065f46] disabled:opacity-60">{loading ? "পাসওয়ার্ড বদলানো হচ্ছে..." : "পাসওয়ার্ড আপডেট করুন"}</button>
        </form>
      </section>
    </main>
  );
}
