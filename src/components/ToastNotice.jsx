"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function ToastNotice() {
  const [toast, setToast] = useState(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const timerRef = useRef(null);

  const showToast = useCallback((text, type = "success") => {
    if (!text) return;

    setToast({ text, type });
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setToast(null);
      timerRef.current = null;
    }, 1000);
  }, []);

  useEffect(() => {
    const handleToastEvent = (event) => {
      const detail = event.detail;
      if (typeof detail === "string") showToast(detail);
      else if (detail) showToast(detail.message, detail.type);
    };

    window.addEventListener("bazar-dor:toast", handleToastEvent);
    if (window.performance.getEntriesByType("navigation")[0]?.type === "reload") {
      showToast("Page refreshed successfully", "info");
    }

    return () => {
      window.removeEventListener("bazar-dor:toast", handleToastEvent);
      window.clearTimeout(timerRef.current);
    };
  }, [showToast]);

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const toastType = currentUrl.searchParams.get("toast");
    const authError = currentUrl.searchParams.get("error");
    const queuedToast = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("bazar_dor_toast="))
      ?.split("=")[1];
    if (toastType === "logout" || toastType === "login") {
      // A completed auth redirect should take precedence over a stale queued toast.
      if (queuedToast === "logout") {
        document.cookie = "bazar_dor_toast=; Max-Age=0; Path=/; SameSite=Lax";
      }
      showToast(toastType === "logout" ? "Logout successful" : "Login successful");
      currentUrl.searchParams.delete("toast");
      window.history.replaceState({}, "", `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`);
    } else if (queuedToast === "logout") {
      showToast("Logout successful");
      document.cookie = "bazar_dor_toast=; Max-Age=0; Path=/; SameSite=Lax";
    } else if (authError) {
      const errorMessages = {
        oauth: "Google বা GitHub দিয়ে সাইন ইন সম্পন্ন হয়নি। আবার চেষ্টা করুন।",
        "email-verification": "ইমেইল যাচাই করা যায়নি। লিংকটি পরীক্ষা করুন।",
        "auth-not-configured": "সাইন ইন সেবা সেট আপ করা নেই।",
      };
      if (errorMessages[authError]) {
        showToast(errorMessages[authError], "info");
      }
    }
  }, [pathname, search, showToast]);

  if (!toast) return null;

  return (
    <div className="toast toast-end z-100">
      <div role="status" className={`alert alert-${toast.type} shadow-lg`}>
        <span>{toast.text}</span>
      </div>
    </div>
  );
}
