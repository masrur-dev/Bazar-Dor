"use client";

import Link from "next/link";
import MarqueeText from "react-marquee-text";

const products = [
  { name: "🌾 চাল", href: "/categories/chal" },
  { name: "🫘 ডাল", href: "/categories/dal" },
  { name: "🛢️ তেল", href: "/categories/tel" },
  { name: "🥔 আলু", href: "/categories/alu" },
  { name: "🧅 পেঁয়াজ", href: "/categories/peyaj" },
  { name: "🥚 ডিম", href: "/categories/dim-dui" },
  { name: "🥛 দুধ", href: "/categories/dim-dui" },
  { name: "🥬 সবজি", href: "/categories/sobji" },
  { name: "🐟 মাছ", href: "/categories/mach" },
  { name: "🍗 মাংস", href: "/categories/mangsho" },
];

export default function ProductMarquee() {
  return (
    <div className="sticky top-[var(--navbar-height)] z-40 w-full overflow-hidden bg-[#047857] py-3 text-white shadow-md">
      <MarqueeText duration={30} pauseOnHover>
        {products.map((product) => (
          <Link
            key={product.name}
            href={product.href}
            className="mx-6 inline-block whitespace-nowrap text-sm font-semibold transition-colors hover:text-yellow-300 sm:text-base"
          >
            {product.name}
          </Link>
        ))}
      </MarqueeText>
    </div>
  );
}
