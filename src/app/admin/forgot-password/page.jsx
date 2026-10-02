import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/adminAuth";
import ForgotPasswordForm from "@/components/account/ForgotPasswordForm";

export const metadata = { title: "Reset admin password" };

// Same reset flow as website users (an emailed 6-digit code), returning to the admin sign-in.
export default async function AdminForgotPasswordPage() {
  if (await getAdmin()) redirect("/admin");

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-bold tracking-tight">Reset admin password</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        We&apos;ll email a 6-digit code to your admin address so you can set a new password.
      </p>
      {/* useSearchParams() in the form needs a Suspense boundary */}
      <Suspense>
        <ForgotPasswordForm loginHref="/admin/login" />
      </Suspense>
    </div>
  );
}
