
import { createBrowserClient } from "@supabase/ssr";

let supabaseClient = null;

export function createClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    console.error(
      "Supabase configuration missing. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
    );
    return null;
  }

  try {
    const parsedUrl = new URL(url);

    if (
      parsedUrl.protocol !== "https:" ||
      parsedUrl.pathname !== "/" ||
      parsedUrl.search ||
      parsedUrl.hash
    ) {
      console.error(
        "Invalid Supabase URL. Use https://YOUR_PROJECT_REF.supabase.co without /rest/v1/."
      );
      return null;
    }

    supabaseClient = createBrowserClient(url, key);

    return supabaseClient;
  } catch (error) {
    console.error("Failed to create Supabase browser client:", error);
    return null;
  }
}
