const BASE_URL =
  "https://openapi.programming-hero.com/api/bazardor";

async function getJson(path) {
  const response = await fetch(`${BASE_URL}${path}`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`API request failed (${response.status})`);
  }

  try {
    return await response.json();
  } catch {
    throw new Error("API returned invalid JSON");
  }
}

export async function getCategories() {
  return getJson("/categories");
}

export async function getProducts() {
  return getJson("/products");
}

export async function getProduct(id) {
  const products = await getProducts();

  if (!Array.isArray(products)) {
    throw new Error("Invalid products API response");
  }

  return (
    products.find((product) => String(product.id) === String(id)) ?? null
  );
}