"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export default function CategoryProducts({ products = [] }) {
  const [sort, setSort] = useState("default");

  const sortedProducts = useMemo(() => {
    const result = [...products];

    if (sort === "low") {
      result.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    }

    if (sort === "high") {
      result.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
    }

    return result;
  }, [products, sort]);

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-6 flex justify-end">
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          className="h-11 rounded-xl border border-black/10 bg-white px-4 text-sm font-medium text-black outline-none focus:border-[#047857]"
        >
          <option value="default">ডিফল্ট</option>
          <option value="low">দাম: কম থেকে বেশি</option>
          <option value="high">দাম: বেশি থেকে কম</option>
        </select>
      </div>

      {/* Products */}
      {sortedProducts.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProducts.map((product) => {
            const change = product.change ?? 0;

            return (
              <Link
                key={product.id}
                href={`/product/${encodeURIComponent(product.id)}`}
                className="group rounded-3xl border border-black/10 bg-white p-5 transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex size-16 items-center justify-center rounded-2xl bg-[#f1f3f0] text-4xl">
                    {product.icon || "🛒"}
                  </div>

                  {change !== 0 && (
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                        change > 0
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {change > 0 ? "▲" : "▼"} {Math.abs(change)}%
                    </span>
                  )}
                </div>

                <h2 className="mt-6 text-xl font-black transition group-hover:text-[#047857]">
                  {product.name}
                </h2>

                <p className="mt-1 text-sm text-black/40">
                  {product.unit || "প্রতি কেজি"}
                </p>

                <div className="mt-6 flex items-end justify-between border-t border-black/10 pt-5">
                  <div>
                    <p className="text-xs text-black/40">
                      বর্তমান দাম
                    </p>

                    <p className="mt-1 text-2xl font-black">
                      {product.price ?? "—"} টাকা
                    </p>
                  </div>

                  <span className="text-sm font-bold text-[#047857]">
                    বিস্তারিত →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-black/10 bg-white px-6 py-16 text-center">
          <div className="text-5xl">📦</div>

          <h2 className="mt-5 text-2xl font-black">
            কোনো পণ্য পাওয়া যায়নি
          </h2>

          <p className="mt-2 text-sm text-black/45">
            এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য নেই।
          </p>
        </div>
      )}
    </div>
  );
}
