import { createClient } from "@/lib/supabase/client";

// Keep browser auth on the same Supabase client used by the rest of the app.
export const authClient = createClient();

