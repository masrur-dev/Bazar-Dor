"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function signOut() {
  const supabase = await createClient();
  if (!supabase) redirect("/");

  const { error } = await supabase.auth.signOut();
  if (!error) {
    const cookieStore = await cookies();
    cookieStore.set("bazar_dor_toast", "logout", {
      path: "/",
      maxAge: 60,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }
  redirect("/");
}
