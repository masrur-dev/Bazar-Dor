import Link from "next/link";
import { notFound } from "next/navigation";

import { getCategories, getProducts } from "@/lib/api";
import { normalizeProducts } from "@/lib/products";
import CategoryProducts from "@/components/CategoryProduct";

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

function listFrom(response) {
  const value = response?.data ?? response;
  return Array.isArray(value) ? value : [];
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;

  const [categoryResponse, productResponse] = await Promise.allSettled([
    getCategories(),
    getProducts(),
  ]);

  if (categoryResponse.status === "rejected") {
    throw categoryResponse.reason;
  }

  const categoryResult = categoryResponse.value;
  const productResult = productResponse.status === "fulfilled"
    ? productResponse.value
    : null;

  const categories = listFrom(categoryResult);

  const category = categories.find(
    (item) =>
      String(item.slug) === String(slug) ||
      String(item.id) === String(slug),
  );

  if (!category) {
    notFound();
  }

  const categoryName =
    category.nameBn ??
    category.name ??
    category.slug ??
    slug;

  const products = normalizeProducts(
    listFrom(productResult),
  ).filter((product) => product.id);

  const categoryProducts = products.filter((product) => {
    const productCategory =
      product.categorySlug ??
      product.category ??
      product.categoryName ??
      "";

    return (
      String(productCategory) === String(slug) ||
      String(productCategory) === String(category.id) ||
      String(productCategory) === String(category.slug) ||
      String(productCategory) === String(categoryName)
    );
  });

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-black">
      {/* Header */}
      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <Link
            href="/"
            className="text-sm font-medium text-black/50 transition hover:text-[#047857]"
          >
            ← হোমে ফিরে যান
          </Link>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-[#f1f3f0] text-4xl">
              {category.icon ||
                CATEGORY_ICONS[categoryName] ||
                "🛒"}
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[#047857]">
                Category
              </p>

              <h1 className="mt-1 text-4xl font-black">
                {categoryName}
              </h1>

              <p className="mt-2 text-sm text-black/50">
                এই ক্যাটাগরির বর্তমান বাজারদর
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black">
              {categoryName} এর পণ্য
            </h2>

            <p className="mt-1 text-sm text-black/50">
              বর্তমান বাজারদর অনুযায়ী পণ্য
            </p>
          </div>

          <span className="rounded-full bg-black px-4 py-2 text-xs font-bold text-white">
            {categoryProducts.length} পণ্য
          </span>
        </div>

        {categoryProducts.length === 0 ? (
          <div className="rounded-2xl border border-black/10 bg-white p-12 text-center">
            <div className="text-4xl">📦</div>

            <h3 className="mt-4 text-lg font-bold">
              কোনো পণ্য পাওয়া যায়নি
            </h3>

            <p className="mt-2 text-sm text-black/50">
              {productResponse.status === "rejected"
                ? "পণ্যের তথ্য এখন পাওয়া যাচ্ছে না। একটু পরে আবার চেষ্টা করুন।"
                : "এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য নেই।"}
            </p>

            <Link
              href="/"
              className="btn mt-6 border-0 bg-[#047857] text-white hover:bg-[#065f46]"
            >
              সব পণ্য দেখুন
            </Link>
          </div>
        ) : (
          <CategoryProducts products={categoryProducts} />
        )}
      </section>
    </main>
  );
}
