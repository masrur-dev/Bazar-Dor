import Link from "next/link";

const features = [
  {
    title: "দৈনিক বাজারদর",
    description:
      "চাল, ডাল, তেল, সবজি, মাছ, মাংসসহ প্রয়োজনীয় পণ্যের বর্তমান দাম এক জায়গায় দেখুন।",
  },
  {
    title: "সহজে পণ্য খুঁজুন",
    description:
      "সার্চ ব্যবহার করে প্রয়োজনীয় পণ্য দ্রুত খুঁজে বের করুন এবং বিস্তারিত তথ্য দেখুন।",
  },
  {
    title: "দাম পরিবর্তন",
    description:
      "কোন পণ্যের দাম বেড়েছে বা কমেছে তা সহজেই বুঝতে পারবেন।",
  },
  {
    title: "ক্যাটাগরি অনুযায়ী দেখুন",
    description:
      "পণ্যগুলো বিভিন্ন ক্যাটাগরিতে সাজানো থাকায় প্রয়োজনীয় পণ্য খুঁজে পাওয়া সহজ।",
  },
];

export const metadata = {
  title: "আমাদের সম্পর্কে",
  description:
    "বাজার দর সম্পর্কে জানুন এবং বাংলাদেশের প্রয়োজনীয় পণ্যের বাজারদর এক জায়গায় দেখুন।",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f5] text-black">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-widest text-[#047857]">
            Bazar Dor
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            বাজারদর জানুন,
            <br />
            বাজার করুন সহজে।
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-black/55 sm:text-lg">
            বাজার দর হলো বাংলাদেশের প্রয়োজনীয় দৈনন্দিন পণ্যের
            বর্তমান বাজারদর সহজভাবে দেখার একটি প্ল্যাটফর্ম।
            আমাদের লক্ষ্য হলো প্রয়োজনীয় পণ্যের দাম এক জায়গায়
            তুলে ধরা, যাতে বাজার করার আগে সহজেই ধারণা পাওয়া যায়।
          </p>

          <Link
            href="/"
            className="btn mt-8 border-0 bg-[#047857] px-6 text-white hover:bg-[#065f46]"
          >
            বাজারদর দেখুন →
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-black/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-[#047857]">
              কেন বাজার দর?
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              প্রয়োজনীয় তথ্য এক জায়গায়
            </h2>

            <p className="mt-4 leading-7 text-black/50">
              প্রতিদিনের বাজারকে আরও সহজ করার জন্য
              বাজার দর তৈরি করা হয়েছে।
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-3xl border border-black/10 bg-[#f7f7f5] p-6 transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex size-11 items-center justify-center rounded-2xl bg-[#dcfce7] text-[#047857]">
                  ✓
                </div>

                <h3 className="mt-5 text-lg font-black">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-black/50">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-black p-8 text-white sm:p-10">
            <p className="text-sm font-bold uppercase tracking-widest text-[#34d399]">
              Our Mission
            </p>

            <h2 className="mt-4 text-3xl font-black sm:text-4xl">
              বাজারের তথ্যকে সহজ করা
            </h2>

            <p className="mt-5 leading-7 text-white/55">
              বাজার করার সময় কোন পণ্যের দাম কত,
              দাম বাড়ছে নাকি কমছে—এসব তথ্য দ্রুত
              জানা গুরুত্বপূর্ণ। বাজার দর সেই তথ্যকে
              সহজ ও ব্যবহারযোগ্যভাবে উপস্থাপন করতে চায়।
            </p>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-8 sm:p-10">
            <p className="text-sm font-bold uppercase tracking-widest text-[#047857]">
              Important
            </p>

            <h2 className="mt-4 text-3xl font-black">
              বাজারদর পরিবর্তন হতে পারে
            </h2>

            <p className="mt-5 leading-7 text-black/50">
              বাজারের দাম স্থান, সময় এবং সরবরাহের ওপর
              নির্ভর করে পরিবর্তিত হতে পারে। তাই বাজার দর
              থেকে পাওয়া তথ্যকে সম্ভাব্য বাজারদর হিসেবে
              বিবেচনা করুন।
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="rounded-3xl bg-[#047857] p-8 text-white sm:p-10">
          <h2 className="text-2xl font-black sm:text-3xl">
            আজকের বাজারদর দেখে নিন
          </h2>

          <p className="mt-2 text-sm text-white/70">
            প্রয়োজনীয় পণ্যের দাম এক নজরে দেখুন।
          </p>

          <Link
            href="/"
            className="btn mt-6 border-0 bg-white px-6 text-black hover:bg-white/90"
          >
            হোম পেজে যান →
          </Link>
        </div>
      </section>
    </main>
  );
}