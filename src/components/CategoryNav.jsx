"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const CATEGORY_ICONS = {
  চাল: "🍚",
  ডাল: "🫘",
  তেল: "🛢️",
  সবজি: "🥬",
  মাছ: "🐟",
  মাংস: "🍗",
  "ডিম-দুধ": "🥛",
  মসলা: "🌶️",
};

export default function CategoryNav({ categories = [] }) {
  const pathname = usePathname();

  return (
    <nav
      className="border-t border-black/10"
      aria-label="ক্যাটাগরি"
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-4">
        <div className="scrollbar-none flex gap-1 overflow-x-auto py-2 sm:justify-center">
          {categories.map((category, index) => {
            const categoryName =
              category.nameBn ??
              category.name ??
              category.slug ??
              "";

            const target =
              category.slug ??
              category.id ??
              categoryName;

            const href = `/categories/${encodeURIComponent(target)}`;

            const isActive = pathname === href;

            return (
              <Link
                key={
                  category.id ??
                  category.slug ??
                  categoryName ??
                  index
                }
                href={href}
                className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all duration-200 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm ${
                  isActive
                    ? "bg-[#047857] text-white shadow-sm"
                    : "text-black/65 hover:bg-[#f1f3f0] hover:text-[#047857]"
                }`}
              >
                <span
                  className={`text-sm sm:text-base ${
                    isActive ? "" : "transition-transform group-hover:scale-110"
                  }`}
                  aria-hidden="true"
                >
                  {category.icon ||
                    CATEGORY_ICONS[categoryName] ||
                    "🛒"}
                </span>

                <span>{categoryName}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}