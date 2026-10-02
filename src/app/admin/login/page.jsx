import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/adminAuth";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const metadata = { title: "Admin login" };

export default async function AdminLoginPage() {
  if (await getAdmin()) redirect("/admin");

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-bold tracking-tight">Admin login</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Sign in with an admin account to view newsletter subscribers.
      </p>
      <AdminLoginForm />
    </div>
  );
}
