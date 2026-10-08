"use client";

import { useState } from "react";
import Link from "next/link";

const ProductSearch = ({ products = [] }) => {
  const [search, setSearch] = useState("");

  const query = search.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    const name = String(product.name ?? "").toLowerCase();
    const category = String(product.category ?? "").toLowerCase();
    const unit = String(product.unit ?? "").toLowerCase();

    return (
      name.includes(query) ||
      category.includes(query) ||
      unit.includes(query)
    );
  });

  return (
    <section className="mt-10">
      {/* Search Box */}
      <div className="rounded-3xl border border-black/10 bg-white p-5 sm:p-6">
        <div className="mb-4">
          <h2 className="text-xl font-black sm:text-2xl">
            পণ্য খুঁজুন
          </h2>

          <p className="mt-1 text-sm text-black/50">
            আপনার প্রয়োজনীয় পণ্যের বর্তমান বাজারদর খুঁজে দেখুন।
          </p>
        </div>

        <div className="relative">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="যেমন: চাল, ডাল, তেল..."
            className="h-14 w-full rounded-2xl border border-black/10 bg-[#f7f7f5] px-5 pr-14 text-sm text-black outline-none transition placeholder:text-black/35 focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/10"
          />

          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xl">
            🔍
          </div>
        </div>
      </div>

      {/* Results */}
      {search.trim() && (
        <div className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-black">
              সার্চ রেজাল্ট
            </h3>

            <span className="text-sm text-black/40">
              {filteredProducts.length}টি পণ্য
            </span>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group rounded-2xl border border-black/10 bg-white p-5 transition duration-200 hover:-translate-y-1 hover:border-[#047857]/30 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#f1f3f0] text-3xl">
                      {product.icon || "🛒"}
                    </div>

                    {product.change !== null &&
                      product.change !== undefined && (
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                            product.change > 0
                              ? "bg-red-100 text-red-700"
                              : product.change < 0
                                ? "bg-green-100 text-green-700"
                                : "bg-black/5 text-black/50"
                          }`}
                        >
                          {product.change > 0 ? "▲" : "▼"}{" "}
                          {Math.abs(product.change)}%
                        </span>
                      )}
                  </div>

                  <h4 className="mt-5 text-lg font-black transition group-hover:text-[#047857]">
                    {product.name}
                  </h4>

                  <p className="mt-1 text-sm text-black/40">
                    {product.category || "সাধারণ পণ্য"}
                    {product.unit && ` • ${product.unit}`}
                  </p>

                  <div className="mt-5 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-black/40">
                        বর্তমান দাম
                      </p>

                      <p className="mt-1 text-xl font-black">
                        {product.price ?? "—"} টাকা
                      </p>
                    </div>

                    <span className="text-sm font-bold text-[#047857]">
                      দেখুন →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-black/10 bg-white px-6 py-12 text-center">
              <div className="text-5xl">🔎</div>

              <h3 className="mt-4 text-xl font-black">
                কোনো পণ্য পাওয়া যায়নি
              </h3>

              <p className="mt-2 text-sm text-black/45">
                অন্য কোনো পণ্যের নাম দিয়ে আবার চেষ্টা করুন।
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default ProductSearch;