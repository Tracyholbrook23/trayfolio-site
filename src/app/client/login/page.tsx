import type { Metadata } from "next";
import LoginForm from "./login-form";

export const metadata: Metadata = { title: "Log in | Trayfolio" };

export default function ClientLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-semibold text-stone-900">Client dashboard login</h1>
        <p className="mt-1 text-sm text-stone-600">
          Sign in to manage this site&apos;s content.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
