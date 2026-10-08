import Link from "next/link";
import CurrentYear from "@/components/CurrentYear";

export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <Link
              href="/"
              className="text-xl font-black text-black"
            >
              বাজার দর
            </Link>

            <p className="mt-2 max-w-md text-sm leading-6 text-black/50">
              প্রয়োজনীয় পণ্যের দাম এক নজরে।
              প্রতিদিনের বাজারদর সহজেই জানুন।
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium">
            <Link
              href="/"
              className="text-black/60 transition hover:text-[#047857]"
            >
              হোম
            </Link>

            <Link
              href="/about"
              className="text-black/60 transition hover:text-[#047857]"
            >
              আমাদের সম্পর্কে
            </Link>

            <Link
              href="/categories/chal"
              className="text-black/60 transition hover:text-[#047857]"
            >
              চাল
            </Link>

            <Link
              href="/categories/dal"
              className="text-black/60 transition hover:text-[#047857]"
            >
              ডাল
            </Link>

            <Link
              href="/categories/tel"
              className="text-black/60 transition hover:text-[#047857]"
            >
              তেল
            </Link>

            <Link
              href="/profile"
              className="text-black/60 transition hover:text-[#047857]"
            >
              প্রোফাইল
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-black/10 pt-6 text-xs text-black/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CurrentYear /> বাজার দর. সর্বস্বত্ব সংরক্ষিত।
          </p>

          <p>
            সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
          </p>
        </div>
      </div>
    </footer>
  );
}