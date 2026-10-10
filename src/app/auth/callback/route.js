import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request) {
  const requestUrl = new URL(request.url);

  const code = requestUrl.searchParams.get("code");
  const flow = requestUrl.searchParams.get("flow");
  const next = requestUrl.searchParams.get("next");

  const errorCode =
    flow === "oauth" ? "oauth" : "email-verification";

  // Handle OAuth provider errors
  if (
    requestUrl.searchParams.has("error") ||
    requestUrl.searchParams.has("error_description")
  ) {
    console.error("[Auth Callback] OAuth provider error:", {
      error: requestUrl.searchParams.get("error"),
      description: requestUrl.searchParams.get("error_description"),
    });

    return NextResponse.redirect(
      new URL(`/sign-in?error=${errorCode}`, requestUrl.origin)
    );
  }

  // Validate authorization code
  if (!code) {
    console.error("[Auth Callback] Authorization code is missing.");

    return NextResponse.redirect(
      new URL(`/sign-in?error=${errorCode}`, requestUrl.origin)
    );
  }

  // Validate destination to prevent open redirects
  const requestedDestination =
    next?.startsWith("/") &&
    !next.startsWith("//") &&
    !next.includes("\\")
      ? next
      : "/profile";

  const destinationUrl = new URL(
    requestedDestination,
    requestUrl.origin
  );

  const destination =
    destinationUrl.origin === requestUrl.origin
      ? `${destinationUrl.pathname}${destinationUrl.search}${destinationUrl.hash}`
      : "/profile";

  try {
    const supabase = await createClient();

    if (!supabase) {
      console.error("[Auth Callback] Supabase client is not configured.");

      return NextResponse.redirect(
        new URL("/sign-in?error=auth-not-configured", requestUrl.origin)
      );
    }

    // Exchange OAuth authorization code for a session
    const { data, error } =
      await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("[Auth Callback] Code exchange failed:", {
        message: error.message,
        status: error.status,
        code: error.code,
      });

      return NextResponse.redirect(
        new URL(`/sign-in?error=${errorCode}`, requestUrl.origin)
      );
    }

    if (!data.session) {
      console.error("[Auth Callback] Session was not created.");

      return NextResponse.redirect(
        new URL(`/sign-in?error=${errorCode}`, requestUrl.origin)
      );
    }

    // Redirect after successful authentication
    const redirectUrl = new URL(destination, requestUrl.origin);

    if (flow === "oauth") {
      redirectUrl.searchParams.set("toast", "login");
    }

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("[Auth Callback] Unexpected error:", error);

    return NextResponse.redirect(
      new URL(`/sign-in?error=${errorCode}`, requestUrl.origin)
    );
  }
}