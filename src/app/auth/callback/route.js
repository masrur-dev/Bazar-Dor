import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const flow = requestUrl.searchParams.get("flow");
  const errorCode = flow === "oauth" ? "oauth" : "email-verification";
  const next = requestUrl.searchParams.get("next");
  const requestedDestination = next?.startsWith("/") && !next.startsWith("//") && !next.includes("\\")
    ? next
    : "/profile";
  const destinationUrl = new URL(requestedDestination, requestUrl.origin);
  const destination = destinationUrl.origin === requestUrl.origin
    ? `${destinationUrl.pathname}${destinationUrl.search}${destinationUrl.hash}`
    : "/profile";

  if (requestUrl.searchParams.has("error") || requestUrl.searchParams.has("error_description")) {
    return NextResponse.redirect(new URL("/sign-in?error=oauth", requestUrl.origin));
  }

  if (!code) {
    return NextResponse.redirect(new URL(`/sign-in?error=${errorCode}`, requestUrl.origin));
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.redirect(new URL("/sign-in?error=auth-not-configured", requestUrl.origin));
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL(`/sign-in?error=${errorCode}`, requestUrl.origin));
  }

  const redirectUrl = new URL(destination, requestUrl.origin);
  if (flow === "oauth") redirectUrl.searchParams.set("toast", "login");
  return NextResponse.redirect(redirectUrl);
}
