"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const inputClass =
  "w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-black/35 focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/15 disabled:opacity-60";

export default function AuthForm({ mode, initialError = "" }) {
  const isSignUp = mode === "sign-up";
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(initialError);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeProvider, setActiveProvider] = useState("");
  const [canResendConfirmation, setCanResendConfirmation] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    setCanResendConfirmation(false);

    const formData = new FormData(event.currentTarget);
    const submittedName = String(formData.get("name") ?? name).trim();
    const submittedEmail = String(formData.get("email") ?? email).trim();
    const submittedPassword = String(formData.get("password") ?? password);
    const submittedConfirmation = String(formData.get("confirm-password") ?? confirmPassword);
    setEmail(submittedEmail);

    if (!authClient) {
      setError("Supabase config নেই। .env.local ফাইলে NEXT_PUBLIC_SUPABASE_URL এবং NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY বসিয়ে dev server আবার চালু করুন।");
      return;
    }
    if (isSignUp && !submittedName) {
      setError("আপনার নাম লিখুন।");
      return;
    }
    if (isSignUp && submittedPassword !== submittedConfirmation) {
      setError("দুটি পাসওয়ার্ড মিলছে না।");
      return;
    }
    if (submittedPassword.length < 6) {
      setError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
      return;
    }

    setLoading(true);
    try {
      const result = isSignUp
        ? await authClient.auth.signUp({
            email: submittedEmail,
            password: submittedPassword,
            options: {
              data: { full_name: submittedName },
              emailRedirectTo: `${window.location.origin}/auth/callback?next=/profile`,
            },
          })
        : await authClient.auth.signInWithPassword({ email: submittedEmail, password: submittedPassword });

      if (result.error) {
        const emailNeedsConfirmation = !isSignUp && (
          result.error.code === "email_not_confirmed" ||
          /email not confirmed/i.test(result.error.message ?? "")
        );
        setCanResendConfirmation(emailNeedsConfirmation);
        setError(emailNeedsConfirmation
          ? "আপনার ইমেইল এখনো নিশ্চিত করা হয়নি। ইনবক্সে থাকা লিংকে চাপুন, অথবা নতুন confirmation email পাঠান।"
          : result.error.message);
        setLoading(false);
        return;
      }

      if (isSignUp && !result.data.session) {
        setNotice("আপনার ইমেইলে একটি নিশ্চিতকরণ লিংক পাঠানো হয়েছে। ইনবক্স দেখুন।");
        window.dispatchEvent(new CustomEvent("bazar-dor:toast", { detail: "অ্যাকাউন্ট তৈরি হয়েছে। ইমেইল নিশ্চিত করুন।" }));
        setLoading(false);
        return;
      }

      window.dispatchEvent(new CustomEvent("bazar-dor:toast", {
        detail: isSignUp ? "অ্যাকাউন্ট তৈরি সফল হয়েছে।" : "সফলভাবে সাইন ইন হয়েছে।",
      }));
      router.push("/profile");
      router.refresh();
    } catch {
      setError("সংযোগে সমস্যা হয়েছে। ইন্টারনেট দেখে আবার চেষ্টা করুন।");
      setLoading(false);
    }
  }

  async function resendConfirmation() {
    const targetEmail = email.trim();
    setError("");
    setNotice("");

    if (!targetEmail) {
      setError("আগে ইমেইল ঘরে আপনার ইমেইল লিখুন।");
      return;
    }
    if (!authClient) {
      setError("Supabase config নেই। .env.local ফাইলে NEXT_PUBLIC_SUPABASE_URL এবং NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY বসিয়ে dev server আবার চালু করুন।");
      return;
    }

    setLoading(true);
    try {
      const { error: resendError } = await authClient.auth.resend({
        type: "signup",
        email: targetEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/profile`,
        },
      });

      if (resendError) {
        setError(resendError.message);
      } else {
        setCanResendConfirmation(false);
        setNotice("Confirmation link পাঠানো হয়েছে। ইমেইল ইনবক্স ও spam folder দেখুন।");
      }
    } catch {
      setError("Confirmation email পাঠানো যায়নি। একটু পরে আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  async function handleOAuth(provider) {
    setError("");
    setNotice("");
    if (!authClient) {
      setError("Supabase config নেই। .env.local ফাইলে NEXT_PUBLIC_SUPABASE_URL এবং NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY বসিয়ে dev server আবার চালু করুন।");
      return;
    }
    setLoading(true);
    setActiveProvider(provider);
    try {
      const callbackUrl = new URL("/auth/callback", window.location.origin);
      callbackUrl.searchParams.set("next", "/profile");
      callbackUrl.searchParams.set("flow", "oauth");
      const { error: oauthError } = await authClient.auth.signInWithOAuth({
        provider,
        options: { redirectTo: callbackUrl.toString() },
      });
      if (oauthError) {
        setError(`${provider === "google" ? "Google" : "GitHub"} দিয়ে সাইন ইন করা যায়নি। ${oauthError.message}`);
        setLoading(false);
        setActiveProvider("");
      }
    } catch {
      setError(`${provider === "google" ? "Google" : "GitHub"} দিয়ে সংযোগ করা যায়নি। আবার চেষ্টা করুন।`);
      setLoading(false);
      setActiveProvider("");
    }
  }

  return (
    <main className="min-h-[65vh] bg-[#f7f7f5] px-4 py-12 sm:py-16">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm md:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#064e3b] p-10 text-white md:flex">
          <div className="absolute -right-20 -top-16 size-72 rounded-full border-36 border-white/5" />
          <div className="absolute -bottom-28 -left-20 size-72 rounded-full bg-[#047857]" />
          <Link href="/" className="relative text-2xl font-black tracking-tight">বাজার <span className="text-emerald-300">দর</span></Link>
          <div className="relative py-10">
            <span className="text-6xl" aria-hidden="true">🧺</span>
            <h2 className="mt-6 text-3xl font-black leading-tight">প্রতিদিনের বাজার,<br />এবার আরও সহজ।</h2>
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/70">আপনার অ্যাকাউন্টে সাইন ইন করে প্রয়োজনীয় পণ্যের হালনাগাদ দাম দেখুন।</p>
          </div>
          <p className="relative text-xs text-white/50">বাংলাদেশের দৈনিক বাজারদর</p>
        </aside>

        <section className="p-6 sm:p-10 lg:p-12">
          <Link href="/" className="text-lg font-black tracking-tight text-black md:hidden">বাজার <span className="text-[#047857]">দর</span></Link>
          <div className="mb-7 mt-7 md:mt-0">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#047857]">আপনার অ্যাকাউন্ট</p>
            <h1 className="text-3xl font-black tracking-tight">{isSignUp ? "নতুন অ্যাকাউন্ট খুলুন" : "আবার স্বাগতম"}</h1>
            <p className="mt-2 text-sm text-black/55">{isSignUp ? "কয়েকটি তথ্য দিলেই শুরু করতে পারবেন।" : "আপনার অ্যাকাউন্টে সাইন ইন করুন।"}</p>
          </div>

          {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}{canResendConfirmation && <button type="button" onClick={resendConfirmation} disabled={loading} className="mt-3 block font-bold text-[#047857] underline underline-offset-2 disabled:opacity-60">{loading ? "ইমেইল পাঠানো হচ্ছে..." : "Confirmation email আবার পাঠান"}</button>}</div>}
          {notice && <div role="status" className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</div>}

          <div className="grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={() => handleOAuth("google")} disabled={loading} className="flex w-full items-center justify-center gap-3 rounded-xl border border-black/15 px-4 py-3 text-sm font-bold transition hover:bg-black/3 disabled:cursor-not-allowed disabled:opacity-60">
              <svg aria-hidden="true" viewBox="0 0 48 48" className="size-5"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.9c-.58 2.96-2.26 5.47-4.73 7.16l7.65 5.93c4.47-4.13 7.16-10.21 7.16-17.56Z"/><path fill="#FBBC05" d="M10.54 28.59A14.5 14.5 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.53 2.56 10.78l7.98-6.19Z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.89l-7.65-5.93c-2.13 1.43-4.85 2.27-8.25 2.27-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"/></svg>
              {loading && activeProvider === "google" ? "Google-এ যাচ্ছেন..." : "Google"}
            </button>
            <button type="button" onClick={() => handleOAuth("github")} disabled={loading} className="flex w-full items-center justify-center gap-3 rounded-xl border border-black/15 px-4 py-3 text-sm font-bold transition hover:bg-black/3 disabled:cursor-not-allowed disabled:opacity-60">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-current"><path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.08c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.23-1.62-1.23-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.72 1.15 1.72 1.15.99 1.71 2.6 1.22 3.23.93.1-.72.39-1.22.7-1.5-2.48-.28-5.09-1.24-5.09-5.53 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.12-1.44 3.05-1.15 3.05-1.15.61 1.54.23 2.68.12 2.96.71.78 1.14 1.78 1.14 3.01 0 4.3-2.61 5.24-5.1 5.51.4.35.75 1.03.75 2.08v3.05c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z"/></svg>
              {loading && activeProvider === "github" ? "GitHub-এ যাচ্ছেন..." : "GitHub"}
            </button>
          </div>

          <div className="my-6 flex items-center gap-3 text-xs text-black/35"><span className="h-px flex-1 bg-black/10" />অথবা ইমেইল দিয়ে<span className="h-px flex-1 bg-black/10" /></div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && <div><label htmlFor="name" className="mb-2 block text-sm font-bold">আপনার নাম</label><input id="name" name="name" type="text" autoComplete="name" required value={name} onChange={(event) => setName(event.target.value)} placeholder="যেমন: রাহিম আহমেদ" className={inputClass} disabled={loading} /></div>}
            <div><label htmlFor="email" className="mb-2 block text-sm font-bold">ইমেইল</label><input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" className={inputClass} disabled={loading} /></div>
            <div><div className="mb-2 flex items-center justify-between"><label htmlFor="password" className="block text-sm font-bold">পাসওয়ার্ড</label>{!isSignUp && <Link href="/forgot-password" className="text-xs font-semibold text-[#047857] hover:text-[#065f46]">পাসওয়ার্ড ভুলে গেছেন?</Link>}</div><input id="password" name="password" type="password" autoComplete={isSignUp ? "new-password" : "current-password"} required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="কমপক্ষে ৬ অক্ষর" className={inputClass} disabled={loading} /></div>
            {isSignUp && <div><label htmlFor="confirm-password" className="mb-2 block text-sm font-bold">পাসওয়ার্ড আবার লিখুন</label><input id="confirm-password" name="confirm-password" type="password" autoComplete="new-password" required minLength={6} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="পাসওয়ার্ডটি আবার লিখুন" className={inputClass} disabled={loading} /></div>}
            <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#047857] px-4 py-3.5 text-sm font-bold text-white transition hover:bg-[#065f46] disabled:cursor-not-allowed disabled:opacity-60">{loading ? "একটু অপেক্ষা করুন..." : isSignUp ? "অ্যাকাউন্ট তৈরি করুন" : "সাইন ইন করুন"}</button>
          </form>

          <p className="mt-6 text-center text-sm text-black/55">{isSignUp ? "আগে থেকেই অ্যাকাউন্ট আছে?" : "অ্যাকাউন্ট নেই?"} <Link href={isSignUp ? "/sign-in" : "/sign-up"} className="font-bold text-[#047857] hover:text-[#065f46]">{isSignUp ? "সাইন ইন করুন" : "সাইন আপ করুন"}</Link></p>
          <p className="mt-5 text-center text-xs leading-5 text-black/40">অ্যাকাউন্ট তৈরি করে আপনার প্রয়োজনীয় পণ্যের বাজারদর দেখুন।</p>
        </section>
      </div>
    </main>
  );
}
