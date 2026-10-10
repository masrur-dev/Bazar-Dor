"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signOut() {
  const supabase = await createClient();
  if (!supabase) redirect("/");

  const { error } = await supabase.auth.signOut();
  redirect(error ? "/" : "/sign-in?toast=logout");
}
