export function normalizeProducts(items = []) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item) => {
    const change = item.change ?? {};
    const imageValue = typeof item.image === "string" ? item.image : "";
    const imageIsUrl = /^(https?:\/\/|\/)/i.test(imageValue);

    return {
      id: item.id ?? item._id ?? item.productId ?? item.slug,
      slug: item.slug,

      name:
        item.nameBn ??
        item.name ??
        item.slug ??
        "অজানা পণ্য",

      category:
        item.categoryNameBn ??
        item.category ??
        "অন্যান্য",

      categorySlug:
        item.category ??
        item.categorySlug ??
        "",

      categoryIcon:
        item.categoryIcon ??
        "🛒",

      unit:
        item.unit ??
        "",

      image:
        imageIsUrl ? imageValue : null,

      icon:
        item.icon ?? (imageValue && !imageIsUrl ? imageValue : null) ?? item.categoryIcon ?? "🛒",

      // API-র today = current price
      price:
        item.today ?? null,

      today:
        item.today ?? null,

      yesterday:
        item.yesterday ?? null,

      lastWeek:
        item.lastWeek ?? null,

      lastMonth:
        item.lastMonth ?? null,

      // API change object থেকে percentage বের করছি
      change:
        typeof change === "object"
          ? change.pct ?? 0
          : Number(change) || 0,

      changeDirection:
        typeof change === "object"
          ? change.dir ?? "flat"
          : "flat",

      markets:
        Array.isArray(item.markets)
          ? item.markets
          : [],
    };
  });
}
