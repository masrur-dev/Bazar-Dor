"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7f5] px-6 text-black">
      <div className="w-full max-w-lg rounded-3xl border border-black/10 bg-white p-8 text-center sm:p-10">
        <div className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-[#f1f3f0] text-4xl">
          ⚠️
        </div>

        <p className="mt-6 text-sm font-bold uppercase tracking-widest text-[#047857]">
          Bazar Dor
        </p>

        <h1 className="mt-3 text-3xl font-black sm:text-4xl">
          কিছু একটা সমস্যা হয়েছে
        </h1>

        <p className="mt-3 text-sm leading-6 text-black/50 sm:text-base">
          দুঃখিত, তথ্য লোড করার সময় একটি সমস্যা হয়েছে।
          আবার চেষ্টা করুন।
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="btn mt-7 border-0 bg-[#047857] px-6 text-white hover:bg-[#065f46]"
        >
          আবার চেষ্টা করুন
        </button>
      </div>
    </main>
  );
}