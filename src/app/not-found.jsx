import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7f5] px-6 text-center text-black">
      <div className="max-w-lg">
        <p className="text-8xl font-black tracking-tight text-[#047857]">
          404
        </p>

        <div className="mx-auto mt-4 flex size-20 items-center justify-center rounded-3xl bg-white text-4xl shadow-sm">
          📦
        </div>

        <h1 className="mt-7 text-3xl font-black sm:text-4xl">
          পেজটি খুঁজে পাওয়া যায়নি
        </h1>

        <p className="mt-3 text-sm leading-6 text-black/50 sm:text-base">
          দুঃখিত, আপনি যে পেজটি খুঁজছেন সেটি
          পাওয়া যাচ্ছে না অথবা URL টি ভুল।
        </p>

        <Link
          href="/"
          className="btn mt-7 border-0 bg-[#047857] px-6 text-white hover:bg-[#065f46]"
        >
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}