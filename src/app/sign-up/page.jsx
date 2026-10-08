"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!name.trim() || !email || !password || !confirmPassword) {
      setError("সবগুলো তথ্য পূরণ করুন।");
      return;
    }

    if (password.length < 8) {
      setError("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      return;
    }

    if (password !== confirmPassword) {
      setError("দুইটি পাসওয়ার্ড একই নয়।");
      return;
    }

    if (!authClient) {
      setError("অ্যাকাউন্ট তৈরি এখনো উপলব্ধ নয়। Supabase কনফিগারেশন যোগ করুন।");
      return;
    }

    try {
      setIsLoading(true);

      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email,
        password,
      });

      if (error) {
        setError(
          error.message || "অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।",
        );
        return;
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(error);
      setError("কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-180px)] items-center justify-center bg-[#f7f7f5] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-black/10 bg-white p-7 shadow-sm sm:p-9">
          {/* Header */}
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-[#047857]">
              Bazar Dor
            </p>

            <h1 className="mt-3 text-3xl font-black">
              অ্যাকাউন্ট তৈরি করুন
            </h1>

            <p className="mt-2 text-sm text-black/50">
              বাজার দর ব্যবহার করতে নতুন অ্যাকাউন্ট খুলুন।
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-5"
          >
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-bold"
              >
                নাম
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="আপনার নাম"
                autoComplete="name"
                className="h-12 w-full rounded-xl border border-black/10 bg-[#f7f7f5] px-4 text-sm outline-none transition placeholder:text-black/30 focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/10"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-bold"
              >
                ইমেইল
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="আপনার ইমেইল"
                autoComplete="email"
                className="h-12 w-full rounded-xl border border-black/10 bg-[#f7f7f5] px-4 text-sm outline-none transition placeholder:text-black/30 focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/10"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-bold"
              >
                পাসওয়ার্ড
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="কমপক্ষে ৮ অক্ষর"
                autoComplete="new-password"
                className="h-12 w-full rounded-xl border border-black/10 bg-[#f7f7f5] px-4 text-sm outline-none transition placeholder:text-black/30 focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/10"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-bold"
              >
                পাসওয়ার্ড নিশ্চিত করুন
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="পাসওয়ার্ড আবার লিখুন"
                autoComplete="new-password"
                className="h-12 w-full rounded-xl border border-black/10 bg-[#f7f7f5] px-4 text-sm outline-none transition placeholder:text-black/30 focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/10"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn h-12 w-full border-0 bg-[#047857] text-white hover:bg-[#065f46] disabled:bg-black/20"
            >
              {isLoading
                ? "অ্যাকাউন্ট তৈরি হচ্ছে..."
                : "অ্যাকাউন্ট তৈরি করুন"}
            </button>
          </form>

          {/* Sign In */}
          <p className="mt-7 text-center text-sm text-black/50">
            ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
            <Link
              href="/sign-in"
              className="font-bold text-[#047857] hover:underline"
            >
              সাইন ইন করুন
            </Link>
          </p>
        </div>

        {/* Home */}
        <div className="mt-5 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-black/45 transition hover:text-[#047857]"
          >
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </main>
  );
}