import AuthForm from "@/components/AuthForm";

// Backwards-compatible wrapper for any existing sign-in page imports.
export default function Hero() {
  return <AuthForm mode="sign-in" />;
}
