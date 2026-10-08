import { getCategories, getProducts } from "@/lib/api";
import { normalizeProducts } from "@/lib/products";

function listFrom(response) {
  const value = response?.data ?? response;
  return Array.isArray(value) ? value : [];
}

export default async function sitemap() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";
  const siteUrl = baseUrl.replace(/\/$/, "");

  const [categoryResponse, productResponse] = await Promise.allSettled([
    getCategories(),
    getProducts(),
  ]);

  const categories = categoryResponse.status === "fulfilled"
    ? listFrom(categoryResponse.value)
    : [];

  const products = productResponse.status === "fulfilled"
    ? normalizeProducts(listFrom(productResponse.value)).filter((product) => product.id)
    : [];
  const lastModified = new Date();

  const categoryUrls = categories
    .filter((category) => category.slug || category.id)
    .map((category) => {
      const slug =
        category.slug ??
        category.id;

      return {
        url: `${siteUrl}/categories/${encodeURIComponent(slug)}`,
        lastModified,
      };
    });

  const productUrls = products.map((product) => ({
    url: `${siteUrl}/product/${encodeURIComponent(product.id)}`,
    lastModified,
  }));

  return [
    {
      url: siteUrl,
      lastModified,
    },
    { url: `${siteUrl}/about`, lastModified },
    ...categoryUrls,
    ...productUrls,
  ];
}
