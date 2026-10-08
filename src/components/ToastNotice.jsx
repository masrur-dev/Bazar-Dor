"use client";

import { useEffect, useState } from "react";

export default function ToastNotice() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    let timer;
    let activeMessage = "";
    const showToast = (text) => {
      if (!text || text === activeMessage) return;

      activeMessage = text;
      setMessage(text);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        setMessage("");
        activeMessage = "";
      }, 3200);
    };
    const handleToastEvent = (event) => showToast(event.detail);

    window.addEventListener("bazar-dor:toast", handleToastEvent);

    const currentUrl = new URL(window.location.href);
    const toastType = currentUrl.searchParams.get("toast");
    const authError = currentUrl.searchParams.get("error");
    const queuedToast = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("bazar_dor_toast="))
      ?.split("=")[1];
    if (queuedToast === "logout") {
      showToast("সফলভাবে সাইন আউট হয়েছে।");
      document.cookie = "bazar_dor_toast=; Max-Age=0; Path=/; SameSite=Lax";
    } else if (toastType === "logout" || toastType === "login") {
      const toastKey = `bazar-dor-toast:${currentUrl.pathname}:${toastType}`;
      if (window.sessionStorage.getItem(toastKey) !== "shown") {
        showToast(toastType === "logout" ? "সফলভাবে সাইন আউট হয়েছে।" : "সফলভাবে সাইন ইন হয়েছে।");
        window.sessionStorage.setItem(toastKey, "shown");
      }
    } else if (authError) {
      const errorMessages = {
        oauth: "Google বা GitHub দিয়ে সাইন ইন সম্পন্ন হয়নি। আবার চেষ্টা করুন।",
        "email-verification": "ইমেইল যাচাই করা যায়নি। লিংকটি পরীক্ষা করুন।",
        "auth-not-configured": "সাইন ইন সেবা সেট আপ করা নেই।",
      };
      if (errorMessages[authError]) {
        const toastKey = `bazar-dor-toast:${currentUrl.pathname}:error:${authError}`;
        if (window.sessionStorage.getItem(toastKey) !== "shown") {
          showToast(errorMessages[authError]);
          window.sessionStorage.setItem(toastKey, "shown");
        }
      }
    } else if (window.performance.getEntriesByType("navigation")[0]?.type === "reload") {
      showToast("পেজ রিফ্রেশ হয়েছে।");
    }

    return () => {
      window.removeEventListener("bazar-dor:toast", handleToastEvent);
      window.clearTimeout(timer);
    };
  }, []);

  if (!message) return null;

  return (
    <div className="fixed left-1/2 top-4 z-100 -translate-x-1/2 px-4">
      <div role="status" className="alert w-max max-w-[calc(100vw-2rem)] border-0 bg-[#047857] text-white shadow-lg">
        <span>{message}</span>
      </div>
    </div>
  );
}
