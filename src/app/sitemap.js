import { getCategories, getProducts } from "@/lib/api";
import { normalizeProducts } from "@/lib/products";

function listFrom(response) {
  const value = response?.data ?? response;
  return Array.isArray(value) ? value : [];
}

const LAST_MODIFIED = "2025-01-01T00:00:00.000Z";

export default async function sitemap() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  const categoryResult = await getCategories();
  const productResult = await getProducts();

  const categories = listFrom(categoryResult);

  const products = normalizeProducts(
    listFrom(productResult),
  ).filter((product) => product.id);

  const categoryUrls = categories
    .filter((category) => category.slug || category.id)
    .map((category) => {
      const slug =
        category.slug ??
        category.id;

      return {
        url: `${baseUrl}/categories/${encodeURIComponent(slug)}`,
        lastModified: LAST_MODIFIED,
      };
    });

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: LAST_MODIFIED,
  }));

  return [
    {
      url: baseUrl,
      lastModified: LAST_MODIFIED,
    },

    {
      url: `${baseUrl}/profile`,
      lastModified: LAST_MODIFIED,
    },

    ...categoryUrls,
    ...productUrls,
  ];
}