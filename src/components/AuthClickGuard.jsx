
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

function isPublicAuthPath(pathname) {
  return publicAuthPaths.includes(pathname);
}

export default function AuthClickGuard() {
  const router = useRouter();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    let active = true;
    let pendingSessionCheck = null;

    // Prevent replayed clicks from being intercepted again.
    const replayAllowed = new WeakSet();

    // Check the latest authentication session.
    const checkSession = async () => {
      if (!authClient?.auth) {
        return false;
      }

      if (!pendingSessionCheck) {
        pendingSessionCheck = authClient.auth
          .getSession()
          .then(({ data, error }) => {
            if (error) {
              console.error("Session check failed:", error.message);
              return false;
            }

            return Boolean(data?.session);
          })
          .catch((error) => {
            console.error("Authentication error:", error);
            return false;
          })
          .finally(() => {
            pendingSessionCheck = null;
          });
      }

      return pendingSessionCheck;
    };

    const guardClick = async (event) => {
      if (event.defaultPrevented) return;

      // Ignore clicks from non-element targets.
      if (!(event.target instanceof Element)) return;

      // Allow interaction with the login modal.
      if (event.target.closest("[data-auth-gate-modal]")) {
        return;
      }

      // Authentication pages must remain accessible.
      if (isPublicAuthPath(window.location.pathname)) {
        return;
      }

      const control = event.target.closest(
        'a[href], button, input[type="submit"], [role="button"]'
      );

      if (!control) return;

      // Allow explicitly permitted elements.
      if (control.hasAttribute("data-auth-gate-allow")) {
        return;
      }

      // Allow a click replayed after authentication.
      if (replayAllowed.has(control)) {
        replayAllowed.delete(control);
        return;
      }

      if (control instanceof HTMLAnchorElement) {
        // Preserve normal browser behavior for modified clicks.
        if (
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }

        if (control.hasAttribute("download")) {
          return;
        }

        const destination = new URL(
          control.href,
          window.location.origin
        );

        // Allow external destinations.
        if (destination.origin !== window.location.origin) {
          return;
        }

        if (isPublicAuthPath(destination.pathname)) {
          return;
        }

        // Allow navigation within the same page.
        if (
          destination.pathname === window.location.pathname &&
          destination.search === window.location.search &&
          destination.hash
        ) {
          return;
        }
      }

      // Pause the original action.
      event.preventDefault();
      event.stopPropagation();

      const authenticated = await checkSession();

      // Component may have unmounted during the check.
      if (!active) return;

      if (!authenticated) {
        setShowLoginPrompt(true);
        return;
      }

      // Continue the original action for authenticated users.
      if (!control.isConnected) return;

      if (control instanceof HTMLAnchorElement) {
        const destination = new URL(
          control.href,
          window.location.origin
        );

        if (control.target === "_blank") {
          window.open(destination.href, "_blank", "noopener,noreferrer");
          return;
        }

        router.push(
          `${destination.pathname}${destination.search}${destination.hash}`
        );

        return;
      }

      // Replay the button click exactly once.
      replayAllowed.add(control);

      try {
        control.click();
      } finally {
        replayAllowed.delete(control);
      }
    };

    document.addEventListener("click", guardClick, true);

    return () => {
      active = false;
      document.removeEventListener("click", guardClick, true);
    };
  }, [router]);

  const closeModal = () => {
    setShowLoginPrompt(false);
  };

  const goToLogin = () => {
    setShowLoginPrompt(false);
    router.push("/sign-in");
  };

  return (
    <>
      {showLoginPrompt && (
        <dialog
          open
          className="modal modal-open"
          data-auth-gate-modal
          aria-labelledby="login-required-title"
          aria-modal="true"
          onCancel={closeModal}
        >
          <div className="modal-box w-11/12 max-w-md border-2 border-[#145F46] bg-white shadow-xl">
            <div className="text-center">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-50 text-3xl">
                🔐
              </div>

              <h2
                id="login-required-title"
                className="text-xl font-bold text-gray-900"
              >
                লগইন প্রয়োজন
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                এই কাজটি করতে আপনাকে আগে লগইন করতে হবে।
                আপনার অ্যাকাউন্ট না থাকলে নতুন অ্যাকাউন্ট
                তৈরি করতে পারেন।
              </p>
            </div>

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
