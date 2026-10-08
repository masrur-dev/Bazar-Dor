import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";

import { getCategories } from "@/lib/api";
import CategoryNav from "@/components/CategoryNav";
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions/auth";
import LocalDateTime from "@/components/LocalDateTime";

function listFrom(response) {
  const value = response?.data ?? response;
  return Array.isArray(value) ? value : [];
}

export default async function Navbar() {
  const categoryResult = await Promise.resolve(getCategories()).catch(() => null);
  const categories = listFrom(categoryResult);
  await connection();
  const supabase = await createSupabaseServerClient();
  const { data: { user } = {} } = supabase
    ? await supabase.auth.getUser()
    : { data: {} };
  const userName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "ব্যবহারকারী";

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur">
      <div className="navbar mx-auto max-w-7xl px-4 sm:px-6">
        <div className="navbar-start">
          <Link
            href="/"
            className="group flex items-center gap-3"
            aria-label="বাজার দর হোম"
          >
            <div className="rounded-xl bg-[#f1f3f0] p-1.5 transition-transform duration-200 group-hover:scale-105">
              <Image
                src="/logo-icon.svg"
                alt="বাজার দর"
                width={40}
                height={40}
                priority
              />
            </div>

            <div>
              <h1 className="text-base font-black leading-tight text-black sm:text-lg">
                বাজার দর
              </h1>
              <LocalDateTime className="block whitespace-nowrap text-[10px] leading-tight text-black/50 sm:text-xs" />
            </div>
          </Link>
        </div>

        <div className="navbar-center hidden items-center gap-1 lg:flex">
          <Link href="/" className="rounded-xl px-4 py-2 text-sm font-bold text-black/65 transition hover:bg-[#f1f3f0] hover:text-[#047857]">হোম</Link>
          <Link href="/about" className="rounded-xl px-4 py-2 text-sm font-bold text-black/65 transition hover:bg-[#f1f3f0] hover:text-[#047857]">আমাদের সম্পর্কে</Link>
        </div>

        <div className="navbar-end">
          <div className="hidden items-center gap-2 sm:flex">
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="btn btn-ghost btn-sm text-[#047857] hover:bg-[#047857]/10"
                >
                  স্বাগতম, {userName}
                </Link>
                <form action={signOut}>
                  <button type="submit" className="btn btn-sm border-0 bg-[#047857] text-white hover:bg-[#065f46]">
                    সাইন আউট
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="btn btn-ghost btn-sm text-black hover:bg-black/5"
                >
                  সাইন ইন
                </Link>
                <Link
                  href="/sign-up"
                  className="btn btn-sm border-0 bg-[#047857] text-white hover:bg-[#065f46]"
                >
                  সাইন আপ
                </Link>
              </>
            )}
          </div>

          <div className="dropdown dropdown-end sm:hidden">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-square text-black"
              aria-label="মেনু খুলুন"
              data-auth-gate-allow
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </div>

            <ul
              tabIndex={0}
              className="menu dropdown-content mt-3 w-56 rounded-2xl border border-black/10 bg-white p-3 shadow-xl"
            >
              <li><Link href="/">হোম</Link></li>
              <li><Link href="/about">আমাদের সম্পর্কে</Link></li>
              {user ? (
                <>



                
                  <li><Link href="/profile" className="font-bold text-[#047857]">স্বাগতম, {userName}</Link></li>
                  <li>
                    <form action={signOut}>
                      <button type="submit" className="w-full rounded-lg bg-[#047857] px-3 py-2 text-left font-semibold text-white hover:bg-[#065f46]">সাইন আউট</button>
                    </form>
                  </li>
                </>
              ) : (
                <>
                  <li><Link href="/sign-in">সাইন ইন</Link></li>
                  <li><Link href="/sign-up">সাইন আপ</Link></li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      <Suspense fallback={<div className="h-10" />}>
        <CategoryNav categories={categories} />
      </Suspense>
    </header>
  );
}
