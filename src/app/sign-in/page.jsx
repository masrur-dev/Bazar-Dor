import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";

export const metadata = { title: "সাইন ইন" };

const authErrors = {
  oauth: "Google বা GitHub দিয়ে সাইন ইন সম্পন্ন হয়নি। আবার চেষ্টা করুন।",
  "email-verification": "ইমেইল যাচাই করা যায়নি। লিংকটি মেয়াদোত্তীর্ণ হলে নতুন করে সাইন আপ করুন।",
  "auth-not-configured": "Supabase config নেই। .env.local ফাইলে NEXT_PUBLIC_SUPABASE_URL এবং NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY বসিয়ে dev server আবার চালু করুন।",
};

export default function SignInPage({ searchParams }) {
  return (
    <Suspense fallback={<AuthForm mode="sign-in" />}>
      <SignInContent searchParams={searchParams} />
    </Suspense>
  );
}

async function SignInContent({ searchParams }) {
  const params = await searchParams;
  const errorCode = Array.isArray(params?.error) ? params.error[0] : params?.error;
  return <AuthForm mode="sign-in" initialError={authErrors[errorCode] ?? ""} />;
}
