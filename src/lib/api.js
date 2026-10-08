const BASE_URL =
  process.env.BAZARDOR_API_URL ||
  "https://api.api-store.workers.dev/api/bazardor";

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

export const getCategories = async () => {
  return getJson("/categories");
};

export const getProducts = async () => {
  return getJson("/products");
};

export const getProduct = async (id) => {
  const safeId = encodeURIComponent(String(id));
  const response = await fetch(`${BASE_URL}/products/${safeId}`, {
    next: { revalidate: 3600 },
  });

  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`API request failed (${response.status})`);
  }

  try {
    return await response.json();
  } catch {
    throw new Error("API returned invalid JSON");
  }
};
