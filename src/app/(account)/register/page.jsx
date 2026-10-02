import { Suspense } from "react";
import RegisterForm from "@/components/account/RegisterForm";

export const metadata = { title: "Create an account" };

export default function Page() {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
      <p className="mt-2 text-sm text-muted-foreground">Create a free account to join the conversation on the blog.</p>
      {/* useSearchParams() in the form needs a Suspense boundary for static rendering */}
      <Suspense>
        <RegisterForm />
      </Suspense>
    </>
  );
}
