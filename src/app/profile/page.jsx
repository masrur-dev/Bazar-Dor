import Link from "next/link";
import { redirect } from "next/navigation";

import { signOut } from "@/app/actions/auth";
import {
  createClient as createSupabaseServerClient,
} from "@/lib/supabase/server";

export const metadata = {
  title: "প্রোফাইল",
  description: "আপনার বাজার দর অ্যাকাউন্টের তথ্য দেখুন।",
};

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user } = {},
  } = supabase
    ? await supabase.auth.getUser()
    : { data: {} };

  // Login না থাকলে Sign In page-এ পাঠাবে
  if (!user) {
    redirect("/sign-in");
  }

  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    "ব্যবহারকারী";

  const email = user.email || "ইমেইল পাওয়া যায়নি";

  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <main className="min-h-[calc(100vh-180px)] bg-[#f7f7f5] px-4 py-12 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-[#047857]">
            Account
          </p>

          <h1 className="mt-2 text-3xl font-black sm:text-4xl">
            আপনার প্রোফাইল
          </h1>

          <p className="mt-2 text-sm text-black/50">
            আপনার বাজার দর অ্যাকাউন্টের তথ্য এখানে দেখুন।
          </p>
        </div>

        {/* Profile */}
        <section className="mt-8 rounded-3xl border border-black/10 bg-white p-7 sm:p-10">
          <div className="flex flex-col gap-7 sm:flex-row sm:items-center">
            <div className="flex size-24 shrink-0 items-center justify-center rounded-3xl bg-[#047857] text-4xl font-black text-white">
              {initial}
            </div>

            <div>
              <p className="text-sm font-medium text-black/40">
                স্বাগতম
              </p>

              <h2 className="mt-1 text-3xl font-black">
                {name}
              </h2>

              <p className="mt-2 text-sm text-black/50">
                {email}
              </p>
            </div>
          </div>
        </section>

        {/* Account Information */}
        <section className="mt-5 rounded-3xl border border-black/10 bg-white p-7 sm:p-10">
          <h2 className="text-xl font-black">
            অ্যাকাউন্ট তথ্য
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#f7f7f5] p-5">
              <p className="text-xs font-medium text-black/40">
                নাম
              </p>

              <p className="mt-2 font-bold">
                {name}
              </p>
            </div>

            <div className="rounded-2xl bg-[#f7f7f5] p-5">
              <p className="text-xs font-medium text-black/40">
                ইমেইল
              </p>

              <p className="mt-2 break-all font-bold">
                {email}
              </p>
            </div>

            <div className="rounded-2xl bg-[#f7f7f5] p-5">
              <p className="text-xs font-medium text-black/40">
                অ্যাকাউন্ট স্ট্যাটাস
              </p>

              <p className="mt-2 font-bold text-[#047857]">
                সক্রিয়
              </p>
            </div>

            <div className="rounded-2xl bg-[#f7f7f5] p-5">
              <p className="text-xs font-medium text-black/40">
                ব্যবহারকারী ID
              </p>

              <p className="mt-2 truncate font-bold">
                {user.id}
              </p>
            </div>
          </div>
        </section>

        {/* Actions */}
        <section className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Link
            href="/"
            className="btn border border-black/10 bg-white px-6 text-black hover:bg-black/5"
          >
            ← বাজারদর দেখুন
          </Link>

          <form action={signOut}>
            <button
              type="submit"
              className="btn w-full border-0 bg-[#047857] px-6 text-white hover:bg-[#065f46] sm:w-auto"
            >
              সাইন আউট
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}