import { Suspense } from "react";
import LoginForm from "@/components/account/LoginForm";

export const metadata = { title: "Sign in" };

export default function Page() {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
      <p className="mt-2 text-sm text-muted-foreground">Sign in to comment on the blog.</p>
      {/* useSearchParams() in the form needs a Suspense boundary for static rendering */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </>
  );
}
