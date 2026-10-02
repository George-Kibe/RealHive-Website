import { Suspense } from "react";
import ForgotPasswordForm from "@/components/account/ForgotPasswordForm";

export const metadata = { title: "Reset your password" };

export default function Page() {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Reset your password</h1>
      <p className="mt-2 text-sm text-muted-foreground">We&apos;ll email you a code to set a new password.</p>
      {/* useSearchParams() in the form needs a Suspense boundary for static rendering */}
      <Suspense>
        <ForgotPasswordForm />
      </Suspense>
    </>
  );
}
