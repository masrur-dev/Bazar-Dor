import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";

import ProductImage from "@/components/ProductImage";
import { getProduct } from "@/lib/api";
import { normalizeProducts } from "@/lib/products";

async function ProductDetailsContent({ params }) {
  const { id } = await params;

  const productResult = await getProduct(id);
  const productData = productResult?.data?.product ?? productResult?.data ?? productResult?.product ?? productResult;
  const productRecord = Array.isArray(productData)
    ? productData[0]
    : productData;
  const product = productRecord
    ? normalizeProducts([productRecord])[0]
    : null;

  if (!product) {
    notFound();
  }

  const price = product.price;
  const change = product.change;

  const isUp = change > 0;
  const isDown = change < 0;

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-black">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <Link
          href="/"
          className="text-sm font-medium text-black/50 transition hover:text-[#047857]"
        >
          ← হোমে ফিরে যান
        </Link>
      </div>

      {/* Product Details */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Product Image */}
          <div className="flex min-h-100 items-center justify-center rounded-3xl border border-black/10 bg-white p-8">
            <ProductImage
              src={product.image}
              alt={product.name}
              icon={product.icon || "🛒"}
              className="size-full min-h-80 rounded-[2.5rem]"
            />
          </div>

          {/* Product Information */}
          <div className="rounded-3xl border border-black/10 bg-white p-7 sm:p-10">
            {/* Category + Unit */}
            <div className="flex flex-wrap items-center gap-2">
              {product.category && (
                <span className="rounded-full bg-[#dcfce7] px-3 py-1 text-xs font-bold text-[#047857]">
                  {product.category}
                </span>
              )}

              {product.unit && (
                <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-black/60">
                  {product.unit}
                </span>
              )}
            </div>

            {/* Product Name */}
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
              {product.name}
            </h1>

            <p className="mt-4 max-w-xl leading-7 text-black/50">
              এই পণ্যের বর্তমান বাজারদর এবং
              সাম্প্রতিক দামের পরিবর্তন এখানে দেখুন।
            </p>

            {/* Current Price */}
            <div className="mt-10 rounded-2xl bg-[#f7f7f5] p-6">
              <p className="text-sm font-medium text-black/40">
                বর্তমান বাজারদর
              </p>

              <div className="mt-2 flex flex-wrap items-end gap-4">
                <p className="text-4xl font-black">
                  {price === null || price === undefined
                    ? "—"
                    : `${price} টাকা`}
                </p>

                {change !== null &&
                  change !== undefined && (
                    <span
                      className={`mb-1 rounded-full px-3 py-1.5 text-sm font-bold ${
                        isUp
                          ? "bg-red-100 text-red-700"
                          : isDown
                            ? "bg-green-100 text-green-700"
                            : "bg-black/5 text-black/50"
                      }`}
                    >
                      {isUp
                        ? "▲"
                        : isDown
                          ? "▼"
                          : "—"}{" "}
                      {Math.abs(change)}%
                    </span>
                  )}
              </div>
            </div>

            {/* Price Information */}
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-black/10 p-5">
                <p className="text-xs text-black/40">
                  বর্তমান দাম
                </p>

                <p className="mt-2 text-xl font-black">
                  {price ?? "—"} টাকা
                </p>
              </div>

              <div className="rounded-2xl border border-black/10 p-5">
                <p className="text-xs text-black/40">
                  দামের পরিবর্তন
                </p>

                <p
                  className={`mt-2 text-xl font-black ${
                    isUp
                      ? "text-red-600"
                      : isDown
                        ? "text-[#047857]"
                        : "text-black"
                  }`}
                >
                  {change === null || change === undefined
                    ? "—"
                    : `${change > 0 ? "+" : ""}${change}%`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Price Trend */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <div className="rounded-3xl border border-black/10 bg-white p-7 sm:p-10">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[#047857]">
                Price Trend
              </p>

              <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                দামের বর্তমান অবস্থা
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-black/50">
                সর্বশেষ পাওয়া তথ্য অনুযায়ী এই পণ্যের
                বাজারদরের পরিবর্তন এখানে দেখানো হয়েছে।
              </p>
            </div>

            <div
              className={`w-fit rounded-2xl px-5 py-4 ${
                isUp
                  ? "bg-red-50"
                  : isDown
                    ? "bg-green-50"
                    : "bg-black/5"
              }`}
            >
              <p className="text-xs font-medium text-black/40">
                পরিবর্তন
              </p>

              <p
                className={`mt-1 text-2xl font-black ${
                  isUp
                    ? "text-red-600"
                    : isDown
                      ? "text-[#047857]"
                      : "text-black"
                }`}
              >
                {change === null || change === undefined
                  ? "—"
                  : `${change > 0 ? "+" : ""}${change}%`}
              </p>
            </div>
          </div>

          {/* Trend Indicator */}
          <div className="mt-8">
            <div className="relative h-4 overflow-hidden rounded-full bg-black/5">
              <div
                className={`h-full rounded-full ${
                  isUp
                    ? "w-[75%] bg-red-500"
                    : isDown
                      ? "w-[35%] bg-[#047857]"
                      : "w-1/2 bg-black"
                }`}
              />
            </div>

            <div className="mt-3 flex justify-between text-xs text-black/40">
              <span>কম</span>
              <span>বর্তমান</span>
              <span>বেশি</span>
            </div>
          </div>

          {/* Status Cards */}
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-[#f7f7f5] p-5">
              <p className="text-xs text-black/40">
                বর্তমান দাম
              </p>

              <p className="mt-2 text-xl font-black">
                {price ?? "—"} টাকা
              </p>
            </div>

            <div className="rounded-2xl bg-[#f7f7f5] p-5">
              <p className="text-xs text-black/40">
                বাজারের অবস্থা
              </p>

              <p
                className={`mt-2 text-xl font-black ${
                  isUp
                    ? "text-red-600"
                    : isDown
                      ? "text-[#047857]"
                      : "text-black"
                }`}
              >
                {isUp
                  ? "দাম বেড়েছে"
                  : isDown
                    ? "দাম কমেছে"
                    : "দাম অপরিবর্তিত"}
              </p>
            </div>

            <div className="rounded-2xl bg-[#f7f7f5] p-5">
              <p className="text-xs text-black/40">
                পরিবর্তনের হার
              </p>

              <p className="mt-2 text-xl font-black">
                {change === null || change === undefined
                  ? "—"
                  : `${Math.abs(change)}%`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="rounded-3xl bg-black p-8 text-white sm:p-10">
          <p className="text-sm font-bold uppercase tracking-widest text-[#34d399]">
            Bazar Dor
          </p>

          <div className="mt-3 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-black">
                আরও পণ্যের বাজারদর দেখুন
              </h2>

              <p className="mt-2 text-sm text-white/50">
                প্রতিদিনের প্রয়োজনীয় পণ্যের দাম এক জায়গায়।
              </p>
            </div>

            <Link
              href="/"
              className="btn border-0 bg-[#047857] px-6 text-white hover:bg-[#065f46]"
            >
              সব পণ্য দেখুন
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ProductDetailsPage({ params }) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f7f7f5] px-4 py-12 sm:px-6">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="skeleton min-h-80 rounded-3xl" />
            <div className="skeleton min-h-80 rounded-3xl" />
          </div>
        </main>
      }
    >
      <ProductDetailsContent params={params} />
    </Suspense>
  );
}
