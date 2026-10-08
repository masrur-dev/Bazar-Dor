"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const publicAuthPaths = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
];

export default function AuthClickGuard() {
  const router = useRouter();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    if (!authClient) return;

    let sessionReady = false;
    let hasSession = false;
    let pendingSessionCheck = null;

    // ----------------------------------------
    // Update session state
    // ----------------------------------------
    const updateSession = (session) => {
      hasSession = Boolean(session);
      sessionReady = true;
    };

    // ----------------------------------------
    // Initial session check
    // ----------------------------------------
    authClient.auth
      .getSession()
      .then(({ data }) => {
        updateSession(data?.session);
      })
      .catch(() => {
        sessionReady = true;
        hasSession = false;
      });

    // ----------------------------------------
    // Listen for auth changes
    // ----------------------------------------
    const {
      data: { subscription } = {},
    } = authClient.auth.onAuthStateChange((_event, session) => {
      updateSession(session);
    });

    // ----------------------------------------
    // Check session when necessary
    // ----------------------------------------
    const checkSession = async () => {
      if (sessionReady) {
        return hasSession;
      }

      if (!pendingSessionCheck) {
        pendingSessionCheck = authClient.auth
          .getSession()
          .then(({ data }) => {
            updateSession(data?.session);
            return hasSession;
          })
          .catch(() => {
            sessionReady = true;
            hasSession = false;
            return false;
          })
          .finally(() => {
            pendingSessionCheck = null;
          });
      }

      return pendingSessionCheck;
    };

    // ----------------------------------------
    // Click Guard
    // ----------------------------------------
    const guardClick = async (event) => {
      // Ignore already prevented events.
      if (event.defaultPrevented) return;

      // Ignore clicks inside the login modal.
      if (event.target.closest("[data-auth-gate-modal]")) return;

      // Keep sign-in and account recovery usable after client-side navigation.
      if (publicAuthPaths.includes(window.location.pathname)) return;

      // Find clickable element.
      const control = event.target.closest(
        'a[href], button, input[type="submit"], [role="button"]'
      );

      if (!control) return;

      // Allow explicitly permitted controls.
      if (control.hasAttribute("data-auth-gate-allow")) return;

      // ----------------------------------------
      // Handle links
      // ----------------------------------------
      if (control instanceof HTMLAnchorElement) {
        const destination = new URL(
          control.href,
          window.location.origin
        );

        // Allow external links.
        if (destination.origin !== window.location.origin) return;

        // Allow public auth pages.
        if (publicAuthPaths.includes(destination.pathname)) return;

        // Allow hash-only links.
        if (
          destination.pathname === window.location.pathname &&
          destination.search === window.location.search &&
          destination.hash
        ) {
          return;
        }
      }

      // ----------------------------------------
      // User is already logged in
      // ----------------------------------------
      if (sessionReady && hasSession) {
        return;
      }

      // ----------------------------------------
      // Stop the action temporarily
      // ----------------------------------------
      event.preventDefault();
      event.stopPropagation();

      // ----------------------------------------
      // Check session before showing modal
      // ----------------------------------------
      const authenticated = await checkSession();

      // ----------------------------------------
      // Session exists
      // ----------------------------------------
      if (authenticated) {
        // Do NOT call control.click().
        // The original click has already been prevented.
        // Reload the current navigation naturally based on element type.

        if (control instanceof HTMLAnchorElement) {
          const destination = new URL(
            control.href,
            window.location.origin
          );

          router.push(
            `${destination.pathname}${destination.search}${destination.hash}`
          );
        } else {
          // For buttons/forms, dispatch a new click after
          // temporarily allowing this specific element.
          control.setAttribute("data-auth-gate-allow", "true");

          control.click();

          control.removeAttribute("data-auth-gate-allow");
        }

        return;
      }

      // ----------------------------------------
      // User is not logged in
      // ----------------------------------------
      setShowLoginPrompt(true);
    };

    document.addEventListener("click", guardClick, true);

    // ----------------------------------------
    // Cleanup
    // ----------------------------------------
    return () => {
      document.removeEventListener("click", guardClick, true);
      subscription?.unsubscribe();
    };
  }, [router]);

  // ----------------------------------------
  // Login modal
  // ----------------------------------------
  const closeModal = () => {
    setShowLoginPrompt(false);
  };

  const goToLogin = () => {
    setShowLoginPrompt(false);

    if (!publicAuthPaths.includes(window.location.pathname)) {
      router.push("/sign-in");
    }
  };

  return (
    <>
      {showLoginPrompt && (
        <dialog
          open
          className="modal modal-open"
          data-auth-gate-modal
          aria-labelledby="login-required-title"
        >
          <div className="modal-box w-11/12 max-w-md bg-white border-2 border-[#145F46]">
            {/* Header */}
            <div className="text-center">
              <h2
                id="login-required-title"
                className="text-xl font-bold text-gray-900"
              >
                লগইন প্রয়োজন
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                এই কাজটি করতে আপনাকে আগে লগইন করতে হবে।
              </p>
            </div>

            {/* Actions */}
            <div className="modal-action flex items-center justify-end gap-3">
              <button
                type="button"
                className="btn border border-gray-300 bg-white text-gray-800 hover:bg-gray-100"
                onClick={closeModal}
              >
                পরে
              </button>

              <button
                type="button"
                className="btn border-0 bg-[#047857] text-white hover:bg-[#065f46]"
                onClick={goToLogin}
              >
                লগ ইন করুন
              </button>
            </div>
          </div>

          {/* Backdrop */}
          <button
            type="button"
            className="modal-backdrop"
            aria-label="বন্ধ করুন"
            onClick={closeModal}
          />
        </dialog>
      )}
    </>
  );
}
