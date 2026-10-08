import Image from "next/image";
import Link from "next/link";
import { getCategories, getProducts } from "@/lib/api";
import { normalizeProducts } from "@/lib/products";

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

export default async function HomePage() {
  const [categoryResult, productResult] = await Promise.allSettled([
    getCategories(),
    getProducts(),
  ]);

  const categories = listFrom(
    categoryResult.status === "fulfilled" ? categoryResult.value : null,
  );
  const products = normalizeProducts(
    listFrom(productResult.status === "fulfilled" ? productResult.value : null),
  ).filter((product) => product.id);
  const increasedProducts = products
    .filter((product) => product.change > 0)
    .sort((a, b) => b.change - a.change)
    .slice(0, 6);
  const decreasedProducts = products
    .filter((product) => product.change < 0)
    .sort((a, b) => a.change - b.change)
    .slice(0, 6);

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-black">
      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.4fr_0.6fr] lg:items-center lg:py-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-[#f1f3f0] px-4 py-2 text-sm font-medium">
              <span className="size-2 rounded-full bg-[#047857]" />
              আজকের বাজারদর আপডেট
            </div>
            <h1 className="max-w-4xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-7xl">
              বাজারের দাম,<br />
              <span className="text-[#047857]">এক নজরে জানুন।</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-black/60 sm:text-lg">
              চাল, ডাল, তেল, সবজি, মাছ, মাংসসহ প্রতিদিনের প্রয়োজনীয় পণ্যের
              বর্তমান বাজারদর সহজেই খুঁজে নিন।
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#products" className="btn border-0 bg-[#047857] px-6 text-white hover:bg-[#065f46]">
                বাজারদর দেখুন
              </Link>
              <Link href="#categories" className="btn border-black bg-white px-6 text-black hover:bg-black hover:text-white">
                ক্যাটাগরি
              </Link>
            </div>
          </div>

          <div className="relative mx-auto flex min-h-72 w-full max-w-md items-center justify-center sm:min-h-96">
            <div className="absolute size-56 rounded-full bg-[#e8f2ec] sm:size-80" />
            <Image
              src="/bazar-hero.png"
              alt="তাজা বাজারের পণ্যে ভরা ঝুড়ি"
              width={420}
              height={350}
              priority
              className="relative z-10 h-auto w-full max-w-[390px] object-contain drop-shadow-sm"
            />
            <div className="absolute bottom-2 left-0 z-20 rounded-2xl border border-black/5 bg-white px-4 py-3 shadow-lg sm:bottom-5">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#047857]">
                <span className="size-2 rounded-full bg-[#047857]" />
                আজকের বাজার
              </span>
              <p className="mt-1 text-sm font-bold">{products.length}টি পণ্যের দর দেখুন</p>
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-[#047857]">Browse</p>
            <h2 className="text-3xl font-black">ক্যাটাগরি</h2>
            <p className="mt-2 text-sm text-black/50">আপনার প্রয়োজনীয় পণ্য খুঁজে নিন</p>
          </div>
          <span className="hidden text-sm text-black/40 sm:block">{categories.length} ক্যাটাগরি</span>
        </div>
        {categories.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {categories.map((category, index) => {
              const name = category.nameBn ?? category.name ?? category.slug ?? "";
              const target = category.slug ?? category.id ?? name;
              return (
                <Link
                  key={category.id ?? category.slug ?? index}
                  href={`/categories/${encodeURIComponent(target)}`}
                  className="group rounded-2xl border border-black/10 bg-white p-5 text-center transition-all duration-200 hover:-translate-y-1 hover:border-[#047857] hover:shadow-lg"
                >
                  <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#f1f3f0] text-3xl transition-colors group-hover:bg-[#047857]">
                    <span className="transition-transform group-hover:scale-110" aria-hidden="true">
                      {category.icon || CATEGORY_ICONS[name] || "🛒"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-bold">{name}</p>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-black/60">
            ক্যাটাগরির তথ্য এখন পাওয়া যাচ্ছে না।
          </p>
        )}
      </section>

      <section id="products" className="border-y border-black/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-widest text-[#047857]">Market</p>
              <h2 className="text-3xl font-black">আজকের বাজারদর</h2>
              <p className="mt-2 text-sm text-black/50">সর্বশেষ আপডেট হওয়া পণ্যের দাম</p>
            </div>
            <span className="rounded-full bg-black px-4 py-2 text-xs font-bold text-white">{products.length} পণ্য</span>
          </div>
          {products.length === 0 ? (
            <div className="rounded-2xl border border-black/10 bg-[#f7f7f5] p-10 text-center">
              <p className="font-medium">এই মুহূর্তে কোনো পণ্য পাওয়া যায়নি।</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.slice(0, 6).map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          )}
        </div>
      </section>

      {increasedProducts.length > 0 && (
        <ProductSection title="দাম বেড়েছে" description="যেসব পণ্যের দাম সবচেয়ে বেশি বেড়েছে" products={increasedProducts} type="up" />
      )}
      {decreasedProducts.length > 0 && (
        <ProductSection title="দাম কমেছে" description="যেসব পণ্যের দাম কমেছে" products={decreasedProducts} type="down" />
      )}

    </main>
  );
}

function ProductCard({ product }) {
  const { price, change } = product;
  const isUp = change > 0;
  const isDown = change < 0;

  return (
    <Link
      href={`/product/${product.id}`}
      className="group rounded-2xl border border-black/10 bg-[#f7f7f5] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[#047857] hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-white text-2xl shadow-sm" aria-hidden="true">
            {product.icon || "🛒"}
          </div>
          <div>
            <h3 className="font-bold group-hover:text-[#047857]">{product.name}</h3>
            {product.unit && <p className="mt-1 text-xs text-black/40">{product.unit}</p>}
          </div>
        </div>
        {change !== null && (
          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${isUp ? "bg-red-100 text-red-700" : isDown ? "bg-green-100 text-green-700" : "bg-black/5 text-black/50"}`}>
            {isUp ? "▲" : isDown ? "▼" : "—"} {Math.abs(change)}%
          </span>
        )}
      </div>
      <div className="mt-8 flex items-end justify-between">
        <div>
          <p className="text-xs text-black/40">বর্তমান দাম</p>
          <p className="mt-1 text-2xl font-black">{price === null ? "—" : `${price} টাকা`}</p>
        </div>
        <span className="text-sm font-bold text-[#047857] transition-transform group-hover:translate-x-1">বিস্তারিত →</span>
      </div>
    </Link>
  );
}

function ProductSection({ title, description, products, type }) {
  const isUp = type === "up";

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex items-center gap-3">
        <div className={`flex size-10 items-center justify-center rounded-xl ${isUp ? "bg-red-100" : "bg-[#dcfce7]"}`} aria-hidden="true">
          <span className="text-lg">{isUp ? "📈" : "📉"}</span>
        </div>
        <div>
          <h2 className="text-2xl font-black">{title}</h2>
          <p className="text-sm text-black/50">{description}</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </section>
  );
}
